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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_reminders_by_token: { Args: { p_token: string }; Returns: number }
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
      intake_exists: { Args: { p_id: string }; Returns: boolean }
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
