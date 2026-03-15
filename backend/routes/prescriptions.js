const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { createPrescription, getMyPrescriptions, getDoctorPrescriptions } = require('../controllers/prescriptionController');

router.post('/', verifyToken, requireRole('doctor'), createPrescription);
router.get('/my', verifyToken, requireRole('patient'), getMyPrescriptions);
router.get('/doctor', verifyToken, requireRole('doctor'), getDoctorPrescriptions);

module.exports = router;