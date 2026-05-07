import React, { useState } from 'react';
import { Calendar, Maximize2, X, Download } from 'lucide-react';

interface Props {
  images: { date: string, image: string }[];
}

const LogGallery: React.FC<Props> = ({ images }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((item, idx) => (
          <div key={idx} className="group relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 transition-all shadow-sm">
            <div className="bg-white px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <button 
                onClick={() => setModalImage(item.image)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            
            <div className="aspect-[1.58/1] bg-white p-2">
              <img 
                src={`data:image/png;base64,${item.image}`} 
                alt={`Log for ${item.date}`}
                className="w-full h-full object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-500"
                onClick={() => setModalImage(item.image)}
              />
            </div>
            
            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Modern Lightbox */}
      {modalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-6xl w-full bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2">
               <button 
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={() => setModalImage(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <img 
                src={`data:image/png;base64,${modalImage}`} 
                className="w-full h-auto rounded-lg shadow-inner border border-slate-100" 
                alt="Full Log" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogGallery;
