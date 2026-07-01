import { useState, useEffect, FormEvent } from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  SlidersHorizontal,
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Bone,
  User,
  Activity,
  Award
} from 'lucide-react';
import { Appointment, AppointmentStatus, Doctor, MedicalReport, UserProfile, UserRole } from '../types';
import { 
  fetchAllAppointments, 
  updateAppointmentStatus, 
  listAllUsers, 
  listAllDoctors, 
  addDoctor, 
  deleteDoctor, 
  fetchAllReports 
} from '../lib/dbHelpers';
import { DEPARTMENTS } from '../data';

export default function AdminPanel() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Active Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'patients' | 'doctors' | 'reports'>('appointments');

  // Search/Filter states
  const [apptSearch, setApptSearch] = useState('');
  const [apptStatusFilter, setApptStatusFilter] = useState('all');
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  // Doctor Form Modal state
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: '',
    department: 'general_medicine',
    experience: 5,
    education: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    availability: ['Monday', 'Wednesday', 'Friday']
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [apptList, ptList, docList, repList] = await Promise.all([
        fetchAllAppointments(),
        listAllUsers(),
        listAllDoctors(),
        fetchAllReports()
      ]);
      setAppointments(apptList);
      setPatients(ptList);
      setDoctors(docList);
      setReports(repList);
    } catch (e) {
      console.error(e);
      setMsg({ text: 'Error fetching administrative records. Access may be blocked by security rules.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, status);
      setMsg({ text: `Appointment status updated to "${status}" successfully.`, isError: false });
      loadAdminData();
    } catch (err) {
      setMsg({ text: 'Failed to update appointment status.', isError: true });
    }
  };

  const handleAddDoctorSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.specialty || !newDoc.education) {
      alert('Please fill out all required doctor fields.');
      return;
    }

    try {
      const docId = `doc-${Math.random().toString(36).substr(2, 9)}`;
      await addDoctor({
        ...newDoc,
        id: docId
      });
      setMsg({ text: `Specialist "${newDoc.name}" added to staff registry successfully.`, isError: false });
      setShowAddDoctorModal(false);
      // Reset doc form
      setNewDoc({
        name: '',
        specialty: '',
        department: 'general_medicine',
        experience: 5,
        education: '',
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
        availability: ['Monday', 'Wednesday', 'Friday']
      });
      loadAdminData();
    } catch (err) {
      setMsg({ text: 'Failed to add doctor profile.', isError: true });
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete doctor profile: "${name}"?`)) return;
    try {
      await deleteDoctor(id);
      setMsg({ text: `Doctor "${name}" removed from registry.`, isError: false });
      loadAdminData();
    } catch (err) {
      setMsg({ text: 'Failed to delete doctor profile.', isError: true });
    }
  };

  // Metrics Calculations
  const metrics = {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
    cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
    completedAppointments: appointments.filter(a => a.status === 'completed').length,
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    totalReports: reports.length
  };

  // Filter lists
  const filteredAppts = appointments.filter((appt) => {
    const matchesSearch = appt.patientName.toLowerCase().includes(apptSearch.toLowerCase()) || 
                          appt.doctorName.toLowerCase().includes(apptSearch.toLowerCase()) ||
                          appt.doctorSpecialty.toLowerCase().includes(apptSearch.toLowerCase());
    const matchesStatus = apptStatusFilter === 'all' || appt.status === apptStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPatients = patients.filter((p) => {
    return p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
           p.email.toLowerCase().includes(patientSearch.toLowerCase());
  });

  const filteredDoctors = doctors.filter((d) => {
    return d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
           d.specialty.toLowerCase().includes(doctorSearch.toLowerCase());
  });

  const handleCheckboxChange = (day: string) => {
    const isAvailable = newDoc.availability.includes(day);
    if (isAvailable) {
      setNewDoc({ ...newDoc, availability: newDoc.availability.filter(d => d !== day) });
    } else {
      setNewDoc({ ...newDoc, availability: [...newDoc.availability, day] });
    }
  };

  return (
    <div id="admin-view" className="space-y-10 pb-16">
      
      {/* Admin Title Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase font-mono">Administrative Control</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Clinical Operations Panel</h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Monitor, track, and manage clinic-wide appointments, verified patient credentials, medical staff profiles, and active records databases.
            </p>
          </div>
          <button
            id="admin-refresh-btn"
            onClick={loadAdminData}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors border border-emerald-700 shrink-0 cursor-pointer"
          >
            Refresh Database
          </button>
        </div>
      </div>

      {msg && (
        <div 
          id="admin-alert" 
          className={`p-4 rounded-xl text-sm flex items-start justify-between gap-3 border ${
            msg.isError 
              ? 'bg-rose-50 border-rose-100 text-rose-700' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}
        >
          <div className="flex items-start gap-2">
            {msg.isError ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-xs font-bold font-mono">Dismiss</button>
        </div>
      )}

      {/* Operations Quick Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultations</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2">{metrics.totalAppointments}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono font-semibold">
            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{metrics.pendingAppointments} Pending</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{metrics.confirmedAppointments} Confirmed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Registered Patients</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2">{metrics.totalPatients}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-3">Verified user identity profiles</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Staff Doctors</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2">{metrics.totalDoctors}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-3">Active board medical professionals</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Medical Records</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-950 mt-2">{metrics.totalReports}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-3">Pathology reports & clinical charts</p>
        </div>

      </div>

      {/* Visual Tracking Dashboard Metrics */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Clinic Consultation Status Distribution</h3>
        
        {/* Visual Bar Percentage Meter */}
        {metrics.totalAppointments > 0 ? (
          <div className="space-y-4">
            <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-100">
              <div 
                style={{ width: `${(metrics.completedAppointments / metrics.totalAppointments) * 100}%` }} 
                className="bg-slate-500 h-full hover:opacity-90 transition-all cursor-pointer"
                title={`Completed: ${metrics.completedAppointments}`}
              />
              <div 
                style={{ width: `${(metrics.confirmedAppointments / metrics.totalAppointments) * 100}%` }} 
                className="bg-emerald-500 h-full hover:opacity-90 transition-all cursor-pointer"
                title={`Confirmed: ${metrics.confirmedAppointments}`}
              />
              <div 
                style={{ width: `${(metrics.pendingAppointments / metrics.totalAppointments) * 100}%` }} 
                className="bg-amber-500 h-full hover:opacity-90 transition-all cursor-pointer"
                title={`Pending: ${metrics.pendingAppointments}`}
              />
              <div 
                style={{ width: `${(metrics.cancelledAppointments / metrics.totalAppointments) * 100}%` }} 
                className="bg-rose-500 h-full hover:opacity-90 transition-all cursor-pointer"
                title={`Cancelled: ${metrics.cancelledAppointments}`}
              />
            </div>
            
            {/* Legend Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-slate-500 rounded" />
                <span className="font-semibold text-slate-700">Completed ({metrics.completedAppointments})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded" />
                <span className="font-semibold text-slate-700">Confirmed ({metrics.confirmedAppointments})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-amber-500 rounded" />
                <span className="font-semibold text-slate-700">Pending ({metrics.pendingAppointments})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-rose-500 rounded" />
                <span className="font-semibold text-slate-700">Cancelled ({metrics.cancelledAppointments})</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-xs font-mono">No consultations recorded in database to map status distribution.</p>
        )}
      </section>

      {/* Sub-Tabs Selector */}
      <div className="flex border-b border-slate-100 overflow-x-auto gap-2">
        {(['appointments', 'patients', 'doctors', 'reports'] as const).map((tab) => (
          <button
            key={tab}
            id={`admin-subtab-${tab}`}
            onClick={() => setActiveSubTab(tab)}
            className={`px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer ${
              activeSubTab === tab
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
          <p className="text-sm text-slate-500 font-mono">Querying admin datastore...</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* TAB 1: APPOINTMENTS */}
          {activeSubTab === 'appointments' && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                  <input
                    id="admin-appt-search"
                    type="text"
                    placeholder="Search consultations by patient, doctor specialty..."
                    value={apptSearch}
                    onChange={(e) => setApptSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <select
                    id="admin-appt-status-filter"
                    value={apptStatusFilter}
                    onChange={(e) => setApptStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Grid or Table list */}
              {filteredAppts.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100">
                  <p className="text-slate-500 text-sm">No scheduled consultations found matching search criteria.</p>
                </div>
              ) : (
                <div id="admin-appt-list" className="grid gap-4">
                  {filteredAppts.map((appt) => (
                    <div 
                      key={appt.id}
                      id={`admin-appt-card-${appt.id}`}
                      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:border-emerald-100 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-base">{appt.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">({appt.patientEmail})</span>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                            appt.status === 'cancelled' 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                              : appt.status === 'completed' 
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : appt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {appt.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <p><span className="font-semibold text-slate-800">Specialist:</span> {appt.doctorName} • <span className="text-emerald-600 font-medium">{appt.doctorSpecialty}</span></p>
                          <p className="font-mono text-[10px] text-slate-400">Consultation Schedule: {appt.date} @ {appt.time}</p>
                        </div>

                        {appt.notes && (
                          <p className="text-xs bg-slate-50/80 p-2.5 rounded-lg border border-slate-100/50 text-slate-600 max-w-xl">
                            <span className="font-semibold text-slate-800">Symptoms:</span> {appt.notes}
                          </p>
                        )}
                      </div>

                      {/* Administrative actions */}
                      <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                        {appt.status === AppointmentStatus.PENDING && (
                          <button
                            id={`admin-confirm-appt-${appt.id}`}
                            onClick={() => handleUpdateStatus(appt.id, AppointmentStatus.CONFIRMED)}
                            className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                            title="Confirm Consultation"
                          >
                            <Check className="w-4 h-4" />
                            Confirm
                          </button>
                        )}

                        {appt.status === AppointmentStatus.CONFIRMED && (
                          <button
                            id={`admin-complete-appt-${appt.id}`}
                            onClick={() => handleUpdateStatus(appt.id, AppointmentStatus.COMPLETED)}
                            className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Complete
                          </button>
                        )}

                        {appt.status !== AppointmentStatus.CANCELLED && appt.status !== AppointmentStatus.COMPLETED && (
                          <button
                            id={`admin-cancel-appt-${appt.id}`}
                            onClick={() => handleUpdateStatus(appt.id, AppointmentStatus.CANCELLED)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl border border-rose-150 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                            title="Cancel Appointment"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PATIENTS */}
          {activeSubTab === 'patients' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                <input
                  id="admin-patient-search"
                  type="text"
                  placeholder="Search registered patients by name or email address..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              {filteredPatients.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100">
                  <p className="text-slate-500 text-sm">No patient profiles match your search criteria.</p>
                </div>
              ) : (
                <div id="admin-patient-list" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((p) => {
                    const patientAppts = appointments.filter(a => a.patientId === p.uid);
                    const patientReps = reports.filter(r => r.patientId === p.uid);
                    return (
                      <div 
                        key={p.uid}
                        id={`admin-patient-card-${p.uid}`}
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                            <p className="text-[10px] text-slate-500 font-mono line-clamp-1">{p.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-3 text-xs text-slate-500">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</p>
                            <p className="text-slate-800 font-bold mt-0.5">{patientAppts.length} appointments</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Clinical Reports</p>
                            <p className="text-slate-800 font-bold mt-0.5">{patientReps.length} files</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCTORS */}
          {activeSubTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                  <input
                    id="admin-doctor-search"
                    type="text"
                    placeholder="Search staff specialists..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
                <button
                  id="admin-add-doctor-btn"
                  onClick={() => setShowAddDoctorModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Register Doctor
                </button>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100">
                  <p className="text-slate-500 text-sm">No board doctors match your search query.</p>
                </div>
              ) : (
                <div id="admin-doctor-list" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDoctors.map((doc) => {
                    const deptObj = DEPARTMENTS.find(d => d.id === doc.department);
                    return (
                      <div 
                        key={doc.id}
                        id={`admin-doctor-card-${doc.id}`}
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:border-emerald-100 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={doc.avatar} 
                              alt={doc.name} 
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">{doc.specialty}</p>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-50">
                            <p><span className="font-semibold text-slate-800">Clinic:</span> {deptObj?.name || 'General Care'}</p>
                            <p><span className="font-semibold text-slate-800">Education:</span> {doc.education}</p>
                            <p><span className="font-semibold text-slate-800">Experience:</span> {doc.experience} years</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center bg-slate-50/20 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Ref: {doc.id}</span>
                          <button
                            id={`admin-delete-doctor-${doc.id}`}
                            onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                            title="Remove Doctor Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {activeSubTab === 'reports' && (
            <div className="space-y-6">
              {reports.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100">
                  <p className="text-slate-500 text-sm">No pathology or diagnosis reports recorded in database.</p>
                </div>
              ) : (
                <div id="admin-reports-list" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-500">
                      <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-100 font-mono font-bold">
                        <tr>
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Document Title</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Format</th>
                          <th className="px-6 py-4">Size</th>
                          <th className="px-6 py-4">Uploaded At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-normal">
                        {reports.map((rep) => (
                          <tr key={rep.id} id={`admin-report-row-${rep.id}`} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-slate-900">{rep.patientName}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-700">{rep.title}</td>
                            <td className="px-6 py-4">{rep.date}</td>
                            <td className="px-6 py-4 font-mono uppercase font-bold text-[10px]">{rep.fileType}</td>
                            <td className="px-6 py-4 font-mono text-[10px]">{rep.fileSize}</td>
                            <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{new Date(rep.uploadedAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Register Staff Doctor Modal */}
      {showAddDoctorModal && (
        <div id="doctor-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-emerald-100 shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Staff Doctor Profile</h3>
                <p className="text-xs font-semibold text-emerald-700">Enter MD credentials and specialties</p>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Allison Becker"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Specialty / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cardiologist Researcher"
                    value={newDoc.specialty}
                    onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Department *</label>
                  <select
                    value={newDoc.department}
                    onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={newDoc.experience}
                    onChange={(e) => setNewDoc({ ...newDoc, experience: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Education / MD Credentials *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., MD - Harvard Medical School"
                    value={newDoc.education}
                    onChange={(e) => setNewDoc({ ...newDoc, education: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Professional Biography</label>
                <textarea
                  rows={2}
                  placeholder="Enter a brief summary of doctor's medical background..."
                  value={newDoc.bio}
                  onChange={(e) => setNewDoc({ ...newDoc, bio: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Weekly Availability *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                    const checked = newDoc.availability.includes(day);
                    return (
                      <label key={day} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-150 rounded-lg text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckboxChange(day)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span>{day}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-700 shadow-sm transition-colors cursor-pointer"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
