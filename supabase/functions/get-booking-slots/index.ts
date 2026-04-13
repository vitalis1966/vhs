import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIMEZONE = "Mountain Standard Time"; // Windows timezone name for Graph API
const IANA_TZ = "America/Edmonton";

async function getAccessToken(): Promise<string> {
  const tenantId = Deno.env.get("AZURE_TENANT_ID")!;
  const clientId = Deno.env.get("AZURE_CLIENT_ID")!;
  const clientSecret = Deno.env.get("AZURE_CLIENT_SECRET")!;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params.toString() }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token request failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

/** Get current date/time in America/Edmonton as a Date-like object */
function nowInMST(): Date {
  const nowStr = new Date().toLocaleString("en-US", { timeZone: IANA_TZ });
  return new Date(nowStr);
}

/** Format a date as YYYY-MM-DD in MST */
function formatDateMST(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = await getAccessToken();
    const businessId = Deno.env.get("BOOKING_BUSINESS_ID")!;

    const now = nowInMST();

    // Build 7-day window in MST
    const startDate = formatDateMST(now);
    const endDateObj = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endDate = formatDateMST(endDateObj);

    // 1. Fetch staff members
    const staffRes = await fetch(
      `https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/staffMembers`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!staffRes.ok) throw new Error(`Failed to fetch staff: ${await staffRes.text()}`);
    const staffMembers = (await staffRes.json()).value || [];
    const staffIds = staffMembers.map((s: any) => s.id);

    if (staffIds.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Call getStaffAvailability
    const availRes = await fetch(
      `https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/getStaffAvailability`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffIds,
          startDateTime: {
            dateTime: `${startDate}T00:00:00`,
            timeZone: TIMEZONE,
          },
          endDateTime: {
            dateTime: `${endDate}T23:59:59`,
            timeZone: TIMEZONE,
          },
        }),
      }
    );

    if (!availRes.ok) {
      const errText = await availRes.text();
      throw new Error(`getStaffAvailability error (${availRes.status}): ${errText}`);
    }

    const availData = await availRes.json();
    const staffAvailItems = availData.staffAvailabilityItem || availData.value || [];

    // 3. Merge availability across all staff — a slot is available if ANY staff member is free
    // Build a set of available 30-min slots from the availability windows
    const availableSlots = new Set<string>(); // "YYYY-MM-DD|HH:MM"

    for (const staffItem of staffAvailItems) {
      const items = staffItem.availabilityItems || [];
      for (const item of items) {
        if (item.status !== "available") continue;
        // Parse the start/end times — these are in the requested timezone (MST)
        const slotStart = new Date(item.startDateTime?.dateTime || item.startDateTime);
        const slotEnd = new Date(item.endDateTime?.dateTime || item.endDateTime);

        // Generate 30-min slots within this window
        let cursor = new Date(slotStart);
        while (cursor.getTime() + 30 * 60 * 1000 <= slotEnd.getTime()) {
          const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
          const timeKey = `${String(cursor.getHours()).padStart(2, "0")}:${String(cursor.getMinutes()).padStart(2, "0")}`;
          availableSlots.add(`${dateKey}|${timeKey}`);
          cursor = new Date(cursor.getTime() + 30 * 60 * 1000);
        }
      }
    }

    // 4. Build the response grid for the next 7 days (weekdays, 9 AM – 5 PM MST)
    const businessHoursStart = 9;
    const businessHoursEnd = 17;
    const slotMinutes = 30;
    const result: { date: string; dayLabel: string; slots: { time: string; available: boolean }[] }[] = [];

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let d = 0; d < 7; d++) {
      const day = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
      const dayOfWeek = day.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

      const dateKey = formatDateMST(day);
      const dayLabel = day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const slots: { time: string; available: boolean }[] = [];

      for (let h = businessHoursStart; h < businessHoursEnd; h++) {
        for (let m = 0; m < 60; m += slotMinutes) {
          // Skip past slots for today
          if (d === 0 && (h < currentHour || (h === currentHour && m <= currentMinute))) continue;

          const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          const key = `${dateKey}|${time}`;
          slots.push({ time, available: availableSlots.has(key) });
        }
      }

      if (slots.length > 0) {
        result.push({ date: dateKey, dayLabel, slots });
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("get-booking-slots error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
