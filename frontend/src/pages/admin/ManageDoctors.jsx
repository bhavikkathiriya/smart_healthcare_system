import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Eye, CheckCircle, XCircle, Loader, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('approved'); // 'approved' | 'pending'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const toast = useToast();
  const { getAuthHeader } = useAuth();

  // ─── FETCH ALL DOCTORS ────────────────────────────────────────────────────
  useEffect(() => {
    fetchDoctors();
    fetchPendingDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/doctors`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.success) setDoctors(data.doctors);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/doctors/pending`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.success) setPendingDoctors(data.doctors);
    } catch (err) {
      console.error('Failed to load pending doctors');
    }
  };

  // ─── APPROVE DOCTOR ───────────────────────────────────────────────────────
  const approveDoctor = async (doctorId) => {
    try {
      const res = await fetch(`${API_URL}/admin/doctors/${doctorId}/approve`, {
        method: 'PUT',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Doctor approved successfully! They can now login.');
        // Remove from pending and refresh approved list
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
        fetchDoctors();
      } else {
        toast.error(data.message || 'Failed to approve doctor');
      }
    } catch (err) {
      toast.error('Cannot connect to server');
    }
  };

  // ─── REJECT DOCTOR ────────────────────────────────────────────────────────
  const rejectDoctor = async (doctorId) => {
    try {
      const res = await fetch(`${API_URL}/admin/doctors/${doctorId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ reason: 'Application rejected by admin' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Doctor application rejected');
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
      } else {
        toast.error(data.message || 'Failed to reject doctor');
      }
    } catch (err) {
      toast.error('Cannot connect to server');
    }
  };

  // ─── DEACTIVATE DOCTOR ────────────────────────────────────────────────────
  const deactivateDoctor = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/deactivate`, {
        method: 'PUT',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Doctor deactivated');
        fetchDoctors();
      }
    } catch (err) {
      toast.error('Cannot connect to server');
    }
  };

  const approvedDoctors = doctors.filter(d => d.approval_status === 'approved');
  const filteredDoctors = approvedDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredPending = pendingDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Doctors</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{approvedDoctors.length} approved doctors in the system</p>
        </div>
        {pendingDoctors.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-2">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {pendingDoctors.length} pending approval{pendingDoctors.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-50 dark:bg-[#16161f] p-1.5 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${activeTab === 'approved' ? 'bg-white dark:bg-[#0d0d14] shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          <Stethoscope size={15} /> Approved
          <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 text-xs px-1.5 py-0.5 rounded-full">
            {approvedDoctors.length}
          </span>
        </button>
        <button onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${activeTab === 'pending' ? 'bg-white dark:bg-[#0d0d14] shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          <Clock size={15} /> Pending Approval
          {pendingDoctors.length > 0 && (
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
              {pendingDoctors.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-2.5">
        <Search size={16} className="text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or specialty..."
          className="bg-transparent text-sm outline-none flex-1 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600" />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={32} className="animate-spin text-primary-500" />
          <span className="ml-3 text-slate-500 dark:text-slate-400">Loading doctors...</span>
        </div>
      ) : (
        <>
          {/* ── APPROVED DOCTORS TAB ────────────────────────────────────── */}
          {activeTab === 'approved' && (
            <>
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-20">
                  <Stethoscope size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No approved doctors found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDoctors.map(doc => (
                    <div key={doc.id} className="card p-5 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold">
                            {doc.avatar || doc.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">{doc.name}</p>
                            <p className="text-xs text-primary-600 font-medium">{doc.specialty}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                          {doc.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        {[
                          { label: 'Experience', value: doc.experience || 'N/A' },
                          { label: 'Patients', value: doc.total_patients || 0 },
                          { label: 'Rating', value: doc.rating > 0 ? `★ ${doc.rating}` : 'N/A' },
                          { label: 'Email', value: doc.email },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{label}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-slate-50 dark:border-dark-border">
                        <button onClick={() => setSelectedDoc(doc)}
                          className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                          <Eye size={13} /> View
                        </button>
                        {doc.status === 'active' && (
                          <button onClick={() => deactivateDoctor(doc.id)}
                            className="flex-1 text-xs py-2 rounded-xl border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── PENDING APPROVAL TAB ────────────────────────────────────── */}
          {activeTab === 'pending' && (
            <>
              {filteredPending.length === 0 ? (
                <div className="text-center py-20">
                  <Clock size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No pending approvals</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">All doctor registrations have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPending.map(doc => (
                    <div key={doc.id} className="card p-5 border-l-4 border-amber-400 dark:border-amber-500">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center text-white font-bold">
                            {doc.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800 dark:text-white">{doc.name}</p>
                              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                                Pending
                              </span>
                            </div>
                            <p className="text-sm text-primary-600 font-medium">{doc.specialty}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{doc.email}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button onClick={() => approveDoctor(doc.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all">
                            <CheckCircle size={15} /> Approve
                          </button>
                          <button onClick={() => rejectDoctor(doc.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all">
                            <XCircle size={15} /> Reject
                          </button>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-dark-border">
                        {[
                          { label: 'Experience', value: doc.experience || 'N/A' },
                          { label: 'Qualification', value: doc.qualification || 'N/A' },
                          { label: 'License No', value: doc.license_number || 'N/A' },
                          { label: 'Phone', value: doc.phone || 'N/A' },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-slate-50 dark:bg-[#16161f] rounded-xl p-3">
                            <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5 truncate">{value}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                        Applied: {new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* View Doctor Modal */}
      <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Doctor Details">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {selectedDoc.avatar || selectedDoc.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{selectedDoc.name}</h3>
                <p className="text-primary-600 font-medium">{selectedDoc.specialty}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedDoc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {selectedDoc.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                  { label: 'Email', value: selectedDoc.email },
                  { label: 'Phone', value: selectedDoc.phone || 'N/A' },
                  { label: 'City', value: selectedDoc.city ? `${selectedDoc.city}, Gujarat` : 'N/A' },
                  { label: 'Experience', value: selectedDoc.experience || 'N/A' },
                  { label: 'Total Patients', value: selectedDoc.total_patients || 0 },
                  { label: 'Rating', value: selectedDoc.rating > 0 ? `★ ${selectedDoc.rating}` : 'N/A' },
                  { label: 'Qualification', value: selectedDoc.qualification || 'N/A' },
                  { label: 'License No', value: selectedDoc.license_number || 'N/A' },
                ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-[#16161f] rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
