import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Assessment, AssessmentSection, AssessmentQuestion } from "@/types/assessment";
import { FIELD_TYPES } from "@/types/assessment";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Loader2,
  Save,
  GripVertical,
  X,
  Upload,
  Pencil,
  Check,
} from "lucide-react";

interface SectionWithQuestions extends AssessmentSection {
  questions: AssessmentQuestion[];
}

export default function AssessmentEditor() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [sections, setSections] = useState<SectionWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // New section form
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");

  // Editing section name state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [editSectionDesc, setEditSectionDesc] = useState("");

  // Editing question state
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [addingToSection, setAddingToSection] = useState<string | null>(null);
  const [qForm, setQForm] = useState({
    question_text: "",
    helper_text: "",
    field_type: "short_text",
    options: "",
    is_required: false,
  });

  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    const { data: a } = await (supabase.from("assessments" as any).select("*").eq("id", id).single() as any);
    setAssessment(a);

    const { data: secs } = await (supabase.from("assessment_sections" as any)
      .select("*").eq("assessment_id", id).order("sort_order") as any);

    const withQ: SectionWithQuestions[] = [];
    for (const sec of (secs || [])) {
      const { data: qs } = await (supabase.from("assessment_questions" as any)
        .select("*").eq("section_id", sec.id).order("sort_order") as any);
      withQ.push({ ...sec, questions: qs || [] });
    }
    setSections(withQ);
    setLoading(false);
  };

  const toggleSection = (sId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sId) ? next.delete(sId) : next.add(sId);
      return next;
    });
  };

  // --- Assessment actions ---
  const togglePublished = async () => {
    if (!assessment) return;
    const newVal = !assessment.is_published;
    await (supabase.from("assessments" as any).update({ is_published: newVal, updated_at: new Date().toISOString() }).eq("id", assessment.id) as any);
    setAssessment({ ...assessment, is_published: newVal });
    toast({ title: newVal ? "Assessment Published" : "Assessment Unpublished" });
  };

  // --- Section actions ---
  const addSection = async () => {
    if (!newSectionTitle.trim()) return;
    const sortOrder = sections.length;
    const { data } = await (supabase.from("assessment_sections" as any).insert({
      assessment_id: id,
      title: newSectionTitle.trim(),
      description: newSectionDesc.trim() || null,
      sort_order: sortOrder,
    }).select().single() as any);
    if (data) {
      setSections([...sections, { ...data, questions: [] }]);
      setNewSectionTitle("");
      setNewSectionDesc("");
      setShowNewSection(false);
      setExpandedSections((prev) => new Set(prev).add(data.id));
    }
  };

  const deleteSection = async (sId: string) => {
    await (supabase.from("assessment_sections" as any).delete().eq("id", sId) as any);
    setSections(sections.filter((s) => s.id !== sId));
    toast({ title: "Section deleted" });
  };

  const startEditSection = (section: SectionWithQuestions, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSectionId(section.id);
    setEditSectionTitle(section.title);
    setEditSectionDesc(section.description || "");
  };

  const cancelEditSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSectionId(null);
  };

  const saveSection = async (sId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editSectionTitle.trim()) return;
    await (supabase.from("assessment_sections" as any).update({
      title: editSectionTitle.trim(),
      description: editSectionDesc.trim() || null,
    }).eq("id", sId) as any);
    setSections(sections.map((s) =>
      s.id === sId ? { ...s, title: editSectionTitle.trim(), description: editSectionDesc.trim() || null } : s
    ));
    setEditingSectionId(null);
    toast({ title: "Section updated" });
  };

  const moveSectionUp = async (idx: number) => {
    if (idx <= 0) return;
    const updated = [...sections];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    updated.forEach((s, i) => (s.sort_order = i));
    for (const s of updated) {
      await (supabase.from("assessment_sections" as any).update({ sort_order: s.sort_order }).eq("id", s.id) as any);
    }
    setSections(updated);
  };

  const moveSectionDown = async (idx: number) => {
    if (idx >= sections.length - 1) return;
    const updated = [...sections];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    updated.forEach((s, i) => (s.sort_order = i));
    for (const s of updated) {
      await (supabase.from("assessment_sections" as any).update({ sort_order: s.sort_order }).eq("id", s.id) as any);
    }
    setSections(updated);
  };

  // --- Question actions ---
  const resetQForm = () => {
    setQForm({ question_text: "", helper_text: "", field_type: "short_text", options: "", is_required: false });
    setEditingQuestion(null);
    setAddingToSection(null);
  };

  const startAddQuestion = (sectionId: string) => {
    resetQForm();
    setAddingToSection(sectionId);
    setExpandedSections((prev) => new Set(prev).add(sectionId));
  };

  const startEditQuestion = (q: AssessmentQuestion) => {
    setQForm({
      question_text: q.question_text,
      helper_text: q.helper_text || "",
      field_type: q.field_type,
      options: q.options ? q.options.join("\n") : "",
      is_required: q.is_required,
    });
    setEditingQuestion(q.id);
    setAddingToSection(null);
  };

  const saveQuestion = async (sectionId: string) => {
    if (!qForm.question_text.trim()) return;
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const opts = qForm.options.trim()
      ? qForm.options.split("\n").map((o) => o.trim()).filter(Boolean)
      : null;

    if (editingQuestion) {
      // Update
      await (supabase.from("assessment_questions" as any).update({
        question_text: qForm.question_text.trim(),
        helper_text: qForm.helper_text.trim() || null,
        field_type: qForm.field_type,
        options: opts,
        is_required: qForm.is_required,
      }).eq("id", editingQuestion) as any);
      setSections(sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === editingQuestion
                  ? { ...q, question_text: qForm.question_text.trim(), helper_text: qForm.helper_text.trim() || null, field_type: qForm.field_type, options: opts, is_required: qForm.is_required }
                  : q
              ),
            }
          : s
      ));
    } else {
      // Insert
      const sortOrder = section.questions.length;
      const { data } = await (supabase.from("assessment_questions" as any).insert({
        section_id: sectionId,
        question_text: qForm.question_text.trim(),
        helper_text: qForm.helper_text.trim() || null,
        field_type: qForm.field_type,
        options: opts,
        is_required: qForm.is_required,
        sort_order: sortOrder,
      }).select().single() as any);
      if (data) {
        setSections(sections.map((s) =>
          s.id === sectionId ? { ...s, questions: [...s.questions, data] } : s
        ));
      }
    }
    resetQForm();
    toast({ title: editingQuestion ? "Question updated" : "Question added" });
  };

  const deleteQuestion = async (sectionId: string, qId: string) => {
    await (supabase.from("assessment_questions" as any).delete().eq("id", qId) as any);
    setSections(sections.map((s) =>
      s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== qId) } : s
    ));
    toast({ title: "Question deleted" });
  };

  const moveQuestionUp = async (sectionId: string, qIdx: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || qIdx <= 0) return;
    const updated = [...section.questions];
    [updated[qIdx - 1], updated[qIdx]] = [updated[qIdx], updated[qIdx - 1]];
    updated.forEach((q, i) => (q.sort_order = i));
    for (const q of updated) {
      await (supabase.from("assessment_questions" as any).update({ sort_order: q.sort_order }).eq("id", q.id) as any);
    }
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, questions: updated } : s)));
  };

  const moveQuestionDown = async (sectionId: string, qIdx: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || qIdx >= section.questions.length - 1) return;
    const updated = [...section.questions];
    [updated[qIdx], updated[qIdx + 1]] = [updated[qIdx + 1], updated[qIdx]];
    updated.forEach((q, i) => (q.sort_order = i));
    for (const q of updated) {
      await (supabase.from("assessment_questions" as any).update({ sort_order: q.sort_order }).eq("id", q.id) as any);
    }
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, questions: updated } : s)));
  };

  const needsOptions = ["dropdown", "single_select", "multi_select"].includes(qForm.field_type);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link to="/admin/assessments" className="text-accent text-sm font-medium hover:underline flex items-center gap-1 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Assessments
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
                {assessment?.title}
              </h1>
              <p className="mt-2 text-muted-foreground">{assessment?.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/assessments/${id}/import`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import from PDF
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">Published</span>
              <Switch checked={assessment?.is_published || false} onCheckedChange={togglePublished} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, sIdx) => {
              const expanded = expandedSections.has(section.id);
              return (
                <div key={section.id} className="bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden">
                  {/* Section header */}
                  <div className="flex items-center gap-3 p-5 cursor-pointer" onClick={() => toggleSection(section.id)}>
                    <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingSectionId === section.id ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editSectionTitle}
                            onChange={(e) => setEditSectionTitle(e.target.value)}
                            placeholder="Section title"
                            className="h-8 text-sm font-bold"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveSection(section.id, e as any);
                              if (e.key === "Escape") setEditingSectionId(null);
                            }}
                          />
                          <Input
                            value={editSectionDesc}
                            onChange={(e) => setEditSectionDesc(e.target.value)}
                            placeholder="Optional description"
                            className="h-7 text-xs"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-accent">Section {sIdx + 1}</span>
                            <h3 className="font-display text-base font-bold text-foreground">{section.title}</h3>
                            <Badge variant="secondary" className="text-[10px]">{section.questions.length} Q</Badge>
                          </div>
                          {section.description && <p className="text-xs text-muted-foreground mt-1">{section.description}</p>}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {editingSectionId === section.id ? (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={(e) => saveSection(section.id, e)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditSection}>
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => startEditSection(section, e)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSectionUp(sIdx)} disabled={sIdx === 0}>
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSectionDown(sIdx)} disabled={sIdx === sections.length - 1}>
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteSection(section.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                    {editingSectionId !== section.id && (
                      expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Expanded content */}
                  {expanded && (
                    <div className="border-t border-border/40 p-5 space-y-3">
                      {section.questions.map((q, qIdx) => (
                        <div key={q.id}>
                          <div className="bg-secondary/30 rounded-xl p-4 flex items-start gap-3">
                            <div className="flex flex-col gap-1 flex-shrink-0 pt-1">
                              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveQuestionUp(section.id, qIdx)} disabled={qIdx === 0}>
                                <ArrowUp className="h-2.5 w-2.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveQuestionDown(section.id, qIdx)} disabled={qIdx === section.questions.length - 1}>
                                <ArrowDown className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-muted-foreground">Q{qIdx + 1}</span>
                                <Badge variant="outline" className="text-[10px]">{q.field_type}</Badge>
                                {q.is_required && <Badge variant="destructive" className="text-[10px]">Required</Badge>}
                              </div>
                              <p className="text-sm font-medium text-foreground">{q.question_text}</p>
                              {q.helper_text && <p className="text-xs text-muted-foreground mt-0.5">{q.helper_text}</p>}
                              {q.options && <p className="text-xs text-muted-foreground/60 mt-1">Options: {(q.options as string[]).join(", ")}</p>}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => startEditQuestion(q)}>Edit</Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteQuestion(section.id, q.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Inline edit form for this question */}
                          {editingQuestion === q.id && (
                            <div className="bg-accent/5 rounded-xl p-5 border border-accent/20 space-y-4 mt-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-display text-sm font-bold text-foreground">Update Question</h4>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetQForm}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label>Question Text *</Label>
                                <Input value={qForm.question_text} onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })} maxLength={500} />
                              </div>
                              <div className="space-y-2">
                                <Label>Helper Text</Label>
                                <Input value={qForm.helper_text} onChange={(e) => setQForm({ ...qForm, helper_text: e.target.value })} maxLength={500} placeholder="Optional guidance text" />
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Field Type</Label>
                                  <Select value={qForm.field_type} onValueChange={(v) => setQForm({ ...qForm, field_type: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {FIELD_TYPES.map((ft) => (
                                        <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                  <Switch checked={qForm.is_required} onCheckedChange={(v) => setQForm({ ...qForm, is_required: v })} />
                                  <Label>Required</Label>
                                </div>
                              </div>
                              {needsOptions && (
                                <div className="space-y-2">
                                  <Label>Options (one per line)</Label>
                                  <Textarea
                                    value={qForm.options}
                                    onChange={(e) => setQForm({ ...qForm, options: e.target.value })}
                                    rows={4}
                                    placeholder={"Option 1\nOption 2\nOption 3"}
                                  />
                                </div>
                              )}
                              <Button variant="hero" size="sm" onClick={() => saveQuestion(section.id)}>
                                <Save className="mr-2 h-4 w-4" />
                                Update Question
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add new question form */}
                      {addingToSection === section.id ? (
                        <div className="bg-accent/5 rounded-xl p-5 border border-accent/20 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display text-sm font-bold text-foreground">New Question</h4>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetQForm}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Question Text *</Label>
                            <Input value={qForm.question_text} onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })} maxLength={500} />
                          </div>
                          <div className="space-y-2">
                            <Label>Helper Text</Label>
                            <Input value={qForm.helper_text} onChange={(e) => setQForm({ ...qForm, helper_text: e.target.value })} maxLength={500} placeholder="Optional guidance text" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Field Type</Label>
                              <Select value={qForm.field_type} onValueChange={(v) => setQForm({ ...qForm, field_type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {FIELD_TYPES.map((ft) => (
                                    <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                              <Switch checked={qForm.is_required} onCheckedChange={(v) => setQForm({ ...qForm, is_required: v })} />
                              <Label>Required</Label>
                            </div>
                          </div>
                          {needsOptions && (
                            <div className="space-y-2">
                              <Label>Options (one per line)</Label>
                              <Textarea
                                value={qForm.options}
                                onChange={(e) => setQForm({ ...qForm, options: e.target.value })}
                                rows={4}
                                placeholder={"Option 1\nOption 2\nOption 3"}
                              />
                            </div>
                          )}
                          <Button variant="hero" size="sm" onClick={() => saveQuestion(section.id)}>
                            <Save className="mr-2 h-4 w-4" />
                            Add Question
                          </Button>
                        </div>
                      ) : (
                        !editingQuestion && (
                          <Button variant="outline" size="sm" onClick={() => startAddQuestion(section.id)} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add section */}
          {showNewSection ? (
            <div className="mt-6 bg-card rounded-2xl p-6 shadow-soft border border-border/40 space-y-4">
              <h3 className="font-display text-base font-bold text-foreground">New Section</h3>
              <div className="space-y-2">
                <Label>Section Title *</Label>
                <Input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} maxLength={200} placeholder="e.g. Financial Planning" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newSectionDesc} onChange={(e) => setNewSectionDesc(e.target.value)} maxLength={500} rows={2} placeholder="Brief description of this section..." />
              </div>
              <div className="flex gap-3">
                <Button variant="hero" size="sm" onClick={addSection}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowNewSection(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="lg" className="mt-6 w-full" onClick={() => setShowNewSection(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
