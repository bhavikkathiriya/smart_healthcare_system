import React, { useState } from 'react';
import { Search, Users, Eye, Trash2, Plus } from 'lucide-react';
import { patients as initialPatients } from '../../data/dummyData';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

const statusBadge = { 'Active': 'badge-green', 'Critical': 'badge-red', 'Recovered': 'badge-blue', 'Under Observation': 'badge-yellow' };

export default function ManagePatients() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const statuses = ['All', 'Active', 'Critical', 'Under Observation', 'Recovered'];
  const filtered = patients
    .filter(p => filter === 'All' || p.status === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    setPatients(patients.filter(p => p.id !== id));
    toast.success('Patient record removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{patients.length} registered patients</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statuses.slice(1).map(s => {
          const count = patients.filter(p => p.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s === filter ? 'All' : s)}
              className={`card p-4 text-left transition-all ${filter === s ? 'ring-2 ring-primary-400' : 'hover:shadow-md'}`}>
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..."
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
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
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Info</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Doctor</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Condition</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-primary-400 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">{p.avatar}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-slate-600">{p.age}y · {p.gender}</p>
                    <p className="text-xs text-slate-400">{p.bloodGroup}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-primary-600 font-medium">{p.doctor}</p>
                    <p className="text-xs text-slate-400">Last: {p.lastVisit}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-sm text-slate-600">{p.condition}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={statusBadge[p.status] || 'badge-gray'}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(p)} className="p-2 rounded-xl text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"><Eye size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No patients found</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Patient Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-primary-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">{selected.avatar}</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{selected.name}</h3>
                <p className="text-slate-500 text-sm">{selected.email}</p>
                <span className={statusBadge[selected.status] || 'badge-gray'}>{selected.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Age', value: `${selected.age} years` },
                { label: 'Gender', value: selected.gender },
                { label: 'Blood Group', value: selected.bloodGroup },
                { label: 'Phone', value: selected.phone },
                { label: 'Condition', value: selected.condition },
                { label: 'Assigned Doctor', value: selected.doctor },
                { label: 'Last Visit', value: selected.lastVisit },
                { label: 'Patient ID', value: selected.id },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
