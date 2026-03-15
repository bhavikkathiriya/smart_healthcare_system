const express = require('express');
const router = express.Router();
const { login, registerPatient, registerDoctor, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/register/patient', registerPatient);
router.post('/register/doctor', registerDoctor);
router.get('/me', verifyToken, getMe);

module.exports = router;