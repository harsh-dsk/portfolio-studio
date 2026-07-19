export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          title: string
          photo_url: string | null
          phone: string
          email: string
          location: string
          college: string
          objective: string
          availability: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          title?: string
          photo_url?: string | null
          phone?: string
          email?: string
          location?: string
          college?: string
          objective?: string
          availability?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          photo_url?: string | null
          phone?: string
          email?: string
          location?: string
          college?: string
          objective?: string
          availability?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          profile_id: string
          platform: string
          label: string
          url: string
          sort_order: number
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          platform: string
          label: string
          url: string
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          platform?: string
          label?: string
          url?: string
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      education: {
        Row: {
          id: string
          profile_id: string
          institution: string
          degree: string
          field: string
          period: string
          location: string
          gpa: string | null
          coursework: string[] | null
          description: string | null
          sort_order: number
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          institution: string
          degree: string
          field: string
          period: string
          location?: string
          gpa?: string | null
          coursework?: string[] | null
          description?: string | null
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          institution?: string
          degree?: string
          field?: string
          period?: string
          location?: string
          gpa?: string | null
          coursework?: string[] | null
          description?: string | null
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      skill_categories: {
        Row: {
          id: string
          profile_id: string
          name: string
          sort_order: number
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_categories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      skills: {
        Row: {
          id: string
          category_id: string
          name: string
          sort_order: number
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          profile_id: string
          title: string
          short_description: string
          full_description: string
          tech_stack: string[]
          live_url: string | null
          github_url: string | null
          sort_order: number
          placeholder_from: string
          placeholder_to: string
          placeholder_accent: string
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          short_description?: string
          full_description?: string
          tech_stack?: string[]
          live_url?: string | null
          github_url?: string | null
          sort_order?: number
          placeholder_from?: string
          placeholder_to?: string
          placeholder_accent?: string
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          short_description?: string
          full_description?: string
          tech_stack?: string[]
          live_url?: string | null
          github_url?: string | null
          sort_order?: number
          placeholder_from?: string
          placeholder_to?: string
          placeholder_accent?: string
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          url: string
          storage_path: string | null
          alt_text: string
          is_cover: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          url: string
          storage_path?: string | null
          alt_text?: string
          is_cover?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          url?: string
          storage_path?: string | null
          alt_text?: string
          is_cover?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      achievements: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string
          date: string | null
          sort_order: number
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string
          date?: string | null
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string
          date?: string | null
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      external_links: {
        Row: {
          id: string
          profile_id: string
          label: string
          url: string
          description: string | null
          sort_order: number
          is_visible: boolean
          include_in_resume: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          label: string
          url: string
          description?: string | null
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          label?: string
          url?: string
          description?: string | null
          sort_order?: number
          is_visible?: boolean
          include_in_resume?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      resume_settings: {
        Row: {
          id: string
          profile_id: string
          selected_template: string
          resume_mode: string
          resume_pdf_url: string | null
          resume_storage_path: string | null
          uploaded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          selected_template?: string
          resume_mode?: string
          resume_pdf_url?: string | null
          resume_storage_path?: string | null
          uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          selected_template?: string
          resume_mode?: string
          resume_pdf_url?: string | null
          resume_storage_path?: string | null
          uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      transfer_portfolio_ownership: {
        Args: {
          old_id: string
          new_id: string
          new_email?: string | null
        }
        Returns: boolean
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never
