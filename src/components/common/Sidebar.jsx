import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Calendar, FileText, ClipboardList, User,
  Users, UserCog, Stethoscope, Activity, Settings, ChevronRight
} from 'lucide-react';

const navConfig = {
  patient: [
    { label: 'Dashboard', path: '/patient', icon: LayoutDashboard },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: Calendar },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    { label: 'Medical History', path: '/patient/history', icon: ClipboardList },
    { label: 'My Profile', path: '/patient/profile', icon: User },
  ],
  doctor: [
    { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { label: 'Patient Records', path: '/doctor/patients', icon: Users },
    { label: 'Write Prescription', path: '/doctor/prescription', icon: FileText },
    { label: 'My Profile', path: '/doctor/profile', icon: User },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Manage Patients', path: '/admin/patients', icon: Users },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'System Overview', path: '/admin/overview', icon: Activity },
  ],
};

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();
  const links = navConfig[user?.role] || [];

  const roleTheme = {
    patient: { gradient: 'from-teal-500 to-primary-600', badge: 'bg-teal-50 text-teal-700' },
    doctor: { gradient: 'from-primary-500 to-indigo-600', badge: 'bg-primary-50 text-primary-700' },
    admin: { gradient: 'from-purple-500 to-primary-600', badge: 'bg-purple-50 text-purple-700' },
  };
  const theme = roleTheme[user?.role] || roleTheme.patient;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-40 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <span className="text-white font-black text-sm">M+</span>
            </div>
            <div>
              <p className="font-bold text-slate-800">MediCare <span className="text-primary-600">Pro</span></p>
              <p className="text-[10px] text-slate-400 font-medium">Healthcare System</p>
            </div>
          </div>
        </div>

        {/* User card */}
        <div className="px-4 py-4">
          <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-4 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold text-sm">
                {user?.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Navigation</p>
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} end={path.split('/').length === 2}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft"></div>
            <span className="text-xs text-slate-500 font-medium">System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}
