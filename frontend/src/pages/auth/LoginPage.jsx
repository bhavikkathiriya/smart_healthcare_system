
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, Heart, User, Stethoscope, Shield } from 'lucide-react';

const roles = [
  { id: 'patient', label: 'Patient', icon: User, color: 'text-teal-600' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-primary-600' },
  { id: 'admin', label: 'Admin', icon: Shield, color: 'text-purple-600' },
];

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register-patient' | 'register-doctor'
  const [role, setRole] = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields (shared)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Patient extra
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  // Doctor extra
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [city, setCity] = useState('');

  const { login, registerPatient, registerDoctor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // ─── HANDLE LOGIN ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(role, email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(`/${role}`);
    } else {
      toast.error(result.error);
    }
  };

  // ─── HANDLE REGISTER PATIENT ─────────────────────────────────────────────────
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await registerPatient({
      name: regName, email: regEmail, password: regPassword,
      phone: regPhone, date_of_birth: dob, gender, blood_group: bloodGroup,
      city,
    });
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      setMode('login');
      setRole('patient');
    } else {
      toast.error(result.message);
    }
  };

  // ─── HANDLE REGISTER DOCTOR ──────────────────────────────────────────────────
  const handleRegisterDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await registerDoctor({
      name: regName, email: regEmail, password: regPassword,
      phone: regPhone, specialty, experience, qualification, license_number: licenseNumber,
      city,
    });
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      setMode('login');
    } else {
      toast.error(result.message);
    }
  };

  const handleSendOTP = async () => {
    if (!regEmail || !regName) {
      toast.error('Please enter name and email first');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, name: regName }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Cannot connect to server');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
  if (!otp || otp.length !== 4) {
    toast.error('Please enter 4 digit OTP');
    return;
  }
  setOtpLoading(true);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regEmail, otp }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Email verified! ✅');
      setOtpVerified(true);
    } else {
      toast.error(data.message);
    }
  } catch {
    toast.error('Cannot connect to server');
  } finally {
    setOtpLoading(false);
  }
};

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#ffffff15] bg-white dark:bg-[#16161f] text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-primary-400 transition-all placeholder-slate-400 dark:placeholder-slate-600";
  const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-[#07070d] dark:via-[#0a0a10] dark:to-[#07070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">MediCare Pro</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Smart Healthcare Management</p>
        </div>

        <div className="bg-white dark:bg-[#0d0d14] rounded-3xl shadow-xl border border-slate-100 dark:border-[#ffffff08] p-8">

          {/* ── LOGIN FORM ─────────────────────────────────────────────────── */}
          {mode === 'login' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Welcome back</h2>

              {/* Role selector */}
              <div className="flex gap-2 mb-6 bg-slate-50 dark:bg-[#16161f] p-1.5 rounded-2xl">
                {roles.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setRole(id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all
                      ${role === id ? 'bg-white dark:bg-[#0d0d14] shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password" className={inputClass} required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Register links */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#ffffff08] text-center space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Don't have an account?</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setMode('register-patient')}
                    className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                    Register as Patient
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button onClick={() => setMode('register-doctor')}
                    className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                    Register as Doctor
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── REGISTER PATIENT FORM ──────────────────────────────────────── */}
          {mode === 'register-patient' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setMode('login')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm">← Back</button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Patient Registration</h2>
              </div>

              <form onSubmit={handleRegisterPatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                      placeholder="John Doe" className={inputClass} required />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      placeholder="john@example.com" className={inputClass} required />
                  </div>

                  {/* OTP Section */}
                  {!otpVerified ? (
                    <div className="col-span-2">
                      {!otpSent ? (
                        <button type="button" onClick={handleSendOTP} disabled={otpLoading || !regEmail || !regName}
                          className="w-full py-2.5 rounded-xl border-2 border-primary-400 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all disabled:opacity-50">
                          {otpLoading ? 'Sending OTP...' : '📧 Send OTP to Email'}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <label className={labelClass}>Enter OTP *</label>
                          <div className="flex gap-2">
                            <input type="text" value={otp} onChange={e => setOtp(e.target.value.slice(0, 4))}
                              placeholder="4 digit OTP" maxLength={4}
                              className={inputClass + ' text-center text-xl font-bold tracking-widest'} />
                            <button type="button" onClick={handleVerifyOTP} disabled={otpLoading}
                              className="px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-50">
                              {otpLoading ? '...' : 'Verify'}
                            </button>
                          </div>
                          <button type="button" onClick={handleSendOTP} disabled={otpLoading}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                            Resend OTP
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="col-span-2 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3">
                      <span className="text-emerald-500 text-lg">✅</span>
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Email verified successfully!</span>
                    </div>
                  )}

                  <div className="col-span-2">
                    <label className={labelClass}>Password *</label>
                    <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters" className={inputClass} required minLength={6} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>City</label>
                    <select value={city} onChange={e => setCity(e.target.value)} className={inputClass}>
                      <option value="">Select City</option>
                      {['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar',
                        'Gandhinagar','Junagadh','Anand','Nadiad','Mehsana','Morbi',
                        'Bhuj','Surendranagar','Amreli','Bharuch'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={loading || !otpVerified}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {loading ? 'Registering...' : 'Create Patient Account'}
                </button>
              </form>
            </>
          )}

          {/* ── REGISTER DOCTOR FORM ───────────────────────────────────────── */}
          {mode === 'register-doctor' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => {
                    setMode('login');
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp('');
                  }} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm"
                >
                  ← Back
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Doctor Registration</h2>
              </div>

              {/* Pending approval notice */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 mb-4 flex gap-2">
                <span className="text-amber-600 dark:text-amber-400 text-lg">⚠️</span>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Doctor registrations require <strong>admin approval</strong> before you can login. You'll be notified once approved.
                </p>
              </div>

              <form onSubmit={handleRegisterDoctor} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                      placeholder="Dr. John Smith" className={inputClass} required />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      placeholder="doctor@hospital.com" className={inputClass} required />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Password *</label>
                    <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters" className={inputClass} required minLength={6} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>City</label>
                    <select value={city} onChange={e => setCity(e.target.value)} className={inputClass}>
                      <option value="">Select City</option>
                      {['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar',
                        'Gandhinagar','Junagadh','Anand','Nadiad','Mehsana','Morbi',
                        'Bhuj','Surendranagar','Amreli','Bharuch'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Specialty *</label>
                    <select value={specialty} onChange={e => setSpecialty(e.target.value)} className={inputClass} required>
                      <option value="">Select</option>
                      {['Cardiology','Neurology','Orthopedics','Pediatrics','Oncology','Dermatology','General Medicine','Psychiatry','Radiology','Surgery'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Experience</label>
                    <input type="text" value={experience} onChange={e => setExperience(e.target.value)}
                      placeholder="e.g. 8 years" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>License Number *</label>
                    <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)}
                      placeholder="MCI-12345" className={inputClass} required />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Qualification</label>
                    <input type="text" value={qualification} onChange={e => setQualification(e.target.value)}
                      placeholder="MBBS, MD Cardiology" className={inputClass} />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-primary-500 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-60">
                  {loading ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
