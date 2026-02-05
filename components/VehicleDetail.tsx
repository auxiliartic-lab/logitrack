
import React, { useState } from 'react';
import { Vehicle, AppSettings, Stage, Role } from '../types';
import { DELAY_CAUSES, PRODUCTS_LOAD, MATERIALS_UNLOAD } from '../constants';

interface VehicleDetailProps {
  vehicle: Vehicle;
  settings: AppSettings;
  onClose: () => void;
  onUpdateStage: (id: string, stage: Stage, delay?: string, extraData?: any) => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, settings, onClose, onUpdateStage }) => {
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  
  const [maneuverType, setManeuverType] = useState<'Cargue' | 'Descargue' | ''>('');
  const [productName, setProductName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [targetQuantity, setTargetQuantity] = useState('');
  const [shippedWeight, setShippedWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const getNextStage = () => {
    const flow = settings.stageFlows[vehicle.operation];
    const currentIndex = flow.indexOf(vehicle.currentStage);
    return flow[currentIndex + 1];
  };

  const nextStage = getNextStage();

  const handleAdvance = () => {
    if (!nextStage) return;
    
    let extraData: any = {};
    if (nextStage === Stage.PHYSICAL_INSPECTION) {
      extraData = { maneuverType, productName, entityName, targetQuantity, shippedWeight };
    } else if (nextStage === Stage.DOCUMENTATION) {
      extraData = { netWeight };
    }

    onUpdateStage(vehicle.id, nextStage, delayReason, extraData);
    setDelayReason('');
    setShowAdvanceForm(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <i className="fas fa-truck text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-indigo-900 tracking-tight">{vehicle.licensePlate}</h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{vehicle.operation}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white text-slate-300 rounded-full shadow-sm flex items-center justify-center hover:text-slate-500 transition-colors"><i className="fas fa-times"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {vehicle.status === 'active' && nextStage && (
            <div className="bg-white border-2 border-indigo-100 p-6 rounded-[2rem] shadow-xl shadow-indigo-50 animate-in slide-in-from-bottom duration-500">
              {!showAdvanceForm ? (
                <button onClick={() => setShowAdvanceForm(true)} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                  REGISTRAR {nextStage.toUpperCase()} <i className="fas fa-arrow-right ml-3"></i>
                </button>
              ) : (
                <div className="space-y-5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span> Nueva Etapa: {nextStage}
                  </h3>
                  
                  {nextStage === Stage.PHYSICAL_INSPECTION && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Maniobra</label>
                        <select className="w-full bg-slate-50 border rounded-xl px-3 py-3 text-xs font-bold outline-none" value={maneuverType} onChange={(e) => setManeuverType(e.target.value as any)}>
                          <option value="">Seleccione...</option>
                          <option value="Cargue">Cargue</option>
                          <option value="Descargue">Descargue</option>
                        </select>
                      </div>
                      {maneuverType && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                             <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Producto / Material</label>
                             <select className="w-full bg-slate-50 border rounded-xl px-3 py-3 text-xs font-bold" value={productName} onChange={(e) => setProductName(e.target.value)}>
                               <option value="">Seleccione...</option>
                               {(maneuverType === 'Cargue' ? PRODUCTS_LOAD : MATERIALS_UNLOAD).map(p => <option key={p} value={p}>{p}</option>)}
                             </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">{maneuverType === 'Cargue' ? 'Cliente' : 'Proveedor'}</label>
                            <input type="text" className="w-full bg-slate-50 border rounded-xl px-3 py-3 text-xs font-bold" value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="Nombre"/>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Cantidad / Peso</label>
                            <input type="number" className="w-full bg-slate-50 border rounded-xl px-3 py-3 text-xs font-bold" value={maneuverType === 'Cargue' ? targetQuantity : shippedWeight} onChange={(e) => maneuverType === 'Cargue' ? setTargetQuantity(e.target.value) : setShippedWeight(e.target.value)} placeholder="0"/>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {nextStage === Stage.DOCUMENTATION && (
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Peso Neto Confirmado (Kg)</label>
                      <input type="number" className="w-full bg-slate-100 border rounded-xl px-4 py-4 text-xl font-black text-indigo-700 outline-none" value={netWeight} onChange={(e) => setNetWeight(e.target.value)} placeholder="0"/>
                    </div>
                  )}

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Justificación Retraso</label>
                    <select className="w-full bg-slate-50 border rounded-xl px-3 py-3 text-xs font-bold outline-none" value={delayReason} onChange={(e) => setDelayReason(e.target.value)}>
                      <option value="">Ninguna - Etapa normal</option>
                      {DELAY_CAUSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowAdvanceForm(false)} className="flex-1 text-slate-400 font-black py-3 text-[10px] uppercase">Cancelar</button>
                    <button onClick={handleAdvance} className="flex-1 bg-green-600 text-white font-black py-3 rounded-2xl text-[10px] uppercase shadow-lg shadow-green-100">Confirmar Registro</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="font-black text-slate-800 text-sm flex justify-between items-center px-1">
              <span>TRAZABILIDAD OPERATIVA</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-400 tracking-widest">{vehicle.history.length} HITOS</span>
            </h3>
            <div className="space-y-6">
              {vehicle.history.slice().reverse().map((event, idx) => {
                const standardMin = settings.standardTimes[event.stage] || 0;
                // Para simplificar, comparamos el tiempo entre hitos en reversa
                const prevEvent = vehicle.history[vehicle.history.length - 1 - idx - 1];
                const duration = prevEvent ? event.timestamp - prevEvent.timestamp : null;
                const isDelayed = duration && (duration / 60000) > standardMin;
                
                return (
                  <div key={event.id} className="relative pl-10 border-l-2 border-slate-100 last:border-transparent">
                    <div className={`absolute -left-[11px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${idx === 0 && vehicle.status === 'active' ? 'bg-indigo-600 animate-pulse' : (isDelayed ? 'bg-red-500' : 'bg-emerald-500')}`}>
                       {isDelayed && <i className="fas fa-exclamation text-[8px] text-white"></i>}
                    </div>
                    
                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{event.stage}</p>
                        <p className="text-[9px] font-black text-slate-400">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                          {event.recordedBy?.charAt(0) || 'S'}
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-700 leading-none">{event.recordedBy || 'Automático'}</p>
                           <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{event.userRole || 'SISTEMA'}</p>
                        </div>
                      </div>

                      {duration !== null && (
                        <div className={`mt-3 flex items-center gap-2 text-[9px] font-black px-2 py-1 rounded-lg ${isDelayed ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                           <i className="fas fa-stopwatch"></i>
                           <span>{formatDuration(duration)}</span>
                           <span className="opacity-30">|</span>
                           <span className="opacity-60">Est: {standardMin}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
