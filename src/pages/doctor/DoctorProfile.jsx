import React, { useState } from 'react';
import { Edit3, Save, X, Star, Users, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function DoctorProfile() {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Dr. Sarah Mitchell',
    email: user?.email || 'sarah@medicare.com',
    phone: '+1-555-0101',
    specialty: 'Cardiology',
    experience: '12 years',
    education: 'MD, Johns Hopkins University',
    bio: 'Board-certified cardiologist with over 12 years of experience in treating complex cardiac conditions. Specializing in interventional cardiology and heart failure management.',
    schedule: 'Monday - Friday, 8:00 AM - 5:00 PM',
  });

  const stats = [
    { label: 'Total Patients', value: '142', icon: Users, color: 'primary' },
    { label: 'Years Experience', value: '12', icon: Award, color: 'teal' },
    { label: 'Appointments', value: '1,284', icon: Calendar, color: 'purple' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'orange' },
  ];

  const colorMap = { primary: 'bg-primary-100 text-primary-600', teal: 'bg-teal-100 text-teal-600', purple: 'bg-purple-100 text-purple-600', orange: 'bg-amber-100 text-amber-600' };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your professional information</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2"><Edit3 size={15} />Edit</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-2"><X size={15} />Cancel</button>
            <button onClick={() => { toast.success('Profile updated!'); setEditing(false); }} className="btn-primary flex items-center gap-2"><Save size={15} />Save</button>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{form.name}</h2>
            <p className="text-primary-600 font-medium">{form.specialty}</p>
            <span className="badge-blue mt-1">{form.experience}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
              <div className={`${colorMap[color]} p-2 rounded-xl w-fit mx-auto mb-2`}><Icon size={16} /></div>
              <p className="font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-slate-800">Professional Information</h3>
        {[
          { key: 'name', label: 'Full Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'specialty', label: 'Specialty' },
          { key: 'experience', label: 'Experience' },
          { key: 'education', label: 'Education' },
          { key: 'schedule', label: 'Working Hours' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
            <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              disabled={!editing}
              className={`input-field ${!editing ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''}`} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
            disabled={!editing} rows={3}
            className={`input-field resize-none w-full ${!editing ? 'bg-slate-50 text-slate-600 cursor-not-allowed' : ''}`} />
        </div>
      </div>
    </div>
  );
}
