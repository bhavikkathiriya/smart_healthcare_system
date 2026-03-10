import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import LoginPage from './pages/auth/LoginPage';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import Prescriptions from './pages/patient/Prescriptions';
import MedicalHistory from './pages/patient/MedicalHistory';
import ProfilePage from './pages/patient/ProfilePage';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import PatientRecords from './pages/doctor/PatientRecords';
import WritePrescription from './pages/doctor/WritePrescription';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import SystemOverview from './pages/admin/SystemOverview';

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user?.role}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<PatientDashboard />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="history" element={<MedicalHistory />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<PatientRecords />} />
              <Route path="prescription" element={<WritePrescription />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="doctors" element={<ManageDoctors />} />
              <Route path="patients" element={<ManagePatients />} />
              <Route path="appointments" element={<AppointmentManagement />} />
              <Route path="overview" element={<SystemOverview />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
