import { Stethoscope, LogIn, ShieldAlert, Award, FileText, Calendar } from 'lucide-react';

interface AuthProps {
  onSignIn: () => void;
  loading: boolean;
}

export default function Auth({ onSignIn, loading }: AuthProps) {
  return (
    <div id="auth-view" className="max-w-md mx-auto my-16 bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-xl animate-fade-in">
      {/* Header Banner */}
      <div className="bg-emerald-800 text-white p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.25),transparent)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 bg-emerald-700/60 rounded-2xl text-white border border-emerald-500/30 mb-4 animate-pulse">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-sans">Hospital Patient Portal</h2>
          <p className="text-emerald-100 text-xs mt-1.5 font-normal">Secure board consultations & diagnostics</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-center font-normal">
            To book clinical consultations, view diagnostic lab results, and upload prescriptions securely, please authenticate your profile.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-700">Schedule real-time available slots</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-700">Access and catalog pathology reports</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-700">Verified HIPAA-compliant security</span>
            </div>
          </div>
        </div>

        {/* Action Sign In */}
        <div className="pt-4">
          <button
            id="auth-signin-btn"
            onClick={onSignIn}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold border border-emerald-700 shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Securing link...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5" />
                <span>Authenticate with Google Account</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-factor biometric protection active</span>
        </div>
      </div>
    </div>
  );
}
