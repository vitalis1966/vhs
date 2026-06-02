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
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          title: string | null
        }
        Insert: {
          client_id: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          title?: string | null
        }
        Update: {
          client_id?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
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
          summary: Json | null
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
          summary?: Json | null
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
          summary?: Json | null
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
          notification_channels?: Json
          notification_preferences?: Json
        }
        Relationships: []
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
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: Json | null
          description_text: string | null
          due_date: string | null
          id: string
          position: number
          priority: string
          project_id: string | null
          status_id: string | null
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          checklist?: Json
          client_id: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: Json | null
          description_text?: string | null
          due_date?: string | null
          id?: string
          position?: number
          priority?: string
          project_id?: string | null
          status_id?: string | null
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          checklist?: Json
          client_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: Json | null
          description_text?: string | null
          due_date?: string | null
          id?: string
          position?: number
          priority?: string
          project_id?: string | null
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
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      can_access_client: { Args: { cid: string }; Returns: boolean }
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
      get_intake_for_session: {
        Args: { p_token: string }
        Returns: {
          email: string
          full_name: string
          organization_name: string
        }[]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      intake_exists: { Args: { p_id: string }; Returns: boolean }
      is_workspace_admin: { Args: { wid: string }; Returns: boolean }
      is_workspace_member: { Args: { wid: string }; Returns: boolean }
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
      schedule_reminder_by_token: {
        Args: {
          p_reminder_number: number
          p_reminder_type?: string
          p_scheduled_at: string
          p_token: string
        }
        Returns: string
      }
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
      workspace_role: { Args: { wid: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "client"
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
    },
  },
} as const
