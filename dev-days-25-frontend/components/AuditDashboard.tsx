"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ExternalLink, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface Evidence {
  issueId: number;
  number: number;
  title: string;
  url: string;
  state: string;
}

interface AuditData {
  auditId: string;
  createdAt: string;
  compliant: boolean;
  metadata: {
    totalIssues: number;
    issuesWithBugInTitle: number;
    ratioWithBugInTitle: number;
    operation: string;
  };
  evidences: Evidence[];
}

const AuditDashboard = ({ auditData }: { auditData: AuditData | null }) => {
  if (!auditData) return null;

  const { metadata, compliant, auditId, createdAt, evidences } = auditData;

  // Datos para la gráfica de barras
  const chartData = [
    { name: 'Total Issues', value: metadata.totalIssues, fill: '#8884d8' },
    { name: 'Bugs Detectados', value: metadata.issuesWithBugInTitle, fill: '#f97316' },
  ];

  // Cálculo para el Gauge circular
  const percentage = Math.min(metadata.ratioWithBugInTitle * 100, 100);
  const strokeDasharray = `${percentage} 100`;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 bg-background text-foreground animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análisis de Integridad</h1>
          <p className="text-muted-foreground text-sm">
            Auditoría <span className="font-mono bg-muted px-1 rounded">{auditId}</span> • {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-black shadow-lg ${
          compliant 
            ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
            : 'bg-red-500/10 text-red-600 border border-red-500/20'
        }`}>
          {compliant ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          {compliant ? 'SISTEMA SEGURO' : 'CRÍTICO: NO CUMPLE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GAUGE CIRCULAR (Ratio) */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <CardHeader className="p-0 pb-4 w-full flex flex-col items-center justify-center">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center w-full">
              Ratio de Error
            </CardTitle>
          </CardHeader>
          <div className="relative size-40">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className={`${metadata.ratioWithBugInTitle > 0.5 ? 'stroke-red-500' : 'stroke-green-500'} transition-all duration-1000`}
                strokeWidth="3" 
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">{percentage.toFixed(1)}%</span>
              <span className="text-[10px] text-muted-foreground uppercase">Impacto</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold text-muted-foreground">{metadata.operation}</p>
        </Card>

        {/* GRÁFICA DE BARRAS COMPARATIVA */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Distribución de Issues</CardTitle>
              <CardDescription>Comparativa entre total y volumen de bugs</CardDescription>
            </div>
            <BarChart3 className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent className="h-48 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* LISTADO DE EVIDENCIAS (Manteniendo tu estilo limpio) */}
      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <PieChartIcon className="text-primary" size={20} />
            </div>
            <div>
                <CardTitle>Evidencias Técnicas</CardTitle>
                <CardDescription>Filtro aplicado: Issues que contienen [Bug] en el título</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {evidences && evidences.length > 0 ? (
              evidences.map((issue) => (
                <div key={issue.issueId} className="flex items-center justify-between p-5 border-b last:border-0 hover:bg-accent/30 transition-all group">
                  <div className="flex gap-4 items-center">
                    <span className="text-xs font-mono bg-muted p-1 rounded text-muted-foreground">#{issue.number}</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{issue.title}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold uppercase">Reportado como Bug</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary hover:text-white rounded-full">
                    <a href={issue.url} target="_blank" rel="noreferrer">
                      <ExternalLink size={14} />
                    </a>
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-muted-foreground italic">
                <CheckCircle2 size={40} className="mb-2 text-green-500 opacity-20" />
                No se han detectado anomalías.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 justify-between py-3 text-[10px] text-muted-foreground">
          <span>SISTEMA DE AUDITORÍA v1.0.2</span>
          <span className="font-mono italic uppercase">Timestamp: {new Date(createdAt).getTime()}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuditDashboard;