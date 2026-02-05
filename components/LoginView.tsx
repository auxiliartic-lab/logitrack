
import React, { useState } from 'react';
import { User, Role } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.YARD);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Por favor, ingresa tu nombre");
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      role
    });
  };

  const roles = [
    { type: Role.YARD, icon: 'fa-clipboard-check', color: 'bg-blue-500' },
    { type: Role.SCALE, icon: 'fa-weight-hanging', color: 'bg-emerald-500' },
    { type: Role.DOCS, icon: 'fa-file-invoice', color: 'bg-amber-500' },
    { type: Role.ADMIN, icon: 'fa-user-shield', color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 bg-indigo-700 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
            <i className="fas fa-truck-fast text-4xl"></i>
          </div>
          <h1 className="text-2xl font-black">Quimicos del Cauca</h1>
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">Terminal Multiusuario</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nombre del Operador</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3">Tu Rol en Planta</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => setRole(r.type)}
                  className={`flex items-center p-3 rounded-2xl border-2 transition-all ${role === r.type ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-white opacity-60'}`}
                >
                  <div className={`w-8 h-8 ${r.color} rounded-lg flex items-center justify-center text-white mr-3 shadow-sm`}>
                    <i className={`fas ${r.icon} text-xs`}></i>
                  </div>
                  <span className={`text-[10px] font-black leading-tight ${role === r.type ? 'text-indigo-900' : 'text-slate-500'}`}>{r.type}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-800 transition-all active:scale-95 flex items-center justify-center"
          >
            INGRESAR A LA TERMINAL <i className="fas fa-arrow-right ml-3"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
