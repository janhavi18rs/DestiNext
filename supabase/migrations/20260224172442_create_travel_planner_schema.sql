/*
  # Travel Planner Database Schema

  ## Overview
  Complete database schema for a modern travel planner application with destinations,
  trips, itineraries, and budget tracking.

  ## New Tables
  
  ### `destinations`
  Popular travel destinations with rich details
  - `id` (uuid, primary key)
  - `name` (text) - Destination name
  - `country` (text) - Country name
  - `region` (text) - Geographic region
  - `description` (text) - Destination description
  - `image_url` (text) - Hero image URL
  - `average_cost_per_day` (numeric) - Estimated daily cost in USD
  - `best_season` (text) - Best time to visit
  - `popular_activities` (text array) - Popular activities
  - `created_at` (timestamptz)

  ### `trips`
  User-created travel trips
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to auth.users
  - `title` (text) - Trip title
  - `start_date` (date) - Trip start date
  - `end_date` (date) - Trip end date
  - `budget` (numeric) - Total budget
  - `status` (text) - planning, booked, completed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `trip_destinations`
  Destinations included in trips
  - `id` (uuid, primary key)
  - `trip_id` (uuid) - Reference to trips
  - `destination_id` (uuid) - Reference to destinations
  - `order_index` (integer) - Order in trip
  - `duration_days` (integer) - Days at destination
  - `created_at` (timestamptz)

  ### `itinerary_items`
  Daily itinerary items for trips
  - `id` (uuid, primary key)
  - `trip_id` (uuid) - Reference to trips
  - `day_number` (integer) - Day of trip
  - `time` (text) - Time of activity
  - `title` (text) - Activity title
  - `description` (text) - Activity details
  - `cost` (numeric) - Estimated cost
  - `location` (text) - Location name
  - `created_at` (timestamptz)

  ## Security
  
  Enable RLS on all tables with restrictive policies:
  - Public read access to destinations
  - Users can only manage their own trips, trip_destinations, and itinerary_items
*/

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  region text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  average_cost_per_day numeric DEFAULT 100,
  best_season text DEFAULT '',
  popular_activities text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_date date,
  end_date date,
  budget numeric DEFAULT 0,
  status text DEFAULT 'planning',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trip_destinations table
CREATE TABLE IF NOT EXISTS trip_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE NOT NULL,
  order_index integer DEFAULT 0,
  duration_days integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create itinerary_items table
CREATE TABLE IF NOT EXISTS itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL,
  time text DEFAULT '',
  title text NOT NULL,
  description text DEFAULT '',
  cost numeric DEFAULT 0,
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

-- Destinations policies (public read)
CREATE POLICY "Anyone can view destinations"
  ON destinations FOR SELECT
  TO public
  USING (true);

-- Trips policies
CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trip destinations policies
CREATE POLICY "Users can view own trip destinations"
  ON trip_destinations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own trip destinations"
  ON trip_destinations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own trip destinations"
  ON trip_destinations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip destinations"
  ON trip_destinations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Itinerary items policies
CREATE POLICY "Users can view own itinerary items"
  ON itinerary_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own itinerary items"
  ON itinerary_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own itinerary items"
  ON itinerary_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own itinerary items"
  ON itinerary_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_items.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Insert sample destinations
INSERT INTO destinations (name, country, region, description, image_url, average_cost_per_day, best_season, popular_activities)
VALUES
  ('Tokyo', 'Japan', 'East Asia', 'A mesmerizing blend of ancient tradition and cutting-edge technology, where neon-lit streets meet serene temples.', 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', 150, 'Spring (March-May)', ARRAY['Temple visits', 'Sushi tasting', 'Shopping', 'Nightlife']),
  ('Paris', 'France', 'Western Europe', 'The City of Light enchants with its timeless elegance, world-class museums, and romantic atmosphere.', 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg', 180, 'Spring/Fall', ARRAY['Museums', 'Dining', 'Architecture', 'River cruises']),
  ('Bali', 'Indonesia', 'Southeast Asia', 'A tropical paradise offering pristine beaches, lush rice terraces, and spiritual tranquility.', 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg', 70, 'April-October', ARRAY['Beach lounging', 'Surfing', 'Yoga', 'Temple tours']),
  ('New York City', 'United States', 'North America', 'The city that never sleeps pulses with energy, culture, and endless possibilities at every corner.', 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg', 200, 'Spring/Fall', ARRAY['Broadway shows', 'Museums', 'Shopping', 'Food tours']),
  ('Santorini', 'Greece', 'Southern Europe', 'Iconic white-washed buildings cascade down cliffs overlooking the stunning azure Aegean Sea.', 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg', 160, 'May-October', ARRAY['Sunset viewing', 'Wine tasting', 'Beach clubs', 'Photography']),
  ('Dubai', 'United Arab Emirates', 'Middle East', 'A futuristic oasis in the desert, blending luxury, innovation, and Arabian hospitality.', 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg', 190, 'November-March', ARRAY['Shopping', 'Desert safari', 'Skydiving', 'Fine dining']),
  ('Machu Picchu', 'Peru', 'South America', 'The lost city of the Incas sits majestically among cloud-shrouded peaks, revealing ancient mysteries.', 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg', 80, 'May-September', ARRAY['Hiking', 'Photography', 'History tours', 'Mountain trekking']),
  ('Iceland', 'Iceland', 'Northern Europe', 'A land of fire and ice, where glaciers meet volcanoes and northern lights dance across the sky.', 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg', 170, 'June-August', ARRAY['Northern lights', 'Hot springs', 'Glacier hiking', 'Waterfall tours'])
ON CONFLICT DO NOTHING;