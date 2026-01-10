"use client";

import React, { useState } from 'react';
import WeatherAuditDashboard from '@/components/WeatherAuditDashboard';
import { CitySearch } from '@/components/CitySearch';
import { AuditDropdown } from '@/components/AuditDropDown';
import { Loader2, LayoutDashboard } from 'lucide-react';

// Interfaces alineadas con tu MongoDB
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
    averageTemp: number; // Si en Mongo es string, recuerda usar parseFloat() en el dashboard
    operation: string;
  };
  evidences: Evidence[];
}

export default function AuditPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [isLoading, setIsLoading] = useState(false); // <--- Controlamos el estado global

  // Función que se ejecuta cuando el hijo recibe los datos
const handleAuditReady = (data: Audit[]) => {
  // Invertimos el array para que la semana más reciente (2026-01-04) sea la primera
  const reversedData = [...data].reverse(); 
  setAudits(reversedData);
  setSelectedAudit(reversedData[0]);
  setIsLoading(false);
};

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER AJUSTADO: items-start y py-4 para mejor alineación vertical */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="container mx-auto flex items-start justify-between px-8">
          
          {/* Logo con pequeño margen superior para nivelar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <LayoutDashboard className="text-primary-foreground" size={20} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">
              Weather<span className="text-primary">Audit</span>
            </span>
          </div>

          {/* Buscador central */}
          <div className="flex-1 max-w-md mx-8 mt-4"> {/* Bajamos un poco el buscador */}
                <CitySearch onAuditReady={handleAuditReady} onLoading={() => setIsLoading(true)} />
            </div>

          {/* Selector de historial (Alineado arriba automáticamente) */}
          <div className="flex flex-col justify-end self-end pb-1">
            {audits.length > 0 && !isLoading && (
              <AuditDropdown 
                audits={audits} 
                selectedId={selectedAudit?._id || ''} 
                onSelect={(audit) => setSelectedAudit(audit || null)} 
              />
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto mt-8 px-8">
        {/* ... (Lógica de Loader y Dashboard se mantiene igual) ... */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <div className="text-center">
               <p className="text-sm font-bold text-foreground animate-pulse uppercase tracking-widest">
                Generando Auditoría Semanal
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Consultando histórico de Open-Meteo y verificando integridad...
              </p>
            </div>
          </div>
        ) : selectedAudit ? (
          <WeatherAuditDashboard audit={selectedAudit} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-[3rem] border-muted mx-8">
            <div className="bg-muted/30 p-6 rounded-full mb-4">
              <LayoutDashboard className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-semibold text-muted-foreground">Esperando Entrada de Datos</h2>
            <p className="text-sm text-muted-foreground/60 max-w-xs text-center mt-2">
              Introduce una ciudad arriba para ejecutar el análisis de integridad de las últimas 4 semanas.
            </p>
          </div>
        )}
      </main>

      {/* FOOTER TÉCNICO */}
      {/* ... (Se mantiene igual) ... */}
    </div>
  );
}