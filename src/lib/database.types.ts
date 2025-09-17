export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: 'citizen' | 'admin'
          department: string | null
          credits: number
          location_lat: number | null
          location_lng: number | null
          location_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: 'citizen' | 'admin'
          department?: string | null
          credits?: number
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'citizen' | 'admin'
          department?: string | null
          credits?: number
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      complaints: {
        Row: {
          id: string
          title: string
          description: string
          department: string
          category: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'submitted' | 'in-review' | 'in-progress' | 'resolved' | 'closed'
          citizen_id: string
          citizen_name: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          attachments: Json
          assigned_to: string | null
          resolution_notes: string | null
          credits_awarded: number | null
          quality_rating: 'excellent' | 'good' | 'poor' | 'fake' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          department: string
          category: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'submitted' | 'in-review' | 'in-progress' | 'resolved' | 'closed'
          citizen_id: string
          citizen_name: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          attachments?: Json
          assigned_to?: string | null
          resolution_notes?: string | null
          credits_awarded?: number | null
          quality_rating?: 'excellent' | 'good' | 'poor' | 'fake' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          department?: string
          category?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'submitted' | 'in-review' | 'in-progress' | 'resolved' | 'closed'
          citizen_id?: string
          citizen_name?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          attachments?: Json
          assigned_to?: string | null
          resolution_notes?: string | null
          credits_awarded?: number | null
          quality_rating?: 'excellent' | 'good' | 'poor' | 'fake' | null
          created_at?: string
          updated_at?: string
        }
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