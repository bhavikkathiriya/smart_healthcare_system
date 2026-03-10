import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { appointments } from '../../data/dummyData';
import AppointmentCard from '../../components/common/AppointmentCard';

export default function DoctorAppointments() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const toast = useToast();
  const [appts, setAppts] = useState(appointments.filter(a => a.doctorId === 'D001'));

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
  const filtered = appts
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => a.patientName.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()));

  const handleAction = (action, id) => {
    if (action === 'confirm') {
      setAppts(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a));
      toast.success('Appointment confirmed!');
    } else if (action === 'cancel') {
      setAppts(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
      toast.warning('Appointment cancelled');
    } else if (action === 'view') {
      toast.info('Viewing appointment details');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your patient appointments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statuses.slice(1).map(s => {
          const count = appts.filter(a => a.status === s).length;
          const colors = { Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200', Pending: 'bg-amber-50 text-amber-700 border-amber-200', Completed: 'bg-primary-50 text-primary-700 border-primary-200', Cancelled: 'bg-red-50 text-red-600 border-red-200' };
          return (
            <div key={s} className={`card p-4 border ${colors[s]}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-semibold">{s}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments..."
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${filter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(a => <AppointmentCard key={a.id} appointment={a} role="doctor" onAction={handleAction} />)}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Calendar size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
