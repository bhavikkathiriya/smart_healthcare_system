import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Calendar, Activity, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { doctors, patients, appointments, chartData } from '../../data/dummyData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1b8bf1', '#04c5b5', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const critical = patients.filter(p => p.status === 'Critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">System-wide overview and management</p>
        </div>
      </div>

      {/* Alerts */}
      {(pending > 0 || critical > 0) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {pending > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 flex-1">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">{pending} appointments pending confirmation</p>
              <Link to="/admin/appointments" className="ml-auto text-xs text-amber-700 font-bold hover:underline">Review →</Link>
            </div>
          )}
          {critical > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 flex-1">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-800 font-medium">{critical} critical patients require attention</p>
              <Link to="/admin/patients" className="ml-auto text-xs text-red-700 font-bold hover:underline">View →</Link>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={patients.length} subtitle="All registered" icon={Users} color="blue" trend="up" trendValue="+12" />
        <StatCard title="Active Doctors" value={doctors.filter(d => d.status === 'Active').length} subtitle="Currently on duty" icon={Stethoscope} color="teal" />
        <StatCard title="Today's Appointments" value="24" subtitle="8 completed" icon={Calendar} color="purple" trend="up" trendValue="+3" />
        <StatCard title="System Uptime" value="99.9%" subtitle="Last 30 days" icon={Activity} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly appointments */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Appointments Trend</h3>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <span className="badge-green text-xs">+10.2% growth</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.appointmentsByMonth}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1b8bf1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1b8bf1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="appointments" stroke="#1b8bf1" strokeWidth={2.5} dot={{ r: 5, fill: '#1b8bf1' }} name="Appointments" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department pie */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-5">By Department</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={chartData.departmentStats} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {chartData.departmentStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {chartData.departmentStats.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Doctors', count: doctors.length, link: '/admin/doctors', color: 'primary', icon: Stethoscope },
          { label: 'Manage Patients', count: patients.length, link: '/admin/patients', color: 'teal', icon: Users },
          { label: 'All Appointments', count: appointments.length, link: '/admin/appointments', color: 'purple', icon: Calendar },
        ].map(({ label, count, link, color, icon: Icon }) => (
          <Link key={label} to={link}
            className="card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 group">
            <div className={`p-3 rounded-2xl bg-${color === 'primary' ? 'primary' : color}-100`}>
              <Icon size={20} className={`text-${color === 'primary' ? 'primary' : color}-600`} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
