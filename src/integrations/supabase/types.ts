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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      birthdays_content: {
        Row: {
          booking_email: string | null
          booking_phone: string | null
          hero_headline: string | null
          hero_image_url: string | null
          hero_subheadline: string | null
          id: string
          promo_text: string | null
          rules_text: string | null
          updated_at: string
        }
        Insert: {
          booking_email?: string | null
          booking_phone?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          promo_text?: string | null
          rules_text?: string | null
          updated_at?: string
        }
        Update: {
          booking_email?: string | null
          booking_phone?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          promo_text?: string | null
          rules_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      business_how_steps: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      business_pricing_tiers: {
        Row: {
          features: string[] | null
          id: string
          is_highlight: boolean
          name: string
          price: string
          sort_order: number
        }
        Insert: {
          features?: string[] | null
          id?: string
          is_highlight?: boolean
          name?: string
          price?: string
          sort_order?: number
        }
        Update: {
          features?: string[] | null
          id?: string
          is_highlight?: boolean
          name?: string
          price?: string
          sort_order?: number
        }
        Relationships: []
      }
      business_sections: {
        Row: {
          bullet_points: string[] | null
          description: string | null
          id: string
          image_url: string | null
          section_key: string
          sort_order: number
          subtitle: string | null
          title: string
        }
        Insert: {
          bullet_points?: string[] | null
          description?: string | null
          id?: string
          image_url?: string | null
          section_key: string
          sort_order?: number
          subtitle?: string | null
          title?: string
        }
        Update: {
          bullet_points?: string[] | null
          description?: string | null
          id?: string
          image_url?: string | null
          section_key?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      custom_blocks: {
        Row: {
          block_key: string
          body: string
          cta_text: string
          cta_url: string
          headline: string
          id: string
          image_position: string
          image_url: string
          sort_order: number
        }
        Insert: {
          block_key: string
          body?: string
          cta_text?: string
          cta_url?: string
          headline?: string
          id?: string
          image_position?: string
          image_url?: string
          sort_order?: number
        }
        Update: {
          block_key?: string
          body?: string
          cta_text?: string
          cta_url?: string
          headline?: string
          id?: string
          image_position?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          id: string
          page: string
          question: string
          sort_order: number
        }
        Insert: {
          answer?: string
          id?: string
          page?: string
          question?: string
          sort_order?: number
        }
        Update: {
          answer?: string
          id?: string
          page?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          about_subtitle: string | null
          about_title: string | null
          hero_cta_text: string | null
          hero_headline: string
          hero_image_url: string | null
          hero_subheadline: string | null
          id: string
          story_body: string | null
          story_image_url: string | null
          story_title: string | null
          updated_at: string
        }
        Insert: {
          about_subtitle?: string | null
          about_title?: string | null
          hero_cta_text?: string | null
          hero_headline?: string
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          story_body?: string | null
          story_image_url?: string | null
          story_title?: string | null
          updated_at?: string
        }
        Update: {
          about_subtitle?: string | null
          about_title?: string | null
          hero_cta_text?: string | null
          hero_headline?: string
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          story_body?: string | null
          story_image_url?: string | null
          story_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      homepage_steps: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      invite_templates: {
        Row: {
          id: string
          name: string
          sort_order: number
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          id?: string
          name?: string
          sort_order?: number
          thumbnail_url?: string | null
          url?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          apply_url: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_paid: boolean
          job_desc_url: string | null
          sort_order: number
          title: string
        }
        Insert: {
          apply_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_paid?: boolean
          job_desc_url?: string | null
          sort_order?: number
          title?: string
        }
        Update: {
          apply_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_paid?: boolean
          job_desc_url?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          created_at: string
          date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          source: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          source?: string | null
          title?: string
          url?: string
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          source?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          bg_color: string
          bg_image_url: string
          columns: number
          custom_css_class: string
          id: string
          is_visible: boolean
          label: string
          padding_y: string
          page: string
          photos: Json
          section_height: string
          section_key: string
          sort_order: number
          text_color: string
          wrapper_max_width: string
        }
        Insert: {
          bg_color?: string
          bg_image_url?: string
          columns?: number
          custom_css_class?: string
          id?: string
          is_visible?: boolean
          label?: string
          padding_y?: string
          page: string
          photos?: Json
          section_height?: string
          section_key: string
          sort_order?: number
          text_color?: string
          wrapper_max_width?: string
        }
        Update: {
          bg_color?: string
          bg_image_url?: string
          columns?: number
          custom_css_class?: string
          id?: string
          is_visible?: boolean
          label?: string
          padding_y?: string
          page?: string
          photos?: Json
          section_height?: string
          section_key?: string
          sort_order?: number
          text_color?: string
          wrapper_max_width?: string
        }
        Relationships: []
      }
      party_options: {
        Row: {
          description: string | null
          features: string[] | null
          id: string
          name: string
          price: string | null
          sort_order: number
        }
        Insert: {
          description?: string | null
          features?: string[] | null
          id?: string
          name?: string
          price?: string | null
          sort_order?: number
        }
        Update: {
          description?: string | null
          features?: string[] | null
          id?: string
          name?: string
          price?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      section_content_blocks: {
        Row: {
          block_type: string
          column_index: number
          content: Json
          id: string
          row_order: number
          section_id: string
        }
        Insert: {
          block_type?: string
          column_index?: number
          content?: Json
          id?: string
          row_order?: number
          section_id: string
        }
        Update: {
          block_type?: string
          column_index?: number
          content?: Json
          id?: string
          row_order?: number
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "section_content_blocks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "page_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string | null
          business_name: string
          email: string | null
          facebook_url: string | null
          gift_card_url: string | null
          google_maps_url: string | null
          id: string
          instagram_url: string | null
          newsletter_text: string | null
          phone: string | null
          tiktok_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string
          email?: string | null
          facebook_url?: string | null
          gift_card_url?: string | null
          google_maps_url?: string | null
          id?: string
          instagram_url?: string | null
          newsletter_text?: string | null
          phone?: string | null
          tiktok_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          email?: string | null
          facebook_url?: string | null
          gift_card_url?: string | null
          google_maps_url?: string | null
          id?: string
          instagram_url?: string | null
          newsletter_text?: string | null
          phone?: string | null
          tiktok_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      store_hours: {
        Row: {
          close_time: string | null
          day_label: string
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string | null
          sort_order: number
        }
        Insert: {
          close_time?: string | null
          day_label: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
          sort_order?: number
        }
        Update: {
          close_time?: string | null
          day_label?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      token_tiers: {
        Row: {
          bonus: string | null
          id: string
          is_highlight: boolean
          price: string
          sort_order: number
          tokens: string
        }
        Insert: {
          bonus?: string | null
          id?: string
          is_highlight?: boolean
          price?: string
          sort_order?: number
          tokens?: string
        }
        Update: {
          bonus?: string | null
          id?: string
          is_highlight?: boolean
          price?: string
          sort_order?: number
          tokens?: string
        }
        Relationships: []
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
