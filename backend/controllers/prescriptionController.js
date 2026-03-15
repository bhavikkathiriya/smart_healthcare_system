const db = require('../config/db');

// ─── CREATE PRESCRIPTION ──────────────────────────────────────────────────────
const createPrescription = async (req, res) => {
  try {
    const { patient_id, diagnosis, notes, medications } = req.body;
    const doctor_id = req.user.id;

    if (!patient_id || !diagnosis || !medications?.length)
      return res.status(400).json({ success: false, message: 'Patient, diagnosis and medications are required' });

    // Insert prescription
    const [result] = await db.query(
      'INSERT INTO prescriptions (patient_id, doctor_id, diagnosis, notes) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, diagnosis, notes || null]
    );

    // Insert each medication
    for (const med of medications) {
      await db.query(
        'INSERT INTO medications (prescription_id, name, dosage, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?)',
        [result.insertId, med.name, med.dosage, med.frequency, med.duration, med.instructions || null]
      );
    }

    res.status(201).json({ success: true, message: 'Prescription created', prescriptionId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET MY PRESCRIPTIONS (patient) ──────────────────────────────────────────
const getMyPrescriptions = async (req, res) => {
  try {
    const [prescriptions] = await db.query(`
      SELECT p.*, u.name as doctor_name
      FROM prescriptions p
      JOIN users u ON p.doctor_id = u.id
      WHERE p.patient_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    // Get medications for each prescription
    for (const rx of prescriptions) {
      const [meds] = await db.query('SELECT * FROM medications WHERE prescription_id = ?', [rx.id]);
      rx.medications = meds;
    }

    res.json({ success: true, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET PRESCRIPTIONS WRITTEN BY DOCTOR ─────────────────────────────────────
const getDoctorPrescriptions = async (req, res) => {
  try {
    const [prescriptions] = await db.query(`
      SELECT p.*, u.name as patient_name
      FROM prescriptions p
      JOIN users u ON p.patient_id = u.id
      WHERE p.doctor_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    for (const rx of prescriptions) {
      const [meds] = await db.query('SELECT * FROM medications WHERE prescription_id = ?', [rx.id]);
      rx.medications = meds;
    }

    res.json({ success: true, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createPrescription, getMyPrescriptions, getDoctorPrescriptions };
