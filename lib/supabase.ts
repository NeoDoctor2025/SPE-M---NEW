import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          crm: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          crm?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          crm?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          cpf: string;
          birth_date: string;
          gender: string;
          address: string;
          status: 'Active' | 'Pending' | 'Inactive' | 'Alert';
          last_visit: string;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          cpf: string;
          birth_date: string;
          gender: string;
          address: string;
          status?: 'Active' | 'Pending' | 'Inactive' | 'Alert';
          last_visit?: string;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          cpf?: string;
          birth_date?: string;
          gender?: string;
          address?: string;
          status?: 'Active' | 'Pending' | 'Inactive' | 'Alert';
          last_visit?: string;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      evaluations: {
        Row: {
          id: string;
          user_id: string;
          patient_id: string;
          name: string;
          date: string;
          score: number | null;
          status: 'Completed' | 'Draft';
          type: 'Cardiology' | 'Dermatology' | 'Orthopedics' | 'Neurology' | 'Nutritional';
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          patient_id: string;
          name: string;
          date?: string;
          score?: number | null;
          status?: 'Completed' | 'Draft';
          type: 'Cardiology' | 'Dermatology' | 'Orthopedics' | 'Neurology' | 'Nutritional';
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          patient_id?: string;
          name?: string;
          date?: string;
          score?: number | null;
          status?: 'Completed' | 'Draft';
          type?: 'Cardiology' | 'Dermatology' | 'Orthopedics' | 'Neurology' | 'Nutritional';
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
