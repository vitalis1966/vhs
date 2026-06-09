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
      activities: {
        Row: {
          actor_id: string | null
          client_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          verb: string
          workspace_id: string
        }
        Insert: {
          actor_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          verb: string
          workspace_id: string
        }
        Update: {
          actor_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          verb?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          status: string
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          status: string
          user_name: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          status?: string
          user_name?: string
        }
        Relationships: []
      }
      administrators: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          is_builtin: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          is_builtin?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          is_builtin?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          meeting_booked: boolean
          meeting_booked_by: string | null
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
          meeting_booked?: boolean
          meeting_booked_by?: string | null
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
          meeting_booked?: boolean
          meeting_booked_by?: string | null
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
      attachments: {
        Row: {
          attachable_id: string
          attachable_type: string
          document_id: string
          id: string
        }
        Insert: {
          attachable_id: string
          attachable_type: string
          document_id: string
          id?: string
        }
        Update: {
          attachable_id?: string
          attachable_type?: string
          document_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "platform_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      client_budget_alerts_sent: {
        Row: {
          activity_type_id: string | null
          client_id: string
          contracted_hours_id: string
          id: string
          sent_at: string
          threshold: number
        }
        Insert: {
          activity_type_id?: string | null
          client_id: string
          contracted_hours_id: string
          id?: string
          sent_at?: string
          threshold: number
        }
        Update: {
          activity_type_id?: string | null
          client_id?: string
          contracted_hours_id?: string
          id?: string
          sent_at?: string
          threshold?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_budget_alerts_sent_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "time_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_budget_alerts_sent_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_budget_alerts_sent_contracted_hours_id_fkey"
            columns: ["contracted_hours_id"]
            isOneToOne: false
            referencedRelation: "contracted_hours"
            referencedColumns: ["id"]
          },
        ]
      }
      client_members: {
        Row: {
          client_id: string
          role_on_account: string
          user_id: string
        }
        Insert: {
          client_id: string
          role_on_account?: string
          user_id: string
        }
        Update: {
          client_id?: string
          role_on_account?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      client_report_tokens: {
        Row: {
          access_count: number | null
          accessed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_revoked: boolean | null
          sent_to_email: string | null
          session_id: string
          token: string
        }
        Insert: {
          access_count?: number | null
          accessed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          sent_to_email?: string | null
          session_id: string
          token: string
        }
        Update: {
          access_count?: number | null
          accessed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          sent_to_email?: string | null
          session_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_report_tokens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_submission_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          assigned_by_user_id: string | null
          client_id: string
          hidden_in_client: boolean
          id: string
          metadata: Json | null
          source_id: string
          source_type: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          assigned_by_user_id?: string | null
          client_id: string
          hidden_in_client?: boolean
          id?: string
          metadata?: Json | null
          source_id: string
          source_type: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          assigned_by_user_id?: string | null
          client_id?: string
          hidden_in_client?: boolean
          id?: string
          metadata?: Json | null
          source_id?: string
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_submission_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_users: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          account_owner_id: string | null
          created_at: string
          created_by: string | null
          health_score: number | null
          id: string
          industry: string | null
          name: string
          start_date: string | null
          status: string | null
          summary: string | null
          updated_at: string
          website: string | null
          workspace_id: string
        }
        Insert: {
          account_owner_id?: string | null
          created_at?: string
          created_by?: string | null
          health_score?: number | null
          id?: string
          industry?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          summary?: string | null
          updated_at?: string
          website?: string | null
          workspace_id: string
        }
        Update: {
          account_owner_id?: string | null
          created_at?: string
          created_by?: string | null
          health_score?: number | null
          id?: string
          industry?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          summary?: string | null
          updated_at?: string
          website?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_account_owner_id_fkey"
            columns: ["account_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          area_of_interest: string | null
          email: string
          id: string
          message: string
          name: string
          organization: string | null
          phone: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          area_of_interest?: string | null
          email: string
          id?: string
          message: string
          name: string
          organization?: string | null
          phone?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          area_of_interest?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          organization?: string | null
          phone?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          client_id: string
          created_from: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          needs_review: boolean
          phone: string | null
          title: string | null
        }
        Insert: {
          client_id: string
          created_from?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          needs_review?: boolean
          phone?: string | null
          title?: string | null
        }
        Update: {
          client_id?: string
          created_from?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          needs_review?: boolean
          phone?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      contracted_hours: {
        Row: {
          cadence: string
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          period_end: string | null
          period_start: string | null
          rollover_unused: boolean
          total_hours: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          cadence?: string
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rollover_unused?: boolean
          total_hours?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          cadence?: string
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rollover_unused?: boolean
          total_hours?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracted_hours_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracted_hours_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contracted_hours_by_activity: {
        Row: {
          activity_type_id: string
          allocated_hours: number
          contracted_hours_id: string
          created_at: string
          id: string
        }
        Insert: {
          activity_type_id: string
          allocated_hours?: number
          contracted_hours_id: string
          created_at?: string
          id?: string
        }
        Update: {
          activity_type_id?: string
          allocated_hours?: number
          contracted_hours_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracted_hours_by_activity_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "time_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracted_hours_by_activity_contracted_hours_id_fkey"
            columns: ["contracted_hours_id"]
            isOneToOne: false
            referencedRelation: "contracted_hours"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          client_user_id: string
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          client_user_id: string
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "client_users"
            referencedColumns: ["id"]
          },
        ]
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
      email_extracted_tasks: {
        Row: {
          created_at: string
          description: string | null
          email_id: string
          id: string
          position: number
          priority: string
          status: string
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email_id: string
          id?: string
          position?: number
          priority?: string
          status?: string
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email_id?: string
          id?: string
          position?: number
          priority?: string
          status?: string
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_extracted_tasks_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "inbound_emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_extracted_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_task_extractions: {
        Row: {
          created_at: string
          email_id: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          email_id: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string
          email_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_task_extractions_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "inbound_emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_task_extractions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          subject: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          body_html?: string
          body_text?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          subject?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      gantt_item_activity: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json | null
          created_at: string
          gantt_item_id: string
          id: string
          workspace_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          gantt_item_id: string
          id?: string
          workspace_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          gantt_item_id?: string
          id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_item_activity_gantt_item_id_fkey"
            columns: ["gantt_item_id"]
            isOneToOne: false
            referencedRelation: "gantt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_item_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          gantt_item_id: string
          id: string
          mentioned_user_ids: string[]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          gantt_item_id: string
          id?: string
          mentioned_user_ids?: string[]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          gantt_item_id?: string
          id?: string
          mentioned_user_ids?: string[]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_item_comments_gantt_item_id_fkey"
            columns: ["gantt_item_id"]
            isOneToOne: false
            referencedRelation: "gantt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_items: {
        Row: {
          assignee_id: string | null
          attachment_document_ids: string[]
          baseline_end: string | null
          baseline_set_at: string | null
          baseline_start: string | null
          client_id: string
          colour: string | null
          created_at: string
          created_by: string | null
          dependencies: Json
          description: string | null
          due_reminder_0d_sent_at: string | null
          due_reminder_1d_sent_at: string | null
          due_reminder_3d_sent_at: string | null
          duration_days: number | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          is_collapsed: boolean
          is_complete: boolean
          is_critical_path: boolean
          is_internal: boolean
          linked_meeting_id: string | null
          linked_milestone_id: string | null
          linked_task_id: string | null
          overdue_notified_at: string | null
          parent_id: string | null
          position: number
          progress: number
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["gantt_item_status"]
          title: string
          type: Database["public"]["Enums"]["gantt_item_type"]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          assignee_id?: string | null
          attachment_document_ids?: string[]
          baseline_end?: string | null
          baseline_set_at?: string | null
          baseline_start?: string | null
          client_id: string
          colour?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: Json
          description?: string | null
          due_reminder_0d_sent_at?: string | null
          due_reminder_1d_sent_at?: string | null
          due_reminder_3d_sent_at?: string | null
          duration_days?: number | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_collapsed?: boolean
          is_complete?: boolean
          is_critical_path?: boolean
          is_internal?: boolean
          linked_meeting_id?: string | null
          linked_milestone_id?: string | null
          linked_task_id?: string | null
          overdue_notified_at?: string | null
          parent_id?: string | null
          position?: number
          progress?: number
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["gantt_item_status"]
          title?: string
          type?: Database["public"]["Enums"]["gantt_item_type"]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          assignee_id?: string | null
          attachment_document_ids?: string[]
          baseline_end?: string | null
          baseline_set_at?: string | null
          baseline_start?: string | null
          client_id?: string
          colour?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: Json
          description?: string | null
          due_reminder_0d_sent_at?: string | null
          due_reminder_1d_sent_at?: string | null
          due_reminder_3d_sent_at?: string | null
          duration_days?: number | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_collapsed?: boolean
          is_complete?: boolean
          is_critical_path?: boolean
          is_internal?: boolean
          linked_meeting_id?: string | null
          linked_milestone_id?: string | null
          linked_task_id?: string | null
          overdue_notified_at?: string | null
          parent_id?: string | null
          position?: number
          progress?: number
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["gantt_item_status"]
          title?: string
          type?: Database["public"]["Enums"]["gantt_item_type"]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_items_linked_meeting_id_fkey"
            columns: ["linked_meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_items_linked_milestone_id_fkey"
            columns: ["linked_milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_items_linked_task_id_fkey"
            columns: ["linked_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "gantt_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gantt_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_template_items: {
        Row: {
          colour: string | null
          created_at: string
          dependencies_keys: string[]
          description: string | null
          duration_days: number
          id: string
          is_internal: boolean
          item_key: string
          parent_key: string | null
          position: number
          start_offset_days: number
          template_id: string
          title: string
          type: string
        }
        Insert: {
          colour?: string | null
          created_at?: string
          dependencies_keys?: string[]
          description?: string | null
          duration_days?: number
          id?: string
          is_internal?: boolean
          item_key: string
          parent_key?: string | null
          position?: number
          start_offset_days?: number
          template_id: string
          title: string
          type: string
        }
        Update: {
          colour?: string | null
          created_at?: string
          dependencies_keys?: string[]
          description?: string | null
          duration_days?: number
          id?: string
          is_internal?: boolean
          item_key?: string
          parent_key?: string | null
          position?: number
          start_offset_days?: number
          template_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "gantt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_builtin: boolean
          name: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_builtin?: boolean
          name: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_builtin?: boolean
          name?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gantt_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      inbound_email_deletions: {
        Row: {
          deleted_at: string
          deleted_by: string | null
          email_id: string
          from_email: string | null
          id: string
          mode: string
          subject: string | null
          workspace_id: string | null
        }
        Insert: {
          deleted_at?: string
          deleted_by?: string | null
          email_id: string
          from_email?: string | null
          id?: string
          mode: string
          subject?: string | null
          workspace_id?: string | null
        }
        Update: {
          deleted_at?: string
          deleted_by?: string | null
          email_id?: string
          from_email?: string | null
          id?: string
          mode?: string
          subject?: string | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      inbound_emails: {
        Row: {
          assigned_to: string | null
          body_html: string | null
          body_text: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          extraction_state: string
          from_email: string
          from_name: string | null
          id: string
          received_at: string
          resend_email_id: string | null
          status: string
          subject: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          extraction_state?: string
          from_email: string
          from_name?: string | null
          id?: string
          received_at?: string
          resend_email_id?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          extraction_state?: string
          from_email?: string
          from_name?: string | null
          id?: string
          received_at?: string
          resend_email_id?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inbound_emails_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_email_attachments: {
        Row: {
          created_at: string
          email_id: string
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          email_id: string
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
          email_id?: string
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbox_email_attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "inbound_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      insights_articles: {
        Row: {
          body: string | null
          category: string
          created_at: string
          date: string
          estimated_read_time: number | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          scheduled_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          date?: string
          estimated_read_time?: number | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          date?: string
          estimated_read_time?: number | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      meeting_action_items: {
        Row: {
          converted_task_id: string | null
          description: string
          due_date: string | null
          id: string
          meeting_id: string
          owner_id: string | null
          position: number
          priority: string
        }
        Insert: {
          converted_task_id?: string | null
          description: string
          due_date?: string | null
          id?: string
          meeting_id: string
          owner_id?: string | null
          position?: number
          priority?: string
        }
        Update: {
          converted_task_id?: string | null
          description?: string
          due_date?: string | null
          id?: string
          meeting_id?: string
          owner_id?: string | null
          position?: number
          priority?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_action_items_converted_task_id_fkey"
            columns: ["converted_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_action_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_attendees: {
        Row: {
          meeting_id: string
          user_id: string
        }
        Insert: {
          meeting_id: string
          user_id: string
        }
        Update: {
          meeting_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendees_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_decisions: {
        Row: {
          content: string
          id: string
          meeting_id: string
          position: number
        }
        Insert: {
          content: string
          id?: string
          meeting_id: string
          position?: number
        }
        Update: {
          content?: string
          id?: string
          meeting_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "meeting_decisions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          external_attendees: string[]
          id: string
          meeting_date: string
          next_meeting_date: string | null
          project_id: string | null
          source_email_id: string | null
          summary: Json | null
          summary_sent_at: string | null
          summary_sent_by: string | null
          summary_text: string | null
          title: string
          topics: string[]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          external_attendees?: string[]
          id?: string
          meeting_date?: string
          next_meeting_date?: string | null
          project_id?: string | null
          source_email_id?: string | null
          summary?: Json | null
          summary_sent_at?: string | null
          summary_sent_by?: string | null
          summary_text?: string | null
          title: string
          topics?: string[]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          external_attendees?: string[]
          id?: string
          meeting_date?: string
          next_meeting_date?: string | null
          project_id?: string | null
          source_email_id?: string | null
          summary?: Json | null
          summary_sent_at?: string | null
          summary_sent_by?: string | null
          summary_text?: string | null
          title?: string
          topics?: string[]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_source_email_id_fkey"
            columns: ["source_email_id"]
            isOneToOne: false
            referencedRelation: "pasted_emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_summary_sent_by_fkey"
            columns: ["summary_sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed_at: string | null
          due_date: string | null
          id: string
          project_id: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          due_date?: string | null
          id?: string
          project_id: string
          title: string
        }
        Update: {
          completed_at?: string | null
          due_date?: string | null
          id?: string
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          body: Json | null
          body_text: string | null
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          project_id: string | null
          title: string | null
          updated_at: string
          updated_by: string | null
          workspace_id: string
        }
        Insert: {
          body?: Json | null
          body_text?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
          workspace_id: string
        }
        Update: {
          body?: Json | null
          body_text?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          email_status: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          link_url: string | null
          title: string | null
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          email_status?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          link_url?: string | null
          title?: string | null
          type: string
          user_id: string
          workspace_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          email_status?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          link_url?: string | null
          title?: string | null
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pasted_emails: {
        Row: {
          ai_category: string | null
          ai_payload: Json | null
          ai_summary: string | null
          cc_addresses: Json
          client_id: string | null
          created_at: string
          from_email: string | null
          from_name: string | null
          id: string
          imported_by: string | null
          project_id: string | null
          raw_body: string
          sent_at: string | null
          source: string
          subject: string | null
          to_addresses: Json
          updated_at: string
          workspace_id: string
        }
        Insert: {
          ai_category?: string | null
          ai_payload?: Json | null
          ai_summary?: string | null
          cc_addresses?: Json
          client_id?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          imported_by?: string | null
          project_id?: string | null
          raw_body: string
          sent_at?: string | null
          source?: string
          subject?: string | null
          to_addresses?: Json
          updated_at?: string
          workspace_id: string
        }
        Update: {
          ai_category?: string | null
          ai_payload?: Json | null
          ai_summary?: string | null
          cc_addresses?: Json
          client_id?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          imported_by?: string | null
          project_id?: string | null
          raw_body?: string
          sent_at?: string | null
          source?: string
          subject?: string | null
          to_addresses?: Json
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pasted_emails_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasted_emails_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasted_emails_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasted_emails_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_documents: {
        Row: {
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_roles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          platform: Database["public"]["Enums"]["platform_kind"]
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform: Database["public"]["Enums"]["platform_kind"]
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform?: Database["public"]["Enums"]["platform_kind"]
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_cases: {
        Row: {
          body: string | null
          case_type: string
          created_at: string | null
          description: string
          ext_challenge: string | null
          ext_results: string | null
          ext_services: string[] | null
          ext_situation: string | null
          ext_stat_1_label: string | null
          ext_stat_1_value: string | null
          ext_stat_2_label: string | null
          ext_stat_2_value: string | null
          ext_stat_3_label: string | null
          ext_stat_3_value: string | null
          ext_what_we_did: string | null
          id: string
          location: string
          metric: string
          slug: string
          sort_order: number | null
          specialty: string
          status: string
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          case_type?: string
          created_at?: string | null
          description: string
          ext_challenge?: string | null
          ext_results?: string | null
          ext_services?: string[] | null
          ext_situation?: string | null
          ext_stat_1_label?: string | null
          ext_stat_1_value?: string | null
          ext_stat_2_label?: string | null
          ext_stat_2_value?: string | null
          ext_stat_3_label?: string | null
          ext_stat_3_value?: string | null
          ext_what_we_did?: string | null
          id?: string
          location?: string
          metric: string
          slug: string
          sort_order?: number | null
          specialty: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          case_type?: string
          created_at?: string | null
          description?: string
          ext_challenge?: string | null
          ext_results?: string | null
          ext_services?: string[] | null
          ext_situation?: string | null
          ext_stat_1_label?: string | null
          ext_stat_1_value?: string | null
          ext_stat_2_label?: string | null
          ext_stat_2_value?: string | null
          ext_stat_3_label?: string | null
          ext_stat_3_value?: string | null
          ext_what_we_did?: string | null
          id?: string
          location?: string
          metric?: string
          slug?: string
          sort_order?: number | null
          specialty?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_active_at: string | null
          must_change_password: boolean
          notification_channels: Json
          notification_preferences: Json
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_active_at?: string | null
          must_change_password?: boolean
          notification_channels?: Json
          notification_preferences?: Json
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          must_change_password?: boolean
          notification_channels?: Json
          notification_preferences?: Json
        }
        Relationships: []
      }
      project_contracted_hours: {
        Row: {
          cadence: string
          created_at: string
          created_by: string | null
          id: string
          period_end: string | null
          period_start: string | null
          project_id: string
          rollover_unused: boolean
          total_hours: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          cadence?: string
          created_at?: string
          created_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          project_id: string
          rollover_unused?: boolean
          total_hours?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          cadence?: string
          created_at?: string
          created_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          project_id?: string
          rollover_unused?: boolean
          total_hours?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_contracted_hours_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_contracted_hours_by_activity: {
        Row: {
          activity_type_id: string
          allocated_hours: number
          created_at: string
          id: string
          project_contracted_hours_id: string
        }
        Insert: {
          activity_type_id: string
          allocated_hours?: number
          created_at?: string
          id?: string
          project_contracted_hours_id: string
        }
        Update: {
          activity_type_id?: string
          allocated_hours?: number
          created_at?: string
          id?: string
          project_contracted_hours_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_contracted_hours_by_ac_project_contracted_hours_id_fkey"
            columns: ["project_contracted_hours_id"]
            isOneToOne: false
            referencedRelation: "project_contracted_hours"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string | null
          start_date: string | null
          status: string | null
          target_date: string | null
          workspace_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          target_date?: string | null
          workspace_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          target_date?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sent_emails: {
        Row: {
          attachments: Json
          bcc_addresses: Json
          body_html: string | null
          body_text: string | null
          cc_addresses: Json
          client_id: string | null
          created_at: string
          error_message: string | null
          from_address: string
          id: string
          is_broadcast: boolean
          resend_message_id: string | null
          sent_at: string
          sent_by: string | null
          status: string
          subject: string
          to_addresses: Json
          workspace_id: string
        }
        Insert: {
          attachments?: Json
          bcc_addresses?: Json
          body_html?: string | null
          body_text?: string | null
          cc_addresses?: Json
          client_id?: string | null
          created_at?: string
          error_message?: string | null
          from_address: string
          id?: string
          is_broadcast?: boolean
          resend_message_id?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject: string
          to_addresses?: Json
          workspace_id: string
        }
        Update: {
          attachments?: Json
          bcc_addresses?: Json
          body_html?: string | null
          body_text?: string | null
          cc_addresses?: Json
          client_id?: string | null
          created_at?: string
          error_message?: string | null
          from_address?: string
          id?: string
          is_broadcast?: boolean
          resend_message_id?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject?: string
          to_addresses?: Json
          workspace_id?: string
        }
        Relationships: []
      }
      seo_global: {
        Row: {
          bing_verification: string | null
          crisp_website_id: string | null
          custom_body_script: string | null
          custom_head_script: string | null
          default_description: string | null
          default_og_image: string | null
          default_robots: string | null
          default_title: string | null
          facebook_app_id: string | null
          facebook_page_url: string | null
          google_ads_conversion_label: string | null
          google_ads_id: string | null
          google_analytics_id: string | null
          google_search_console: string | null
          google_tag_manager_body: string | null
          google_tag_manager_head: string | null
          google_tag_manager_id: string | null
          hotjar_id: string | null
          id: number
          instagram_url: string | null
          intercom_app_id: string | null
          linkedin_partner_id: string | null
          linkedin_url: string | null
          meta_pixel_id: string | null
          pinterest_verification: string | null
          site_locale: string | null
          site_name: string | null
          site_url: string | null
          theme_color: string | null
          twitter_handle: string | null
          updated_at: string | null
        }
        Insert: {
          bing_verification?: string | null
          crisp_website_id?: string | null
          custom_body_script?: string | null
          custom_head_script?: string | null
          default_description?: string | null
          default_og_image?: string | null
          default_robots?: string | null
          default_title?: string | null
          facebook_app_id?: string | null
          facebook_page_url?: string | null
          google_ads_conversion_label?: string | null
          google_ads_id?: string | null
          google_analytics_id?: string | null
          google_search_console?: string | null
          google_tag_manager_body?: string | null
          google_tag_manager_head?: string | null
          google_tag_manager_id?: string | null
          hotjar_id?: string | null
          id?: number
          instagram_url?: string | null
          intercom_app_id?: string | null
          linkedin_partner_id?: string | null
          linkedin_url?: string | null
          meta_pixel_id?: string | null
          pinterest_verification?: string | null
          site_locale?: string | null
          site_name?: string | null
          site_url?: string | null
          theme_color?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
        }
        Update: {
          bing_verification?: string | null
          crisp_website_id?: string | null
          custom_body_script?: string | null
          custom_head_script?: string | null
          default_description?: string | null
          default_og_image?: string | null
          default_robots?: string | null
          default_title?: string | null
          facebook_app_id?: string | null
          facebook_page_url?: string | null
          google_ads_conversion_label?: string | null
          google_ads_id?: string | null
          google_analytics_id?: string | null
          google_search_console?: string | null
          google_tag_manager_body?: string | null
          google_tag_manager_head?: string | null
          google_tag_manager_id?: string | null
          hotjar_id?: string | null
          id?: number
          instagram_url?: string | null
          intercom_app_id?: string | null
          linkedin_partner_id?: string | null
          linkedin_url?: string | null
          meta_pixel_id?: string | null
          pinterest_verification?: string | null
          site_locale?: string | null
          site_name?: string | null
          site_url?: string | null
          theme_color?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          article_author: string | null
          article_modified: string | null
          article_published: string | null
          article_section: string | null
          article_tags: string[] | null
          breadcrumbs: Json | null
          canonical_override: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          keywords: string | null
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_image_alt: string | null
          og_image_height: string | null
          og_image_width: string | null
          og_title: string | null
          og_type: string | null
          page_label: string
          robots: string | null
          route: string
          schema_json: Json | null
          schema_type: string | null
          title: string | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_image_alt: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          article_author?: string | null
          article_modified?: string | null
          article_published?: string | null
          article_section?: string | null
          article_tags?: string[] | null
          breadcrumbs?: Json | null
          canonical_override?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_image_height?: string | null
          og_image_width?: string | null
          og_title?: string | null
          og_type?: string | null
          page_label: string
          robots?: string | null
          route: string
          schema_json?: Json | null
          schema_type?: string | null
          title?: string | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_image_alt?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          article_author?: string | null
          article_modified?: string | null
          article_published?: string | null
          article_section?: string | null
          article_tags?: string[] | null
          breadcrumbs?: Json | null
          canonical_override?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_image_height?: string | null
          og_image_width?: string | null
          og_title?: string | null
          og_type?: string | null
          page_label?: string
          robots?: string | null
          route?: string
          schema_json?: Json | null
          schema_type?: string | null
          title?: string | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_image_alt?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_redirects: {
        Row: {
          created_at: string | null
          from_path: string
          id: string
          is_active: boolean | null
          note: string | null
          redirect_type: number | null
          to_path: string
        }
        Insert: {
          created_at?: string | null
          from_path: string
          id?: string
          is_active?: boolean | null
          note?: string | null
          redirect_type?: number | null
          to_path: string
        }
        Update: {
          created_at?: string | null
          from_path?: string
          id?: string
          is_active?: boolean | null
          note?: string | null
          redirect_type?: number | null
          to_path?: string
        }
        Relationships: []
      }
      seo_schema_global: {
        Row: {
          id: string
          is_active: boolean | null
          label: string
          schema_json: Json
          updated_at: string | null
        }
        Insert: {
          id: string
          is_active?: boolean | null
          label: string
          schema_json: Json
          updated_at?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          label?: string
          schema_json?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_social_links: {
        Row: {
          created_at: string
          display_label: string | null
          icon_style: string
          id: string
          is_active: boolean
          open_in_new_tab: boolean
          platform: string
          profile_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_label?: string | null
          icon_style?: string
          id?: string
          is_active?: boolean
          open_in_new_tab?: boolean
          platform: string
          profile_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_label?: string | null
          icon_style?: string
          id?: string
          is_active?: boolean
          open_in_new_tab?: boolean
          platform?: string
          profile_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      taggings: {
        Row: {
          id: string
          tag_id: string
          taggable_id: string
          taggable_type: string
        }
        Insert: {
          id?: string
          tag_id: string
          taggable_id: string
          taggable_type: string
        }
        Update: {
          id?: string
          tag_id?: string
          taggable_id?: string
          taggable_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "taggings_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string
          color: string | null
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          category?: string
          color?: string | null
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          category?: string
          color?: string | null
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignees: {
        Row: {
          task_id: string
          user_id: string
        }
        Insert: {
          task_id: string
          user_id: string
        }
        Update: {
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          author_id: string
          body_html: string
          body_text: string
          created_at: string
          id: string
          mentioned_user_ids: string[]
          task_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          author_id: string
          body_html: string
          body_text?: string
          created_at?: string
          id?: string
          mentioned_user_ids?: string[]
          task_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          author_id?: string
          body_html?: string
          body_text?: string
          created_at?: string
          id?: string
          mentioned_user_ids?: string[]
          task_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      task_follow_ups: {
        Row: {
          created_at: string
          enabled: boolean
          follow_up_date: string | null
          follow_up_due_date: string | null
          follow_up_status: string
          id: string
          is_recurring: boolean
          last_reminder_sent_at: string | null
          recurrence_frequency: string | null
          remind_before_unit: string | null
          remind_before_value: number | null
          resource_contact_id: string | null
          resource_external_email: string | null
          resource_external_name: string | null
          resource_id: string | null
          resource_kind: string
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          follow_up_date?: string | null
          follow_up_due_date?: string | null
          follow_up_status?: string
          id?: string
          is_recurring?: boolean
          last_reminder_sent_at?: string | null
          recurrence_frequency?: string | null
          remind_before_unit?: string | null
          remind_before_value?: number | null
          resource_contact_id?: string | null
          resource_external_email?: string | null
          resource_external_name?: string | null
          resource_id?: string | null
          resource_kind?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          follow_up_date?: string | null
          follow_up_due_date?: string | null
          follow_up_status?: string
          id?: string
          is_recurring?: boolean
          last_reminder_sent_at?: string | null
          recurrence_frequency?: string | null
          remind_before_unit?: string | null
          remind_before_value?: number | null
          resource_contact_id?: string | null
          resource_external_email?: string | null
          resource_external_name?: string | null
          resource_id?: string | null
          resource_kind?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_follow_ups_resource_contact_id_fkey"
            columns: ["resource_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_follow_ups_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_follow_ups_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_mutes: {
        Row: {
          created_at: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_mutes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_mutes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_statuses: {
        Row: {
          category: string
          color: string | null
          id: string
          name: string
          position: number
          workspace_id: string
        }
        Insert: {
          category: string
          color?: string | null
          id?: string
          name: string
          position?: number
          workspace_id: string
        }
        Update: {
          category?: string
          color?: string | null
          id?: string
          name?: string
          position?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_statuses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          checklist: Json
          client_id: string
          comment_count: number
          completed_at: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: Json | null
          description_text: string | null
          due_date: string | null
          id: string
          meeting_id: string | null
          position: number
          priority: string
          project_id: string | null
          source_email_id: string | null
          source_kind: string | null
          status_id: string | null
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          checklist?: Json
          client_id: string
          comment_count?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: Json | null
          description_text?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          position?: number
          priority?: string
          project_id?: string | null
          source_email_id?: string | null
          source_kind?: string | null
          status_id?: string | null
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          checklist?: Json
          client_id?: string
          comment_count?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: Json | null
          description_text?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          position?: number
          priority?: string
          project_id?: string | null
          source_email_id?: string | null
          source_kind?: string | null
          status_id?: string | null
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_source_email_id_fkey"
            columns: ["source_email_id"]
            isOneToOne: false
            referencedRelation: "pasted_emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "task_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          team_id: string
          user_id: string
        }
        Insert: {
          team_id: string
          user_id: string
        }
        Update: {
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      time_activity_types: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          position: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          position?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          position?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_activity_types_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          activity_type_id: string
          client_id: string
          created_at: string
          description: string | null
          duration_seconds: number
          ended_at: string | null
          id: string
          is_manual: boolean
          project_id: string | null
          source: string
          started_at: string
          task_id: string | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          activity_type_id: string
          client_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          is_manual?: boolean
          project_id?: string | null
          source?: string
          started_at: string
          task_id?: string | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          activity_type_id?: string
          client_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          is_manual?: boolean
          project_id?: string | null
          source?: string
          started_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "time_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries_running: {
        Row: {
          activity_type_id: string
          client_id: string
          description: string | null
          project_id: string | null
          started_at: string
          task_id: string | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          activity_type_id: string
          client_id: string
          description?: string | null
          project_id?: string | null
          started_at?: string
          task_id?: string | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          activity_type_id?: string
          client_id?: string
          description?: string | null
          project_id?: string | null
          started_at?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_running_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "time_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_running_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_running_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_running_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_running_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      time_tracking_settings: {
        Row: {
          created_at: string
          default_activity_type_id: string | null
          id: string
          reminder_enabled: boolean
          reminder_time: string | null
          rounding_minutes: number
          show_decimal: boolean
          show_widget: boolean
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          default_activity_type_id?: string | null
          id?: string
          reminder_enabled?: boolean
          reminder_time?: string | null
          rounding_minutes?: number
          show_decimal?: boolean
          show_widget?: boolean
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          default_activity_type_id?: string | null
          id?: string
          reminder_enabled?: boolean
          reminder_time?: string | null
          rounding_minutes?: number
          show_decimal?: boolean
          show_widget?: boolean
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_tracking_settings_default_activity_type_id_fkey"
            columns: ["default_activity_type_id"]
            isOneToOne: false
            referencedRelation: "time_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_tracking_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          invited_email: string | null
          invited_name: string | null
          role: string
          status: string
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          invited_name?: string | null
          role?: string
          status?: string
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          invited_name?: string | null
          role?: string
          status?: string
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          date_format: string | null
          default_account_owner_id: string | null
          default_industry: string | null
          id: string
          logo_url: string | null
          name: string
          notification_config: Json
          primary_color: string | null
          role_permissions: Json
          security_config: Json
          slug: string
          time_zone: string | null
          updated_at: string
          workspace_config: Json
        }
        Insert: {
          created_at?: string
          date_format?: string | null
          default_account_owner_id?: string | null
          default_industry?: string | null
          id?: string
          logo_url?: string | null
          name: string
          notification_config?: Json
          primary_color?: string | null
          role_permissions?: Json
          security_config?: Json
          slug: string
          time_zone?: string | null
          updated_at?: string
          workspace_config?: Json
        }
        Update: {
          created_at?: string
          date_format?: string | null
          default_account_owner_id?: string | null
          default_industry?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          notification_config?: Json
          primary_color?: string | null
          role_permissions?: Json
          security_config?: Json
          slug?: string
          time_zone?: string | null
          updated_at?: string
          workspace_config?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_pending_invites: {
        Args: { p_email: string; p_user_id: string }
        Returns: number
      }
      admin_update_member_name: {
        Args: { p_member_id: string; p_name: string }
        Returns: undefined
      }
      auto_assign_assessment_to_client: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      auto_assign_document_to_client: {
        Args: { p_document_id: string }
        Returns: undefined
      }
      can_access_client: { Args: { cid: string }; Returns: boolean }
      can_manage_inbound_email: { Args: { p_id: string }; Returns: boolean }
      cancel_reminders_by_token: { Args: { p_token: string }; Returns: number }
      create_workspace_for_user: {
        Args: {
          p_email: string
          p_full_name: string
          p_user_id: string
          p_workspace_name: string
        }
        Returns: string
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_client_gantt_for_project: {
        Args: { p_project_id: string }
        Returns: {
          end_date: string
          id: string
          is_complete: boolean
          parent_id: string
          position: number
          progress: number
          start_date: string
          title: string
          type: string
        }[]
      }
      get_client_report_for_assignment: {
        Args: { p_assignment_id: string }
        Returns: Json
      }
      get_client_time_summary: { Args: { p_client_id: string }; Returns: Json }
      get_client_time_summary_window: {
        Args: { p_client_id: string; p_end: string; p_start: string }
        Returns: Json
      }
      get_intake_for_session: {
        Args: { p_token: string }
        Returns: {
          email: string
          full_name: string
          organization_name: string
        }[]
      }
      get_internal_report_for_assignment: {
        Args: { p_assignment_id: string }
        Returns: Json
      }
      get_portal_gantt_for_project: {
        Args: { p_project_id: string }
        Returns: {
          end_date: string
          id: string
          is_complete: boolean
          parent_id: string
          position: number
          progress: number
          start_date: string
          title: string
          type: string
        }[]
      }
      get_portal_projects_for_user: {
        Args: never
        Returns: {
          client_id: string
          client_name: string
          project_id: string
          project_name: string
        }[]
      }
      get_project_time_summary_window: {
        Args: { p_end: string; p_project_id: string; p_start: string }
        Returns: Json
      }
      get_public_seo_global: {
        Args: never
        Returns: {
          bing_verification: string
          crisp_website_id: string
          custom_body_script: string
          custom_head_script: string
          default_description: string
          default_og_image: string
          default_robots: string
          default_title: string
          facebook_app_id: string
          facebook_page_url: string
          google_ads_conversion_label: string
          google_ads_id: string
          google_analytics_id: string
          google_search_console: string
          google_tag_manager_body: string
          google_tag_manager_head: string
          google_tag_manager_id: string
          hotjar_id: string
          id: number
          instagram_url: string
          intercom_app_id: string
          linkedin_partner_id: string
          linkedin_url: string
          meta_pixel_id: string
          pinterest_verification: string
          site_locale: string
          site_name: string
          site_url: string
          theme_color: string
          twitter_handle: string
        }[]
      }
      get_report_by_token: { Args: { p_token: string }; Returns: Json }
      get_responses_by_token: {
        Args: { p_token: string }
        Returns: {
          id: string
          question_id: string
          response_json: Json
          response_value: string
          session_id: string
          updated_at: string
        }[]
      }
      get_session_by_token: {
        Args: { p_token: string }
        Returns: {
          assessment_id: string
          created_at: string
          current_section_index: number
          id: string
          intake_id: string
          meeting_booked: boolean
          meeting_booked_by: string
          status: string
          submitted_at: string
          updated_at: string
        }[]
      }
      global_search: {
        Args: { p_query: string; p_workspace_id: string }
        Returns: {
          client_id: string
          id: string
          kind: string
          project_id: string
          rank: number
          subtitle: string
          title: string
        }[]
      }
      hard_delete_inbound_email: { Args: { p_id: string }; Returns: string }
      has_platform_access: {
        Args: {
          _platform: Database["public"]["Enums"]["platform_kind"]
          _user: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      intake_exists: { Args: { p_id: string }; Returns: boolean }
      is_task_assignee: {
        Args: { _task_id: string; _user_id: string }
        Returns: boolean
      }
      is_workspace_admin: { Args: { wid: string }; Returns: boolean }
      is_workspace_admin_or_manager: { Args: { wid: string }; Returns: boolean }
      is_workspace_member: { Args: { wid: string }; Returns: boolean }
      list_client_assessment_assignments: {
        Args: { p_client_id: string }
        Returns: {
          analysis_status: string
          assessment_purpose: string
          assessment_slug: string
          assessment_title: string
          assigned_at: string
          assignment_id: string
          client_email: string
          client_name: string
          has_client_report: boolean
          has_internal_report: boolean
          meeting_booked: boolean
          meeting_booked_by: string
          organization: string
          session_id: string
          status: string
          submitted_at: string
        }[]
      }
      list_client_submission_assignments: {
        Args: { p_client_id: string }
        Returns: {
          assigned_at: string
          assignment_id: string
          business_name: string
          created_at: string
          document_id: string
          file_name: string
          file_size: number
          file_type: string
          storage_path: string
          updated_at: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      restore_inbound_email: { Args: { p_id: string }; Returns: string }
      schedule_reminder_by_token: {
        Args: {
          p_reminder_number: number
          p_reminder_type?: string
          p_scheduled_at: string
          p_token: string
        }
        Returns: string
      }
      set_assignment_hidden: {
        Args: { p_hidden: boolean; p_id: string }
        Returns: undefined
      }
      shares_workspace_with: { Args: { _other_user: string }; Returns: boolean }
      soft_delete_inbound_email: { Args: { p_id: string }; Returns: string }
      soft_delete_inbound_emails: { Args: { p_ids: string[] }; Returns: number }
      task_workspace_id: { Args: { _task_id: string }; Returns: string }
      update_session_by_token: {
        Args: {
          p_current_section_index?: number
          p_meeting_booked?: boolean
          p_meeting_booked_by?: string
          p_status?: string
          p_submitted_at?: string
          p_token: string
        }
        Returns: string
      }
      upsert_response_by_token: {
        Args: {
          p_question_id: string
          p_response_json?: Json
          p_response_value?: string
          p_token: string
        }
        Returns: string
      }
      user_mentioned_in_task: {
        Args: { _task_id: string; _user_id: string }
        Returns: boolean
      }
      workspace_role: { Args: { wid: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "client"
      gantt_item_status:
        | "not_started"
        | "in_progress"
        | "complete"
        | "blocked"
        | "on_hold"
      gantt_item_type: "section" | "task" | "milestone" | "sub_item"
      platform_kind: "vhs" | "vitalis_os"
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
    Enums: {
      app_role: ["admin", "client"],
      gantt_item_status: [
        "not_started",
        "in_progress",
        "complete",
        "blocked",
        "on_hold",
      ],
      gantt_item_type: ["section", "task", "milestone", "sub_item"],
      platform_kind: ["vhs", "vitalis_os"],
    },
  },
} as const
