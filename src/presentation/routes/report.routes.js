const express = require('express');
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../../application/middleware/authMiddleware')

const router = express.Router();

router.get('/reportExistenceCheck/:reportId', authMiddleware, reportController.reportExistenceCheck);

router.post('/createReport', reportController.createReport);
router.put('/addCommonFields', reportController.addCommonFields);

module.exports = router;