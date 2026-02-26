import { useEffect, useState, useRef } from 'react';
import { Plane, Compass, TrendingUp } from 'lucide-react';
import Hero from './components/Hero';
import DestinationCard from './components/DestinationCard';
import SearchBar from './components/SearchBar';
import TripBuilder from './components/TripBuilder';
import { supabase, Destination } from './lib/supabase';

function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const destinationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name');

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToDestinations = () => {
    destinationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDestination = (destination: Destination) => {
    if (!selectedDestinations.find((d) => d.id === destination.id)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };

  const handleRemoveDestination = (id: string) => {
    setSelectedDestinations(selectedDestinations.filter((d) => d.id !== id));
  };

  const handleClearAll = () => {
    setSelectedDestinations([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Hero onSearchClick={scrollToDestinations} />

      <div className="relative z-10 -mt-32 px-4">
        <SearchBar destinations={destinations} onSelect={handleSelectDestination} />
      </div>

      <div className="container mx-auto px-4 py-20" ref={destinationsRef}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-6 py-3 mb-6 shadow-lg">
            <Compass className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-semibold">Popular Destinations</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Where will you go
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> next</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover breathtaking destinations handpicked for unforgettable experiences
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={handleSelectDestination}
              />
            ))}
          </div>
        )}

        {selectedDestinations.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-6 py-3 mb-6 shadow-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 font-semibold">Trip Planning</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Build Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Trip</span>
              </h2>
            </div>
            <TripBuilder
              selectedDestinations={selectedDestinations}
              onRemoveDestination={handleRemoveDestination}
              onClearAll={handleClearAll}
            />
          </div>
        )}
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">TravelVista</span>
          </div>
          <p className="text-gray-400">
            Your journey to extraordinary experiences starts here
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
