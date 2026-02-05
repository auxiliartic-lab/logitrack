
import React, { useState } from 'react';
import { Stage, AppSettings, OperationType, User } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onLogout: () => void;
  user: User;
  hasSyncError?: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onLogout, user, hasSyncError }) => {
  const [activeSubTab, setActiveSubTab] = useState<'times' | 'flows' | 'account'>('account');
  const [selectedOp, setSelectedOp] = useState<OperationType>(OperationType.RAW_MATERIAL);

  const handleTimeChange = (stage: Stage, value: string) => {
    const minutes = parseInt(value) || 0;
    onUpdate({
      ...settings,
      standardTimes: { ...settings.standardTimes, [stage]: minutes }
    });
  };

  const handleRemoveStage = (op: OperationType, index: number) => {
    const newFlow = [...settings.stageFlows[op]];
    if (newFlow.length <= 1) return alert("Debe haber al menos una etapa.");
    newFlow.splice(index, 1);
    onUpdate({ ...settings, stageFlows: { ...settings.stageFlows, [op]: newFlow } });
  };

  const handleAddStage = (op: OperationType, stage: Stage) => {
    const newFlow = [...settings.stageFlows[op], stage];
    onUpdate({ ...settings, stageFlows: { ...settings.stageFlows, [op]: newFlow } });
  };

  const handleMoveStage = (op: OperationType, index: number, direction: 'up' | 'down') => {
    const newFlow = [...settings.stageFlows[op]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFlow.length) return;
    const temp = newFlow[index];
    newFlow[index] = newFlow[newIndex];
    newFlow[newIndex] = temp;
    onUpdate({ ...settings, stageFlows: { ...settings.stageFlows, [op]: newFlow } });
  };

  return (
    <div className="p-4 space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex bg-slate-200 p-1 rounded-2xl shadow-inner border border-slate-300/20">
        <button onClick={() => setActiveSubTab('account')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubTab === 'account' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Sesión / Cloud</button>
        <button onClick={() => setActiveSubTab('flows')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubTab === 'flows' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Flujos</button>
        <button onClick={() => setActiveSubTab('times')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeSubTab === 'times' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Tiempos</button>
      </div>

      {activeSubTab === 'account' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-inner border-4 border-white">
                {user.name.charAt(0)}
             </div>
             <h3 className="text-xl font-black text-slate-800">{user.name}</h3>
             <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase mt-2 tracking-widest">{user.role}</span>
             
             <div className="w-full grid grid-cols-1 gap-4 mt-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Estado de Conexión</p>
                   <p className={`text-sm font-black flex items-center justify-center ${hasSyncError ? 'text-red-500' : 'text-green-600'}`}>
                     <span className={`w-1.5 h-1.5 rounded-full mr-2 ${hasSyncError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span> {hasSyncError ? 'Desconectado' : 'Sincronizado'}
                   </p>
                </div>
             </div>

             <button 
                onClick={onLogout}
                className="w-full mt-6 bg-red-50 text-red-600 font-black py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all"
              >
               SALIR DE LA TERMINAL <i className="fas fa-sign-out-alt ml-2"></i>
             </button>
          </div>
        </div>
      )}

      {activeSubTab === 'times' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Etapa Logística</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min. Estándar</span>
            </div>
            <div className="divide-y divide-slate-50">
              {Object.values(Stage).map((stage) => (
                <div key={stage} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-slate-700 pr-4">{stage}</span>
                  <input 
                    type="number" 
                    value={settings.standardTimes[stage]}
                    onChange={(e) => handleTimeChange(stage, e.target.value)}
                    className="w-16 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5 text-right text-xs font-black text-indigo-600 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'flows' && (
        <div className="animate-in fade-in duration-300 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-3">Configurar Secuencia por Operación</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-xs font-black text-slate-700 outline-none shadow-inner"
              value={selectedOp}
              onChange={(e) => setSelectedOp(e.target.value as OperationType)}
            >
              {Object.values(OperationType).map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {settings.stageFlows[selectedOp].map((stage, index) => (
                <div key={`${stage}-${index}`} className="p-4 flex items-center justify-between group bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center mr-3 shadow-inner">
                      {index + 1}
                    </span>
                    <span className="text-xs font-black text-slate-700">{stage}</span>
                  </div>
                  <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleMoveStage(selectedOp, index, 'up')} className="p-2 text-slate-400 hover:text-indigo-600"><i className="fas fa-chevron-up text-xs"></i></button>
                    <button onClick={() => handleMoveStage(selectedOp, index, 'down')} className="p-2 text-slate-400 hover:text-indigo-600"><i className="fas fa-chevron-down text-xs"></i></button>
                    <button onClick={() => handleRemoveStage(selectedOp, index)} className="p-2 text-slate-400 hover:text-red-600"><i className="fas fa-trash-alt text-xs"></i></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Añadir Nueva Etapa</p>
              <div className="flex gap-2">
                 <select 
                    id="new-stage-select-set"
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-3 py-3 text-[10px] font-bold outline-none shadow-sm"
                    defaultValue=""
                 >
                    <option value="" disabled>Seleccionar etapa operativa...</option>
                    {Object.values(Stage).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <button 
                    onClick={() => {
                      const el = document.getElementById('new-stage-select-set') as HTMLSelectElement;
                      if (el.value) handleAddStage(selectedOp, el.value as Stage);
                    }}
                    className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black shadow-lg shadow-indigo-200"
                 >
                    AÑADIR
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
