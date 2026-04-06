const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    // Find user by email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const user = rows[0];

    // Check if account is active
    if (user.status === 'pending')
      return res.status(403).json({ success: false, message: 'Your account is pending admin approval' });

    if (user.status === 'rejected')
      return res.status(403).json({ success: false, message: 'Your account has been rejected' });

    if (user.status === 'inactive')
      return res.status(403).json({ success: false, message: 'Your account is inactive' });

    // For doctors, check approval status
    if (user.role === 'doctor') {
      const [docRows] = await db.query(
        'SELECT approval_status FROM doctor_profiles WHERE user_id = ?', [user.id]
      );
      if (docRows.length > 0 && docRows[0].approval_status !== 'approved')
        return res.status(403).json({ success: false, message: 'Your doctor account is pending admin approval' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── REGISTER PATIENT ─────────────────────────────────────────────────────────
const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, date_of_birth, gender, blood_group } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    // Check if email exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate avatar initials
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // Insert user
    const [result] = await db.query(
    'INSERT INTO users (name, email, password, role, status, avatar, phone, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, 'patient', 'active', avatar, phone || null, city || null, 'Gujarat']
    );

    // Insert patient profile
    await db.query(
      'INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_group) VALUES (?, ?, ?, ?)',
      [result.insertId, date_of_birth || null, gender || null, blood_group || null]
    );

    res.status(201).json({ success: true, message: 'Patient registered successfully. You can now login.' });

  } catch (err) {
    console.error('Register patient error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── REGISTER DOCTOR (pending approval) ──────────────────────────────────────
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialty, experience, qualification, license_number, city } = req.body;

    if (!name || !email || !password || !specialty || !license_number)
      return res.status(400).json({ success: false, message: 'Name, email, password, specialty and license number are required' });

    // Check if email exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // Insert user with pending status
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, status, avatar, phone, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'doctor', 'pending', avatar, phone || null, city || null, 'Gujarat']
    );

    // Insert doctor profile with pending approval
    await db.query(
      'INSERT INTO doctor_profiles (user_id, specialty, experience, qualification, license_number, approval_status) VALUES (?, ?, ?, ?, ?, ?)',
      [result.insertId, specialty, experience || null, qualification || null, license_number, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted. Please wait for admin approval before logging in.'
    });

  } catch (err) {
    console.error('Register doctor error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, status, avatar, phone FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login, registerPatient, registerDoctor, getMe };
