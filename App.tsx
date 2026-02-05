
import React, { useState, useEffect } from 'react';
import { Vehicle, OperationType, Stage, TrackingEvent, AppSettings, User, Role } from './types';
import { DEFAULT_STANDARD_TIMES, DEFAULT_STAGE_FLOWS } from './constants';
import { supabase } from './supabaseClient';
import { rowToVehicle, vehicleToRow, rowToSettings, settingsToRow } from './utils/supabaseMappers';

import Dashboard from './components/Dashboard';
import VehicleList from './components/VehicleList';
import ScannerView from './components/ScannerView';
import ReportsView from './components/ReportsView';
import VehicleDetail from './components/VehicleDetail';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

const SETTINGS_DOC_ID = 'global_settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('logitrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ 
    standardTimes: DEFAULT_STANDARD_TIMES,
    stageFlows: DEFAULT_STAGE_FLOWS,
    workspaceId: 'OPERACION_GLOBAL'
  });

  const [activeTab, setActiveTab] = useState<'scan' | 'list' | 'reports' | 'dashboard' | 'settings'>('dashboard');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'local'>('local');
  
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch inicial y suscripción a cambios en tiempo real para VEHÍCULOS
  useEffect(() => {
    if (!currentUser) return;

    const fetchVehicles = async () => {
      setSyncStatus('syncing');
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('entry_time', { ascending: false });

      if (error) {
        console.error("Error fetching vehicles:", error);
        setSyncStatus('error');
        const msg = error?.message || error?.details || "Error conectando a Supabase";
        showToast(msg.length > 80 ? msg.slice(0, 80) + "…" : msg, "error");
      } else {
        setVehicles(((data as any[]) || []).map(rowToVehicle));
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      }
    };

    fetchVehicles();

    // Realtime subscription
    const channel = supabase
      .channel('vehicles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        (payload) => {
          // Por simplicidad y seguridad de datos, recargamos la lista completa
          // En una app más grande, haríamos optimistic updates aquí
          fetchVehicles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Fetch inicial y suscripción para SETTINGS
  useEffect(() => {
    if (!currentUser) return;

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', SETTINGS_DOC_ID)
        .single();

      if (data) {
        setSettings(rowToSettings(data as any));
      } else if (!data && !error) {
        const initialSettings = {
          standardTimes: DEFAULT_STANDARD_TIMES,
          stageFlows: DEFAULT_STAGE_FLOWS,
          workspaceId: 'OPERACION_GLOBAL'
        };
        await supabase.from('settings').insert(settingsToRow({ ...initialSettings, id: SETTINGS_DOC_ID }));
        setSettings(initialSettings);
      }
    };

    fetchSettings();

    const channel = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
             if (payload.new) setSettings(rowToSettings(payload.new as any));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('logitrack_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('logitrack_user');
  };

  const addVehicle = async (newVehicle: Vehicle) => {
    if (!currentUser) return;
    
    setSyncStatus('syncing');
    try {
      newVehicle.history[0].recordedBy = currentUser.name;
      newVehicle.history[0].userRole = currentUser.role;

      const { error } = await supabase
        .from('vehicles')
        .insert(vehicleToRow(newVehicle));

      if (error) throw error;

      showToast(`Vehículo ${newVehicle.licensePlate} guardado en Supabase`);
      setSyncStatus('synced');
    } catch (e: any) {
      console.error("Add error:", e);
      setSyncStatus('error');
      showToast("Error al guardar en base de datos", 'error');
    }
  };

  const updateVehicleStage = async (vehicleId: string, nextStage: Stage, delayReason?: string, extraData?: any) => {
    if (!currentUser) return;
    
    setSyncStatus('syncing');
    try {
      // Primero obtenemos el estado actual para añadir al historial
      const { data: currentData, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
      
      if (fetchError || !currentData) throw new Error("No se encontró el vehículo");

      const v = rowToVehicle(currentData as any);
      const newEvent: TrackingEvent = {
        id: Math.random().toString(36).substr(2, 9),
        stage: nextStage,
        timestamp: Date.now(),
        recordedBy: currentUser.name,
        userRole: currentUser.role,
        delayReason,
        extraData
      };
      
      const flow = settings.stageFlows[v.operation];
      const isLastStage = nextStage === flow[flow.length - 1];

      const updates: Record<string, unknown> = {
        current_stage: nextStage,
        history: [...v.history, newEvent],
        status: isLastStage ? 'completed' : 'active',
        exit_time: isLastStage ? Date.now() : (v.exitTime ?? null),
      };
      if (extraData?.maneuverType) updates.maneuver_type = extraData.maneuverType;
      if (extraData?.productName) updates.product_name = extraData.productName;
      if (extraData?.entityName) updates.entity_name = extraData.entityName;
      if (extraData?.targetQuantity) updates.target_quantity = Number(extraData.targetQuantity);
      if (extraData?.shippedWeight) updates.shipped_weight = Number(extraData.shippedWeight);
      if (extraData?.netWeight) updates.net_weight = Number(extraData.netWeight);

      const { error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', vehicleId);

      if (error) throw error;
      showToast(`Etapa actualizada: ${nextStage}`);
      setSyncStatus('synced');
    } catch (e: any) {
      console.error("Update error:", e);
      setSyncStatus('error');
      showToast("Error de conexión con Supabase", 'error');
    }
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    try {
      const settingsToSave = { ...newSettings, id: SETTINGS_DOC_ID };
      const { error } = await supabase
        .from('settings')
        .upsert(settingsToRow(settingsToSave));

      if (error) throw error;
      showToast("Configuración guardada en Cloud");
    } catch (e: any) {
      console.error("Settings error:", e);
      showToast("Error guardando ajustes", 'error');
    }
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 flex flex-col max-w-lg mx-auto border-x border-slate-200 shadow-xl overflow-hidden relative">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 rounded-xl w-10 h-10 flex items-center justify-center border border-emerald-400 shadow-inner">
            <i className="fas fa-truck-moving"></i>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-white">Quimicos del <span className="text-emerald-200">Cauca</span></h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[8px] bg-emerald-900/40 px-1.5 py-0.5 rounded font-black tracking-widest uppercase max-w-[150px] truncate">SUPABASE SYSTEM</span>
              <div className={`w-2 h-2 rounded-full ${
                syncStatus === 'syncing' ? 'bg-amber-400 animate-pulse' : 
                syncStatus === 'synced' ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 
                syncStatus === 'error' ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-slate-400'
              }`}></div>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex flex-col items-end group">
           <span className="text-[10px] font-black text-emerald-100 uppercase">{currentUser.name.split(' ')[0]}</span>
           <div className="flex items-center gap-1">
             <i className={`fas ${
               syncStatus === 'synced' ? 'fa-database' : 
               syncStatus === 'syncing' ? 'fa-sync fa-spin' : 
               syncStatus === 'error' ? 'fa-exclamation-triangle text-red-300' : 'fa-database'
             } text-[8px] opacity-70`}></i>
             <span className="text-[8px] text-emerald-200/60 font-bold italic">{currentUser.role}</span>
           </div>
        </button>
      </header>

      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300 ${toast.type === 'success' ? 'bg-slate-800 text-green-400' : 'bg-red-600 text-white'}`}>
           <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
           <span className="text-xs font-black tracking-wide">{toast.message}</span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard vehicles={vehicles} onSelectVehicle={setSelectedVehicle} lastSync={lastSyncTime} />}
        {activeTab === 'scan' && <ScannerView vehicles={vehicles} settings={settings} onRegister={addVehicle} />}
        {activeTab === 'list' && <VehicleList vehicles={vehicles} onSelect={setSelectedVehicle} />}
        {activeTab === 'reports' && <ReportsView vehicles={vehicles} />}
        {activeTab === 'settings' && (
          <SettingsView 
            settings={settings} 
            onUpdate={handleUpdateSettings} 
            onLogout={handleLogout} 
            user={currentUser} 
            hasSyncError={syncStatus === 'error'}
          />
        )}
      </main>

      {selectedVehicle && (
        <VehicleDetail 
          vehicle={selectedVehicle} 
          settings={settings}
          onClose={() => setSelectedVehicle(null)} 
          onUpdateStage={updateVehicleStage}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 grid grid-cols-5 p-2 z-50 max-w-lg mx-auto shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="fas fa-grid-horizontal" label="Terminal" />
        <NavButton active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} icon="fas fa-plus-circle" label="Nuevo" />
        <NavButton active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon="fas fa-truck-ramp-box" label="En Planta" />
        <NavButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon="fas fa-chart-simple" label="Data" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon="fas fa-sliders" label="Ajustes" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center py-1 transition-all ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
    <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-emerald-50 shadow-sm scale-110' : ''}`}>
      <i className={`${icon} text-lg`}></i>
    </div>
    <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;
