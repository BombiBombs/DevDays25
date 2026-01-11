import auditRepository from '../repositories/audit.repository.js';
import IssueRepository from '../repositories/issue.repository.js';
import weatherRepository from '../repositories/weather.repository.js';

export const getAllAudits = async () => {
    return await auditRepository.findAll();
};

export const getAuditById = async (id) => {
    return await auditRepository.findByAuditId(id);
};

export const auditIssues = async () => {
    const issues = await IssueRepository.findAll();    
    const issuesWithBugInTitle = issues.filter(issue => /bug/i.test(issue.title));
    const totalIssues = issues.length;
    const ratioWithBugInTitle = totalIssues === 0 ? 0 : issuesWithBugInTitle.length / totalIssues;
    const auditRecord = {
        auditId: `audit-${Date.now()}`,
        createdAt: new Date(),
        compliant: ratioWithBugInTitle <= 0.50,
        metadata: {
            totalIssues: totalIssues,
            issuesWithBugInTitle: issuesWithBugInTitle.length,
            ratioWithBugInTitle: ratioWithBugInTitle,
            operation: 'ratioWithBugInTitle <= 0.50'
        },
        evidences: issuesWithBugInTitle
    };
    const auditCreated = await auditRepository.create(auditRecord);
    return auditCreated;
};

export const auditWeathers = async (city) => {
    const allWeathers = await weatherRepository.findByCity(city);
    if (allWeathers.length === 0) {
        console.log("No se encontraron datos climáticos para la ciudad:", city);
        return null;
    }
    let currentIndex = 0;

    while (currentIndex < allWeathers.length && new Date(allWeathers[currentIndex].date).getDay() !== 1) {
    currentIndex++;
    }

    if (currentIndex === allWeathers.length) {
    console.log("No se encontró ningún inicio de semana (lunes) en los datos.");
    return [];
    }

    const auditsResults = [];

  // procesamos por bloques de 7 días (semanas completas)
    while (currentIndex + 6 < allWeathers.length) {
    const weeklyArray = allWeathers.slice(currentIndex, currentIndex + 7);
    
    const lastDay = new Date(weeklyArray[6].date);
    const firstDay = new Date(weeklyArray[0].date);
    
    const diffTime = Math.abs(lastDay - firstDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 6) {
        const audit = await performAudit(weeklyArray, city);
        auditsResults.push(audit);
    }
    currentIndex += 7;
    }

    return auditsResults;
};

const performAudit = async (weeklyWeathers, city) => {
    const sum = weeklyWeathers.reduce((acc, curr) => acc + curr.temperature, 0);
    const average = sum / weeklyWeathers.length;

    const auditRecord = {
        auditId: `audit-${Date.now()}`,
        createdAt: new Date(),
        compliant: average > 18,
        metadata: {
            ciudad: city,
            weekRange: `${weeklyWeathers[0].date.toISOString().split('T')[0]} / ${weeklyWeathers[6].date.toISOString().split('T')[0]}`,
            averageTemp: average,
            operation: 'average temperature > 18'
        },
        evidences: weeklyWeathers
    };
    const auditCreated = await auditRepository.create(auditRecord);
    return auditCreated;
};
const findAuditByCity = async (city) => {
 return await auditRepository.findAuditByCity(city);
}
export default {
    getAllAudits,
    getAuditById,
    auditIssues,
    auditWeathers,
    findAuditByCity
};