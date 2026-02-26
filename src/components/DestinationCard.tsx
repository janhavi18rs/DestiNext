import { MapPin, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { Destination } from '../lib/supabase';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
}

export default function DestinationCard({ destination, onSelect }: DestinationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Convert USD → INR
  const costInRupees = destination.average_cost_per_day * 90;

  return (
    <div
      className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(destination)}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
      }}
    >
      <div className="absolute inset-0">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
          }`}
        />
      </button>

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="transform transition-all duration-500 translate-y-0 group-hover:-translate-y-2">
          
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5">
              <MapPin className="w-4 h-4 text-white inline mr-1" />
              <span className="text-white text-sm font-medium">{destination.country}</span>
            </div>

            <div className="bg-yellow-400/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1">
              <Star className="w-4 h-4 fill-white text-white" />
              <span className="text-white text-sm font-bold">4.8</span>
            </div>
          </div>

          <h3 className="text-4xl font-bold text-white mb-3 leading-tight">
            {destination.name}
          </h3>

          <p className="text-white/90 text-base mb-4 line-clamp-2 transition-all duration-500 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20">
            {destination.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              
              {/* ✅ Rupee Symbol Instead of Dollar */}
              <span className="text-green-400 text-xl font-bold">₹</span>

              <span className="text-white font-semibold">
                {costInRupees.toLocaleString('en-IN')}
                <span className="text-white/70 text-sm ml-1">/day</span>
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-2.5 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Explore
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            {destination.popular_activities.slice(0, 3).map((activity, index) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs px-3 py-1.5 rounded-full"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
