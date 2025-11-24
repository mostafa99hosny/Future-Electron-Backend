const { createReportUC } = require('../../application/services/report/uploadAssetsToDB.uc');
const { reportExistenceCheckUC } = require('../../application/services/report/reportExistenceCheck.uc');
const { addCommonFields } = require('../../application/services/report/addCommonFields.uc');

const reportController = {
    async createReport(req, res) {
        try {
            const { reportId, reportData } = req.body;
            const { success, message, data } = await createReportUC(reportId, reportData);

            if (success) {
                res.status(200).json({ success, message, data });
            } else {
                res.status(500).json({ success, message, data });
            }
        } catch (error) {
            console.error('Error creating report:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async reportExistenceCheck(req, res) {
        try {
            const { reportId } = req.params;
            const { success, message, data } = await reportExistenceCheckUC(reportId);

            if (success) {
                console.log("Success", success, "message", message, "data", data);
                res.status(200).json({ success, message });
            } else if (message === 'Report does not exist') {
                res.status(200).json({ success, message });
            } else {
                console.log("Success", success, "message", message, "data", data);
                res.status(500).json({ success, message });
            }
        } catch (error) {
            console.error('Error checking report existence:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async addCommonFields(req, res) {
        try {
            const { reportId, region, city, inspectionDate } = req.body;
            const { success, message, data } = await addCommonFields(reportId, region, city, inspectionDate);

            if (success) {
                res.status(200).json({ success, message, data });
            } else {
                res.status(500).json({ success, message, data });
            }
        } catch (error) {
            console.error('Error adding common fields:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = reportController;