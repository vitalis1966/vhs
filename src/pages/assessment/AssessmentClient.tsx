import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { QuestionRenderer } from "@/components/assessment/QuestionRenderer";
import { EmailAutomationService } from "@/services/EmailAutomationService";
import type {
  Assessment,
  AssessmentSession,
  SectionWithQuestions,
} from "@/types/assessment";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Compass,
  ClipboardList,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Screen = "loading" | "error" | "start" | "section" | "review" | "submitted";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AssessmentClient() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();

  const [screen, setScreen] = useState<Screen>("loading");
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [sections, setSections] = useState<SectionWithQuestions[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, { value: string; json: any }>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load session + assessment data
  useEffect(() => {
    if (!token) { setScreen("error"); return; }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      // Load session via secure RPC (does not expose access_token)
      const { data: sess, error: sessErr } = await supabase.rpc("get_session_by_token", { p_token: token });
      const session = Array.isArray(sess) ? sess[0] : sess;
      if (sessErr || !session) { setScreen("error"); return; }

      if (session.status === "submitted") {
        setSession(session as any);
        setScreen("submitted");
        return;
      }
      const sess_data = session as any;

      // Load assessment
      const { data: assess } = await (supabase.from("assessments" as any)
        .select("*")
        .eq("id", sess.assessment_id)
        .single() as any);

      // Load sections with questions
      const { data: secs } = await (supabase.from("assessment_sections" as any)
        .select("*")
        .eq("assessment_id", sess.assessment_id)
        .order("sort_order") as any);

      const sectionsWithQuestions: SectionWithQuestions[] = [];
      for (const sec of (secs || [])) {
        const { data: questions } = await (supabase.from("assessment_questions" as any)
          .select("*")
          .eq("section_id", sec.id)
          .order("sort_order") as any);
        sectionsWithQuestions.push({ ...sec, questions: questions || [] });
      }

      // Load existing responses
      const { data: existingResponses } = await (supabase.from("assessment_responses" as any)
        .select("*")
        .eq("session_id", sess.id) as any);

      const resMap: Record<string, { value: string; json: any }> = {};
      for (const r of (existingResponses || [])) {
        resMap[r.question_id] = { value: r.response_value || "", json: r.response_json };
      }

      setSession(sess);
      setAssessment(assess);
      setSections(sectionsWithQuestions);
      setResponses(resMap);
      setCurrentIdx(sess.current_section_index || 0);
      setScreen("start");
    } catch {
      setScreen("error");
    }
  };

  const saveResponse = useCallback(async (questionId: string, value: string, jsonValue?: any) => {
    if (!session) return;
    setSaveStatus("saving");
    try {
      await (supabase.from("assessment_responses" as any).upsert({
        session_id: session.id,
        question_id: questionId,
        response_value: value || null,
        response_json: jsonValue || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "session_id,question_id" }) as any);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("idle");
    }
  }, [session]);

  const handleResponseChange = (questionId: string, value: string, jsonValue?: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { value, json: jsonValue },
    }));
    // Debounced save
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveResponse(questionId, value, jsonValue), 1500);
  };

  const saveAllCurrentSection = async () => {
    if (!session || !sections[currentIdx]) return;
    setSaveStatus("saving");
    for (const q of sections[currentIdx].questions) {
      const r = responses[q.id];
      if (r) {
        await (supabase.from("assessment_responses" as any).upsert({
          session_id: session.id,
          question_id: q.id,
          response_value: r.value || null,
          response_json: r.json || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "session_id,question_id" }) as any);
      }
    }
    // Update session current_section_index
    await (supabase.from("assessment_sessions" as any)
      .update({ current_section_index: currentIdx, updated_at: new Date().toISOString() })
      .eq("id", session.id) as any);
    setSaveStatus("saved");
  };

  const validateCurrentSection = (): boolean => {
    if (!sections[currentIdx]) return true;
    for (const q of sections[currentIdx].questions) {
      if (q.is_required) {
        const r = responses[q.id];
        if (!r || (!r.value && !r.json)) {
          toast({
            title: "Required Field",
            description: `Please answer: "${q.question_text}"`,
            variant: "destructive",
          });
          return false;
        }
      }
    }
    return true;
  };

  const goNext = async () => {
    if (!validateCurrentSection()) return;
    await saveAllCurrentSection();
    if (currentIdx < sections.length - 1) {
      setCurrentIdx(currentIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!session) return;
    setSaveStatus("saving");
    await (supabase.from("assessment_sessions" as any)
      .update({ status: "submitted", submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", session.id) as any);

    // Cancel pending reminders
    await EmailAutomationService.cancelPendingReminders(session.id);

    // Send completion email and admin notification
    if (session.intake_id) {
      const { data: intake } = await (supabase.from("assessment_intakes" as any)
        .select("full_name, email, organization_name")
        .eq("id", session.intake_id)
        .single() as any);

      if (intake) {
        // Client completion email
        EmailAutomationService.sendCompletionConfirmation(
          session.id,
          session.intake_id,
          intake.full_name || "",
          intake.email,
          token || ""
        );

        // Admin notification (logged for now — configure NOTIFICATION_EMAIL for delivery)
        const assessmentType = assessment?.title || "Strategic Assessment";
        EmailAutomationService.sendAdminNotification(
          session.id,
          intake.full_name || "Unknown",
          intake.organization_name || "—",
          assessmentType,
          new Date().toISOString(),
          "admin@vitalishealth.com" // Placeholder — configure via secrets
        );

        // Update lifecycle status
        await (supabase.from("assessment_intakes" as any)
          .update({
            lifecycle_status: "assessment_completed",
            assessment_completion_date: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
          })
          .eq("id", session.intake_id) as any);
      }
    }

    setSaveStatus("saved");
    setScreen("submitted");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progress = sections.length > 0
    ? screen === "review" || screen === "submitted"
      ? 100
      : Math.round(((currentIdx + 1) / sections.length) * 100)
    : 0;

  // --- SCREENS ---

  if (screen === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (screen === "error") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Assessment Not Found</h1>
          <p className="text-muted-foreground mb-8">This assessment link may be invalid or expired.</p>
          <Button variant="hero" asChild>
            <Link to="/strategic-assessment">Back to Strategic Assessment</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (screen === "submitted") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 text-center max-w-2xl mx-auto px-4">
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Assessment Submitted
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Thank you for completing the {assessment?.title || "Strategic Assessment"}.
            </p>
            <p className="text-muted-foreground mb-4">
              Your responses have been received. You can view a formatted summary of your submission below.
            </p>
            <p className="text-sm text-muted-foreground mb-10">
              Our team will review your assessment and follow up with strategic insights tailored to your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to={`/assessment/${token}/report`}>
                  View Response Summary
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">Return to Website</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (screen === "start") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <motion.div {...fadeUp}>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
                  <ClipboardList className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                {assessment?.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {assessment?.description}
              </p>
              <p className="text-muted-foreground mb-2">
                This assessment has <strong>{sections.length} sections</strong> with questions designed to understand your situation.
              </p>
              <p className="text-sm text-muted-foreground mb-10">
                Your progress is saved automatically. You can save and continue later at any time.
              </p>
              <Button variant="hero" size="xl" onClick={() => { setScreen("section"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Begin Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Section overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">Assessment Sections</h2>
            <div className="space-y-3">
              {sections.map((s, i) => (
                <div key={s.id} className="bg-card rounded-xl px-5 py-4 shadow-soft border border-border/40 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.title}</p>
                    {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (screen === "review") {
    return (
      <div className="min-h-screen">
        <Navbar />
        {/* Progress bar */}
        <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="h-1 bg-secondary">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: "100%" }} />
          </div>
        </div>

        <section className="pt-32 pb-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <motion.div {...fadeUp}>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Review Your Answers</h1>
              <p className="text-muted-foreground mb-10">
                Please review your responses before submitting. You can go back to any section to make changes.
              </p>

              {sections.map((section, sIdx) => (
                <div key={section.id} className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      {sIdx + 1}. {section.title}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setCurrentIdx(sIdx); setScreen("section"); }}
                      className="text-accent hover:text-accent/80"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 space-y-4">
                    {section.questions.map((q) => {
                      const r = responses[q.id];
                      const displayValue = r?.json && Array.isArray(r.json) ? r.json.join(", ") : r?.value || "";
                      return (
                        <div key={q.id}>
                          <p className="text-sm font-medium text-foreground">
                            {q.question_text}
                            {q.is_required && <span className="text-destructive ml-1">*</span>}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {displayValue || <span className="italic text-muted-foreground/60">No answer provided</span>}
                          </p>
                        </div>
                      );
                    })}
                    {section.questions.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No questions in this section yet.</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button variant="outline" size="lg" onClick={() => { setCurrentIdx(sections.length - 1); setScreen("section"); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Last Section
                </Button>
                <Button variant="hero" size="lg" onClick={handleSubmit} className="flex-1">
                  Submit Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // SECTION SCREEN
  const section = sections[currentIdx];
  if (!section) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Progress bar */}
      <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl flex items-center justify-between py-2">
          <span className="text-xs text-muted-foreground">
            Section {currentIdx + 1} of {sections.length}
          </span>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            {saveStatus === "saved" && <CheckCircle className="h-3 w-3 text-accent" />}
            <span className="text-xs text-muted-foreground">
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : ""}
            </span>
          </div>
        </div>
      </div>

      <section className="pt-36 lg:pt-40 pb-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <motion.div {...fadeUp} key={section.id}>
            <div className="mb-8">
              <p className="text-accent font-medium tracking-widest uppercase text-xs mb-2">
                Section {currentIdx + 1} of {sections.length}
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
            </div>

            <div className="space-y-8">
              {section.questions.map((q) => (
                <div key={q.id} className="bg-card rounded-2xl p-6 shadow-soft border border-border/40">
                  <QuestionRenderer
                    question={q}
                    value={responses[q.id]?.value || ""}
                    jsonValue={responses[q.id]?.json}
                    onChange={(val, json) => handleResponseChange(q.id, val, json)}
                  />
                </div>
              ))}
              {section.questions.length === 0 && (
                <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/40 text-center">
                  <p className="text-muted-foreground">No questions in this section yet.</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Questions will be added soon.</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-10 gap-4">
              <div className="flex gap-3">
                {currentIdx > 0 && (
                  <Button variant="outline" size="lg" onClick={goPrev}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                <Button variant="ghost" size="lg" onClick={saveAllCurrentSection}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Progress
                </Button>
              </div>
              <Button variant="hero" size="lg" onClick={goNext}>
                {currentIdx < sections.length - 1 ? (
                  <>
                    Next Section
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Review Answers
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
