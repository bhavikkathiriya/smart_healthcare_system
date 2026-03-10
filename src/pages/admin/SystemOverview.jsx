import React from 'react';
import { Server, Shield, Activity, Database, Wifi, CheckCircle } from 'lucide-react';
import { doctors, patients, appointments, chartData } from '../../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1b8bf1', '#04c5b5', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function SystemOverview() {
  const systemStats = [
    { label: 'System Uptime', value: '99.9%', status: 'ok', icon: Server },
    { label: 'Database Health', value: 'Optimal', status: 'ok', icon: Database },
    { label: 'Network Latency', value: '12ms', status: 'ok', icon: Wifi },
    { label: 'Security Status', value: 'Secure', status: 'ok', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time system health and analytics</p>
      </div>

      {/* System health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-emerald-100 p-2.5 rounded-xl"><Icon size={18} className="text-emerald-600" /></div>
              <CheckCircle size={16} className="text-emerald-500 ml-auto" />
            </div>
            <p className="text-lg font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments trend */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-5">Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.appointmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="appointments" fill="#1b8bf1" radius={[6, 6, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department distribution */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-5">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData.departmentStats} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {chartData.departmentStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Patient Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Registered', value: patients.length },
              { label: 'Active', value: patients.filter(p => p.status === 'Active').length },
              { label: 'Critical', value: patients.filter(p => p.status === 'Critical').length },
              { label: 'Recovered', value: patients.filter(p => p.status === 'Recovered').length },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Doctor Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Doctors', value: doctors.length },
              { label: 'Active', value: doctors.filter(d => d.status === 'Active').length },
              { label: 'On Leave', value: doctors.filter(d => d.status === 'On Leave').length },
              { label: 'Avg Rating', value: (doctors.reduce((s, d) => s + d.rating, 0) / doctors.length).toFixed(1) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Appointment Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Total', value: appointments.length },
              { label: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length },
              { label: 'Pending', value: appointments.filter(a => a.status === 'Pending').length },
              { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
