import React, { useState } from 'react';
import { Search, Users, Eye, FileText, Phone, Mail } from 'lucide-react';
import { patients } from '../../data/dummyData';
import Modal from '../../components/common/Modal';

export default function PatientRecords() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const myPatients = patients.filter(p => p.doctor === 'Dr. Sarah Mitchell');
  const filtered = myPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = {
    'Active': 'badge-green', 'Critical': 'badge-red',
    'Recovered': 'badge-blue', 'Under Observation': 'badge-yellow',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Patient Records</h1>
        <p className="text-slate-500 text-sm mt-1">{myPatients.length} patients assigned to you</p>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2.5">
        <Search size={16} className="text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or condition..."
          className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Patient</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Age/Gender</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Condition</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Last Visit</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-teal-400 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {p.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-slate-600">{p.age} yrs</p>
                    <p className="text-xs text-slate-400">{p.gender}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-slate-600">{p.condition}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-sm text-slate-500">{p.lastVisit}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={statusBadge[p.status] || 'badge-gray'}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelected(p)}
                      className="p-2 rounded-xl text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Eye size={16} />
                    </button>
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

      {/* Patient Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Patient Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {selected.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selected.name}</h3>
                <p className="text-sm text-slate-500">ID: {selected.id}</p>
                <span className={statusBadge[selected.status] || 'badge-gray'}>{selected.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Age', value: `${selected.age} years` },
                { label: 'Gender', value: selected.gender },
                { label: 'Blood Group', value: selected.bloodGroup },
                { label: 'Condition', value: selected.condition },
                { label: 'Last Visit', value: selected.lastVisit },
                { label: 'Phone', value: selected.phone },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                <FileText size={15} /> Write Prescription
              </button>
              <a href={`tel:${selected.phone}`} className="btn-secondary flex items-center gap-2 text-sm">
                <Phone size={15} /> Call
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
