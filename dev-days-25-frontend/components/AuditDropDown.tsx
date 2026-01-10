"use client";
import React from 'react';
import 'dayjs/locale/es'; // Para que los meses salgan en español si quieres

// 1. Sincronizamos con el modelo real de tu MongoDB
interface Evidence {
  city: string;
  date: string;
  temperature: number;
  weatherStatus: string;
  precipitationSum: number;
  windSpeed: number;
  cloudCoverage: number;
}

interface Audit {
  _id: string;
  auditId: string;
  createdAt: string;
  compliant: boolean;
  metadata: {
    ciudad: string;
    weekRange: string;
    averageTemp: number;
    operation: string;
  };
  evidences: Evidence[];
}

interface AuditDropdownProps {
  audits: Audit[];
  onSelect: (audit: Audit | undefined) => void;
  selectedId: string;
}

export const AuditDropdown: React.FC<AuditDropdownProps> = ({ audits, onSelect, selectedId }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">
        Historial de Auditorías
      </label>
      
      <div className="relative group">
        <select 
          value={selectedId}
          onChange={(e) => {
            const audit = audits.find(a => a._id === e.target.value);
            onSelect(audit);
          }}
          className="w-full bg-zinc-900 text-zinc-100 border border-zinc-800 p-3.5 rounded-2xl outline-none hover:border-zinc-700 cursor-pointer appearance-none text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20"
        >
          {audits.map((audit, index) => (
            <option key={audit._id} value={audit._id} className="bg-zinc-900 py-2">
              {/* Usamos el weekRange que ya viene calculado del backend para máxima coherencia */}
              Semana {index === 0 ? '(Anterior)' : index + 1}: {audit.metadata.weekRange} 
              {audit.compliant ? ' — ✅ PASADA' : ' — ❌ FALLIDA'}
            </option>
          ))}
        </select>
        
        {/* Pequeña flecha decorativa ya que quitamos la original con appearance-none */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};