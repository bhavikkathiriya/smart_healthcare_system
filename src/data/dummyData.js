export const doctors = [
  { id: 'D001', name: 'Dr. Sarah Mitchell', specialty: 'Cardiology', email: 'sarah@medicare.com', phone: '+1-555-0101', patients: 142, rating: 4.9, status: 'Active', experience: '12 years', avatar: 'SM', schedule: 'Mon-Fri', nextSlot: '10:00 AM' },
  { id: 'D002', name: 'Dr. James Rivera', specialty: 'Neurology', email: 'james@medicare.com', phone: '+1-555-0102', patients: 98, rating: 4.7, status: 'Active', experience: '8 years', avatar: 'JR', schedule: 'Mon-Thu', nextSlot: '2:30 PM' },
  { id: 'D003', name: 'Dr. Emily Chen', specialty: 'Orthopedics', email: 'emily@medicare.com', phone: '+1-555-0103', patients: 175, rating: 4.8, status: 'Active', experience: '15 years', avatar: 'EC', schedule: 'Tue-Sat', nextSlot: '11:00 AM' },
  { id: 'D004', name: 'Dr. Michael Brooks', specialty: 'Pediatrics', email: 'michael@medicare.com', phone: '+1-555-0104', patients: 220, rating: 4.9, status: 'Active', experience: '10 years', avatar: 'MB', schedule: 'Mon-Fri', nextSlot: '9:00 AM' },
  { id: 'D005', name: 'Dr. Aisha Patel', specialty: 'Dermatology', email: 'aisha@medicare.com', phone: '+1-555-0105', patients: 88, rating: 4.6, status: 'On Leave', experience: '6 years', avatar: 'AP', schedule: 'Mon-Wed', nextSlot: 'N/A' },
  { id: 'D006', name: 'Dr. Robert Kim', specialty: 'Oncology', email: 'robert@medicare.com', phone: '+1-555-0106', patients: 65, rating: 4.8, status: 'Active', experience: '18 years', avatar: 'RK', schedule: 'Mon-Fri', nextSlot: '3:00 PM' },
];

export const patients = [
  { id: 'P001', name: 'Alex Johnson', age: 34, gender: 'Male', email: 'alex@example.com', phone: '+1-555-0201', bloodGroup: 'O+', doctor: 'Dr. Sarah Mitchell', lastVisit: '2024-03-10', status: 'Active', condition: 'Hypertension', avatar: 'AJ' },
  { id: 'P002', name: 'Maria Garcia', age: 28, gender: 'Female', email: 'maria@example.com', phone: '+1-555-0202', bloodGroup: 'A+', doctor: 'Dr. Emily Chen', lastVisit: '2024-03-08', status: 'Active', condition: 'Fracture Recovery', avatar: 'MG' },
  { id: 'P003', name: 'David Wilson', age: 52, gender: 'Male', email: 'david@example.com', phone: '+1-555-0203', bloodGroup: 'B-', doctor: 'Dr. James Rivera', lastVisit: '2024-03-05', status: 'Critical', condition: 'Migraine Disorder', avatar: 'DW' },
  { id: 'P004', name: 'Sophie Turner', age: 8, gender: 'Female', email: 'sophie.p@example.com', phone: '+1-555-0204', bloodGroup: 'AB+', doctor: 'Dr. Michael Brooks', lastVisit: '2024-03-12', status: 'Active', condition: 'Flu', avatar: 'ST' },
  { id: 'P005', name: 'James Martinez', age: 61, gender: 'Male', email: 'james.m@example.com', phone: '+1-555-0205', bloodGroup: 'O-', doctor: 'Dr. Robert Kim', lastVisit: '2024-02-28', status: 'Under Observation', condition: 'Lymphoma', avatar: 'JM' },
  { id: 'P006', name: 'Linda Brown', age: 45, gender: 'Female', email: 'linda@example.com', phone: '+1-555-0206', bloodGroup: 'A-', doctor: 'Dr. Sarah Mitchell', lastVisit: '2024-03-11', status: 'Active', condition: 'Cardiac Arrhythmia', avatar: 'LB' },
  { id: 'P007', name: 'Kevin Zhang', age: 39, gender: 'Male', email: 'kevin@example.com', phone: '+1-555-0207', bloodGroup: 'B+', doctor: 'Dr. Aisha Patel', lastVisit: '2024-03-01', status: 'Active', condition: 'Eczema', avatar: 'KZ' },
  { id: 'P008', name: 'Nina Patel', age: 30, gender: 'Female', email: 'nina@example.com', phone: '+1-555-0208', bloodGroup: 'O+', doctor: 'Dr. Emily Chen', lastVisit: '2024-03-09', status: 'Recovered', condition: 'Knee Surgery', avatar: 'NP' },
];

