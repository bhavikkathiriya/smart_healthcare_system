import React, { useState } from 'react';
import { ClipboardList, Filter, Search } from 'lucide-react';
import { medicalHistory } from '../../data/dummyData';

const typeColors = {
  Consultation: 'bg-primary-100 text-primary-700',
  'Lab Tests': 'bg-teal-100 text-teal-700',
  Emergency: 'bg-red-100 text-red-700',
  Surgery: 'bg-purple-100 text-purple-700',
};

export default function MedicalHistory() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const types = ['All', 'Consultation', 'Lab Tests', 'Emergency', 'Surgery'];
  const filtered = medicalHistory
    .filter(h => filter === 'All' || h.type === filter)
    .filter(h => h.description.toLowerCase().includes(search.toLowerCase()) || h.doctor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Medical History</h1>
        <p className="text-slate-500 text-sm mt-1">Complete record of your medical visits</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search history..."
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${filter === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>
        <div className="space-y-4 pl-14">
          {filtered.map((item, idx) => (
            <div key={item.id} className="relative card p-5 hover:shadow-md transition-all">
              <div className={`absolute -left-[2.15rem] w-4 h-4 rounded-full border-2 border-white ${item.type === 'Emergency' ? 'bg-red-500' : item.type === 'Surgery' ? 'bg-purple-500' : item.type === 'Lab Tests' ? 'bg-teal-500' : 'bg-primary-500'}`}></div>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[item.type] || 'bg-slate-100 text-slate-600'}`}>{item.type}</span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <p className="text-xs text-primary-600 font-medium">{item.doctor}</p>
                    <span className="text-xs text-slate-400">·</span>
                    <p className="text-xs text-emerald-600 font-medium">{item.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
