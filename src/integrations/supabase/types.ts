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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          module: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          module: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          module?: string
        }
        Relationships: []
      }
      boats: {
        Row: {
          boat_type: string | null
          color: string | null
          created_at: string | null
          engine_brand: string | null
          engine_power_hp: number | null
          fuel_type: string | null
          home_port: string | null
          hull_material: string | null
          id: string
          is_primary: boolean | null
          length_meters: number | null
          name: string
          owner_id: string
          photo_url: string | null
          registration_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          boat_type?: string | null
          color?: string | null
          created_at?: string | null
          engine_brand?: string | null
          engine_power_hp?: number | null
          fuel_type?: string | null
          home_port?: string | null
          hull_material?: string | null
          id?: string
          is_primary?: boolean | null
          length_meters?: number | null
          name: string
          owner_id: string
          photo_url?: string | null
          registration_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          boat_type?: string | null
          color?: string | null
          created_at?: string | null
          engine_brand?: string | null
          engine_power_hp?: number | null
          fuel_type?: string | null
          home_port?: string | null
          hull_material?: string | null
          id?: string
          is_primary?: boolean | null
          length_meters?: number | null
          name?: string
          owner_id?: string
          photo_url?: string | null
          registration_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          is_public: boolean | null
          location: string | null
          notice_id: string | null
          priority: string | null
          source: string | null
          starts_at: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          notice_id?: string | null
          priority?: string | null
          source?: string | null
          starts_at: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          notice_id?: string | null
          priority?: string | null
          source?: string | null
          starts_at?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          display_order: number | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_incidents: {
        Row: {
          accuracy: number | null
          acknowledged_at: string | null
          boat_id: string | null
          client_request_id: string | null
          contact_phone: string | null
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          incident_type: string | null
          latitude: number | null
          location_recorded_at: string | null
          location_source: string | null
          longitude: number | null
          message: string | null
          priority: string
          resolved_at: string | null
          sos_number: string | null
          status: string
          trip_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          acknowledged_at?: string | null
          boat_id?: string | null
          client_request_id?: string | null
          contact_phone?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          incident_type?: string | null
          latitude?: number | null
          location_recorded_at?: string | null
          location_source?: string | null
          longitude?: number | null
          message?: string | null
          priority?: string
          resolved_at?: string | null
          sos_number?: string | null
          status?: string
          trip_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          acknowledged_at?: string | null
          boat_id?: string | null
          client_request_id?: string | null
          contact_phone?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          incident_type?: string | null
          latitude?: number | null
          location_recorded_at?: string | null
          location_source?: string | null
          longitude?: number | null
          message?: string | null
          priority?: string
          resolved_at?: string | null
          sos_number?: string | null
          status?: string
          trip_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_incidents_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_incidents_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "fishing_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      external_content_queue: {
        Row: {
          caption: string | null
          created_at: string | null
          external_id: string
          id: string
          media_url: string | null
          permalink: string | null
          platform: string
          published_at: string | null
          raw_payload: Json | null
          review_status: string
          source_account: string
          title: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          external_id: string
          id?: string
          media_url?: string | null
          permalink?: string | null
          platform: string
          published_at?: string | null
          raw_payload?: Json | null
          review_status?: string
          source_account: string
          title?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          external_id?: string
          id?: string
          media_url?: string | null
          permalink?: string | null
          platform?: string
          published_at?: string | null
          raw_payload?: Json | null
          review_status?: string
          source_account?: string
          title?: string | null
        }
        Relationships: []
      }
      fish_species: {
        Row: {
          active: boolean | null
          common_name: string
          created_at: string | null
          id: string
          image_url: string | null
          scientific_name: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          common_name: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          scientific_name?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          common_name?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          scientific_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fishing_regulations: {
        Row: {
          description: string | null
          ends_at: string | null
          id: string
          legal_reference: string | null
          minimum_size_cm: number | null
          region: string | null
          rule_type: string
          source_name: string | null
          source_url: string | null
          species_id: string | null
          starts_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          ends_at?: string | null
          id?: string
          legal_reference?: string | null
          minimum_size_cm?: number | null
          region?: string | null
          rule_type: string
          source_name?: string | null
          source_url?: string | null
          species_id?: string | null
          starts_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          ends_at?: string | null
          id?: string
          legal_reference?: string | null
          minimum_size_cm?: number | null
          region?: string | null
          rule_type?: string
          source_name?: string | null
          source_url?: string | null
          species_id?: string | null
          starts_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fishing_regulations_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "fish_species"
            referencedColumns: ["id"]
          },
        ]
      }
      fishing_trips: {
        Row: {
          boat_id: string
          created_at: string | null
          crew_count: number
          destination_description: string | null
          ended_at: string | null
          expected_return_at: string | null
          id: string
          last_location_at: string | null
          location_sharing_enabled: boolean
          started_at: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          boat_id: string
          created_at?: string | null
          crew_count?: number
          destination_description?: string | null
          ended_at?: string | null
          expected_return_at?: string | null
          id?: string
          last_location_at?: string | null
          location_sharing_enabled?: boolean
          started_at?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          boat_id?: string
          created_at?: string | null
          crew_count?: number
          destination_description?: string | null
          ended_at?: string | null
          expected_return_at?: string | null
          id?: string
          last_location_at?: string | null
          location_sharing_enabled?: boolean
          started_at?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fishing_trips_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
        ]
      }
      notice_audiences: {
        Row: {
          audience_type: string
          audience_value: string | null
          created_at: string | null
          id: string
          notice_id: string
        }
        Insert: {
          audience_type: string
          audience_value?: string | null
          created_at?: string | null
          id?: string
          notice_id: string
        }
        Update: {
          audience_type?: string
          audience_value?: string | null
          created_at?: string | null
          id?: string
          notice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notice_audiences_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          external_id: string | null
          id: string
          image_url: string | null
          pinned: boolean | null
          priority: string
          published_at: string | null
          scheduled_at: string | null
          source_name: string | null
          source_type: string
          source_url: string | null
          status: string
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          pinned?: boolean | null
          priority?: string
          published_at?: string | null
          scheduled_at?: string | null
          source_name?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          pinned?: boolean | null
          priority?: string
          published_at?: string | null
          scheduled_at?: string | null
          source_name?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_deliveries: {
        Row: {
          created_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          notification_id: string | null
          sent_at: string | null
          status: string
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          status: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_deliveries_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "push_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          events_enabled: boolean | null
          marine_enabled: boolean | null
          prefeitura_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          secretaria_enabled: boolean | null
          sos_enabled: boolean | null
          trip_enabled: boolean | null
          updated_at: string | null
          user_id: string
          weather_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          events_enabled?: boolean | null
          marine_enabled?: boolean | null
          prefeitura_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          secretaria_enabled?: boolean | null
          sos_enabled?: boolean | null
          trip_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
          weather_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          events_enabled?: boolean | null
          marine_enabled?: boolean | null
          prefeitura_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          secretaria_enabled?: boolean | null
          sos_enabled?: boolean | null
          trip_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
          weather_enabled?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          id: string
          priority: string
          reference_id: string | null
          reference_type: string | null
          scheduled_at: string | null
          sent_at: string | null
          target_type: string
          target_value: string | null
          title: string
          type: string
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          priority: string
          reference_id?: string | null
          reference_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          target_type: string
          target_value?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          target_type?: string
          target_value?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      offline_sync_queue: {
        Row: {
          attempts: number | null
          client_request_id: string
          created_at: string | null
          error_message: string | null
          id: string
          operation_type: string
          payload: Json
          priority: number | null
          processed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          client_request_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          operation_type: string
          payload: Json
          priority?: number | null
          processed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          client_request_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          operation_type?: string
          payload?: Json
          priority?: number | null
          processed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          cep: string | null
          city: string | null
          community: string | null
          cpf: string | null
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          fisher_registration: string | null
          fisher_type: string | null
          full_name: string | null
          gender: string | null
          id: string
          locality: string | null
          municipal_registration: string | null
          neighborhood: string | null
          nickname: string | null
          phone: string | null
          registration_completed: boolean | null
          state: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          community?: string | null
          cpf?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          fisher_registration?: string | null
          fisher_type?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          locality?: string | null
          municipal_registration?: string | null
          neighborhood?: string | null
          nickname?: string | null
          phone?: string | null
          registration_completed?: boolean | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          community?: string | null
          cpf?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          fisher_registration?: string | null
          fisher_type?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          locality?: string | null
          municipal_registration?: string | null
          neighborhood?: string | null
          nickname?: string | null
          phone?: string | null
          registration_completed?: boolean | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          active: boolean | null
          created_at: string | null
          device_name: string | null
          device_token: string
          id: string
          last_seen_at: string | null
          platform: string | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          device_name?: string | null
          device_token: string
          id?: string
          last_seen_at?: string | null
          platform?: string | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          device_name?: string | null
          device_token?: string
          id?: string
          last_seen_at?: string | null
          platform?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tide_cache: {
        Row: {
          created_at: string | null
          date: string
          expires_at: string
          fetched_at: string | null
          id: string
          payload: Json
          provider: string
          station_key: string
        }
        Insert: {
          created_at?: string | null
          date: string
          expires_at: string
          fetched_at?: string | null
          id?: string
          payload: Json
          provider: string
          station_key: string
        }
        Update: {
          created_at?: string | null
          date?: string
          expires_at?: string
          fetched_at?: string | null
          id?: string
          payload?: Json
          provider?: string
          station_key?: string
        }
        Relationships: []
      }
      trip_locations: {
        Row: {
          accuracy: number | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          received_at: string | null
          recorded_at: string
          speed: number | null
          trip_id: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          received_at?: string | null
          recorded_at?: string
          speed?: number | null
          trip_id: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          received_at?: string | null
          recorded_at?: string
          speed?: number | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_locations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "fishing_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_timeline_events: {
        Row: {
          actor_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          trip_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          trip_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_timeline_events_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "fishing_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          created_at: string | null
          granted: boolean | null
          granted_at: string | null
          id: string
          revoked_at: string | null
          user_id: string
          version: string | null
        }
        Insert: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          created_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          revoked_at?: string | null
          user_id: string
          version?: string | null
        }
        Update: {
          consent_type?: Database["public"]["Enums"]["consent_type"]
          created_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          revoked_at?: string | null
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          boat_id: string | null
          category_id: string | null
          created_at: string | null
          document_number: string | null
          expires_at: string | null
          file_url: string | null
          id: string
          issued_at: string | null
          issuer: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          boat_id?: string | null
          category_id?: string | null
          created_at?: string | null
          document_number?: string | null
          expires_at?: string | null
          file_url?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          notes?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          boat_id?: string | null
          category_id?: string | null
          created_at?: string | null
          document_number?: string | null
          expires_at?: string | null
          file_url?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weather_cache: {
        Row: {
          created_at: string | null
          data_type: string
          expires_at: string
          fetched_at: string | null
          id: string
          latitude: number | null
          location_key: string | null
          longitude: number | null
          payload: Json
          provider: string
        }
        Insert: {
          created_at?: string | null
          data_type: string
          expires_at: string
          fetched_at?: string | null
          id?: string
          latitude?: number | null
          location_key?: string | null
          longitude?: number | null
          payload: Json
          provider: string
        }
        Update: {
          created_at?: string | null
          data_type?: string
          expires_at?: string
          fetched_at?: string | null
          id?: string
          latitude?: number | null
          location_key?: string | null
          longitude?: number | null
          payload?: Json
          provider?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_any_admin: { Args: { _user_id: string }; Returns: boolean }
      log_admin_action: {
        Args: {
          _action: string
          _entity_id?: string
          _entity_type?: string
          _metadata?: Json
          _module: string
        }
        Returns: undefined
      }
      process_scheduled_notices: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role:
        | "admin"
        | "fisher"
        | "master_admin"
        | "secretary"
        | "emergency_operator"
        | "service_operator"
        | "content_manager"
        | "viewer"
      consent_type:
        | "location"
        | "trip_location"
        | "notifications"
        | "privacy_policy"
        | "terms"
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
      app_role: [
        "admin",
        "fisher",
        "master_admin",
        "secretary",
        "emergency_operator",
        "service_operator",
        "content_manager",
        "viewer",
      ],
      consent_type: [
        "location",
        "trip_location",
        "notifications",
        "privacy_policy",
        "terms",
      ],
    },
  },
} as const
