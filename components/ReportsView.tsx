
import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { analyzeBottlenecks } from '../geminiService';

interface ReportsViewProps {
  vehicles: Vehicle[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ vehicles }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [reportType, setReportType] = useState<'product' | 'entity'>('product');
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('day');

  const filteredVehicles = useMemo(() => {
    const now = new Date();
    return vehicles.filter(v => {
      const entry = new Date(v.entryTime);
      if (timeframe === 'day') return entry.toDateString() === now.toDateString();
      if (timeframe === 'month') return entry.getMonth() === now.getMonth() && entry.getFullYear() === now.getFullYear();
      if (timeframe === 'year') return entry.getFullYear() === now.getFullYear();
      return true;
    });
  }, [vehicles, timeframe]);

  const loadData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredVehicles.forEach(v => {
      const key = reportType === 'product' ? (v.productName || 'Sin Definir') : (v.entityName || 'Sin Definir');
      const val = v.netWeight || v.shippedWeight || v.targetQuantity || 0;
      counts[key] = (counts[key] || 0) + Number(val);
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [filteredVehicles, reportType]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeBottlenecks(vehicles);
    setAiInsight(result);
    setIsAnalyzing(false);
  };

  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center">
            <i className="fas fa-boxes text-indigo-500 mr-2"></i> Análisis de Carga
          </h3>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {(['day', 'month', 'year'] as const).map(t => (
              <button key={t} onClick={() => setTimeframe(t)} className={`px-2 py-1 rounded text-[10px] font-bold ${timeframe === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                {t === 'day' ? 'Día' : t === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setReportType('product')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${reportType === 'product' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white text-slate-400 border-slate-100'}`}>
            Producto / Material
          </button>
          <button onClick={() => setReportType('entity')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${reportType === 'entity' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white text-slate-400 border-slate-100'}`}>
            Cliente / Proveedor
          </button>
        </div>

        <div className="h-64 w-full">
          {loadData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {loadData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center flex-col text-slate-300">
              <i className="fas fa-folder-open text-4xl mb-2"></i>
              <p className="text-xs">No hay datos para este periodo</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-black text-lg">Diagnóstico IA</h3>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">Resumen de Operación</p>
          </div>
          <i className="fas fa-microchip text-2xl opacity-30"></i>
        </div>

        {aiInsight ? (
          <div className="space-y-4 animate-in fade-in zoom-in">
            <p className="text-xs leading-relaxed italic border-l-2 border-indigo-400 pl-3">{aiInsight.insights}</p>
            <button onClick={() => setAiInsight(null)} className="w-full bg-white/10 py-2 rounded-xl text-[10px] font-bold">Nuevo Análisis</button>
          </div>
        ) : (
          <button onClick={handleAiAnalysis} disabled={isAnalyzing} className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95">
            {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : 'GENERAR DIAGNÓSTICO'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
