import React from 'react';
import { Clock, Calendar, User, Stethoscope, ChevronRight } from 'lucide-react';

const statusBadge = {
  Confirmed: 'badge-green',
  Pending: 'badge-yellow',
  Cancelled: 'badge-red',
  Completed: 'badge-blue',
};

export default function AppointmentCard({ appointment, role, onAction }) {
  const badge = statusBadge[appointment.status] || 'badge-gray';
  return (
    <div className="card p-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={badge}>{appointment.status}</span>
            <span className="badge-gray capitalize">{appointment.type}</span>
          </div>
          <p className="font-semibold text-slate-800 text-sm">
            {role === 'patient' ? appointment.doctorName : appointment.patientName}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{appointment.department}</p>
          <p className="text-xs text-slate-400 mt-2 line-clamp-1">{appointment.notes}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500 justify-end">
            <Calendar size={12} />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary-600 font-semibold justify-end mt-1">
            <Clock size={12} />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>
      {onAction && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
          {appointment.status === 'Pending' && (
            <button onClick={() => onAction('confirm', appointment.id)}
              className="flex-1 btn-primary text-xs py-2">Confirm</button>
          )}
          {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
            <button onClick={() => onAction('cancel', appointment.id)}
              className="flex-1 btn-secondary text-xs py-2">Cancel</button>
          )}
          <button onClick={() => onAction('view', appointment.id)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
