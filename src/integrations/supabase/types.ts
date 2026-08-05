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
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
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
      event_availability: {
        Row: {
          created_at: string
          event_type: string
          hours: Json
          id: string
          lead_time_hours: number
          slot_minutes: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          hours?: Json
          id?: string
          lead_time_hours?: number
          slot_minutes?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          hours?: Json
          id?: string
          lead_time_hours?: number
          slot_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_blackout_dates: {
        Row: {
          blackout_date: string
          created_at: string
          event_type: string
          id: string
          reason: string | null
        }
        Insert: {
          blackout_date: string
          created_at?: string
          event_type: string
          id?: string
          reason?: string | null
        }
        Update: {
          blackout_date?: string
          created_at?: string
          event_type?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          addons: Json
          booking_ref: string
          celebrant_age: number | null
          celebrant_name: string | null
          character_pick: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          duration_minutes: number
          event_type: string
          favorites: string | null
          id: string
          miles: number | null
          party_size: number | null
          pathway: string
          shopify_cart_id: string | null
          shopify_order_id: string | null
          special_requests: string | null
          start_at: string
          status: string
          total_cents: number | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          addons?: Json
          booking_ref: string
          celebrant_age?: number | null
          celebrant_name?: string | null
          character_pick?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          duration_minutes?: number
          event_type: string
          favorites?: string | null
          id?: string
          miles?: number | null
          party_size?: number | null
          pathway: string
          shopify_cart_id?: string | null
          shopify_order_id?: string | null
          special_requests?: string | null
          start_at: string
          status?: string
          total_cents?: number | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          addons?: Json
          booking_ref?: string
          celebrant_age?: number | null
          celebrant_name?: string | null
          character_pick?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          duration_minutes?: number
          event_type?: string
          favorites?: string | null
          id?: string
          miles?: number | null
          party_size?: number | null
          pathway?: string
          shopify_cart_id?: string | null
          shopify_order_id?: string | null
          special_requests?: string | null
          start_at?: string
          status?: string
          total_cents?: number | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          created_at: string
          id: string
          page: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string
          created_at?: string
          id?: string
          page?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          page?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          caption: string
          created_at: string
          id: string
          image_url: string
          section: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          image_url?: string
          section?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          image_url?: string
          section?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          about_subtitle: string
          about_title: string
          created_at: string
          hero_cta_text: string
          hero_headline: string
          hero_image_url: string
          hero_subheadline: string
          id: string
          story_body: string
          story_image_url: string
          story_title: string
          updated_at: string
        }
        Insert: {
          about_subtitle?: string
          about_title?: string
          created_at?: string
          hero_cta_text?: string
          hero_headline?: string
          hero_image_url?: string
          hero_subheadline?: string
          id?: string
          story_body?: string
          story_image_url?: string
          story_title?: string
          updated_at?: string
        }
        Update: {
          about_subtitle?: string
          about_title?: string
          created_at?: string
          hero_cta_text?: string
          hero_headline?: string
          hero_image_url?: string
          hero_subheadline?: string
          id?: string
          story_body?: string
          story_image_url?: string
          story_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_steps: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          apply_url: string
          category: string
          created_at: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          is_paid: boolean
          job_desc_url: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          apply_url?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          is_paid?: boolean
          job_desc_url?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          apply_url?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          is_paid?: boolean
          job_desc_url?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          created_at: string
          date: string
          id: string
          image_url: string
          is_active: boolean
          sort_order: number
          source: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          source?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          source?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      page_heroes: {
        Row: {
          created_at: string
          cta_text: string
          cta_url: string
          eyebrow: string
          id: string
          image_url: string
          page_key: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text?: string
          cta_url?: string
          eyebrow?: string
          id?: string
          image_url?: string
          page_key?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string
          cta_url?: string
          eyebrow?: string
          id?: string
          image_url?: string
          page_key?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      party_options: {
        Row: {
          created_at: string
          description: string
          features: string[]
          id: string
          name: string
          price: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          name?: string
          price?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          name?: string
          price?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      rental_packages: {
        Row: {
          created_at: string
          cta_text: string
          cta_url: string
          description: string
          features: string[]
          id: string
          is_highlight: boolean
          name: string
          price: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text?: string
          cta_url?: string
          description?: string
          features?: string[]
          id?: string
          is_highlight?: boolean
          name?: string
          price?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string
          cta_url?: string
          description?: string
          features?: string[]
          id?: string
          is_highlight?: boolean
          name?: string
          price?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          author_role: string
          created_at: string
          id: string
          is_active: boolean
          rating: number
          review_text: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_name?: string
          author_role?: string
          created_at?: string
          id?: string
          is_active?: boolean
          rating?: number
          review_text?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string
          created_at?: string
          id?: string
          is_active?: boolean
          rating?: number
          review_text?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string
          announcement_body: string
          announcement_enabled: boolean
          announcement_title: string
          business_name: string
          email: string
          events_email: string
          facebook_url: string
          google_maps_url: string
          id: string
          instagram_url: string
          phone: string
          tiktok_url: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          address?: string
          announcement_body?: string
          announcement_enabled?: boolean
          announcement_title?: string
          business_name?: string
          email?: string
          events_email?: string
          facebook_url?: string
          google_maps_url?: string
          id?: string
          instagram_url?: string
          phone?: string
          tiktok_url?: string
          updated_at?: string
          youtube_url?: string
        }
        Update: {
          address?: string
          announcement_body?: string
          announcement_enabled?: boolean
          announcement_title?: string
          business_name?: string
          email?: string
          events_email?: string
          facebook_url?: string
          google_maps_url?: string
          id?: string
          instagram_url?: string
          phone?: string
          tiktok_url?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
      store_hours: {
        Row: {
          close_time: string
          day_label: string
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          close_time?: string
          day_label: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          close_time?: string
          day_label?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string
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
      token_tiers: {
        Row: {
          bonus: string
          created_at: string
          id: string
          is_highlight: boolean
          price: string
          sort_order: number
          tokens: string
          updated_at: string
        }
        Insert: {
          bonus?: string
          created_at?: string
          id?: string
          is_highlight?: boolean
          price?: string
          sort_order?: number
          tokens?: string
          updated_at?: string
        }
        Update: {
          bonus?: string
          created_at?: string
          id?: string
          is_highlight?: boolean
          price?: string
          sort_order?: number
          tokens?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
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
