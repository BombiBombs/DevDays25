// lib/auditService.ts
export async function getAudits() {
  console.log("Fetching audits from API...");
  const res = await fetch("http://localhost:3000/api/v1/audits", { cache: "no-store" });
  console.log("Fetch audits response status:", res.status);
  if (!res.ok) throw new Error("Error al obtener auditorias");
  return res.json();
}