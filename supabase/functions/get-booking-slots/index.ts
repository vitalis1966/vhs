import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = await getAccessToken();
    const businessId = Deno.env.get("BOOKING_BUSINESS_ID")!;

    const now = new Date();
    const start = now.toISOString();
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch calendar view for the next 7 days
    // Permissions required: Bookings.Read.All, BookingsAppointment.ReadWrite.All
    const calRes = await fetch(
      `https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/calendarView?start=${start}&end=${end}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!calRes.ok) {
      const errText = await calRes.text();
      throw new Error(`Graph API error (${calRes.status}): ${errText}`);
    }

    const calData = await calRes.json();
    const appointments = calData.value || [];

    // Build a map of booked slots by date
    const bookedByDate: Record<string, Set<string>> = {};
    for (const appt of appointments) {
      if (appt.start?.dateTime) {
        const dt = new Date(appt.start.dateTime);
        const dateKey = dt.toISOString().split("T")[0];
        const timeKey = dt.toISOString().split("T")[1].substring(0, 5); // HH:MM
        if (!bookedByDate[dateKey]) bookedByDate[dateKey] = new Set();
        bookedByDate[dateKey].add(timeKey);
      }
    }

    // Generate slots for the next 7 days (9 AM – 5 PM, 30-min intervals, America/Toronto)
    const businessHoursStart = 9;
    const businessHoursEnd = 17;
    const slotMinutes = 30;
    const result: { date: string; dayLabel: string; slots: { time: string; available: boolean }[] }[] = [];

    for (let d = 0; d < 7; d++) {
      const day = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
      const dayOfWeek = day.getDay();
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateKey = day.toISOString().split("T")[0];
      const dayLabel = day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const booked = bookedByDate[dateKey] || new Set();
      const slots: { time: string; available: boolean }[] = [];

      for (let h = businessHoursStart; h < businessHoursEnd; h++) {
        for (let m = 0; m < 60; m += slotMinutes) {
          const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          // If today, skip slots that are in the past
          if (d === 0) {
            const slotDate = new Date(day);
            slotDate.setHours(h, m, 0, 0);
            if (slotDate <= now) continue;
          }
          slots.push({ time, available: !booked.has(time) });
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
