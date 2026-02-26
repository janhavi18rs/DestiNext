import { Calendar, DollarSign, MapPin, Plus, X, Save } from 'lucide-react';
import { useState } from 'react';
import { Destination } from '../lib/supabase';

interface TripBuilderProps {
  selectedDestinations: Destination[];
  onRemoveDestination: (id: string) => void;
  onClearAll: () => void;
}

export default function TripBuilder({
  selectedDestinations,
  onRemoveDestination,
  onClearAll,
}: TripBuilderProps) {
  const [tripName, setTripName] = useState('My Dream Trip');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('5000');

  const totalEstimatedCost = selectedDestinations.reduce(
    (sum, dest) => sum + dest.average_cost_per_day * 3,
    0
  );

  if (selectedDestinations.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Building Your Trip</h3>
        <p className="text-gray-600 text-lg">
          Select destinations above to create your perfect itinerary
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Trip Plan
        </h3>
        <button
          onClick={onClearAll}
          className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Name</label>
        <input
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Total Budget
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-all duration-200"
        />
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Selected Destinations</h4>
        <div className="space-y-3">
          {selectedDestinations.map((destination, index) => (
            <div
              key={destination.id}
              className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 group hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {index + 1}
              </div>
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-16 h-16 object-cover rounded-xl"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-900">{destination.name}</div>
                <div className="text-sm text-gray-600">{destination.country}</div>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-bold">
                  ${destination.average_cost_per_day * 3}
                </div>
                <div className="text-xs text-gray-500">3 days est.</div>
              </div>
              <button
                onClick={() => onRemoveDestination(destination.id)}
                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-semibold">Estimated Total Cost</span>
          <span className="text-3xl font-bold text-blue-600">${totalEstimatedCost}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Your Budget</span>
          <span className="text-2xl font-bold text-gray-900">${budget}</span>
        </div>
        <div className="mt-4 h-3 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
            style={{
              width: `${Math.min((totalEstimatedCost / parseInt(budget)) * 100, 100)}%`,
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {totalEstimatedCost <= parseInt(budget)
            ? `You're ${((1 - totalEstimatedCost / parseInt(budget)) * 100).toFixed(0)}% under budget`
            : `You're ${((totalEstimatedCost / parseInt(budget) - 1) * 100).toFixed(0)}% over budget`}
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
        <Save className="w-6 h-6" />
        Save Trip Plan
      </button>
    </div>
  );
}