export const appointments = [
  { id: 'A001', patientId: 'P001', patientName: 'Alex Johnson', doctorId: 'D001', doctorName: 'Dr. Sarah Mitchell', date: '2024-03-18', time: '10:00 AM', type: 'Follow-up', status: 'Confirmed', notes: 'Blood pressure monitoring', department: 'Cardiology' },
  { id: 'A002', patientId: 'P002', patientName: 'Maria Garcia', doctorId: 'D003', doctorName: 'Dr. Emily Chen', date: '2024-03-18', time: '11:30 AM', type: 'Check-up', status: 'Pending', notes: 'Post-surgery evaluation', department: 'Orthopedics' },
  { id: 'A003', patientId: 'P003', patientName: 'David Wilson', doctorId: 'D002', doctorName: 'Dr. James Rivera', date: '2024-03-19', time: '2:00 PM', type: 'Consultation', status: 'Confirmed', notes: 'MRI results discussion', department: 'Neurology' },
  { id: 'A004', patientId: 'P004', patientName: 'Sophie Turner', doctorId: 'D004', doctorName: 'Dr. Michael Brooks', date: '2024-03-19', time: '9:30 AM', type: 'Emergency', status: 'Completed', notes: 'High fever treatment', department: 'Pediatrics' },
  { id: 'A005', patientId: 'P005', patientName: 'James Martinez', doctorId: 'D006', doctorName: 'Dr. Robert Kim', date: '2024-03-20', time: '3:00 PM', type: 'Consultation', status: 'Confirmed', notes: 'Chemotherapy planning', department: 'Oncology' },
  { id: 'A006', patientId: 'P006', patientName: 'Linda Brown', doctorId: 'D001', doctorName: 'Dr. Sarah Mitchell', date: '2024-03-20', time: '11:00 AM', type: 'Follow-up', status: 'Pending', notes: 'ECG review', department: 'Cardiology' },
  { id: 'A007', patientId: 'P007', patientName: 'Kevin Zhang', doctorId: 'D005', doctorName: 'Dr. Aisha Patel', date: '2024-03-21', time: '10:30 AM', type: 'Check-up', status: 'Cancelled', notes: 'Skin condition assessment', department: 'Dermatology' },
  { id: 'A008', patientId: 'P001', patientName: 'Alex Johnson', doctorId: 'D001', doctorName: 'Dr. Sarah Mitchell', date: '2024-03-22', time: '9:00 AM', type: 'Follow-up', status: 'Confirmed', notes: 'Medication adjustment', department: 'Cardiology' },
];

export const prescriptions = [
  {
    id: 'RX001', patientId: 'P001', patientName: 'Alex Johnson', doctorId: 'D001', doctorName: 'Dr. Sarah Mitchell',
    date: '2024-03-10', diagnosis: 'Hypertension Stage 1',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in morning with water' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with or without food' },
    ],
    notes: 'Monitor BP daily. Reduce sodium intake. Follow up in 4 weeks.', status: 'Active'
  },
  {
    id: 'RX002', patientId: 'P001', patientName: 'Alex Johnson', doctorId: 'D001', doctorName: 'Dr. Sarah Mitchell',
    date: '2024-02-10', diagnosis: 'Upper Respiratory Infection',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Thrice daily', duration: '7 days', instructions: 'Take after meals' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at night', duration: '7 days', instructions: 'May cause drowsiness' },
    ],
    notes: 'Complete the full antibiotic course. Rest adequately.', status: 'Completed'
  },
];

