// lib/weatherService.ts

export async function fetchAndSaveWeather(city: string) {
  const today = new Date().toISOString().split('T')[0];
  const cincoSemanasAtras = new Date();
  cincoSemanasAtras.setDate(cincoSemanasAtras.getDate() - 35);
  console.log("posting and saving weathers from API...");
  const res = await fetch(`http://localhost:3000/api/v1/weathers`, {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciudad: city, start_date: cincoSemanasAtras.toISOString().split('T')[0], end_date: today }),
    });
  console.log("Fetch audits response status:", res.status);
  if (!res.ok) throw new Error("Error al obtener auditorias");
  return res.status;
}
export async function performWeatherAudit(city: string) {
  console.log("Performing weather audit from API...");
  const res = await fetch(`http://localhost:3000/api/v1/audits/weathers`, {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city })
    });
  console.log("Fetch audits response status:", res.status);
  if (!res.ok) throw new Error("Error al realizar auditoria");
  return res.json();
}