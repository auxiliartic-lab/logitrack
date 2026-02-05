
import React, { useState } from 'react';
import { Vehicle, OperationType, AppSettings } from '../types';

interface ScannerViewProps {
  vehicles: Vehicle[];
  settings: AppSettings;
  onRegister: (v: Vehicle) => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ vehicles, settings, onRegister }) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('manual');
  const [inputCode, setInputCode] = useState('');
  const [showRegForm, setShowRegForm] = useState(false);

  const [newPlate, setNewPlate] = useState('');
  const [newOp, setNewOp] = useState<OperationType>(OperationType.RAW_MATERIAL);

  const handleSearch = () => {
    const v = vehicles.find(veh => veh.id === inputCode || veh.licensePlate === inputCode);
    if (v) {
      alert(`Vehículo ${v.licensePlate} ya está en planta. Localízalo en la pestaña 'En Planta'.`);
      setInputCode('');
    } else if (inputCode) {
      setShowRegForm(true);
      setNewPlate(inputCode);
    }
  };

  const handleRegister = () => {
    if (!newPlate) return alert("Ingresa una placa válida");
    
    const currentFlow = settings.stageFlows[newOp];
    const initialStage = currentFlow[0];

    const id = `V-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVehicle: Vehicle = {
      id,
      licensePlate: newPlate,
      operation: newOp,
      currentStage: initialStage,
      entryTime: Date.now(),
      status: 'active',
      history: [{
        id: Math.random().toString(36).substr(2, 9),
        stage: initialStage,
        timestamp: Date.now(),
        recordedBy: 'Sistema',
        userRole: ({} as any) // Se asignará en App.tsx
      }]
    };
    onRegister(newVehicle);
    setShowRegForm(false);
    setInputCode('');
    alert(`Entrada registrada para ${newPlate}.`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex bg-slate-200 p-1 rounded-2xl shadow-inner">
        <button className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'manual' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('manual')}>Teclado</button>
        <button className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'scan' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('scan')}>Cámara</button>
      </div>

      {mode === 'manual' ? (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-top duration-500">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Registro de Nueva Entrada</label>
          <div className="relative group">
            <input 
              type="text" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="PLACA" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-6 text-3xl font-black text-center text-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-200"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="w-full mt-6 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            CONTINUAR <i className="fas fa-chevron-right ml-2 text-[10px] opacity-50"></i>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 aspect-[4/5] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
          <div className="w-64 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-bounce mb-8"></div>
          <i className="fas fa-barcode-read text-6xl text-indigo-400 opacity-20 mb-4"></i>
          <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest text-center px-12 opacity-50">Alinea el código de barras o placa</p>
        </div>
      )}

      {showRegForm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 bg-indigo-50 border-b flex justify-between items-center">
               <h3 className="font-black text-indigo-900 text-sm">NUEVO MOVIMIENTO</h3>
               <button onClick={() => setShowRegForm(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">{newPlate}</span>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-2">Tipo de Operación Logística</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                  value={newOp}
                  onChange={(e) => setNewOp(e.target.value as OperationType)}
                >
                  {Object.values(OperationType).map(op => <option key={op} value={op}>{op}</option>)}
                </select>
              </div>
              <button onClick={handleRegister} className="w-full bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl">
                ABRIR REGISTRO EN PLANTA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerView;