export const medicalHistory = [
  { id: 'MH001', patientId: 'P001', date: '2024-03-10', type: 'Consultation', description: 'Blood pressure review - BP: 145/92 mmHg. Medication adjusted.', doctor: 'Dr. Sarah Mitchell', outcome: 'Medication changed' },
  { id: 'MH002', patientId: 'P001', date: '2024-02-10', type: 'Lab Tests', description: 'Complete blood count, lipid panel, kidney function tests. Results normal except mild hyperlipidemia.', doctor: 'Dr. Sarah Mitchell', outcome: 'Diet counseling' },
  { id: 'MH003', patientId: 'P001', date: '2024-01-15', type: 'Emergency', description: 'Acute chest discomfort. ECG performed, ruled out MI. Diagnosed as muscle strain.', doctor: 'Dr. Sarah Mitchell', outcome: 'Discharged with pain meds' },
  { id: 'MH004', patientId: 'P001', date: '2023-11-20', type: 'Surgery', description: 'Minor appendectomy procedure. No complications. Recovery normal.', doctor: 'Dr. Emily Chen', outcome: 'Full recovery' },
];

export const chartData = {
  appointmentsByMonth: [
    { month: 'Oct', appointments: 145 }, { month: 'Nov', appointments: 162 },
    { month: 'Dec', appointments: 138 }, { month: 'Jan', appointments: 178 },
    { month: 'Feb', appointments: 195 }, { month: 'Mar', appointments: 214 },
  ],
  departmentStats: [
    { name: 'Cardiology', value: 32 }, { name: 'Neurology', value: 18 },
    { name: 'Orthopedics', value: 24 }, { name: 'Pediatrics', value: 16 },
    { name: 'Oncology', value: 10 },
  ],
  patientVitals: [
    { time: '8AM', bp: 142, hr: 78, spo2: 98 }, { time: '10AM', bp: 138, hr: 82, spo2: 97 },
    { time: '12PM', bp: 135, hr: 75, spo2: 98 }, { time: '2PM', bp: 140, hr: 80, spo2: 97 },
    { time: '4PM', bp: 137, hr: 77, spo2: 99 }, { time: '6PM', bp: 133, hr: 74, spo2: 98 },
  ],
  weeklyPatients: [
    { day: 'Mon', new: 12, returning: 28 }, { day: 'Tue', new: 18, returning: 32 },
    { day: 'Wed', new: 15, returning: 25 }, { day: 'Thu', new: 22, returning: 38 },
    { day: 'Fri', new: 19, returning: 30 }, { day: 'Sat', new: 8, returning: 15 },
  ],
};

export const notifications = [
  { id: 1, type: 'appointment', message: 'Appointment with Dr. Sarah Mitchell confirmed for Mar 18', time: '2 hours ago', read: false },
  { id: 2, type: 'prescription', message: 'New prescription added: Lisinopril 10mg', time: '1 day ago', read: false },
  { id: 3, type: 'lab', message: 'Lab results are ready for review', time: '2 days ago', read: true },
  { id: 4, type: 'reminder', message: 'Upcoming appointment tomorrow at 10:00 AM', time: '3 days ago', read: true },
];

export const availableSlots = [
  { date: '2024-03-18', slots: ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'] },
  { date: '2024-03-19', slots: ['8:30 AM', '11:00 AM', '1:30 PM', '4:00 PM'] },
  { date: '2024-03-20', slots: ['9:30 AM', '12:00 PM', '2:30 PM', '5:00 PM'] },
];
