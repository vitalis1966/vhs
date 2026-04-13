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

/** Add minutes to "HH:MM" and return "HH:MM". */
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + minutes;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

/** Parse ISO 8601 duration like PT30M or PT1H into minutes. */
function parseDuration(dur: string): number {
  const hMatch = dur.match(/(\d+)H/);
  const mMatch = dur.match(/(\d+)M/);
  return (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0) || 30;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organization, date, time, note } = await req.json();

    const token = await getAccessToken();
    const businessId = Deno.env.get("BOOKING_BUSINESS_ID")!;

    if (!name || !email || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, date, time" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch service + staff in parallel
    const [svcRes, staffRes] = await Promise.all([
      fetch(`https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/staffMembers`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!svcRes.ok) throw new Error(`Failed to fetch services: ${await svcRes.text()}`);
    if (!staffRes.ok) throw new Error(`Failed to fetch staff: ${await staffRes.text()}`);

    const services = (await svcRes.json()).value || [];
    const staffMembers = (await staffRes.json()).value || [];
    if (services.length === 0) throw new Error("No services configured");

    const service = services[0];
    const serviceId = service.id;
    const durationMinutes = parseDuration(service.defaultDuration || "PT30M");
    
    // With application permissions, staffMemberIds MUST be provided.
    // Use service's assigned staff, or fall back to any active staff member.
    let staffMemberIds: string[] = service.staffMemberIds || [];
    if (staffMemberIds.length === 0 && staffMembers.length > 0) {
      staffMemberIds = [staffMembers[0].id];
    }

    const endTime = addMinutes(time, durationMinutes);
    const customerNotes = [organization, note].filter(Boolean).join(" — ");

    // Use minimal payload — the Graph API v1.0 with app permissions
    // is very strict about the shape. Use the legacy flat customer fields
    // which are more reliable with application permissions.
    const appointmentBody = {
      serviceId,
      staffMemberIds,
      start: {
        dateTime: `${date}T${time}:00.0000000`,
        timeZone: "America/Edmonton",
      },
      end: {
        dateTime: `${date}T${endTime}:00.0000000`,
        timeZone: "America/Edmonton",
      },
      customerName: name,
      customerEmailAddress: email,
      customerNotes,
      isLocationOnline: true,
    };

    console.log("Creating appointment:", JSON.stringify(appointmentBody));

    const apptRes = await fetch(
      `https://graph.microsoft.com/beta/solutions/bookingBusinesses/${businessId}/appointments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentBody),
      }
    );

    if (!apptRes.ok) {
      const errText = await apptRes.text();
      throw new Error(`Appointment creation failed (${apptRes.status}): ${errText}`);
    }

    const apptData = await apptRes.json();

    return new Response(JSON.stringify({ success: true, appointmentId: apptData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("create-booking error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
