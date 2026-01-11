import Audit from "../models/audit.model.js";

const findAll = async () => {
 return await Audit.find();
};

const findByAuditId = async (auditId) => {
 return await Audit.findOne({ auditId });
};

const create = async (auditData) => {
 const audit = new Audit(auditData);
 return await audit.save();
};
const findAuditByCity = async (city) => {
 return await Audit.find({ 'metadata.ciudad': city });
}
export default {
 findAll,
 create,
 findByAuditId,
 findAuditByCity
};