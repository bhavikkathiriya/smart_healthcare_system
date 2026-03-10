import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, Shield, Stethoscope, User, Lock, ArrowRight, Activity } from 'lucide-react';

const roles = [
  { id: 'patient', label: 'Patient', icon: User, color: 'teal', hint: 'ID: patient123 | Pass: patient@123' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'blue', hint: 'ID: doctor123 | Pass: doctor@123' },
  { id: 'admin', label: 'Admin', icon: Shield, color: 'purple', hint: 'ID: admin123 | Pass: admin@123' },
];

export default function LoginPage() {
  const [role, setRole] = useState('patient');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const selectedRole = roles.find(r => r.id === role);

  const validate = () => {
    const e = {};
    if (!id.trim()) e.id = 'ID or email is required';
    if (!password) e.password = 'Password is required';
    if (password && password.length < 6) e.password = 'Minimum 6 characters required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const result = login(role, id, password);
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome back! Logged in as ${role}`);
      navigate(`/${role}`);
    } else {
      toast.error(result.error);
      setErrors({ general: result.error });
    }
  };

  const handleQuickFill = () => {
    const hint = selectedRole.hint;
    const idVal = hint.match(/ID: (\S+)/)[1];
    const passVal = hint.match(/Pass: (\S+)/)[1];
    setId(idVal);
    setPassword(passVal);
    setErrors({});
  };

  const colorMap = {
    teal: { active: 'border-teal-500 bg-teal-50 text-teal-700', inactive: 'border-slate-200 hover:border-teal-300' },
    blue: { active: 'border-primary-500 bg-primary-50 text-primary-700', inactive: 'border-slate-200 hover:border-primary-300' },
    purple: { active: 'border-purple-500 bg-purple-50 text-purple-700', inactive: 'border-slate-200 hover:border-purple-300' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">MediCare <span className="text-teal-300">Pro</span></h1>
          <p className="text-primary-200 mt-2 text-sm">Smart Healthcare Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Select Your Role</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ id: rId, label, icon: Icon, color }) => {
                const isActive = role === rId;
                return (
                  <button key={rId} onClick={() => { setRole(rId); setId(''); setPassword(''); setErrors({}); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-200
                      ${isActive ? 'bg-white border-white text-slate-800 shadow-lg scale-105' : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white hover:scale-105'}`}>
                    <Icon size={20} />
                    <span className="text-xs">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hint */}
          <button onClick={handleQuickFill}
            className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 mb-6 transition-all group">
            <span className="text-xs text-white/50">Demo:</span>
            <span className="text-xs text-teal-300 font-mono flex-1 text-left">{selectedRole.hint}</span>
            <span className="text-[10px] text-white/40 group-hover:text-white/60 font-medium">Auto-fill →</span>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Email / ID</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" value={id} onChange={e => { setId(e.target.value); setErrors({}); }}
                  placeholder="Enter your ID or email"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-teal-400 focus:bg-white/15 transition-all" />
              </div>
              {errors.id && <p className="text-red-400 text-xs mt-1">{errors.id}</p>}
            </div>

            <div>
              <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setErrors({}); }}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pl-10 pr-10 text-sm outline-none focus:border-teal-400 focus:bg-white/15 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {errors.general && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3">
                <p className="text-red-300 text-sm text-center">{errors.general}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-primary-500 hover:from-teal-400 hover:to-primary-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>Sign In</span><ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © 2024 MediCare Pro · Secure Healthcare Management
        </p>
      </div>
    </div>
  );
}
