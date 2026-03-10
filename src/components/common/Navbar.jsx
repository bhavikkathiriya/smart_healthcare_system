import React, { useState } from 'react';
import { Bell, Search, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notifications } from '../../data/dummyData';

export default function Navbar({ onMenuToggle, sidebarOpen }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const roleColors = {
    patient: 'bg-teal-100 text-teal-700',
    doctor: 'bg-primary-100 text-primary-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors lg:hidden">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">M+</span>
            </div>
            <span className="font-bold text-slate-800 text-lg">MediCare <span className="text-primary-600">Pro</span></span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-50 rounded-xl px-4 py-2.5 gap-3 w-64 lg:w-80 border border-slate-100 focus-within:border-primary-300 focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="Search patients, doctors..." className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder-slate-400" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-50">
                  <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-primary-50/40' : ''}`}>
                    <p className={`text-sm ${!n.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-400 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                {user?.avatar}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</p>
                <span className={`text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-md ${roleColors[user?.role]}`}>{user?.role}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Close dropdowns on outside click */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </header>
  );
}
