
import React, { useState } from 'react';
import { Vehicle } from '../types';

interface VehicleListProps {
  vehicles: Vehicle[];
  onSelect: (v: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [search, setSearch] = useState('');

  const filtered = vehicles.filter(v => {
    const matchesFilter = filter === 'all' || v.status === filter;
    const matchesSearch = v.licensePlate.toLowerCase().includes(search.toLowerCase()) || 
                          v.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['active', 'completed', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap capitalize ${
              filter === f ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            {f === 'active' ? 'En Planta' : f === 'completed' ? 'Finalizados' : 'Todos'}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
        <input 
          type="text" 
          placeholder="Buscar por placa o código..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map(v => (
          <div 
            key={v.id} 
            onClick={() => onSelect(v)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-black text-lg text-slate-800 tracking-tight">{v.licensePlate}</h4>
                <p className="text-[10px] text-indigo-600 font-bold uppercase">{v.operation}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                {v.id}
              </span>
            </div>
            
            <div className="flex items-center text-slate-500 text-xs mb-3">
              <i className="fas fa-location-dot mr-2 text-indigo-400"></i>
              <span className="font-medium truncate">{v.currentStage}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div className="flex items-center text-[10px] text-slate-400">
                <i className="fas fa-clock mr-1"></i>
                Ingresó: {new Date(v.entryTime).toLocaleDateString()} {new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-[10px] font-bold text-slate-600">
                {v.history.length} Etapas
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-truck-ramp-box text-slate-200 text-6xl mb-4"></i>
            <p className="text-slate-400 font-medium">No se encontraron vehículos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
