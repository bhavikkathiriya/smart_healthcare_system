import React, { useState } from 'react';
import { Plus, Trash2, FileText, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { patients } from '../../data/dummyData';

const emptyMed = { name: '', dosage: '', frequency: '', duration: '', instructions: '' };

export default function WritePrescription() {
  const toast = useToast();
  const [form, setForm] = useState({ patientId: '', diagnosis: '', notes: '' });
  const [meds, setMeds] = useState([{ ...emptyMed }]);
  const [saved, setSaved] = useState(false);

  const addMed = () => setMeds([...meds, { ...emptyMed }]);
  const removeMed = (i) => setMeds(meds.filter((_, idx) => idx !== i));
  const updateMed = (i, key, val) => setMeds(meds.map((m, idx) => idx === i ? { ...m, [key]: val } : m));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosis) { toast.error('Please fill all required fields'); return; }
    if (meds.some(m => !m.name || !m.dosage)) { toast.error('Please fill all medication details'); return; }
    toast.success('Prescription saved successfully!');
    setSaved(true);
  };

  if (saved) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText size={36} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Prescription Saved!</h2>
      <p className="text-slate-500 mb-6">The prescription has been added to the patient's record.</p>
      <button onClick={() => { setSaved(false); setForm({ patientId: '', diagnosis: '', notes: '' }); setMeds([{ ...emptyMed }]); }}
        className="btn-primary">Write Another</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Write Prescription</h1>
        <p className="text-slate-500 text-sm mt-1">Create a prescription for your patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-800">Patient Information</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Select Patient *</label>
            <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
              className="input-field">
              <option value="">-- Choose a patient --</option>
              {patients.filter(p => p.doctor === 'Dr. Sarah Mitchell').map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Diagnosis *</label>
            <input type="text" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })}
              placeholder="e.g. Hypertension Stage 1" className="input-field" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Medications</h3>
            <button type="button" onClick={addMed}
              className="btn-secondary text-sm flex items-center gap-1.5 py-2"><Plus size={15} />Add Medication</button>
          </div>

          {meds.map((med, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-700">Medication {i + 1}</p>
                {meds.length > 1 && (
                  <button type="button" onClick={() => removeMed(i)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-100 transition-colors"><Trash2 size={15} /></button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input placeholder="Medicine name *" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)}
                  className="input-field text-sm" />
                <input placeholder="Dosage (e.g. 10mg) *" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)}
                  className="input-field text-sm" />
                <input placeholder="Frequency (e.g. Twice daily)" value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)}
                  className="input-field text-sm" />
                <input placeholder="Duration (e.g. 7 days)" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)}
                  className="input-field text-sm" />
              </div>
              <input placeholder="Special instructions" value={med.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)}
                className="input-field text-sm w-full" />
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4">Additional Notes</h3>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={4} placeholder="Add any additional notes, diet recommendations, follow-up instructions..."
            className="input-field resize-none w-full" />
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          <Save size={18} /> Save Prescription
        </button>
      </form>
    </div>
  );
}
