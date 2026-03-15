import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { appointments as initialAppts } from '../../data/dummyData';
import { useToast } from '../../context/ToastContext';

const statusBadge = { Confirmed: 'badge-green', Pending: 'badge-yellow', Cancelled: 'badge-red', Completed: 'badge-blue' };

export default function AppointmentManagement() {
  const [appts, setAppts] = useState(initialAppts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const toast = useToast();

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
  const filtered = appts
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id, status) => {
    setAppts(appts.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Appointment ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Appointment Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Oversee all appointments across departments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statuses.slice(1).map(s => {
          const count = appts.filter(a => a.status === s).length;
          const colorMap = { Confirmed: 'text-emerald-600', Pending: 'text-amber-600', Completed: 'text-primary-600', Cancelled: 'text-red-600' };
          return (
            <div key={s} className="card p-4">
              <p className={`text-2xl font-bold ${colorMap[s]}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments..."
            className="bg-transparent text-sm outline-none flex-1 placeholder-slate-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${filter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Patient</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Doctor</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Date & Time</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{a.patientName}</p>
                    <p className="text-xs text-slate-400">{a.department}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-primary-600 font-medium">{a.doctorName}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-slate-700">{a.date}</p>
                    <p className="text-xs text-primary-600 font-semibold">{a.time}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="badge-gray text-xs">{a.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={statusBadge[a.status] || 'badge-gray'}>{a.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400">
                      {statuses.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Calendar size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
