const db = require('../config/db');

// ─── BOOK APPOINTMENT ─────────────────────────────────────────────────────────
const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, type, notes } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !appointment_date || !appointment_time)
      return res.status(400).json({ success: false, message: 'Doctor, date and time are required' });

    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, type || 'Consultation', notes || null]
    );

    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointmentId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET MY APPOINTMENTS (patient) ───────────────────────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, u.name as doctor_name, dp.specialty
      FROM appointments a
      JOIN users u ON a.doctor_id = u.id
      JOIN doctor_profiles dp ON u.id = dp.user_id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [req.user.id]);

    res.json({ success: true, appointments: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET DOCTOR APPOINTMENTS ──────────────────────────────────────────────────
const getDoctorAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, u.name as patient_name, u.phone as patient_phone
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [req.user.id]);

    res.json({ success: true, appointments: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── UPDATE APPOINTMENT STATUS ────────────────────────────────────────────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET ALL APPOINTMENTS (admin) ─────────────────────────────────────────────
const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*,
             p.name as patient_name,
             d.name as doctor_name,
             dp.specialty
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN users d ON a.doctor_id = d.id
      JOIN doctor_profiles dp ON d.id = dp.user_id
      ORDER BY a.appointment_date DESC
    `);
    res.json({ success: true, appointments: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { bookAppointment, getMyAppointments, getDoctorAppointments, updateAppointmentStatus, getAllAppointments };
