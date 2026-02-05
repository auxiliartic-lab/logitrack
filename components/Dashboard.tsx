
import React from 'react';
import { Vehicle } from '../types';

interface DashboardProps {
  vehicles: Vehicle[];
  onSelectVehicle: (v: Vehicle) => void;
  lastSync?: Date | null;
}

const Dashboard: React.FC<DashboardProps> = ({ vehicles, onSelectVehicle, lastSync }) => {
  const activeCount = vehicles.filter(v => v.status === 'active').length;
  const todayStart = new Date().setHours(0,0,0,0);
  const todayCount = vehicles.filter(v => v.entryTime >= todayStart).length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between px-2">
         <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Resumen Operativo</h2>
         {lastSync && (
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-bold text-slate-400">
               Sync: {lastSync.toLocaleTimeString()}
             </span>
           </div>
         )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-transform active:scale-95">
          <div className="flex items-center text-indigo-600 mb-2">
            <i className="fas fa-clock mr-2"></i>
            <span className="text-xs font-bold uppercase tracking-wider">En Planta</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{activeCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Vehículos activos ahora</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-transform active:scale-95">
          <div className="flex items-center text-green-600 mb-2">
            <i className="fas fa-calendar-day mr-2"></i>
            <span className="text-xs font-bold uppercase tracking-wider">Hoy</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{todayCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Total registrados hoy</p>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-1 text-indigo-100">Eficiencia Operativa</h2>
          <p className="text-xs opacity-80 mb-4">Pulsa en cualquier vehículo para ver su historial de tiempos.</p>
          <div className="flex gap-2">
             <div className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/20">
               Promedio: 1h 45m
             </div>
             <div className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/20">
               Cumplimiento: 94%
             </div>
          </div>
        </div>
        <i className="fas fa-bolt absolute -right-4 -bottom-4 text-indigo-800 text-8xl opacity-30 transform rotate-12"></i>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-slate-700">Movimientos Recientes</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Últimos 5</p>
        </div>
        <div className="space-y-3">
          {vehicles.slice(0, 5).map(v => (
            <div 
              key={v.id} 
              onClick={() => onSelectVehicle(v)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between active:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${v.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  <i className={`fas ${v.status === 'active' ? 'fa-truck' : 'fa-check'}`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{v.licensePlate}</h4>
                  <p className="text-[10px] text-slate-500 truncate w-32">{v.currentStage}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  {v.operation.split(' ')[0]}
                </p>
                <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
