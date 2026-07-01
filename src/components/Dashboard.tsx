import { useState, useEffect, DragEvent, ChangeEvent, FormEvent } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Trash2, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Download, 
  FileUp,
  X,
  Info
} from 'lucide-react';
import { Appointment, MedicalReport, UserProfile } from '../types';
import { 
  fetchAppointmentsForPatient, 
  cancelAppointment, 
  fetchReportsForPatient, 
  uploadMedicalReport, 
  deleteMedicalReport 
} from '../lib/dbHelpers';

interface DashboardProps {
  user: UserProfile;
}

export default function Dashboard({ user }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportNotes, setReportNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  // Detail view state
  const [viewingReport, setViewingReport] = useState<MedicalReport | null>(null);

  const loadData = async () => {
    try {
      setLoadingAppts(true);
      const apptList = await fetchAppointmentsForPatient(user.uid);
      setAppointments(apptList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAppts(false);
    }

    try {
      setLoadingReports(true);
      const reportList = await fetchReportsForPatient(user.uid);
      setReports(reportList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.uid]);

  const handleCancelAppt = async (apptId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(apptId);
      setMsg({ text: 'Appointment cancelled successfully.', isError: false });
      loadData();
    } catch (err) {
      setMsg({ text: 'Failed to cancel appointment.', isError: true });
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setSelectedFile({
      name: file.name,
      size: `${sizeInMB} MB`,
      type: file.type || 'application/pdf'
    });
    setReportTitle(file.name.split('.')[0]); // Default title to filename
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !reportTitle) return;

    setUploading(true);
    try {
      await uploadMedicalReport({
        patientId: user.uid,
        patientName: user.name,
        title: reportTitle,
        date: reportDate,
        fileUrl: `mock-url-for-${reportTitle.toLowerCase().replace(/\s+/g, '-')}`, // Mock secure URL simulation
        fileType: selectedFile.type.split('/')[1]?.toUpperCase() || 'PDF',
        fileSize: selectedFile.size,
        notes: reportNotes
      });

      setMsg({ text: `Medical report "${reportTitle}" uploaded successfully.`, isError: false });
      setShowUploadModal(false);
      setSelectedFile(null);
      setReportTitle('');
      setReportNotes('');
      loadData();
    } catch (err) {
      setMsg({ text: 'Failed to upload report.', isError: true });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReport = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete report: "${title}"?`)) return;
    try {
      await deleteMedicalReport(id);
      setMsg({ text: `Report "${title}" deleted successfully.`, isError: false });
      loadData();
    } catch (err) {
      setMsg({ text: 'Failed to delete report.', isError: true });
    }
  };

  return (
    <div id="dashboard-view" className="space-y-10 pb-16">
      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center font-bold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500 font-medium font-mono">{user.email}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Patient Registry ID: {user.uid.substring(0, 10).toUpperCase()}...</p>
          </div>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 flex gap-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultations</p>
            <p className="text-xl font-extrabold text-emerald-800">{appointments.filter(a => a.status !== 'cancelled').length}</p>
          </div>
          <div className="border-l border-emerald-100/80 pl-6">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reports Vault</p>
            <p className="text-xl font-extrabold text-emerald-800">{reports.length}</p>
          </div>
        </div>
      </div>

      {msg && (
        <div 
          id="dashboard-alert" 
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
          <button id="close-alert-btn" onClick={() => setMsg(null)} className="text-xs font-bold font-mono">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Appointments & Reports */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Appointments Section */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              My Scheduled Consultations
            </h2>
          </div>

          {loadingAppts ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 font-mono mt-4">Retrieving active schedules...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center">
              <p className="text-slate-500 text-sm">You have no scheduled medical consultations.</p>
              <p className="text-slate-400 text-xs mt-1">Book an appointment from our doctors directory.</p>
            </div>
          ) : (
            <div id="appointment-list" className="space-y-4">
              {appointments.map((appt) => {
                const isCancelled = appt.status === 'cancelled';
                const isCompleted = appt.status === 'completed';
                const isPending = appt.status === 'pending';
                const isConfirmed = appt.status === 'confirmed';

                return (
                  <div 
                    key={appt.id}
                    id={`appt-card-${appt.id}`}
                    className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                      isCancelled ? 'opacity-60 border-slate-100 bg-slate-50/20' : 'border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-slate-900 text-base">{appt.doctorName}</h4>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                            isCancelled 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                              : isCompleted 
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : isConfirmed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mt-0.5">{appt.doctorSpecialty}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{appt.time}</span>
                          </div>
                        </div>

                        {appt.notes && (
                          <div className="mt-2.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100/50 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800">Symptoms:</span> {appt.notes}
                          </div>
                        )}
                      </div>

                      {/* Cancel action */}
                      {!isCancelled && !isCompleted && (
                        <button
                          id={`cancel-appt-btn-${appt.id}`}
                          onClick={() => handleCancelAppt(appt.id)}
                          className="px-3.5 py-2 bg-white text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Reports Section with Drag and Drop Uploader */}
        <section className="lg:col-span-5 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Medical Reports Vault
          </h2>

          {/* Drag & Drop Upload Zone */}
          <div 
            id="report-drag-zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-50/40' 
                : 'border-slate-200 hover:border-emerald-300 bg-slate-50/40'
            }`}
          >
            <input 
              type="file" 
              id="report-file-input"
              className="hidden" 
              onChange={handleFileInputChange} 
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <label htmlFor="report-file-input" className="cursor-pointer space-y-3 block">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl w-fit mx-auto border border-emerald-200">
                <FileUp className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Drag & Drop Clinical Records</p>
                <p className="text-xs text-slate-500 mt-1">Or click to select files (PDF, JPG, PNG)</p>
              </div>
            </label>
          </div>

          {/* Reports List */}
          {loadingReports ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 font-mono mt-4">Retrieving reports vault...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
              <p className="text-slate-500 text-sm font-medium">No medical documents uploaded.</p>
              <p className="text-slate-400 text-xs mt-1">Safely catalog prescription history or pathology reports here.</p>
            </div>
          ) : (
            <div id="report-list" className="space-y-3">
              {reports.map((rep) => (
                <div 
                  key={rep.id}
                  id={`report-card-${rep.id}`}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:border-emerald-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 
                        onClick={() => setViewingReport(rep)}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-1"
                      >
                        {rep.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Uploaded: {rep.date} • {rep.fileType} • {rep.fileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`view-report-btn-${rep.id}`}
                      onClick={() => setViewingReport(rep)}
                      className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
                      title="View Notes"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      id={`delete-report-btn-${rep.id}`}
                      onClick={() => handleDeleteReport(rep.id, rep.title)}
                      className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg border border-slate-100 hover:border-rose-200 transition-all cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Upload Details Confirmation Modal */}
      {showUploadModal && selectedFile && (
        <div id="upload-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-emerald-100 shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Metadata Catalog</h3>
                <p className="text-xs font-semibold text-emerald-700">Tag your document with clinical records</p>
              </div>
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                <p><span className="font-bold text-slate-800">File:</span> {selectedFile.name}</p>
                <p className="mt-1"><span className="font-bold text-slate-800">Size:</span> {selectedFile.size} • <span className="font-bold text-slate-800">Type:</span> {selectedFile.type}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Document Title</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Report Date</label>
                <input
                  type="date"
                  required
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Clinical Notes / Findings</label>
                <textarea
                  rows={3}
                  placeholder="Enter diagnostic notes, prescriptions, or summary of results..."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Details Dialog */}
      {viewingReport && (
        <div id="view-report-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-emerald-100 shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Clinical Record View</h3>
                <p className="text-xs font-semibold text-emerald-700">Pathology or diagnostics details</p>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-bold text-slate-900">{viewingReport.title}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Report ID: {viewingReport.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Record Date</p>
                  <p className="text-slate-800 mt-1 font-semibold">{viewingReport.date}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">File Metadata</p>
                  <p className="text-slate-800 mt-1 font-semibold">{viewingReport.fileType} ({viewingReport.fileSize})</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <p className="font-semibold text-slate-500 text-xs">Diagnostic findings or Notes:</p>
                <p className="text-slate-700 text-xs whitespace-pre-wrap leading-relaxed font-normal">
                  {viewingReport.notes || 'No specific diagnostic notes entered for this file record.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setViewingReport(null)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-700 shadow-sm transition-colors cursor-pointer"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
