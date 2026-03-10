import React, { useState } from 'react';
import { Pill, Calendar, User, FileText, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';
import { prescriptions } from '../../data/dummyData';

export default function Prescriptions() {
  const [expanded, setExpanded] = useState('RX001');
  const myRx = prescriptions.filter(p => p.patientId === 'P001');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Prescriptions</h1>
        <p className="text-slate-500 text-sm mt-1">View and manage your medications</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-3 rounded-2xl"><Pill size={20} className="text-primary-600" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{myRx.filter(r => r.status === 'Active').length}</p>
              <p className="text-sm text-slate-500">Active Prescriptions</p>
            </div>
          </div>
        </div>
        <div className="stat-card border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-2xl"><CheckCircle size={20} className="text-emerald-600" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{myRx.filter(r => r.status === 'Completed').length}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {myRx.map(rx => (
          <div key={rx.id} className="card overflow-hidden">
            <button className="w-full p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === rx.id ? null : rx.id)}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${rx.status === 'Active' ? 'bg-primary-100' : 'bg-slate-100'}`}>
                  <FileText size={20} className={rx.status === 'Active' ? 'text-primary-600' : 'text-slate-400'} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800">{rx.diagnosis}</p>
                    <span className={rx.status === 'Active' ? 'badge-blue' : 'badge-gray'}>{rx.status}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><User size={11} />{rx.doctorName}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={11} />{rx.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{rx.medications.length} medication{rx.medications.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              {expanded === rx.id ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
            </button>

            {expanded === rx.id && (
              <div className="border-t border-slate-100 p-5 space-y-5 animate-fade-in">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Medications</h4>
                  <div className="space-y-3">
                    {rx.medications.map((med, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-bold text-slate-800">{med.name}</p>
                            <p className="text-sm text-primary-600 font-medium">{med.dosage}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-700">{med.frequency}</p>
                            <p className="text-xs text-slate-400">{med.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                          <Clock size={12} />
                          <p className="text-xs font-medium">{med.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {rx.notes && (
                  <div className="bg-primary-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-primary-700 mb-1">Doctor's Notes</p>
                    <p className="text-sm text-slate-600">{rx.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
