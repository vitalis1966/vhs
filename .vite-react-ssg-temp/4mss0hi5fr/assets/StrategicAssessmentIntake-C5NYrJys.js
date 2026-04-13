import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { B as Button } from "./button-DnzOxZqg.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-_RjaqiGR.js";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import { s as supabase } from "./client-B5yO-kwf.js";
import { Compass, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import "./index-CalXArNJ.js";
import "react-dom";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-radio-group";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
const BASE_URL = window.location.origin;
const EmailAutomationService = {
  async sendEmail(payload) {
    try {
      const { data, error } = await supabase.functions.invoke("send-assessment-email", {
        body: payload
      });
      if (error) {
        console.error("Email send error:", error);
        return { success: false };
      }
      return { success: true, event_id: data?.event_id };
    } catch (err) {
      console.error("Email service error:", err);
      return { success: false };
    }
  },
  async sendIntakeConfirmation(intakeId, clientName, email) {
    return this.sendEmail({
      email_type: "intake_confirmation",
      recipient_email: email,
      intake_id: intakeId,
      template_data: { client_name: clientName }
    });
  },
  async sendAssessmentAccess(intakeId, sessionId, clientName, email, accessToken) {
    return this.sendEmail({
      email_type: "assessment_access",
      recipient_email: email,
      session_id: sessionId,
      intake_id: intakeId,
      template_data: {
        client_name: clientName,
        assessment_url: `${BASE_URL}/assessment/${accessToken}`
      }
    });
  },
  async sendCompletionConfirmation(sessionId, intakeId, clientName, email, _accessToken) {
    return this.sendEmail({
      email_type: "completion_confirmation",
      recipient_email: email,
      session_id: sessionId,
      intake_id: intakeId || void 0,
      template_data: {
        client_name: clientName
      }
    });
  },
  async sendAdminNotification(sessionId, clientName, organization, assessmentType, submittedAt, adminEmail) {
    return this.sendEmail({
      email_type: "admin_notification",
      recipient_email: adminEmail,
      session_id: sessionId,
      template_data: {
        client_name: clientName,
        organization,
        assessment_type: assessmentType,
        submitted_at: new Date(submittedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        admin_url: `${BASE_URL}/admin/submissions/${sessionId}`
      }
    });
  },
  async scheduleReminders(accessToken) {
    const now = Date.now();
    const reminders = [
      { number: 1, delay: 24 * 60 * 60 * 1e3 },
      // 24 hours
      { number: 2, delay: 4 * 24 * 60 * 60 * 1e3 },
      // 4 days
      { number: 3, delay: 8 * 24 * 60 * 60 * 1e3 }
      // 8 days
    ];
    for (const r of reminders) {
      await supabase.rpc("schedule_reminder_by_token", {
        p_token: accessToken,
        p_reminder_number: r.number,
        p_scheduled_at: new Date(now + r.delay).toISOString()
      });
    }
  },
  async cancelPendingReminders(accessToken) {
    await supabase.rpc("cancel_reminders_by_token", { p_token: accessToken });
  },
  async getEmailHistory(sessionId, intakeId) {
    let query = supabase.from("email_events").select("*").order("created_at", { ascending: false });
    if (sessionId) query = query.eq("session_id", sessionId);
    if (intakeId) query = query.eq("intake_id", intakeId);
    const { data } = await query;
    return data || [];
  }
};
const assessmentPurposeOptions = [
  { value: "building_new_clinic", label: "Building a new clinic", track: "new" },
  { value: "planning_healthcare_space", label: "Planning a new healthcare space", track: "new" },
  { value: "improving_existing_clinic", label: "Improving an existing clinic", track: "existing" },
  { value: "evaluating_operations", label: "Evaluating current operations", track: "existing" },
  { value: "healthcare_it_new", label: "Establishing New Healthcare IT", track: "healthcare_it" },
  { value: "healthcare_it_existing", label: "Improving Existing Healthcare IT", track: "healthcare_it" },
  { value: "growth_expansion", label: "Growth and expansion planning", track: "existing" },
  { value: "new_healthcare_venture", label: "Exploring a new healthcare venture", track: "new" },
  { value: "not_sure", label: "Not sure yet", track: "unknown" }
];
const timelineOptions = [
  "Immediately / ASAP",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "12+ months",
  "No specific timeline"
];
const specialtyOptions = [
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Cardiology",
  "Psychiatry",
  "Obstetrics & Gynecology",
  "General Surgery",
  "Ophthalmology",
  "Dental",
  "Physiotherapy",
  "Multidisciplinary",
  "Walk-In / Urgent Care",
  "Diagnostic / Imaging",
  "Veterinary Medicine",
  "Other"
];
const practiceTypeOptions = [
  "Solo practice",
  "Group practice",
  "Multi-physician clinic",
  "Multidisciplinary clinic",
  "Specialist practice",
  "Walk-in clinic",
  "Diagnostic / Imaging center",
  "Virtual / Telehealth practice",
  "Veterinary Clinic",
  "Other"
];
const provinceOptions = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
  "Other / Outside Canada"
];
function determineTrack(form) {
  const match = assessmentPurposeOptions.find((o) => o.value === form.assessment_purpose);
  if (match && match.track === "healthcare_it") {
    return { track: "healthcare_it", reason: `assessment_for:${form.assessment_purpose}` };
  }
  if (match && match.track === "new") {
    return { track: "new_clinic_build", reason: `assessment_for:${form.assessment_purpose}` };
  }
  if (match && match.track === "existing") {
    return { track: "existing_clinic", reason: `assessment_for:${form.assessment_purpose}` };
  }
  if (form.planning_new_facility === "yes") {
    return { track: "new_clinic_build", reason: "planning_new_facility:yes" };
  }
  if (form.currently_operating === "yes") {
    return { track: "existing_clinic", reason: "currently_operating:yes" };
  }
  if (form.planning_new_facility === "exploring") {
    return { track: "new_clinic_build", reason: "planning_new_facility:exploring" };
  }
  if (form.currently_operating === "in_planning") {
    return { track: "new_clinic_build", reason: "currently_operating:in_planning" };
  }
  return { track: "needs_review", reason: "fallback:not_sure" };
}
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};
const StrategicAssessmentIntake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    organization_name: "",
    email: "",
    phone: "",
    city: "",
    province_state: "",
    country: "Canada",
    specialty: "",
    practice_type: "",
    assessment_purpose: "",
    currently_operating: "",
    planning_new_facility: "",
    approximate_timeline: "",
    looking_for: "",
    preferred_followup: "",
    additional_notes: ""
  });
  const [errors, setErrors] = useState({});
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const validate = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required.";
    if (form.full_name.trim().length > 100) newErrors.full_name = "Name must be under 100 characters.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = "Please enter a valid email.";
    if (form.email.trim().length > 255) newErrors.email = "Email must be under 255 characters.";
    if (!form.assessment_purpose) newErrors.assessment_purpose = "Please select what this assessment is for.";
    if (form.phone && form.phone.length > 30) newErrors.phone = "Phone number is too long.";
    if (form.additional_notes.length > 2e3) newErrors.additional_notes = "Please keep notes under 2000 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const { track, reason } = determineTrack(form);
    try {
      const intakeId = crypto.randomUUID();
      const { error } = await supabase.from("assessment_intakes").insert({
        id: intakeId,
        full_name: form.full_name.trim(),
        organization_name: form.organization_name.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        province_state: form.province_state || null,
        country: form.country || "Canada",
        specialty: form.specialty || null,
        practice_type: form.practice_type || null,
        assessment_purpose: form.assessment_purpose,
        currently_operating: form.currently_operating === "yes" ? true : form.currently_operating === "no" ? false : null,
        planning_new_facility: form.planning_new_facility === "yes" ? true : form.planning_new_facility === "no" ? false : null,
        approximate_timeline: form.approximate_timeline || null,
        looking_for: form.looking_for.trim() || null,
        preferred_followup: form.preferred_followup || null,
        additional_notes: form.additional_notes.trim() || null,
        assigned_track: track,
        assignment_reason: reason
      });
      if (error) throw error;
      const trackNameMap = {
        new_clinic_build: "Build Strategy Assessment",
        existing_clinic: "Performance Assessment",
        healthcare_it: "Healthcare IT Assessment",
        needs_review: "Strategic Assessment (Needs Review)"
      };
      const assessmentName = trackNameMap[track] || "Strategic Assessment";
      try {
        const operatingStatus = form.currently_operating === "yes" ? "Yes" : form.currently_operating === "no" ? "No" : form.currently_operating === "in_planning" ? "In Planning" : "Not specified";
        const messageParts = [
          `Assessment: ${assessmentName}`,
          `Specialty: ${form.specialty || "Not specified"}`,
          `Practice Type: ${form.practice_type || "Not specified"}`,
          `City: ${[form.city, form.province_state].filter(Boolean).join(", ") || "Not specified"}`,
          `Operating Status: ${operatingStatus}`,
          `Timeline: ${form.approximate_timeline || "Not specified"}`,
          `Looking for: ${form.looking_for.trim() || "Not specified"}`,
          `Additional notes: ${form.additional_notes.trim() || "None"}`
        ];
        const { error: contactError } = await supabase.from("contact_submissions").insert({
          name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          organization: form.organization_name.trim() || null,
          area_of_interest: assessmentName,
          message: messageParts.join("\n"),
          status: "new"
        });
        if (contactError) {
          console.error("Contact submission mirror DB error:", contactError);
        }
      } catch (contactErr) {
        console.error("Contact submission mirror failed (non-blocking):", contactErr);
      }
      try {
        await supabase.functions.invoke("send-assessment-intake-notification", {
          body: {
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || void 0,
            organization_name: form.organization_name.trim() || void 0,
            city: form.city.trim() || void 0,
            province_state: form.province_state || void 0,
            specialty: form.specialty || void 0,
            practice_type: form.practice_type || void 0,
            assessment_purpose: form.assessment_purpose,
            approximate_timeline: form.approximate_timeline || void 0,
            looking_for: form.looking_for.trim() || void 0,
            additional_notes: form.additional_notes.trim() || void 0,
            assigned_track: track,
            idempotencyKey: `intake-notify-${intakeId}`
          }
        });
      } catch (emailErr) {
        console.error("Intake notification email failed (non-blocking):", emailErr);
      }
      let accessToken = "";
      let sessionId = "";
      if (track !== "needs_review") {
        const slugMap = {
          new_clinic_build: "new-clinic",
          existing_clinic: "existing-clinic",
          healthcare_it: "healthcare-it-assessment"
        };
        const slug = slugMap[track] || "existing-clinic";
        const { data: assessment } = await supabase.from("assessments").select("id").eq("slug", slug).single();
        if (assessment) {
          accessToken = crypto.randomUUID();
          sessionId = crypto.randomUUID();
          const { error: sessionError } = await supabase.from("assessment_sessions").insert({
            id: sessionId,
            intake_id: intakeId,
            assessment_id: assessment.id,
            access_token: accessToken,
            status: "in_progress",
            current_section_index: 0
          });
          if (sessionError) {
            console.error("Session creation error:", sessionError);
            sessionId = "";
            accessToken = "";
          }
          if (sessionId) {
            await supabase.from("assessment_intakes").update({
              session_id: sessionId,
              lifecycle_status: "assessment_assigned",
              last_activity_at: (/* @__PURE__ */ new Date()).toISOString()
            }).eq("id", intakeId);
          }
          EmailAutomationService.sendAssessmentAccess(
            intakeId,
            sessionId,
            form.full_name.trim(),
            form.email.trim(),
            accessToken
          );
          if (accessToken) {
            EmailAutomationService.scheduleReminders(accessToken);
          }
        }
      }
      if (accessToken) {
        navigate(`/assessment/${accessToken}`);
      } else {
        const params = new URLSearchParams({ track });
        navigate(`/strategic-assessment/confirmation?${params.toString()}`);
      }
    } catch (err) {
      console.error("Intake submission error:", err);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  const fieldClass = (field) => errors[field] ? "border-destructive focus-visible:ring-destructive" : "";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-10 lg:pt-40 lg:pb-14 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Compass, { className: "h-7 w-7 text-accent" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "Strategic Assessment Intake" }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto", children: "Tell us about your situation. This helps us identify the most relevant assessment path and connect you with the right strategic support." })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-2xl", children: /* @__PURE__ */ jsxs(motion.form, { ...fadeUp, onSubmit: handleSubmit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 space-y-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Contact Information" }),
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "full_name", children: "Full Name *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "full_name",
                value: form.full_name,
                onChange: (e) => updateField("full_name", e.target.value),
                maxLength: 100,
                className: fieldClass("full_name"),
                placeholder: "Dr. Jane Smith"
              }
            ),
            errors.full_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.full_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "organization_name", children: "Clinic / Organization Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "organization_name",
                value: form.organization_name,
                onChange: (e) => updateField("organization_name", e.target.value),
                maxLength: 150,
                placeholder: "e.g. Summit Medical Clinic"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: form.email,
                onChange: (e) => updateField("email", e.target.value),
                maxLength: 255,
                className: fieldClass("email"),
                placeholder: "jane@example.com"
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone",
                value: form.phone,
                onChange: (e) => updateField("phone", e.target.value),
                maxLength: 30,
                className: fieldClass("phone"),
                placeholder: "(403) 555-0100"
              }
            ),
            errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.phone })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "city", children: "City" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "city",
                value: form.city,
                onChange: (e) => updateField("city", e.target.value),
                maxLength: 80,
                placeholder: "Calgary"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Province / State" }),
            /* @__PURE__ */ jsxs(Select, { value: form.province_state, onValueChange: (v) => updateField("province_state", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: provinceOptions.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: p }, p)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "country", children: "Country" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "country",
                value: form.country,
                onChange: (e) => updateField("country", e.target.value),
                maxLength: 60
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 space-y-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Practice Details" }),
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Specialty" }),
            /* @__PURE__ */ jsxs(Select, { value: form.specialty, onValueChange: (v) => updateField("specialty", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select specialty" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: specialtyOptions.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Type of Clinic / Practice" }),
            /* @__PURE__ */ jsxs(Select, { value: form.practice_type, onValueChange: (v) => updateField("practice_type", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: practiceTypeOptions.map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t, children: t }, t)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "What are you looking for?" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: form.looking_for,
              onChange: (e) => updateField("looking_for", e.target.value),
              maxLength: 1e3,
              placeholder: "Briefly describe what you're looking to achieve...",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Preferred Follow-Up Method" }),
          /* @__PURE__ */ jsxs(Select, { value: form.preferred_followup, onValueChange: (v) => updateField("preferred_followup", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "email", children: "Email" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "phone", children: "Phone" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "video_call", children: "Video Call" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "no_preference", children: "No Preference" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 space-y-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Assessment Details" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "What is this assessment for? *" }),
          /* @__PURE__ */ jsx(
            RadioGroup,
            {
              value: form.assessment_purpose,
              onValueChange: (v) => updateField("assessment_purpose", v),
              className: "space-y-2",
              children: assessmentPurposeOptions.map((o) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(RadioGroupItem, { value: o.value, id: o.value }),
                    /* @__PURE__ */ jsx(Label, { htmlFor: o.value, className: "cursor-pointer text-sm font-medium text-foreground flex-1", children: o.label })
                  ]
                },
                o.value
              ))
            }
          ),
          errors.assessment_purpose && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.assessment_purpose })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { className: "font-semibold", children: "Are you currently operating?" }),
          /* @__PURE__ */ jsxs(
            RadioGroup,
            {
              value: form.currently_operating,
              onValueChange: (v) => updateField("currently_operating", v),
              className: "flex flex-wrap gap-4",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "yes", id: "op_yes" }),
                  /* @__PURE__ */ jsx(Label, { htmlFor: "op_yes", className: "cursor-pointer text-sm", children: "Yes" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "no", id: "op_no" }),
                  /* @__PURE__ */ jsx(Label, { htmlFor: "op_no", className: "cursor-pointer text-sm", children: "No" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "in_planning", id: "op_planning" }),
                  /* @__PURE__ */ jsx(Label, { htmlFor: "op_planning", className: "cursor-pointer text-sm", children: "In Planning" })
                ] })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Approximate Timeline" }),
          /* @__PURE__ */ jsxs(Select, { value: form.approximate_timeline, onValueChange: (v) => updateField("approximate_timeline", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select timeline" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: timelineOptions.map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t, children: t }, t)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Anything else we should know?" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: form.additional_notes,
              onChange: (e) => updateField("additional_notes", e.target.value),
              maxLength: 2e3,
              placeholder: "Any additional context that would help us prepare...",
              rows: 4
            }
          ),
          errors.additional_notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.additional_notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center pt-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "submit", variant: "hero", size: "xl", disabled: submitting, className: "min-w-[280px]", children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-5 w-5 animate-spin" }),
          "Submitting..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Submit Assessment Intake",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "Your information is kept confidential and will only be used to prepare your Strategic Assessment." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  StrategicAssessmentIntake as default
};
