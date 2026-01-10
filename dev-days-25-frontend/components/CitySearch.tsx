"use client";

import React, { useState } from 'react';
import { fetchAndSaveWeather, performWeatherAudit } from '@/lib/weatherService';
import { Search, Loader2 } from 'lucide-react';
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
interface CitySearchProps {
  onAuditReady: (data: Audit[]) => void;
  onLoading: (isLoading: boolean) => void; // Para avisar al padre
}

export const CitySearch: React.FC<CitySearchProps> = ({ onAuditReady, onLoading }) => {
  const [city, setCity] = useState("");
  const [isInnerLoading, setIsInnerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    // 1. Iniciamos estados de carga
    setIsInnerLoading(true);
    onLoading(true); 
    setError(null);

    try {
      // 2. Primer paso: Fetch y guardado en DB (Métricas de Weather)
      console.log(`Iniciando captura de datos para: ${city}`);
      await fetchAndSaveWeather(city);

      // 3. Segundo paso: Ejecutar lógica de auditoría
      console.log(`Ejecutando auditoría de integridad...`);
      const auditsData = await performWeatherAudit(city);

      // 4. Enviamos los resultados al padre (page.tsx)
      onAuditReady(auditsData);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en la conexión con el servidor';
      setError(msg);
      onLoading(false); // Si hay error, quitamos el loading para que no se quede bloqueado
    } finally {
      setIsInnerLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit} 
        className="flex gap-3 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300"
      >
        <div className="flex items-center pl-4 text-zinc-500">
          <Search size={18} />
        </div>
        
        <input
          className="bg-transparent py-2 flex-1 outline-none text-sm text-zinc-100 placeholder:text-zinc-600 font-medium"
          placeholder="Nombre de la ciudad..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isInnerLoading}
        />

        <button 
          type="submit"
          disabled={isInnerLoading || !city} 
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          {isInnerLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Audita...
            </>
          ) : (
            'Auditar'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-top-1">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">
            System_Error: {error}
          </span>
        </div>
      )}
    </div>
  );
};