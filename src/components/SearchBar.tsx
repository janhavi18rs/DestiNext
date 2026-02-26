import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Destination } from '../lib/supabase';

interface SearchBarProps {
  destinations: Destination[];
  onSelect: (destination: Destination) => void;
}

export default function SearchBar({ destinations, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = destinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query.toLowerCase()) ||
          dest.country.toLowerCase().includes(query.toLowerCase()) ||
          dest.region.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setIsOpen(true);
    } else {
      setFilteredDestinations([]);
      setIsOpen(false);
    }
  }, [query, destinations]);

  const handleSelect = (destination: Destination) => {
    onSelect(destination);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
          <Search className="w-6 h-6 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, countries, or regions..."
          className="w-full pl-16 pr-16 py-6 text-lg rounded-2xl bg-white/90 backdrop-blur-xl border-2 border-white/50 shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {isOpen && filteredDestinations.length > 0 && (
        <div className="absolute top-full mt-4 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {filteredDestinations.map((destination) => (
            <button
              key={destination.id}
              onClick={() => handleSelect(destination)}
              className="w-full px-6 py-4 hover:bg-blue-50 transition-colors duration-200 text-left flex items-center gap-4 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-16 h-16 object-cover rounded-xl"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">{destination.name}</div>
                <div className="text-gray-600 text-sm">{destination.country} • {destination.region}</div>
              </div>
              <div className="text-green-600 font-semibold">
                ${destination.average_cost_per_day}/day
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
