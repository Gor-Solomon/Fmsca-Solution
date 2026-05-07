import React, { useState } from 'react';
import axios from 'axios';
import TripForm from './components/TripForm';
import RouteMap from './components/RouteMap';
import LogGallery from './components/LogGallery';
import { 
  Truck, 
  Map as MapIcon, 
  ClipboardList, 
  Info, 
  Bell, 
  LayoutDashboard, 
  History as HistoryIcon, 
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

// --- MOCK DATA ---
const MOCK_HISTORY = [
  { id: 1, date: 'May 05, 2026', origin: 'Miami, FL', dest: 'Atlanta, GA', miles: '660', time: '10.5', status: 'Completed' },
  { id: 2, date: 'May 03, 2026', origin: 'Dallas, TX', dest: 'Denver, CO', miles: '795', time: '13.2', status: 'Completed' },
  { id: 3, date: 'May 01, 2026', origin: 'Seattle, WA', dest: 'Portland, OR', miles: '175', time: '3.1', status: 'Completed' },
  { id: 4, date: 'Apr 28, 2026', origin: 'Chicago, IL', dest: 'Nashville, TN', miles: '470', time: '7.8', status: 'Flagged' },
  { id: 5, date: 'Apr 25, 2026', origin: 'Phoenix, AZ', dest: 'Las Vegas, NV', miles: '300', time: '4.9', status: 'Completed' },
];

const MOCK_AUDIT_LOGS = [
  { id: 1, date: '2026-05-07', driver: 'John Doe', status: 'Verified' },
  { id: 2, date: '2026-05-06', driver: 'John Doe', status: 'Verified' },
  { id: 3, date: '2026-05-05', driver: 'John Doe', status: 'Verified' },
  { id: 4, date: '2026-05-04', driver: 'John Doe', status: 'System Auto-Sign' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleCalculate = async (formData: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/calculate-trip/`, formData);
      setData(response.data);
    } catch (error) {
      console.error("Error calculating trip", error);
      alert("Failed to connect to backend. Ensure Django is running at port 8000.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING COMPONENTS ---

  const renderDashboard = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
      <div className="xl:col-span-4 sticky top-24">
        <TripForm onCalculate={handleCalculate} loading={loading} />
        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
          <Info className="text-indigo-500 shrink-0" size={20} />
          <p className="text-xs text-indigo-700 leading-relaxed">
            Calculations are strictly based on FMCSA 70h/8d cycle rules. 
            Includes mandatory 30-min breaks and 10h resets.
          </p>
        </div>
      </div>

      <div className="xl:col-span-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <MapIcon className="text-indigo-500" size={18} />
            <h3 className="font-bold text-slate-800">Route Overview</h3>
          </div>
          <div className="h-[450px] relative">
            <RouteMap geometry={data?.route_geometry} />
            {!data && (
              <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <p className="text-slate-400 font-medium">Configure trip to view route</p>
              </div>
            )}
          </div>
        </div>

        {data?.log_images && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <ClipboardList className="text-indigo-500" size={18} />
              <h3 className="font-bold text-slate-800">Compliance Logs</h3>
            </div>
            <LogGallery images={data.log_images} />
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <HistoryIcon size={20} className="text-indigo-500" /> Trip History
        </h3>
        <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4 text-center">Distance</th>
              <th className="px-6 py-4 text-center">Duration</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_HISTORY.map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{trip.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    {trip.origin} <ArrowRight size={14} className="text-slate-300" /> {trip.dest}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center text-slate-500 font-medium">{trip.miles} mi</td>
                <td className="px-6 py-4 text-sm text-center text-slate-500 font-medium">{trip.time} hrs</td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg"><Clock className="text-indigo-600" size={20} /></div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">70h / 8d CYCLE</span>
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Cycle Used</h4>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-black text-slate-900">55.0</span>
            <span className="text-slate-400 font-bold pb-1">/ 70 hrs</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">15 hours remaining before 34h restart</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-2 rounded-lg"><AlertCircle className="text-amber-600" size={20} /></div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">RESTART DUE</span>
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Next Required Break</h4>
          <p className="text-2xl font-black text-slate-900 mb-1">34-Hour Restart</p>
          <p className="text-sm font-bold text-slate-500">Required in: <span className="text-amber-600">2 Days</span></p>
          <div className="mt-4 pt-4 border-t border-slate-50">
             <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">View Schedule <ArrowRight size={12} /></button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle2 className="text-emerald-600" size={20} /></div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">HEALTHY</span>
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Recent Violations</h4>
          <p className="text-3xl font-black text-slate-900 mb-1">0</p>
          <p className="text-sm font-bold text-slate-500">In the last 30 days</p>
          <div className="flex gap-1 mt-4">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>)}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <ClipboardList size={20} className="text-indigo-500" />
          <h3 className="text-lg font-bold text-slate-800">Daily Compliance Audit Log</h3>
        </div>
        <div className="p-0">
          {MOCK_AUDIT_LOGS.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-xl text-slate-400">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Log_{log.date}.png</p>
                  <p className="text-xs text-slate-400 font-medium">Generated for {log.driver} • {log.status}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm">
                <Download size={14} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="bg-slate-900 text-white h-16 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-inner">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">FMSCA <span className="text-indigo-400 font-black italic">Flow</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 h-full">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 h-full transition-all border-b-2 ${activeTab === 'dashboard' ? 'text-white border-indigo-500 bg-white/5' : 'border-transparent hover:text-white hover:bg-white/5'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 h-full transition-all border-b-2 ${activeTab === 'history' ? 'text-white border-indigo-500 bg-white/5' : 'border-transparent hover:text-white hover:bg-white/5'}`}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('compliance')}
            className={`px-6 h-full transition-all border-b-2 ${activeTab === 'compliance' ? 'text-white border-indigo-500 bg-white/5' : 'border-transparent hover:text-white hover:bg-white/5'}`}
          >
            Compliance
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-indigo-500/20">
            JD
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <ShieldCheck className="text-indigo-500" size={16} />
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Enterprise Platform</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab} <span className="text-slate-300 font-light">Overview</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Real-time logistics and FMCSA regulatory management.</p>
          </div>
          
          {activeTab === 'dashboard' && data && (
             <div className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Route Distance</p>
                  <p className="text-2xl font-black text-slate-900">{data.summary.total_distance.toFixed(0)} <span className="text-sm text-slate-400 font-bold">mi</span></p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Drive Time</p>
                  <p className="text-2xl font-black text-slate-900">{data.summary.total_drive_time.toFixed(1)} <span className="text-sm text-slate-400 font-bold">hrs</span></p>
                </div>
             </div>
          )}
        </div>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'compliance' && renderCompliance()}
      </main>

      <footer className="mt-auto py-8 border-t border-slate-200 bg-white px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 font-bold">
        <div className="flex items-center gap-4">
          <span className="text-slate-900 font-black tracking-tighter text-lg">FMSCA <span className="text-indigo-500 italic">Flow</span></span>
          <span className="hidden md:inline">|</span>
          <span>&copy; 2026 Regulatory Solutions</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-500 transition-colors">Documentation</a>
          <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-500 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
