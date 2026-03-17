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

/** Fetch the first service and its default duration (ISO 8601). */
async function getServiceInfo(token: string, businessId: string): Promise<{ id: string; durationMinutes: number }> {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/services`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch services (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const services = data.value || [];
  if (services.length === 0) {
    throw new Error("No services configured in Microsoft Bookings business");
  }

  const svc = services[0];
  // defaultDuration is ISO 8601 duration like "PT30M" or "PT1H"
  let durationMinutes = 30; // fallback
  const dur = svc.defaultDuration as string | undefined;
  if (dur) {
    const hMatch = dur.match(/(\d+)H/);
    const mMatch = dur.match(/(\d+)M/);
    durationMinutes = (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0);
  }

  return { id: svc.id, durationMinutes };
}

/** Add minutes to "HH:MM" and return "HH:MM". */
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + minutes;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organization, date, time, note } = await req.json();

    if (!name || !email || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, date, time" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await getAccessToken();
    const businessId = Deno.env.get("BOOKING_BUSINESS_ID")!;

    const { id: serviceId, durationMinutes } = await getServiceInfo(token, businessId);

    const endTime = addMinutes(time, durationMinutes);
    const customerNotes = [organization, note].filter(Boolean).join(" — ");

    // Use the exact appointment shape that Microsoft Bookings expects.
    // Key: start/end must match the service's configured duration.
    const appointmentBody = {
      "@odata.type": "#microsoft.graph.bookingAppointment",
      serviceId,
      start: {
        "@odata.type": "#microsoft.graph.dateTimeTimeZone",
        dateTime: `${date}T${time}:00`,
        timeZone: "America/Toronto",
      },
      end: {
        "@odata.type": "#microsoft.graph.dateTimeTimeZone",
        dateTime: `${date}T${endTime}:00`,
        timeZone: "America/Toronto",
      },
      customers: [
        {
          "@odata.type": "#microsoft.graph.bookingCustomerInformation",
          name,
          emailAddress: email,
          notes: customerNotes,
          timeZone: "America/Toronto",
        },
      ],
      isLocationOnline: true,
    };

    console.log("Creating appointment with body:", JSON.stringify(appointmentBody));

    const apptRes = await fetch(
      `https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/${businessId}/appointments`,
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
