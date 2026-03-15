const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAllDoctors, getDoctorProfile, getMyPatients } = require('../controllers/doctorController');

router.get('/', verifyToken, getAllDoctors);
router.get('/profile', verifyToken, requireRole('doctor'), getDoctorProfile);
router.get('/patients', verifyToken, requireRole('doctor'), getMyPatients);

module.exports = router;