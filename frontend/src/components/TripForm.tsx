import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Search, Loader2, User, Building2, Truck as TruckIcon } from 'lucide-react';

interface Props {
  onCalculate: (data: any) => void;
  loading: boolean;
}

const TripForm: React.FC<Props> = ({ onCalculate, loading }) => {
  const [formData, setFormData] = useState({
    current_location: 'New York, NY',
    pickup_location: 'Chicago, IL',
    dropoff_location: 'Los Angeles, CA',
    cycle_used: '0',
    driver_name: 'John Doe',
    carrier_name: 'Spotter Freight',
    truck_number: 'TRK-2026'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const labelClasses = "text-[10px] font-bold text-slate-400 mb-1 block uppercase tracking-wider";
  const inputClasses = "w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500";
  const iconClasses = "absolute left-3 top-[30px] text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
          <Search size={16} className="text-indigo-500" /> Manifest Details
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Route Section */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">1. Route & Schedule</p>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <label className={labelClasses}>Current Location</label>
              <MapPin className={iconClasses} size={16} />
              <input
                type="text"
                value={formData.current_location}
                onChange={(e) => setFormData({...formData, current_location: e.target.value})}
                className={inputClasses}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className={labelClasses}>Pickup</label>
                  <Navigation className={iconClasses} size={16} />
                  <input
                    type="text"
                    value={formData.pickup_location}
                    onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                    className={inputClasses}
                    required
                  />
                </div>
                <div className="relative group">
                  <label className={labelClasses}>Dropoff</label>
                  <Navigation className={iconClasses} size={16} />
                  <input
                    type="text"
                    value={formData.dropoff_location}
                    onChange={(e) => setFormData({...formData, dropoff_location: e.target.value})}
                    className={inputClasses}
                    required
                  />
                </div>
            </div>
            <div className="relative group">
              <label className={labelClasses}>Cycle Used (8-Day)</label>
              <Clock className={iconClasses} size={16} />
              <input
                type="number"
                value={formData.cycle_used}
                onChange={(e) => setFormData({...formData, cycle_used: e.target.value})}
                className={inputClasses}
                placeholder="Hours"
                min="0"
                max="70"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        {/* Vehicle/Driver Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">2. Driver & Vehicle</p>
          <div className="space-y-4">
            <div className="relative group">
              <label className={labelClasses}>Driver Name</label>
              <User className={iconClasses} size={16} />
              <input
                type="text"
                value={formData.driver_name}
                onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
                className={inputClasses}
                required
              />
            </div>
            <div className="relative group">
              <label className={labelClasses}>Carrier Name</label>
              <Building2 className={iconClasses} size={16} />
              <input
                type="text"
                value={formData.carrier_name}
                onChange={(e) => setFormData({...formData, carrier_name: e.target.value})}
                className={inputClasses}
                required
              />
            </div>
            <div className="relative group">
              <label className={labelClasses}>Truck Number</label>
              <TruckIcon className={iconClasses} size={16} />
              <input
                type="text"
                value={formData.truck_number}
                onChange={(e) => setFormData({...formData, truck_number: e.target.value})}
                className={inputClasses}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Optimize & Build Log Book"
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
