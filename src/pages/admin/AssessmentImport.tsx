import { useState, useEffect, useRef } from "react";
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
import { FIELD_TYPES } from "@/types/assessment";
import {
  ArrowLeft,
  Upload,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  X,
} from "lucide-react";

interface ParsedQuestion {
  question_text: string;
  helper_text: string | null;
  field_type: string;
  options: string[] | null;
  is_required: boolean;
  _selected: boolean; // UI-only
}

interface ParsedSection {
  title: string;
  description: string | null;
  questions: ParsedQuestion[];
  _expanded: boolean; // UI-only
  _selected: boolean; // UI-only
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AssessmentImport() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [step, setStep] = useState<"upload" | "parsing" | "preview" | "importing" | "done">("upload");
  const [sections, setSections] = useState<ParsedSection[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    const { data } = await (supabase
      .from("assessments" as any)
      .select("title")
      .eq("id", id)
      .single() as any);
    if (data) setAssessmentTitle(data.title);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 20MB.", variant: "destructive" });
      return;
    }

    setStep("parsing");
    setParseError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assessment_type", assessmentTitle);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-questionnaire`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const result = await response.json();

      if (!result.data?.sections?.length) {
        throw new Error("No sections found in the PDF.");
      }

      const parsed: ParsedSection[] = result.data.sections.map((s: any) => ({
        title: s.title || "Untitled Section",
        description: s.description || null,
        _expanded: true,
        _selected: true,
        questions: (s.questions || []).map((q: any) => ({
          question_text: q.question_text || "",
          helper_text: q.helper_text || null,
          field_type: q.field_type || "short_text",
          options: q.options || null,
          is_required: q.is_required ?? false,
          _selected: true,
        })),
      }));

