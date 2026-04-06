import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChevronRight, CheckCircle, Search, Loader } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const steps = ['Select Doctor', 'Choose Slot', 'Confirm'];

// Generate next 7 available dates
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day !== 0 && day !== 6) { // skip weekends
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
};

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [type, setType] = useState('Consultation');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const toast = useToast();
  const { getAuthHeader } = useAuth();

  const availableDates = getAvailableDates();

  // ─── FETCH DOCTORS FROM API ───────────────────────────────────────────────
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await fetch(`${API_URL}/doctors`, {
          headers: { ...getAuthHeader() }
        });
        const data = await res.json();
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          toast.error('Failed to load doctors');
        }
      } catch (err) {
        toast.error('Cannot connect to server');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // ─── FILTER DOCTORS ───────────────────────────────────────────────────────
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  // ─── BOOK APPOINTMENT ─────────────────────────────────────────────────────
  const handleBook = async () => {
    try {
      setBooking(true);
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          type,
          notes,
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Appointment booked successfully!');
        setBooked(true);
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      toast.error('Cannot connect to server');
    } finally {
      setBooking(false);
    }
  };

  // ─── CONFIRMED SCREEN ─────────────────────────────────────────────────────
  if (booked) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 animate-slide-up">
        <CheckCircle size={40} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Appointment Confirmed!</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
        Your appointment with <strong>{selectedDoctor?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been confirmed.
      </p>
      <button onClick={() => { setBooked(false); setStep(0); setSelectedDoctor(null); setSelectedDate(''); setSelectedTime(''); setNotes(''); }}
        className="btn-primary">Book Another</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Book Appointment</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Schedule a visit with our specialists</p>
      </div>

      {/* Steps */}
      <div className="card p-6">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-[#2a2a3d] text-slate-400 dark:text-slate-500'}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-primary-700 dark:text-primary-400' : i < step ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-600'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all ${i < step ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-[#2a2a3d]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 0: Doctor selection */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-3">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search doctors by name or specialty..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600" />
          </div>

          {loadingDoctors ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-primary-500" />
              <span className="ml-3 text-slate-500 dark:text-slate-400">Loading doctors...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400">No doctors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(doc => (
                <button key={doc.id} onClick={() => { setSelectedDoctor(doc); setStep(1); }}
                  className={`card p-5 text-left hover:shadow-md transition-all duration-200 group hover:border-primary-200 ${selectedDoctor?.id === doc.id ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold shrink-0">
                      {doc.avatar || doc.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{doc.name}</p>
                          <p className="text-xs text-primary-600 font-medium">{doc.specialty}</p>
                        </div>
                        {doc.rating > 0 && (
                          <div className="flex items-center gap-1 text-amber-500">
                            <span className="text-xs font-bold">★ {doc.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {doc.experience && <span className="text-xs text-slate-500 dark:text-slate-400">{doc.experience}</span>}
                        {doc.total_patients > 0 && (
                          <>
                            <span className="text-xs text-slate-400 dark:text-slate-600">·</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{doc.total_patients} patients</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="badge-green text-[10px]">Available</span>
                        {doc.city && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">📍 {doc.city}, Gujarat</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Slot selection */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold">
                {selectedDoctor?.avatar || selectedDoctor?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{selectedDoctor?.name}</p>
                <p className="text-sm text-primary-600">{selectedDoctor?.specialty}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Appointment Type</label>
                <div className="flex gap-2 flex-wrap">
                  {['Consultation', 'Follow-up', 'Check-up', 'Emergency'].map(t => (
                    <button key={t} onClick={() => setType(t)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${type === t ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-[#ffffff15] text-slate-600 dark:text-slate-300 hover:border-primary-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                <div className="flex gap-2 flex-wrap">
                  {availableDates.map(date => (
                    <button key={date} onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedDate === date ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-[#ffffff15] text-slate-600 dark:text-slate-300 hover:border-primary-300'}`}>
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Time</label>
                  <div className="flex gap-2 flex-wrap">
                    {timeSlots.map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 ${selectedTime === t ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-[#ffffff15] text-slate-600 dark:text-slate-300 hover:border-primary-300'}`}>
                        <Clock size={13} />{t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Additional Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={3} placeholder="Describe your symptoms or reason for visit..."
                  className="input-field resize-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary">← Back</button>
            <button onClick={() => { if (selectedDate && selectedTime) setStep(2); else toast.error('Please select date and time'); }}
              className="btn-primary flex-1">Continue →</button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-5">Appointment Summary</h3>
            <div className="space-y-4">
              {[
                { label: 'Doctor', value: selectedDoctor?.name },
                { label: 'Specialty', value: selectedDoctor?.specialty },
                { label: 'Doctor City', value: selectedDoctor?.city ? `${selectedDoctor.city}, Gujarat` : 'N/A' },
                { label: 'Type', value: type },
                { label: 'Date', value: selectedDate },
                { label: 'Time', value: selectedTime },
                { label: 'Notes', value: notes || 'None provided' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-dark-border last:border-0">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
            <button onClick={handleBook} disabled={booking}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {booking
                ? <><Loader size={16} className="animate-spin" /> Booking...</>
                : <><CheckCircle size={16} /> Confirm Booking</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
