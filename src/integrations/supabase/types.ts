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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_numbers: {
        Row: {
          account_number: number
          created_at: string
          user_id: string
        }
        Insert: {
          account_number?: never
          created_at?: string
          user_id: string
        }
        Update: {
          account_number?: never
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      account_restrictions: {
        Row: {
          blocked: boolean
          blocked_by: string
          created_at: string
          nickname_key: string
          user_id: string
        }
        Insert: {
          blocked?: boolean
          blocked_by: string
          created_at?: string
          nickname_key: string
          user_id: string
        }
        Update: {
          blocked?: boolean
          blocked_by?: string
          created_at?: string
          nickname_key?: string
          user_id?: string
        }
        Relationships: []
      }
      board_text_approvals: {
        Row: {
          notebook_id: string
          reviewed_at: string
          reviewed_by: string
          text_hash: string
        }
        Insert: {
          notebook_id: string
          reviewed_at?: string
          reviewed_by: string
          text_hash: string
        }
        Update: {
          notebook_id?: string
          reviewed_at?: string
          reviewed_by?: string
          text_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_text_approvals_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          audience: string
          created_at: string
          id: string
          message: string
          sender_user_id: string | null
          status: string
        }
        Insert: {
          audience?: string
          created_at?: string
          id?: string
          message: string
          sender_user_id?: string | null
          status?: string
        }
        Update: {
          audience?: string
          created_at?: string
          id?: string
          message?: string
          sender_user_id?: string | null
          status?: string
        }
        Relationships: []
      }
      entries: {
        Row: {
          content: string
          created_at: string
          id: string
          mood: string | null
          notebook_id: string
          pinned_at: string | null
          share_as: string
          shared: boolean
          shared_at: string | null
          topics: string[]
          trigger_warnings: string[]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          notebook_id: string
          pinned_at?: string | null
          share_as?: string
          shared?: boolean
          shared_at?: string | null
          topics?: string[]
          trigger_warnings?: string[]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          notebook_id?: string
          pinned_at?: string | null
          share_as?: string
          shared?: boolean
          shared_at?: string | null
          topics?: string[]
          trigger_warnings?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      guidance_ai_state: {
        Row: {
          id: string
          message: string
          status: number
          updated_at: string
        }
        Insert: {
          id: string
          message: string
          status: number
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          status?: number
          updated_at?: string
        }
        Relationships: []
      }
      guidance_messages: {
        Row: {
          created_at: string
          id: string
          message: Json
          sdk_id: string
          thread_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: Json
          sdk_id: string
          thread_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: Json
          sdk_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guidance_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "guidance_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      guidance_threads: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guidance_threads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_recovery_locks: {
        Row: {
          created_at: string
          method: string
          status: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          method?: string
          status?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          method?: string
          status?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          attachments: Json
          audience: string
          audio_path: string | null
          created_at: string
          fields: Json
          id: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          attachments?: Json
          audience?: string
          audio_path?: string | null
          created_at?: string
          fields?: Json
          id?: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          attachments?: Json
          audience?: string
          audio_path?: string | null
          created_at?: string
          fields?: Json
          id?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_replies: {
        Row: {
          author_user_id: string | null
          body: string
          created_at: string
          id: string
          message_id: string
        }
        Insert: {
          author_user_id?: string | null
          body: string
          created_at?: string
          id?: string
          message_id: string
        }
        Update: {
          author_user_id?: string | null
          body?: string
          created_at?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_replies_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "contact_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notebooks: {
        Row: {
          color: string
          created_at: string
          hidden: boolean
          id: string
          owner_id: string
          share_as: string
          shared: boolean
          shared_at: string | null
          title: string
          topics: string[]
          trigger_warnings: string[]
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          hidden?: boolean
          id?: string
          owner_id: string
          share_as?: string
          shared?: boolean
          shared_at?: string | null
          title: string
          topics?: string[]
          trigger_warnings?: string[]
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          hidden?: boolean
          id?: string
          owner_id?: string
          share_as?: string
          shared?: boolean
          shared_at?: string | null
          title?: string
          topics?: string[]
          trigger_warnings?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          audience: string
          city: string | null
          country: string | null
          created_at: string
          id: string
          nickname: string
          state_region: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          city?: string | null
          country?: string | null
          created_at?: string
          id: string
          nickname: string
          state_region?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          nickname?: string
          state_region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reaction_events: {
        Row: {
          active: boolean
          created_at: string
          id: string
          notebook_id: string
          reaction: string
          session_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          notebook_id: string
          reaction: string
          session_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          notebook_id?: string
          reaction?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reaction_events_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_devices: {
        Row: {
          created_at: string
          device_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_key?: string
          user_id?: string
        }
        Relationships: []
      }
      security_questions: {
        Row: {
          answer_1_hash: string
          answer_2_hash: string
          answer_3_hash: string
          created_at: string
          question_1: string
          question_2: string
          question_3: string
          salt: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_1_hash: string
          answer_2_hash: string
          answer_3_hash: string
          created_at?: string
          question_1: string
          question_2: string
          question_3: string
          salt: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_1_hash?: string
          answer_2_hash?: string
          answer_3_hash?: string
          created_at?: string
          question_1?: string
          question_2?: string
          question_3?: string
          salt?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      story_blocks: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          session_id?: string
        }
        Relationships: []
      }
      story_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          notebook_id: string
          reason: string
          session_id: string
          status: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          notebook_id: string
          reason: string
          session_id: string
          status?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          notebook_id?: string
          reason?: string
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_reports_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      board_safety_reason: { Args: { p_text: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      moderate_board_post: {
        Args: { p_notebook_id: string; p_notice?: string; p_remove: boolean }
        Returns: string
      }
      resolve_board_report: {
        Args: { p_action: string; p_report_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
