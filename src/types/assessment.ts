export interface Assessment {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssessmentSection {
  id: string;
  assessment_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  section_id: string;
  question_text: string;
  helper_text: string | null;
  field_type: string;
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
  created_at: string;
}

export interface AssessmentSession {
  id: string;
  intake_id: string | null;
  assessment_id: string;
  access_token: string;
  status: string;
  current_section_index: number;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface AssessmentResponse {
  id: string;
  session_id: string;
  question_id: string;
  response_value: string | null;
  response_json: any;
  updated_at: string;
}

export interface SectionWithQuestions extends AssessmentSection {
  questions: AssessmentQuestion[];
}

export const FIELD_TYPES = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "dropdown", label: "Dropdown" },
  { value: "single_select", label: "Single Select" },
  { value: "multi_select", label: "Multi Select" },
  { value: "yes_no", label: "Yes / No" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "file_upload", label: "File Upload" },
] as const;
