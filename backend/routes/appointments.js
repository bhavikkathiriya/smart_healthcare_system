const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  bookAppointment,
  checkSlotAvailability,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments
} = require('../controllers/appointmentController');

router.post('/check-slot', verifyToken, checkSlotAvailability);
router.post('/', verifyToken, requireRole('patient'), bookAppointment);
router.get('/my', verifyToken, requireRole('patient'), getMyAppointments);
router.get('/doctor', verifyToken, requireRole('doctor'), getDoctorAppointments);
router.put('/:id/status', verifyToken, requireRole('doctor', 'admin'), updateAppointmentStatus);
router.get('/all', verifyToken, requireRole('admin'), getAllAppointments);

module.exports = router;