      setSections(parsed);
      setStep("preview");
    } catch (err: any) {
      setParseError(err.message || "Failed to parse PDF");
      setStep("upload");
    }
  };

  // --- Section/question editing ---
  const toggleSectionExpand = (idx: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, _expanded: !s._expanded } : s))
    );
  };

  const toggleSectionSelect = (idx: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              _selected: !s._selected,
              questions: s.questions.map((q) => ({ ...q, _selected: !s._selected })),
            }
          : s
      )
    );
  };

  const toggleQuestionSelect = (sIdx: number, qIdx: number) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx ? { ...q, _selected: !q._selected } : q
              ),
            }
          : s
      )
    );
  };

  const updateSection = (idx: number, field: string, value: any) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const updateQuestion = (sIdx: number, qIdx: number, field: string, value: any) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx ? { ...q, [field]: value } : q
              ),
            }
          : s
      )
    );
  };

  const removeSection = (idx: number) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeQuestion = (sIdx: number, qIdx: number) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sIdx
          ? { ...s, questions: s.questions.filter((_, qi) => qi !== qIdx) }
          : s
      )
    );
  };

  const addQuestion = (sIdx: number) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sIdx
          ? {
              ...s,
              _expanded: true,
              questions: [
                ...s.questions,
                {
                  question_text: "",
                  helper_text: null,
                  field_type: "short_text",
                  options: null,
                  is_required: false,
                  _selected: true,
                },
              ],
            }
          : s
      )
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: "New Section",
        description: null,
        _expanded: true,
        _selected: true,
        questions: [],
      },
    ]);
  };

  // --- Import ---
  const handleImport = async () => {
    const selectedSections = sections.filter((s) => s._selected);
    const totalItems = selectedSections.reduce(
      (sum, s) => sum + s.questions.filter((q) => q._selected && q.question_text.trim()).length + 1,
      0
    );

    if (totalItems <= selectedSections.length) {
      toast({ title: "No questions to import", variant: "destructive" });
      return;
    }

    setStep("importing");
    setImportProgress(0);

    // Get existing section count for sort_order offset
    const { data: existingSections } = await (supabase
      .from("assessment_sections" as any)
      .select("id")
      .eq("assessment_id", id) as any);
    const sectionOffset = existingSections?.length || 0;

    let completed = 0;

    for (let sIdx = 0; sIdx < selectedSections.length; sIdx++) {
      const sec = selectedSections[sIdx];

      // Create section
      const { data: newSec } = await (supabase
        .from("assessment_sections" as any)
        .insert({
          assessment_id: id,
          title: sec.title.trim(),
          description: sec.description?.trim() || null,
          sort_order: sectionOffset + sIdx,
        })
        .select()
        .single() as any);

      completed++;
      setImportProgress(Math.round((completed / totalItems) * 100));

      if (!newSec) continue;

      // Create questions
      const selectedQuestions = sec.questions.filter((q) => q._selected && q.question_text.trim());
      for (let qIdx = 0; qIdx < selectedQuestions.length; qIdx++) {
        const q = selectedQuestions[qIdx];
        await (supabase
          .from("assessment_questions" as any)
          .insert({
            section_id: newSec.id,
            question_text: q.question_text.trim(),
            helper_text: q.helper_text?.trim() || null,
            field_type: q.field_type,
            options: q.options?.length ? q.options : null,
            is_required: q.is_required,
            sort_order: qIdx,
          }) as any);

        completed++;
        setImportProgress(Math.round((completed / totalItems) * 100));
      }
    }

    setStep("done");
    toast({ title: "Import Complete", description: `Imported ${selectedSections.length} sections.` });
  };

  const selectedCount = sections.filter((s) => s._selected).length;
  const selectedQCount = sections.reduce(
    (sum, s) => sum + (s._selected ? s.questions.filter((q) => q._selected).length : 0),
    0
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-6 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Link
            to={`/admin/assessments/${id}`}
            className="text-accent text-sm font-medium hover:underline flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {assessmentTitle || "Assessment"}
          </Link>
          <motion.div {...fadeUp}>
            <h1 className="font-display text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
              Import Questions
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload a PDF questionnaire to automatically extract and import sections and questions into{" "}
              <strong>{assessmentTitle}</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* UPLOAD STEP */}
          {step === "upload" && (
            <motion.div {...fadeUp} className="max-w-xl mx-auto">
              <div
                className="border-2 border-dashed border-border/60 rounded-2xl p-12 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Upload PDF Questionnaire
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drop a PDF file here or click to browse. The AI will extract sections and questions automatically.
                </p>
                <Badge variant="secondary">PDF · Max 20MB</Badge>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {parseError && (
                <div className="mt-6 bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Parsing Failed</p>
                    <p className="text-sm text-muted-foreground mt-1">{parseError}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 bg-card rounded-2xl p-6 shadow-soft border border-border/40">
                <h4 className="font-display text-sm font-bold text-foreground mb-3">Or add sections manually</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  You can also add sections and questions manually using the assessment builder.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/assessments/${id}`}>Open Assessment Builder</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* PARSING STEP */}
          {step === "parsing" && (
            <div className="max-w-md mx-auto text-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto mb-6" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Extracting Questions…</h3>
              <p className="text-sm text-muted-foreground">
                The AI is reading your PDF and structuring the questions. This may take 30–60 seconds.
              </p>
            </div>
          )}

          {/* PREVIEW STEP */}
          {step === "preview" && (
            <div>
              {/* Summary bar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    {selectedCount} sections · {selectedQCount} questions selected
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => { setStep("upload"); setSections([]); }}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Different PDF
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={addSection}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handleImport}
                    disabled={selectedQCount === 0}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Import {selectedQCount} Questions
                  </Button>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {sections.map((sec, sIdx) => (
                  <div
                    key={sIdx}
                    className={`bg-card rounded-2xl shadow-soft border overflow-hidden transition-colors ${
                      sec._selected ? "border-border/40" : "border-border/20 opacity-60"
                    }`}
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3 p-5">
                      <Switch
                        checked={sec._selected}
                        onCheckedChange={() => toggleSectionSelect(sIdx)}
                        className="flex-shrink-0"
                      />
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleSectionExpand(sIdx)}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            Section {sIdx + 1}
                          </Badge>
                          <Input
                            value={sec.title}
                            onChange={(e) => updateSection(sIdx, "title", e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="font-display font-bold text-foreground border-none bg-transparent p-0 h-auto text-base shadow-none focus-visible:ring-0"
                          />
                          <Badge variant="outline" className="text-[10px] flex-shrink-0">
                            {sec.questions.length} Q
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeSection(sIdx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <button onClick={() => toggleSectionExpand(sIdx)}>
                          {sec._expanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Section description */}
                    {sec._expanded && (
                      <div className="px-5 pb-2">
                        <Input
                          value={sec.description || ""}
                          onChange={(e) => updateSection(sIdx, "description", e.target.value || null)}
                          placeholder="Section description (optional)"
                          className="text-sm text-muted-foreground border-dashed"
                        />
                      </div>
                    )}

                    {/* Questions */}
                    {sec._expanded && (
                      <div className="border-t border-border/40 p-5 space-y-3">
                        {sec.questions.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            className={`rounded-xl p-4 transition-colors ${
                              q._selected
                                ? "bg-secondary/30 border border-border/30"
                                : "bg-secondary/10 border border-border/10 opacity-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Switch
                                checked={q._selected}
                                onCheckedChange={() => toggleQuestionSelect(sIdx, qIdx)}
                                className="mt-1 flex-shrink-0"
                              />
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-bold text-muted-foreground mt-2">
                                    Q{qIdx + 1}
                                  </span>
                                  <Textarea
                                    value={q.question_text}
                                    onChange={(e) =>
                                      updateQuestion(sIdx, qIdx, "question_text", e.target.value)
                                    }
                                    rows={2}
                                    className="text-sm font-medium"
                                  />
                                </div>
                                <div className="grid sm:grid-cols-3 gap-3">
                                  <div>
                                    <Label className="text-xs">Field Type</Label>
                                    <Select
                                      value={q.field_type}
                                      onValueChange={(v) =>
                                        updateQuestion(sIdx, qIdx, "field_type", v)
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {FIELD_TYPES.map((ft) => (
                                          <SelectItem key={ft.value} value={ft.value}>
                                            {ft.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-xs">Helper Text</Label>
                                    <Input
                                      value={q.helper_text || ""}
                                      onChange={(e) =>
                                        updateQuestion(sIdx, qIdx, "helper_text", e.target.value || null)
                                      }
                                      placeholder="Optional"
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div className="flex items-end gap-3">
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={q.is_required}
                                        onCheckedChange={(v) =>
                                          updateQuestion(sIdx, qIdx, "is_required", v)
                                        }
                                      />
                                      <Label className="text-xs">Required</Label>
                                    </div>
                                  </div>
                                </div>
                                {/* Options for select types */}
                                {["dropdown", "single_select", "multi_select"].includes(q.field_type) && (
                                  <div>
                                    <Label className="text-xs">Options (one per line)</Label>
                                    <Textarea
                                      value={q.options?.join("\n") || ""}
                                      onChange={(e) =>
                                        updateQuestion(
                                          sIdx,
                                          qIdx,
                                          "options",
                                          e.target.value
                                            .split("\n")
                                            .map((o) => o.trim())
                                            .filter(Boolean)
                                        )
                                      }
                                      rows={3}
                                      className="text-xs"
                                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                                    />
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive flex-shrink-0"
                                onClick={() => removeQuestion(sIdx, qIdx)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full border border-dashed border-border/40"
                          onClick={() => addQuestion(sIdx)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Question
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom import bar */}
              <div className="mt-8 flex justify-end">
                <Button variant="hero" size="lg" onClick={handleImport} disabled={selectedQCount === 0}>
                  <Check className="mr-2 h-5 w-5" />
                  Import {selectedCount} Sections · {selectedQCount} Questions
                </Button>
              </div>
            </div>
          )}

          {/* IMPORTING STEP */}
          {step === "importing" && (
            <div className="max-w-md mx-auto text-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto mb-6" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Importing Questions…
              </h3>
              <p className="text-sm text-muted-foreground mb-6">{importProgress}% complete</p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* DONE STEP */}
          {step === "done" && (
            <div className="max-w-md mx-auto text-center py-20">
              <motion.div {...fadeUp}>
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Import Complete</h3>
                <p className="text-muted-foreground mb-8">
                  Questions have been imported into <strong>{assessmentTitle}</strong>. You can now
                  review, edit, reorder, and publish using the assessment builder.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" asChild>
                    <Link to={`/admin/assessments/${id}`}>
                      <FileText className="mr-2 h-5 w-5" />
                      Open Assessment Builder
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setStep("upload");
                      setSections([]);
                    }}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Import More
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
