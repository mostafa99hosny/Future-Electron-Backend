const express = require('express');
const reportController = require('../controllers/report.controller');

const router = express.Router();

router.get('/reportExistenceCheck/:reportId', reportController.reportExistenceCheck);

router.post('/createReport', reportController.createReport);
router.put('/addCommonFields', reportController.addCommonFields);

module.exports = router;