/**
 * Database Types
 * 
 * Generated from Supabase schema
 * Run `pnpm db:generate` to update
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string | null;
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          url: string;
          canonical_url: string;
          url_hash: string;
          description: string | null;
          resource_type: string;
          category_id: string | null;
          status: string;
          needs_review: boolean;
          source: string;
          raw_data: Json | null;
          ai_summary: string | null;
          ai_topics: string[] | null;
          ai_confidence: number | null;
          ai_model_used: string | null;
          manual_edits: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          updated_by_ai_at: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          canonical_url: string;
          url_hash: string;
          description?: string | null;
          resource_type: string;
          category_id?: string | null;
          status?: string;
          needs_review?: boolean;
          source: string;
          raw_data?: Json | null;
          ai_summary?: string | null;
          ai_topics?: string[] | null;
          ai_confidence?: number | null;
          ai_model_used?: string | null;
          manual_edits?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by_ai_at?: string | null;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          canonical_url?: string;
          url_hash?: string;
          description?: string | null;
          resource_type?: string;
          category_id?: string | null;
          status?: string;
          needs_review?: boolean;
          source?: string;
          raw_data?: Json | null;
          ai_summary?: string | null;
          ai_topics?: string[] | null;
          ai_confidence?: number | null;
          ai_model_used?: string | null;
          manual_edits?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by_ai_at?: string | null;
          reviewed_at?: string | null;
        };
      };
      resource_tags: {
        Row: {
          resource_id: string;
          tag_id: string;
          source: string;
          created_at: string;
        };
        Insert: {
          resource_id: string;
          tag_id: string;
          source: string;
          created_at?: string;
        };
        Update: {
          resource_id?: string;
          tag_id?: string;
          source?: string;
          created_at?: string;
        };
      };
      ingestion_jobs: {
        Row: {
          id: string;
          source_type: string;
          file_name: string | null;
          total_count: number;
          processed_count: number;
          failed_count: number;
          status: string;
          error_message: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_type: string;
          file_name?: string | null;
          total_count?: number;
          processed_count?: number;
          failed_count?: number;
          status?: string;
          error_message?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_type?: string;
          file_name?: string | null;
          total_count?: number;
          processed_count?: number;
          failed_count?: number;
          status?: string;
          error_message?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      ai_logs: {
        Row: {
          id: string;
          resource_id: string | null;
          job_type: string;
          model_used: string;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          total_tokens: number | null;
          cost_usd: number | null;
          latency_ms: number | null;
          success: boolean;
          error_message: string | null;
          raw_response: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id?: string | null;
          job_type: string;
          model_used: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          total_tokens?: number | null;
          cost_usd?: number | null;
          latency_ms?: number | null;
          success: boolean;
          error_message?: string | null;
          raw_response?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resource_id?: string | null;
          job_type?: string;
          model_used?: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          total_tokens?: number | null;
          cost_usd?: number | null;
          latency_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          raw_response?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      ai_cost_summary: {
        Row: {
          date: string | null;
          model_used: string | null;
          job_type: string | null;
          request_count: number | null;
          total_tokens: number | null;
          total_cost: number | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
