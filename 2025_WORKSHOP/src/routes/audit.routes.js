import { Router } from "express";
import { getAllAudits, getAuditById, auditIssues, auditWeathers, findAuditByCity, getAllIssuesAudits } from "../controllers/audit.controller.js";

const auditRouter = Router();


auditRouter.get('/audits/issues', getAllIssuesAudits);
auditRouter.get('/audits/city/:city', findAuditByCity);
auditRouter.get('/audits/:auditId', getAuditById);
auditRouter.post('/audits/issues', auditIssues);
auditRouter.post('/audits/weathers', auditWeathers);
auditRouter.get('/audits', getAllAudits);
export { auditRouter };