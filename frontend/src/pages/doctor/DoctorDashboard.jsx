import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ClipboardList, Star, Clock, ChevronRight, Activity } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import AppointmentCard from '../../components/common/AppointmentCard';
import { appointments, patients, chartData } from '../../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DoctorDashboard() {
  const todayAppts = appointments.filter(a => a.doctorId === 'D001').slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Tuesday, March 18, 2024 · 10 appointments today</p>
        </div>
        <Link to="/doctor/prescription" className="btn-primary text-sm hidden sm:flex items-center gap-2">
          <ClipboardList size={16} /> Write Prescription
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value="142" subtitle="Assigned to you" icon={Users} color="blue" trend="up" trendValue="+8" />
        <StatCard title="Today's Appointments" value="10" subtitle="3 completed" icon={Calendar} color="teal" />
        <StatCard title="Prescriptions Written" value="28" subtitle="This month" icon={ClipboardList} color="purple" trend="up" trendValue="+5" />
        <StatCard title="Average Rating" value="4.9" subtitle="From 142 reviews" icon={Star} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Weekly Patients</h3>
              <p className="text-xs text-slate-400">New vs Returning</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.weeklyPatients} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="new" fill="#04c5b5" radius={[4, 4, 0, 0]} name="New Patients" />
              <Bar dataKey="returning" fill="#1b8bf1" radius={[4, 4, 0, 0]} name="Returning" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Today's Schedule</h3>
            {appointments.filter(a => a.doctorId === 'D001').slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-0.5"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{a.patientName}</p>
                  <p className="text-xs text-slate-400">{a.type}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-primary-600 font-semibold shrink-0">
                  <Clock size={11} />{a.time}
                </div>
              </div>
            ))}
            <Link to="/doctor/appointments" className="flex items-center gap-1 text-xs text-primary-600 font-semibold mt-3 hover:text-primary-700">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Recent Patients</h3>
            {patients.filter(p => p.doctor === 'Dr. Sarah Mitchell').slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-teal-400 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.condition}</p>
                </div>
                <span className={p.status === 'Critical' ? 'badge-red' : p.status === 'Active' ? 'badge-green' : 'badge-gray'}
                  style={{ fontSize: '10px' }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Upcoming Appointments</h3>
          <Link to="/doctor/appointments" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">View All <ChevronRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayAppts.map(a => <AppointmentCard key={a.id} appointment={a} role="doctor" />)}
        </div>
      </div>
    </div>
  );
}
