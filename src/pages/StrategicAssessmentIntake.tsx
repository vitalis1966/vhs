import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Compass, ArrowRight, Loader2 } from "lucide-react";
import { EmailAutomationService } from "@/services/EmailAutomationService";

const assessmentPurposeOptions = [
  { value: "building_new_clinic", label: "Building a new clinic", track: "new" },
  { value: "planning_healthcare_space", label: "Planning a new healthcare space", track: "new" },
  { value: "improving_existing_clinic", label: "Improving an existing clinic", track: "existing" },
  { value: "evaluating_operations", label: "Evaluating current operations", track: "existing" },
  { value: "healthcare_it_new", label: "Establishing New Healthcare IT", track: "healthcare_it" },
  { value: "healthcare_it_existing", label: "Improving Existing Healthcare IT", track: "healthcare_it" },
  { value: "growth_expansion", label: "Growth and expansion planning", track: "existing" },
  { value: "new_healthcare_venture", label: "Exploring a new healthcare venture", track: "new" },
  { value: "not_sure", label: "Not sure yet", track: "unknown" },
];

const timelineOptions = [
  "Immediately / ASAP",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "12+ months",
  "No specific timeline",
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
  "Other",
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
  "Other",
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
  "Other / Outside Canada",
];

function determineTrack(form: {
  assessment_purpose: string;
  currently_operating: string;
  planning_new_facility: string;
}): { track: string; reason: string } {
  const match = assessmentPurposeOptions.find((o) => o.value === form.assessment_purpose);

  // Primary signal: assessment purpose
  if (match && match.track === "new") {
    return { track: "new_clinic_build", reason: `assessment_for:${form.assessment_purpose}` };
  }
  if (match && match.track === "existing") {
    return { track: "existing_clinic", reason: `assessment_for:${form.assessment_purpose}` };
  }

  // Fallback for "not_sure" or missing: use secondary signals
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
  viewport: { once: true },
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
    additional_notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required.";
    if (form.full_name.trim().length > 100) newErrors.full_name = "Name must be under 100 characters.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = "Please enter a valid email.";
    if (form.email.trim().length > 255) newErrors.email = "Email must be under 255 characters.";
    if (!form.assessment_purpose) newErrors.assessment_purpose = "Please select what this assessment is for.";
    if (form.phone && form.phone.length > 30) newErrors.phone = "Phone number is too long.";
    if (form.additional_notes.length > 2000) newErrors.additional_notes = "Please keep notes under 2000 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const { track, reason } = determineTrack(form);

    try {
      // Insert intake and get the id back
      const { data: intakeData, error } = (await supabase
        .from("assessment_intakes")
        .insert({
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
          currently_operating:
            form.currently_operating === "yes" ? true : form.currently_operating === "no" ? false : null,
          planning_new_facility:
            form.planning_new_facility === "yes" ? true : form.planning_new_facility === "no" ? false : null,
          approximate_timeline: form.approximate_timeline || null,
          looking_for: form.looking_for.trim() || null,
          preferred_followup: form.preferred_followup || null,
          additional_notes: form.additional_notes.trim() || null,
          assigned_track: track,
          assignment_reason: reason,
        } as any)
        .select()
        .single()) as any;

      if (error) throw error;

      // Send intake confirmation email
      if (intakeData?.id) {
        EmailAutomationService.sendIntakeConfirmation(intakeData.id, form.full_name.trim(), form.email.trim());
      }

      // Create assessment session if track is known
      let accessToken = "";
      let sessionId = "";
      if (track !== "needs_review") {
        const slug = track === "new_clinic_build" ? "new-clinic" : "existing-clinic";
        const { data: assessment } = await (supabase
          .from("assessments" as any)
          .select("id")
          .eq("slug", slug)
          .single() as any);

        if (assessment) {
          accessToken = crypto.randomUUID();
          const { data: sessionData } = await (supabase
            .from("assessment_sessions" as any)
            .insert({
              intake_id: intakeData?.id || null,
              assessment_id: assessment.id,
              access_token: accessToken,
              status: "in_progress",
              current_section_index: 0,
            })
            .select()
            .single() as any);

          sessionId = sessionData?.id || "";

          // Update intake with session reference and lifecycle
          if (intakeData?.id && sessionId) {
            await (supabase
              .from("assessment_intakes" as any)
              .update({
                session_id: sessionId,
                lifecycle_status: "assessment_assigned",
                last_activity_at: new Date().toISOString(),
              })
              .eq("id", intakeData.id) as any);
          }

          // Send assessment access email
          if (intakeData?.id) {
            EmailAutomationService.sendAssessmentAccess(
              intakeData.id,
              sessionId,
              form.full_name.trim(),
              form.email.trim(),
              accessToken,
            );
          }

          // Schedule reminders
          if (sessionId) {
            EmailAutomationService.scheduleReminders(sessionId);
          }
        }
      }

      const params = new URLSearchParams({ track });
      if (accessToken) params.set("token", accessToken);
      navigate(`/strategic-assessment/confirmation?${params.toString()}`);
    } catch (err: any) {
      console.error("Intake submission error:", err);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (field: string) => (errors[field] ? "border-destructive focus-visible:ring-destructive" : "");

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-10 lg:pt-40 lg:pb-14 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center">
                <Compass className="h-7 w-7 text-accent" />
              </div>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
              Strategic Assessment Intake
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Tell us about your situation. This helps us identify the most relevant assessment path and connect you
              with the right strategic support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <motion.form {...fadeUp} onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Contact Information</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    maxLength={100}
                    className={fieldClass("full_name")}
                    placeholder="Dr. Jane Smith"
                  />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization_name">Clinic / Organization Name</Label>
                  <Input
                    id="organization_name"
                    value={form.organization_name}
                    onChange={(e) => updateField("organization_name", e.target.value)}
                    maxLength={150}
                    placeholder="e.g. Summit Medical Clinic"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    maxLength={255}
                    className={fieldClass("email")}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    maxLength={30}
                    className={fieldClass("phone")}
                    placeholder="(403) 555-0100"
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    maxLength={80}
                    placeholder="Calgary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Province / State</Label>
                  <Select value={form.province_state} onValueChange={(v) => updateField("province_state", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinceOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    maxLength={60}
                  />
                </div>
              </div>
            </div>

            {/* Practice Info */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Practice Details</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <Select value={form.specialty} onValueChange={(v) => updateField("specialty", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtyOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type of Clinic / Practice</Label>
                  <Select value={form.practice_type} onValueChange={(v) => updateField("practice_type", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceTypeOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>What are you looking for?</Label>
                <Textarea
                  value={form.looking_for}
                  onChange={(e) => updateField("looking_for", e.target.value)}
                  maxLength={1000}
                  placeholder="Briefly describe what you're looking to achieve..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Follow-Up Method</Label>
                <Select value={form.preferred_followup} onValueChange={(v) => updateField("preferred_followup", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video_call">Video Call</SelectItem>
                    <SelectItem value="no_preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assessment Routing */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Assessment Details</h2>

              <div className="space-y-3">
                <Label className="text-base font-semibold">What is this assessment for? *</Label>
                <RadioGroup
                  value={form.assessment_purpose}
                  onValueChange={(v) => updateField("assessment_purpose", v)}
                  className="space-y-2"
                >
                  {assessmentPurposeOptions.map((o) => (
                    <div
                      key={o.value}
                      className="flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={o.value} id={o.value} />
                      <Label htmlFor={o.value} className="cursor-pointer text-sm font-medium text-foreground flex-1">
                        {o.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.assessment_purpose && <p className="text-xs text-destructive">{errors.assessment_purpose}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-semibold">Are you currently operating?</Label>
                  <RadioGroup
                    value={form.currently_operating}
                    onValueChange={(v) => updateField("currently_operating", v)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="op_yes" />
                      <Label htmlFor="op_yes" className="cursor-pointer text-sm">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="op_no" />
                      <Label htmlFor="op_no" className="cursor-pointer text-sm">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="in_planning" id="op_planning" />
                      <Label htmlFor="op_planning" className="cursor-pointer text-sm">
                        In Planning
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Approximate Timeline</Label>
                <Select value={form.approximate_timeline} onValueChange={(v) => updateField("approximate_timeline", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Anything else we should know?</Label>
                <Textarea
                  value={form.additional_notes}
                  onChange={(e) => updateField("additional_notes", e.target.value)}
                  maxLength={2000}
                  placeholder="Any additional context that would help us prepare..."
                  rows={4}
                />

                {errors.additional_notes && <p className="text-xs text-destructive">{errors.additional_notes}</p>}
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-2">
              <Button type="submit" variant="hero" size="xl" disabled={submitting} className="min-w-[280px]">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Assessment Intake
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Your information is kept confidential and will only be used to prepare your Strategic Assessment.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicAssessmentIntake;
