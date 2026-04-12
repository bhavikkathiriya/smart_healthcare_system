import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Search, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const steps = ['Select Doctor', 'Choose Slot', 'Confirm'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─── FULL CALENDAR COMPONENT ──────────────────────────────────────────────────
function FullCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (year, month, day) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    const dow = d.getDay();
    return d < today || dow === 0 || dow === 6;
  };

  const isSelected = (year, month, day) => {
    const d = new Date(year, month, day);
    return selectedDate === d.toISOString().split('T')[0];
  };

  const isToday = (year, month, day) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const handleSelect = (year, month, day) => {
    if (isDisabled(year, month, day)) return;
    const d = new Date(year, month, day);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  // Build calendar grid
  const cells = [];
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, month: viewMonth - 1, year: viewMonth === 0 ? viewYear - 1 : viewYear, outside: true });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, outside: false });
  }
  // Next month days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: viewMonth + 1, year: viewMonth === 11 ? viewYear + 1 : viewYear, outside: true });
  }

  return (
    <div className="bg-white dark:bg-[#0d0d14] rounded-2xl border border-slate-100 dark:border-[#ffffff08] overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 dark:border-[#ffffff08]">
        <button onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a1a28] transition-colors text-slate-500 dark:text-slate-400">
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-bold text-slate-800 dark:text-white text-base">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <button onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a1a28] transition-colors text-slate-500 dark:text-slate-400">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 border-b border-slate-50 dark:border-[#ffffff08]">
        {DAYS.map(d => (
          <div key={d} className={`text-center py-2 text-xs font-bold uppercase tracking-wide
            ${d === 'Sun' || d === 'Sat' ? 'text-red-400 dark:text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {cells.map((cell, idx) => {
          const disabled = cell.outside || isDisabled(cell.year, cell.month, cell.day);
          const selected = !cell.outside && isSelected(cell.year, cell.month, cell.day);
          const today_ = !cell.outside && isToday(cell.year, cell.month, cell.day);
          const weekend = [0, 6].includes(new Date(cell.year, cell.month, cell.day).getDay());

          return (
            <button key={idx}
              onClick={() => handleSelect(cell.year, cell.month, cell.day)}
              disabled={disabled}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                ${selected ? 'bg-primary-600 text-white shadow-md scale-105 font-bold' : ''}
                ${today_ && !selected ? 'border-2 border-primary-400 text-primary-600 dark:text-primary-400 font-bold' : ''}
                ${!selected && !today_ && !disabled ? 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-700 dark:text-slate-300' : ''}
                ${disabled && !cell.outside ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : ''}
                ${cell.outside ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed' : ''}
                ${weekend && !cell.outside && !selected ? 'text-red-300 dark:text-red-800' : ''}
              `}>
              {cell.day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-slate-50 dark:border-[#ffffff08] flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary-600"></div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-primary-400"></div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Unavailable</span>
        </div>
      </div>
    </div>
  );
}

// ─── 24 HOUR TIME CLOCK COMPONENT ────────────────────────────────────────────
function TimeClock({ selectedTime, onSelectTime }) {
  const [hour, setHour] = useState(selectedTime ? parseInt(selectedTime.split(':')[0]) : 9);
  const [minute, setMinute] = useState(selectedTime ? parseInt(selectedTime.split(':')[1]) : 0);
  const [selectingHour, setSelectingHour] = useState(true);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Working hours: 8 AM to 8 PM
  const isValidHour = (h) => h >= 8 && h <= 20;
  const isValidMinute = (m) => isValidHour(hour);

  const handleHourSelect = (h) => {
    if (!isValidHour(h)) return;
    setHour(h);
    setSelectingHour(false);
    const time = `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onSelectTime(time);
  };

  const handleMinuteSelect = (m) => {
    setMinute(m);
    const time = `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onSelectTime(time);
  };

  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return (
    <div className="bg-white dark:bg-[#0d0d14] rounded-2xl border border-slate-100 dark:border-[#ffffff08] overflow-hidden">
      {/* Clock Header */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-500 px-6 py-5 text-center">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Selected Time</p>
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setSelectingHour(true)}
            className={`text-4xl font-bold transition-all ${selectingHour ? 'text-white' : 'text-white/60 hover:text-white/80'}`}>
            {String(hour).padStart(2, '0')}
          </button>
          <span className="text-4xl font-bold text-white">:</span>
          <button onClick={() => setSelectingHour(false)}
            className={`text-4xl font-bold transition-all ${!selectingHour ? 'text-white' : 'text-white/60 hover:text-white/80'}`}>
            {String(minute).padStart(2, '0')}
          </button>
        </div>
        <p className="text-white/60 text-xs mt-2">
          {hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'} · 24-hour format
        </p>
      </div>

      {/* Hour/Minute Toggle */}
      <div className="flex border-b border-slate-50 dark:border-[#ffffff08]">
        <button onClick={() => setSelectingHour(true)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-all ${selectingHour ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          Hour
        </button>
        <button onClick={() => setSelectingHour(false)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-all ${!selectingHour ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          Minute
        </button>
      </div>

      {/* Hour Grid */}
      {selectingHour && (
        <div className="p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 text-center">Working hours: 08:00 — 20:00</p>
          <div className="grid grid-cols-6 gap-1.5">
            {hours.map(h => (
              <button key={h}
                onClick={() => handleHourSelect(h)}
                disabled={!isValidHour(h)}
                className={`
                  py-2 rounded-xl text-sm font-semibold transition-all
                  ${h === hour ? 'bg-primary-600 text-white shadow-sm' : ''}
                  ${isValidHour(h) && h !== hour ? 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-700 dark:text-slate-300' : ''}
                  ${!isValidHour(h) ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : ''}
                `}>
                {String(h).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minute Grid */}
      {!selectingHour && (
        <div className="p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 text-center">Select minute</p>
          <div className="grid grid-cols-6 gap-1.5">
            {minutes.map(m => (
              <button key={m}
                onClick={() => handleMinuteSelect(m)}
                className={`
                  py-2 rounded-xl text-sm font-semibold transition-all
                  ${m === minute ? 'bg-primary-600 text-white shadow-sm' : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-700 dark:text-slate-300'}
                `}>
                {String(m).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Time */}
      <div className="px-4 pb-4">
        <div className="bg-slate-50 dark:bg-[#16161f] rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">Appointment time</span>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [type, setType] = useState('Consultation');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [patientCity, setPatientCity] = useState('');
  const [checkingSlot, setCheckingSlot] = useState(false);
  const [slotError, setSlotError] = useState(null); // { message, suggestedSlots }
  const toast = useToast();
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await fetch(`${API_URL}/doctors`, { headers: { ...getAuthHeader() } });
        const data = await res.json();
        if (data.success) { setDoctors(data.doctors); setPatientCity(data.patientCity || ''); }
        else toast.error('Failed to load doctors');
      } catch { toast.error('Cannot connect to server'); }
      finally { setLoadingDoctors(false); }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  // ─── CHECK SLOT ────────────────────────────────────────────────────────────
  const checkSlot = async () => {
    if (!selectedDate) { toast.error('Please select a date first'); return; }
    try {
      setCheckingSlot(true);
      setSlotError(null);
      const res = await fetch(`${API_URL}/appointments/check-slot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
        })
      });
      const data = await res.json();
      if (data.available) {
        setSlotError(null);
        setStep(2);
      } else {
        setSlotError({
          message: data.message,
          suggestedSlots: data.suggestedSlots || [],
        });
      }
    } catch { toast.error('Cannot connect to server'); }
    finally { setCheckingSlot(false); }
  };

  const handleBook = async () => {
    try {
      setBooking(true);
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          type, notes,
        })
      });
      const data = await res.json();
      if (data.success) { toast.success('Appointment booked!'); setBooked(true); }
      else toast.error(data.message || 'Failed to book');
    } catch { toast.error('Cannot connect to server'); }
    finally { setBooking(false); }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (booked) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={48} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Appointment Confirmed! 🎉</h2>
      <div className="bg-white dark:bg-[#0d0d14] rounded-2xl border border-slate-100 dark:border-[#ffffff08] p-6 mt-4 max-w-sm w-full space-y-3">
        {[
          { label: '👨‍⚕️ Doctor', value: selectedDoctor?.name },
          { label: '🏥 Specialty', value: selectedDoctor?.specialty },
          { label: '📅 Date', value: formatDate(selectedDate) },
          { label: '🕐 Time', value: selectedTime },
          { label: '📋 Type', value: type },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-1.5 border-b border-slate-50 dark:border-[#ffffff08] last:border-0">
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{value}</span>
          </div>
        ))}
      </div>
      <button onClick={() => { setBooked(false); setStep(0); setSelectedDoctor(null); setSelectedDate(''); setSelectedTime('09:00'); setNotes(''); }}
        className="btn-primary mt-6">Book Another Appointment</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Book Appointment</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Schedule a visit with our specialists</p>
      </div>

      {/* Steps */}
      <div className="card p-5">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-[#2a2a3d] text-slate-400 dark:text-slate-500'}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${i === step ? 'text-primary-700 dark:text-primary-400' : i < step ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-600'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all ${i < step ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-[#2a2a3d]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── STEP 0: Select Doctor ─────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-[#16161f] rounded-xl border border-slate-200 dark:border-[#ffffff15] px-4 py-3">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search doctors by name or specialty..."
              value={search} onChange={e => setSearch(e.target.value)}
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
            <>
            {patientCity && (
              <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/40 rounded-xl px-4 py-2.5 mb-2">
                <span className="text-primary-600 dark:text-primary-400">📍</span>
                <span className="text-sm text-primary-700 dark:text-primary-400">Showing doctors nearest to <strong>{patientCity}</strong>, Gujarat</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(doc => (
                <button key={doc.id} onClick={() => { setSelectedDoctor(doc); setStep(1); }}
                  className={`card p-5 text-left hover:shadow-md transition-all duration-200 hover:border-primary-200 ${selectedDoctor?.id === doc.id ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 text-lg">
                      {doc.avatar || doc.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{doc.name}</p>
                          <p className="text-xs text-primary-600 font-medium">{doc.specialty}</p>
                        </div>
                        {doc.rating > 0 && <span className="text-xs font-bold text-amber-500">★ {doc.rating}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {doc.experience && <span className="text-xs text-slate-500 dark:text-slate-400">{doc.experience}</span>}
                        {doc.total_patients > 0 && <span className="text-xs text-slate-400 dark:text-slate-500">· {doc.total_patients} patients</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="badge-green text-[10px]">Available</span>
                        {doc.sameCity && (
                          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                            📍 Nearest
                          </span>
                        )}
                        {doc.city && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {doc.city}, Gujarat
                          </span>
                        )}
                        {doc.distanceLabel && !doc.sameCity && (
                          <span className="text-xs text-primary-500 dark:text-primary-400 font-medium">
                            🚗 {doc.distanceLabel}
                          </span>
                        )}
                        {doc.sameCity && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Same city as you
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 1: Choose Slot ───────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Selected Doctor Info */}
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              {selectedDoctor?.avatar || selectedDoctor?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{selectedDoctor?.name}</p>
              <p className="text-sm text-primary-600">{selectedDoctor?.specialty}</p>
              {selectedDoctor?.city && <p className="text-xs text-slate-400 dark:text-slate-500">📍 {selectedDoctor.city}, Gujarat</p>}
            </div>
          </div>

          {/* Appointment Type */}
          <div className="card p-5">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Appointment Type</label>
            <div className="flex gap-2 flex-wrap">
              {['Consultation', 'Follow-up', 'Check-up', 'Emergency'].map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                    ${type === t ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'border-slate-200 dark:border-[#ffffff15] text-slate-600 dark:text-slate-300 hover:border-primary-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar and Time side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Full Calendar */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Calendar size={16} className="text-primary-500" /> Select Date
              </label>
              <FullCalendar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSlotError(null); }} />
              {selectedDate && (
                <div className="mt-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/40 rounded-xl px-4 py-2.5">
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">📅 {formatDate(selectedDate)}</p>
                </div>
              )}
            </div>

            {/* 24hr Time Clock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Clock size={16} className="text-primary-500" /> Select Time (24-hour)
              </label>
              <TimeClock selectedTime={selectedTime} onSelectTime={(t) => { setSelectedTime(t); setSlotError(null); }} />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="card p-5">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Additional Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              rows={3} placeholder="Describe your symptoms or reason for visit..."
              className="input-field resize-none w-full" />
          </div>

          {/* Slot Error Notification */}
          {slotError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-red-700 dark:text-red-400">{slotError.message}</p>
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">Please select one of the available slots below or choose a different time.</p>
                </div>
              </div>
              {slotError.suggestedSlots.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">✅ Available slots near your selected time:</p>
                  <div className="flex gap-2 flex-wrap">
                    {slotError.suggestedSlots.map(slot => (
                      <button key={slot}
                        onClick={() => { setSelectedTime(slot); setSlotError(null); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all">
                        <Clock size={14} /> {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Click a slot to select it, then click Continue again.</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary">← Back</button>
            <button onClick={checkSlot} disabled={checkingSlot || !selectedDate}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {checkingSlot
                ? <><Loader size={16} className="animate-spin" /> Checking slot...</>
                : <>Continue →</>
              }
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Confirm ───────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-5">Appointment Summary</h3>
            <div className="space-y-3">
              {[
                { label: '👨‍⚕️ Doctor', value: selectedDoctor?.name },
                { label: '🏥 Specialty', value: selectedDoctor?.specialty },
                { label: '📍 Location', value: selectedDoctor?.city ? `${selectedDoctor.city}, Gujarat` : 'N/A' },
                { label: '📋 Type', value: type },
                { label: '📅 Date', value: formatDate(selectedDate) },
                { label: '🕐 Time', value: selectedTime },
                { label: '📝 Notes', value: notes || 'None provided' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between py-2.5 border-b border-slate-50 dark:border-dark-border last:border-0 gap-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white text-right">{value}</span>
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
