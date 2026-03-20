import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusBadge = {
  Confirmed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Completed: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
  Cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

const statusCard = {
  Confirmed: 'border-emerald-200 dark:border-emerald-800/40',
  Pending: 'border-amber-200 dark:border-amber-800/40',
  Completed: 'border-primary-200 dark:border-primary-800/40',
  Cancelled: 'border-red-200 dark:border-red-800/40',
};

export default function DoctorAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const toast = useToast();
  const { getAuthHeader } = useAuth();

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  // ─── FETCH DOCTOR APPOINTMENTS ────────────────────────────────────────────
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/appointments/doctor`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.success) {
        setAppts(data.appointments);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (err) {
      toast.error('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  // ─── UPDATE STATUS ────────────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        toast.success(`Appointment ${status.toLowerCase()}!`);
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (err) {
      toast.error('Cannot connect to server');
    }
  };

  const filtered = appts
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a =>
      (a.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.type || '').toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Appointments</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your patient appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statuses.slice(1).map(s => {
          const count = appts.filter(a => a.status === s).length;
          const colors = {
            Confirmed: 'text-emerald-600',
            Pending: 'text-amber-600',
            Completed: 'text-primary-600',
            Cancelled: 'text-red-600'
          };
          return (
            <div key={s} className="card p-4">
              <p className={`text-2xl font-bold ${colors[s]}`}>{count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name or type..."
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                ${filter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-[#16161f] border-slate-200 dark:border-[#ffffff15] text-slate-600 dark:text-slate-300 hover:border-primary-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={32} className="animate-spin text-primary-500" />
          <span className="ml-3 text-slate-500 dark:text-slate-400">Loading appointments...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(a => (
            <div key={a.id} className={`card p-5 border-l-4 ${statusCard[a.status] || 'border-slate-200'}`}>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {a.patient_name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{a.patient_name}</p>
                    {a.patient_phone && (
                      <p className="text-xs text-slate-400 dark:text-slate-500">{a.patient_phone}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[a.status] || 'bg-slate-100 text-slate-600'}`}>
                  {a.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar size={13} className="text-primary-500" />
                  <span>{a.appointment_date}</span>
                  <Clock size={13} className="text-primary-500 ml-1" />
                  <span>{a.appointment_time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <User size={13} className="text-teal-500" />
                  <span className="font-medium">{a.type}</span>
                </div>
                {a.notes && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-[#16161f] rounded-lg p-2 mt-2">
                    📝 {a.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {a.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(a.id, 'Confirmed')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all">
                    <CheckCircle size={13} /> Confirm
                  </button>
                  <button onClick={() => updateStatus(a.id, 'Cancelled')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all">
                    <XCircle size={13} /> Cancel
                  </button>
                </div>
              )}
              {a.status === 'Confirmed' && (
                <button onClick={() => updateStatus(a.id, 'Completed')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all">
                  <CheckCircle size={13} /> Mark as Completed
                </button>
              )}
              {(a.status === 'Completed' || a.status === 'Cancelled') && (
                <div className="text-center py-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {a.status === 'Completed' ? '✅ Appointment completed' : '❌ Appointment cancelled'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
