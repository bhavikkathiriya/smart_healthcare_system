import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Clock, Heart, Activity, AlertCircle, ChevronRight, Pill } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import AppointmentCard from '../../components/common/AppointmentCard';
import { appointments, prescriptions, medicalHistory, chartData } from '../../data/dummyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function PatientDashboard() {
  const { user } = useAuth();
  const myAppts = appointments.filter(a => a.patientId === 'P001').slice(0, 3);
  const myRx = prescriptions.filter(p => p.patientId === 'P001');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good Morning, <span className="text-primary-600">{user?.name?.split(' ')[0]}</span> 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Here's your health overview for today</p>
        </div>
        <Link to="/patient/book-appointment" className="btn-primary text-sm hidden sm:flex items-center gap-2">
          <Calendar size={16} /> Book Appointment
        </Link>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">Upcoming Appointment</p>
          <p className="text-amber-700 text-xs mt-0.5">You have an appointment with Dr. Sarah Mitchell tomorrow at 10:00 AM</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value="12" subtitle="This year" icon={Calendar} color="blue" trend="up" trendValue="+3" />
        <StatCard title="Active Prescriptions" value="2" subtitle="Medications" icon={Pill} color="teal" />
        <StatCard title="Last Checkup" value="Mar 10" subtitle="2024" icon={Clock} color="purple" />
        <StatCard title="Health Score" value="82%" subtitle="Good condition" icon={Heart} color="emerald" trend="up" trendValue="+5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Blood Pressure Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Today's monitoring</p>
            </div>
            <span className="badge-blue">Today</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData.patientVitals}>
              <defs>
                <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1b8bf1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1b8bf1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[120, 160]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="bp" stroke="#1b8bf1" strokeWidth={2.5} fill="url(#bpGrad)" name="BP (mmHg)" dot={{ r: 4, fill: '#1b8bf1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Health Metrics</h3>
            {[
              { label: 'Blood Pressure', value: '138/88', status: 'warning', icon: Activity },
              { label: 'Heart Rate', value: '76 bpm', status: 'good', icon: Heart },
              { label: 'SpO2', value: '98%', status: 'good', icon: Activity },
              { label: 'Blood Group', value: 'O+', status: 'info', icon: Heart },
            ].map(({ label, value, status, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-500">{label}</span>
                <span className={`text-xs font-bold ${status === 'good' ? 'text-emerald-600' : status === 'warning' ? 'text-amber-600' : 'text-primary-600'}`}>{value}</span>
              </div>
            ))}
          </div>
          <Link to="/patient/prescriptions" className="card p-4 flex items-center gap-3 hover:shadow-md transition-all group">
            <div className="bg-teal-100 p-2.5 rounded-xl"><Pill size={18} className="text-teal-600" /></div>
            <div className="flex-1"><p className="text-sm font-semibold text-slate-800">Active Prescription</p><p className="text-xs text-slate-400">Lisinopril 10mg</p></div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Upcoming Appointments</h3>
          <Link to="/patient/book-appointment" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myAppts.map(a => <AppointmentCard key={a.id} appointment={a} role="patient" />)}
        </div>
      </div>

      {/* Recent History */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Medical History</h3>
          <Link to="/patient/history" className="text-xs text-primary-600 font-semibold">View All</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {medicalHistory.slice(0, 3).map(item => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.type === 'Emergency' ? 'bg-red-500' : item.type === 'Surgery' ? 'bg-purple-500' : 'bg-primary-500'}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{item.type}</p>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-primary-600 font-medium mt-1">{item.doctor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
