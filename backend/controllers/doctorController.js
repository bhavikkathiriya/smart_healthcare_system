const db = require('../config/db');

// ─── GET ALL APPROVED DOCTORS ─────────────────────────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.avatar,
             dp.specialty, dp.experience, dp.rating, dp.total_patients
      FROM users u
      JOIN doctor_profiles dp ON u.id = dp.user_id
      WHERE u.status = 'active' AND dp.approval_status = 'approved'
      ORDER BY dp.rating DESC
    `);
    res.json({ success: true, doctors: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET DOCTOR PROFILE ───────────────────────────────────────────────────────
const getDoctorProfile = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.avatar,
             dp.specialty, dp.experience, dp.qualification, dp.rating, dp.total_patients
      FROM users u
      JOIN doctor_profiles dp ON u.id = dp.user_id
      WHERE u.id = ?
    `, [req.user.id]);

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Doctor not found' });

    res.json({ success: true, doctor: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET DOCTOR PATIENTS ──────────────────────────────────────────────────────
const getMyPatients = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT u.id, u.name, u.email, u.phone,
             pp.blood_group, pp.gender,
             COUNT(a.id) as total_appointments
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      WHERE a.doctor_id = ?
      GROUP BY u.id
    `, [req.user.id]);

    res.json({ success: true, patients: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllDoctors, getDoctorProfile, getMyPatients };
