import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1-555-0201',
    dob: '1990-03-15',
    address: '123 Maple Street, New York, NY 10001',
    bloodGroup: 'O+',
    emergencyContact: 'Jane Johnson - +1-555-0299',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: User },
    { key: 'email', label: 'Email Address', icon: Mail },
    { key: 'phone', label: 'Phone Number', icon: Phone },
    { key: 'dob', label: 'Date of Birth', icon: Calendar },
    { key: 'address', label: 'Address', icon: MapPin },
  ];

  const roleGradients = {
    patient: 'from-teal-400 to-primary-500',
    doctor: 'from-primary-400 to-indigo-500',
    admin: 'from-purple-400 to-primary-500',
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
            <Edit3 size={15} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-2"><X size={15} />Cancel</button>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save size={15} />Save</button>
          </div>
        )}
      </div>

      {/* Avatar Card */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${roleGradients[user?.role]} rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
            {user?.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{form.name}</h2>
            <p className="text-slate-500 text-sm">{form.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-bold capitalize px-3 py-1 rounded-full ${user?.role === 'patient' ? 'bg-teal-100 text-teal-700' : user?.role === 'doctor' ? 'bg-primary-100 text-primary-700' : 'bg-purple-100 text-purple-700'}`}>
                {user?.role}
              </span>
              <span className="badge-green text-[10px]">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 space-y-5">
        <h3 className="font-bold text-slate-800">Personal Information</h3>
        {fields.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
            <div className="relative">
              <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                disabled={!editing}
                className={`input-field pl-10 ${!editing ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      {user?.role === 'patient' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-800">Medical Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Blood Group</label>
              <input value={form.bloodGroup} disabled={!editing}
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                className={`input-field ${!editing ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''}`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Emergency Contact</label>
              <input value={form.emergencyContact} disabled={!editing}
                onChange={e => setForm({ ...form, emergencyContact: e.target.value })}
                className={`input-field ${!editing ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
