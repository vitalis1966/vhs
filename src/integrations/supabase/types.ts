export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_intakes: {
        Row: {
          additional_notes: string | null
          approximate_timeline: string | null
          assessment_completion_date: string | null
          assessment_purpose: string
          assessment_start_date: string | null
          assigned_track: string
          assignment_reason: string | null
          city: string | null
          country: string | null
          created_at: string
          currently_operating: boolean | null
          email: string
          full_name: string
          id: string
          internal_report_id: string | null
          last_activity_at: string | null
          lead_source: string
          lifecycle_status: string
          looking_for: string | null
          organization_name: string | null
          phone: string | null
          planning_new_facility: boolean | null
          practice_type: string | null
          preferred_followup: string | null
          province_state: string | null
          session_id: string | null
          specialty: string | null
          status: string
        }
        Insert: {
          additional_notes?: string | null
          approximate_timeline?: string | null
          assessment_completion_date?: string | null
          assessment_purpose: string
          assessment_start_date?: string | null
          assigned_track?: string
          assignment_reason?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currently_operating?: boolean | null
          email: string
          full_name: string
          id?: string
          internal_report_id?: string | null
          last_activity_at?: string | null
          lead_source?: string
          lifecycle_status?: string
          looking_for?: string | null
          organization_name?: string | null
          phone?: string | null
          planning_new_facility?: boolean | null
          practice_type?: string | null
          preferred_followup?: string | null
          province_state?: string | null
          session_id?: string | null
          specialty?: string | null
          status?: string
        }
        Update: {
          additional_notes?: string | null
          approximate_timeline?: string | null
          assessment_completion_date?: string | null
          assessment_purpose?: string
          assessment_start_date?: string | null
          assigned_track?: string
          assignment_reason?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currently_operating?: boolean | null
          email?: string
          full_name?: string
          id?: string
          internal_report_id?: string | null
          last_activity_at?: string | null
          lead_source?: string
          lifecycle_status?: string
          looking_for?: string | null
          organization_name?: string | null
          phone?: string | null
          planning_new_facility?: boolean | null
          practice_type?: string | null
          preferred_followup?: string | null
          province_state?: string | null
          session_id?: string | null
          specialty?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_intakes_internal_report_id_fkey"
            columns: ["internal_report_id"]
            isOneToOne: false
            referencedRelation: "internal_assessment_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_intakes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          created_at: string | null
          field_type: string
          helper_text: string | null
          id: string
          is_required: boolean | null
          options: Json | null
          question_text: string
          section_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          field_type?: string
          helper_text?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          question_text: string
          section_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          field_type?: string
          helper_text?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          question_text?: string
          section_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "assessment_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_reminders: {
        Row: {
          created_at: string
          id: string
          reminder_number: number
          reminder_type: string
          scheduled_at: string
          sent_at: string | null
          session_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          reminder_number?: number
          reminder_type?: string
          scheduled_at: string
          sent_at?: string | null
          session_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          reminder_number?: number
          reminder_type?: string
          scheduled_at?: string
          sent_at?: string | null
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_reminders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_responses: {
        Row: {
          id: string
          question_id: string
          response_json: Json | null
          response_value: string | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          question_id: string
          response_json?: Json | null
          response_value?: string | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          question_id?: string
          response_json?: Json | null
          response_value?: string | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sections: {
        Row: {
          assessment_id: string
          created_at: string | null
          description: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_sections_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sessions: {
        Row: {
          access_token: string
          assessment_id: string
          created_at: string | null
          current_section_index: number | null
          id: string
          intake_id: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          assessment_id: string
          created_at?: string | null
          current_section_index?: number | null
          id?: string
          intake_id?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          assessment_id?: string
          created_at?: string | null
          current_section_index?: number | null
          id?: string
          intake_id?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_sessions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_sessions_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "assessment_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_report_edits: {
        Row: {
          created_at: string | null
          edited_text: string
          id: string
          item_index: number
          original_text: string
          section_key: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          edited_text: string
          id?: string
          item_index?: number
          original_text: string
          section_key: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          edited_text?: string
          id?: string
          item_index?: number
          original_text?: string
          section_key?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_events: {
        Row: {
          created_at: string
          email_type: string
          id: string
          intake_id: string | null
          provider_response: Json | null
          recipient_email: string
          sent_at: string | null
          session_id: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email_type: string
          id?: string
          intake_id?: string | null
          provider_response?: Json | null
          recipient_email: string
          sent_at?: string | null
          session_id?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email_type?: string
          id?: string
          intake_id?: string | null
          provider_response?: Json | null
          recipient_email?: string
          sent_at?: string | null
          session_id?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_events_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "assessment_intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_assessment_reports: {
        Row: {
          analysis_data: Json | null
          analysis_status: string
          analysis_version: number
          assessment_id: string
          created_at: string
          executive_summary: string | null
          id: string
          last_analysis_run: string | null
          overall_score: number | null
          readiness_category: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          analysis_data?: Json | null
          analysis_status?: string
          analysis_version?: number
          assessment_id: string
          created_at?: string
          executive_summary?: string | null
          id?: string
          last_analysis_run?: string | null
          overall_score?: number | null
          readiness_category?: string | null
          session_id: string
          updated_at?: string
        }
        Update: {
          analysis_data?: Json | null
          analysis_status?: string
          analysis_version?: number
          assessment_id?: string
          created_at?: string
          executive_summary?: string | null
          id?: string
          last_analysis_run?: string | null
          overall_score?: number | null
          readiness_category?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_assessment_reports_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_assessment_reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
