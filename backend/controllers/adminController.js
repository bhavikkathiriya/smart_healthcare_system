const db = require('../config/db');

// ─── GET ALL PENDING DOCTORS ──────────────────────────────────────────────────
const getPendingDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at,
             dp.specialty, dp.experience, dp.qualification, dp.license_number, dp.approval_status
      FROM users u
      JOIN doctor_profiles dp ON u.id = dp.user_id
      WHERE dp.approval_status = 'pending'
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, doctors: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── APPROVE DOCTOR ───────────────────────────────────────────────────────────
const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Update doctor profile
    await db.query(
      'UPDATE doctor_profiles SET approval_status = ?, approved_by = ?, approved_at = NOW() WHERE user_id = ?',
      ['approved', req.user.id, doctorId]
    );

    // Update user status to active
    await db.query('UPDATE users SET status = ? WHERE id = ?', ['active', doctorId]);

    res.json({ success: true, message: 'Doctor approved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── REJECT DOCTOR ────────────────────────────────────────────────────────────
const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { reason } = req.body;

    await db.query(
      'UPDATE doctor_profiles SET approval_status = ? WHERE user_id = ?',
      ['rejected', doctorId]
    );

    await db.query('UPDATE users SET status = ? WHERE id = ?', ['rejected', doctorId]);

    res.json({ success: true, message: 'Doctor rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET ALL DOCTORS ──────────────────────────────────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at,
             dp.specialty, dp.experience, dp.qualification, dp.rating, dp.total_patients, dp.approval_status
      FROM users u
      JOIN doctor_profiles dp ON u.id = dp.user_id
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, doctors: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET ALL PATIENTS ─────────────────────────────────────────────────────────
const getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.status, u.city, u.state, u.created_at,
       pp.date_of_birth, pp.gender, pp.blood_group
      FROM users u
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      WHERE u.role = 'patient'
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, patients: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET DASHBOARD STATS ──────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalDoctors }]] = await db.query('SELECT COUNT(*) as totalDoctors FROM users WHERE role = "doctor" AND status = "active"');
    const [[{ totalPatients }]] = await db.query('SELECT COUNT(*) as totalPatients FROM users WHERE role = "patient"');
    const [[{ totalAppointments }]] = await db.query('SELECT COUNT(*) as totalAppointments FROM appointments');
    const [[{ pendingDoctors }]] = await db.query('SELECT COUNT(*) as pendingDoctors FROM doctor_profiles WHERE approval_status = "pending"');

    res.json({
      success: true,
      stats: { totalDoctors, totalPatients, totalAppointments, pendingDoctors }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── DEACTIVATE USER ──────────────────────────────────────────────────────────
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query('UPDATE users SET status = "inactive" WHERE id = ?', [userId]);
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



module.exports = { getPendingDoctors, approveDoctor, rejectDoctor, getAllDoctors, getAllPatients, getDashboardStats, deactivateUser };
