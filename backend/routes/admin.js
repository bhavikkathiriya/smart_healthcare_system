const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  getPendingDoctors, approveDoctor, rejectDoctor,
  getAllDoctors, getAllPatients, getDashboardStats, deactivateUser
} = require('../controllers/adminController');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/stats', getDashboardStats);
router.get('/doctors', getAllDoctors);
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:doctorId/approve', approveDoctor);
router.put('/doctors/:doctorId/reject', rejectDoctor);
router.get('/patients', getAllPatients);
router.put('/users/:userId/deactivate', deactivateUser);

module.exports = router;