import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image_url: string;
  average_cost_per_day: number;
  best_season: string;
  popular_activities: string[];
  created_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TripDestination {
  id: string;
  trip_id: string;
  destination_id: string;
  order_index: number;
  duration_days: number;
  created_at: string;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day_number: number;
  time: string;
  title: string;
  description: string;
  cost: number;
  location: string;
  created_at: string;
}
