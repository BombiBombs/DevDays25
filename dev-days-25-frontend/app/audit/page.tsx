"use client";
import React, { useEffect, useState } from 'react';
import { getAudits } from '@/lib/auditService';
import AuditDashboard from '@/components/AuditDashboard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuditPage = () => {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAudits();
      console.log("Audits fetched:", data);
      // Manejamos si viene un array o un objeto único
      const latestAudit = Array.isArray(data) ? data[data.length - 1] : data;
      if (!latestAudit) {
        throw new Error("No hay reportes disponibles");
      }
      
      setAuditData(latestAudit);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con la base de datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Sincronizando auditoría...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-4">
        <div className="bg-destructive/10 text-destructive p-8 rounded-2xl border border-destructive/20 max-w-sm text-center space-y-4">
          <AlertCircle className="mx-auto" size={40} />
          <h2 className="font-bold text-xl">Error de Datos</h2>
          <p className="text-sm opacity-80">{error}</p>
          <Button variant="destructive" onClick={fetchData} className="w-full">
            Reintentar conexión
          </Button>
        </div>
      </div>
    );
  }

  return <AuditDashboard auditData={auditData} />;
};

export default AuditPage;