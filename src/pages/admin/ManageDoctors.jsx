import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Stethoscope, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { doctors as initialDoctors } from '../../data/dummyData';
import Modal from '../../components/common/Modal';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form, setForm] = useState({ name: '', specialty: '', email: '', phone: '', experience: '' });
  const toast = useToast();

  const filtered = doctors
    .filter(d => filterStatus === 'All' || d.status === filterStatus)
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.specialty || !form.email) { toast.error('Please fill required fields'); return; }
    const newDoc = { ...form, id: `D00${doctors.length + 1}`, patients: 0, rating: 4.5, status: 'Active', avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(), schedule: 'Mon-Fri', nextSlot: '9:00 AM' };
    setDoctors([...doctors, newDoc]);
    setShowAdd(false);
    setForm({ name: '', specialty: '', email: '', phone: '', experience: '' });
    toast.success('Doctor added successfully!');
  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter(d => d.id !== id));
    toast.success('Doctor removed from system');
  };

  const toggleStatus = (id) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'On Leave' : 'Active' } : d));
    toast.info('Doctor status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Doctors</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{doctors.length} doctors in the system</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Doctor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-2.5 flex-1">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty..."
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'On Leave'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${filterStatus === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc.id} className="card p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold">
                  {doc.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                  <p className="text-xs text-primary-600 font-medium">{doc.specialty}</p>
                </div>
              </div>
              <span className={doc.status === 'Active' ? 'badge-green' : 'badge-yellow'}>{doc.status}</span>
            </div>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Experience</span>
                <span className="font-semibold text-slate-700">{doc.experience}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Patients</span>
                <span className="font-semibold text-slate-700">{doc.patients}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Rating</span>
                <span className="font-semibold text-amber-600">★ {doc.rating}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Schedule</span>
                <span className="font-semibold text-slate-700">{doc.schedule}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-slate-50">
              <button onClick={() => setSelectedDoc(doc)} className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                <Eye size={13} />View
              </button>
              <button onClick={() => toggleStatus(doc.id)} className="flex-1 btn-secondary text-xs py-2">
                {doc.status === 'Active' ? 'Set Leave' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Doctor">
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Dr. John Smith' },
            { key: 'specialty', label: 'Specialty', placeholder: 'Cardiology' },
            { key: 'email', label: 'Email', placeholder: 'doctor@medicare.com' },
            { key: 'phone', label: 'Phone', placeholder: '+1-555-0000' },
            { key: 'experience', label: 'Experience', placeholder: '5 years' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder} className="input-field" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1">Add Doctor</button>
          </div>
        </div>
      </Modal>

      {/* View Doctor Modal */}
      <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Doctor Details">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {selectedDoc.avatar}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{selectedDoc.name}</h3>
                <p className="text-primary-600 font-medium">{selectedDoc.specialty}</p>
                <span className={selectedDoc.status === 'Active' ? 'badge-green' : 'badge-yellow'}>{selectedDoc.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: selectedDoc.email },
                { label: 'Phone', value: selectedDoc.phone },
                { label: 'Experience', value: selectedDoc.experience },
                { label: 'Total Patients', value: selectedDoc.patients },
                { label: 'Rating', value: `★ ${selectedDoc.rating}` },
                { label: 'Schedule', value: selectedDoc.schedule },
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
