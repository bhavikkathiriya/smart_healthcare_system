const db = require('../config/db');

// ─── CHECK SLOT AVAILABILITY ──────────────────────────────────────────────────
const checkSlotAvailability = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time)
      return res.status(400).json({ success: false, message: 'Doctor, date and time are required' });

    // Check if slot is already booked
    const [existing] = await db.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
       AND status NOT IN ('Cancelled')`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existing.length > 0) {
      // Get all booked slots for that doctor on that date
      const [bookedSlots] = await db.query(
        `SELECT appointment_time FROM appointments
         WHERE doctor_id = ? AND appointment_date = ?
         AND status NOT IN ('Cancelled')`,
        [doctor_id, appointment_date]
      );

      const bookedTimes = bookedSlots.map(s => s.appointment_time.slice(0, 5));

      // All possible slots 08:00 to 20:00 every 30 mins
      const allSlots = [];
      for (let h = 8; h <= 19; h++) {
        allSlots.push(`${String(h).padStart(2, '0')}:00`);
        allSlots.push(`${String(h).padStart(2, '0')}:30`);
      }
      allSlots.push('20:00');

      // Find free slots
      const freeSlots = allSlots.filter(s => !bookedTimes.includes(s));

      // Suggest 3 closest free slots to requested time
      const requestedMinutes =
        parseInt(appointment_time.split(':')[0]) * 60 +
        parseInt(appointment_time.split(':')[1]);

      const suggested = freeSlots
        .map(s => {
          const mins = parseInt(s.split(':')[0]) * 60 + parseInt(s.split(':')[1]);
          return { time: s, diff: Math.abs(mins - requestedMinutes) };
        })
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 3)
        .map(s => s.time);

      return res.json({
        success: false,
        available: false,
        message: `This slot (${appointment_time}) is already booked!`,
        suggestedSlots: suggested,
        bookedSlots: bookedTimes,
      });
    }

    // Slot is free
    return res.json({
      success: true,
      available: true,
      message: 'Slot is available',
    });

  } catch (err) {
    console.error('Check slot error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── BOOK APPOINTMENT ─────────────────────────────────────────────────────────
const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, type, notes } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !appointment_date || !appointment_time)
      return res.status(400).json({ success: false, message: 'Doctor, date and time are required' });

    // Double check slot is still available before booking
    const [existing] = await db.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
       AND status NOT IN ('Cancelled')`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existing.length > 0)
      return res.status(409).json({
        success: false,
        message: 'This slot was just booked by someone else. Please choose another time.',
      });

    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, type || 'Consultation', notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointmentId: result.insertId
    });
  } catch (err) {
    console.error('Book appointment error:', err);
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

module.exports = {
  checkSlotAvailability,
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments
};
