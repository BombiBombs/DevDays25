"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Wind, Droplets, Cloud, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';

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

const WeatherAuditDashboard = ({ audit }: { audit: Audit | null }) => {
  if (!audit) return null;

  const { auditId, createdAt, compliant, metadata, evidences } = audit;
  

  const avgTempNum = metadata.averageTemp || 0;
  const displayTemp = avgTempNum.toFixed(1);

  const dailyData = evidences.map(day => ({
    name: new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
    temp: parseFloat(day.temperature.toFixed(1)),
    fill: day.temperature >= 18 ? '#10b981' : '#ef4444' 
  }));

  const percentage = Math.min((avgTempNum / 40) * 100, 100);
  const strokeDasharray = `${percentage} 100`;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-background text-foreground animate-in fade-in duration-700">
      
      {/* HEADER TÉCNICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-muted pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Análisis de Integridad Térmica</h1>
          <p className="text-muted-foreground text-sm flex gap-2 items-center">
            ID: <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{auditId}</span> 
            <span>•</span> 
            <span>Semana: {metadata.weekRange}</span>
          </p>
        </div>
        
        <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-black shadow-lg border transition-all ${
          compliant 
            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
            : 'bg-red-500/10 text-red-600 border-red-500/20'
        }`}>
          {compliant ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          {compliant ? 'SISTEMA SEGURO' : 'CRÍTICO: NO CUMPLE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GAUGE DE TEMPERATURA MEDIA */}
        <Card className="flex flex-col items-center justify-center p-6 shadow-sm border-muted/50 min-h-[380px]">
          <div className="relative flex flex-col items-center justify-center">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Promedio Térmico
            </h3>
          </div>
          
          <div className="relative flex items-center justify-center">
            <svg className="size-48 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted/30" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className={`${compliant ? 'stroke-green-500' : 'stroke-red-500'} transition-all duration-1000`}
                strokeWidth="3" 
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-4xl font-black tracking-tighter text-foreground">{displayTemp}°C</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase mt-2">{metadata.ciudad}</span>
            </div>
          </div>
          
          <p className="mt-8 text-[10px] font-mono text-muted-foreground opacity-60">
            {metadata.operation}
          </p>
        </Card>

        {/* GRÁFICA DE BARRAS CON ETIQUETAS CLARAS */}
        <Card className="md:col-span-2 shadow-sm border-muted/50">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <div>
      <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
        Evolución Diaria
      </CardTitle>
      <CardDescription className="text-xs">Temperaturas exactas registradas</CardDescription>
    </div>
    <CalendarDays className="text-muted-foreground opacity-50" size={20} />
  </CardHeader>
  
  <CardContent className="h-64 pt-8">
    <ResponsiveContainer width="100%" height="100%">
      {/* 1. Ajustamos el margen izquierdo (left) para que se vea el eje */}
      <BarChart data={dailyData} margin={{ top: 25, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
        
        <XAxis 
          dataKey="name" 
          tick={{fontSize: 10, fontWeight: 700}} 
          axisLine={false} 
          tickLine={false} 
        />

        {/* 2. Mostramos el YAxis y le damos formato */}
        <YAxis 
          hide={false} // Ahora es visible
          domain={[0, 'dataMax + 5']} 
          tick={{fontSize: 10, fill: '#71717a'}} 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={(value) => `${value}°`}
        />
        <ReferenceLine 
            y={18} 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5" 
            ifOverflow="extendDomain" 
            label={{ 
                value: 'UMBRAL 18°C', 
                position: 'insideBottomRight', 
                fill: '#3b82f6', 
                fontSize: 10,
                fontWeight: 'bold',
                dy: -10 // Desplazamiento para que no pise la línea
            }} 
/>
        <Bar dataKey="temp" radius={[6, 6, 0, 0]} barSize={35}>
          <LabelList 
            dataKey="temp" 
            position="top" 
            style={{ fill: '#71717a', fontSize: '11px', fontWeight: 'bold' }} 
            formatter={(value: unknown) => {
              if (typeof value === 'number' || typeof value === 'string') {
                return `${value}°C`;
              }
              return '';
            }} 
          />
          {dailyData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
      </div>

      {/* LISTADO DE EVIDENCIAS */}
      <Card className="shadow-xl border-muted/50 overflow-hidden">
        <CardHeader className="bg-muted/20 border-b py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-xl shadow-inner">
                <Cloud className="text-primary" size={20} />
            </div>
            <div>
                <CardTitle className="text-base font-bold">Evidencias Meteorológicas</CardTitle>
                <CardDescription className="text-[10px]">Registros recuperados de la base de datos para {metadata.ciudad}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {evidences.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-5 border-b last:border-0 hover:bg-muted/30 transition-all group">
                <div className="flex gap-6 items-center">
                  <div className="text-center min-w-[50px]">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">
                      {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                    </p>
                    <p className="text-xs font-mono font-bold text-primary">
                      {new Date(day.date).getDate()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-sm group-hover:text-primary transition-colors flex items-center gap-2 text-foreground">
                      {day.temperature.toFixed(1)}°C 
                      <span className="text-[10px] font-normal text-muted-foreground">— {day.weatherStatus}</span>
                    </p>
                    <div className="flex gap-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                        day.temperature >= 18 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {day.temperature >= 18 ? 'Validado' : 'Fallo'}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><Wind size={12}/> {day.windSpeed} km/h</span>
                        <span className="flex items-center gap-1"><Droplets size={12}/> {day.precipitationSum}mm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 justify-between py-3 px-6 border-t text-[10px] text-muted-foreground">
          <span className="font-black uppercase tracking-widest">Weather Audit System</span>
          <span className="font-mono italic uppercase">TS: {new Date(createdAt).getTime()}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WeatherAuditDashboard;