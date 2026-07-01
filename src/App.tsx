import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';
import { syncUserProfile, listAllDoctors, bookAppointment } from './lib/dbHelpers';
import { UserProfile, Doctor, UserRole } from './types';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Doctors from './components/Doctors';
import BookingModal from './components/BookingModal';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';

import { Stethoscope, Calendar, Heart, ShieldAlert, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Booking Modal states
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(
            user.uid,
            user.email || 'patient@hospital.org',
            user.displayName || 'Valued Patient'
          );
          setUserProfile(profile);
        } catch (err) {
          console.error('Error syncing user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Load doctors registry
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const list = await listAllDoctors();
        setDoctors(list);
      } catch (err) {
        console.error('Error fetching doctors list:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // 3. User Sign In trigger (Google Pop-up)
  const handleSignIn = async () => {
    setLoadingAuth(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(
          result.user.uid,
          result.user.email || 'patient@hospital.org',
          result.user.displayName || 'Valued Patient'
        );
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      alert('Authentication with Google was cancelled or failed.');
    } finally {
      setLoadingAuth(false);
    }
  };

  // 4. User Sign Out trigger
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUserProfile(null);
      setActiveTab('home');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // 5. Book appointment execution
  const handleBookNowTrigger = (doctor: Doctor) => {
    if (!firebaseUser) {
      alert('Please log in with Google to schedule consultations.');
      setActiveTab('doctors');
      handleSignIn();
      return;
    }
    setSelectedDoctorForBooking(doctor);
  };

  const handleConfirmBooking = async (date: string, time: string, notes: string) => {
    if (!userProfile || !selectedDoctorForBooking) return;

    try {
      await bookAppointment({
        patientId: userProfile.uid,
        patientName: userProfile.name,
        patientEmail: userProfile.email,
        doctorId: selectedDoctorForBooking.id,
        doctorName: selectedDoctorForBooking.name,
        doctorSpecialty: selectedDoctorForBooking.specialty,
        date,
        time,
        notes
      });

      setSelectedDoctorForBooking(null);
      setSuccessMsg(`Your consultation with ${selectedDoctorForBooking.name} is successfully booked for ${date} at ${time}.`);
      
      // Auto switch to dashboard to view bookings
      if (userProfile.role === UserRole.ADMIN) {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }

      // Auto clear alert
      setTimeout(() => {
        setSuccessMsg(null);
      }, 7000);
    } catch (err) {
      console.error(err);
      alert('Failed to complete consultation booking. Please check database permissions.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Header */}
      <Navbar
        user={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        loading={loadingAuth}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {successMsg && (
          <div 
            id="app-global-success-alert"
            className="mb-6 p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-sm flex items-start justify-between gap-3 shadow-sm animate-fade-in"
          >
            <div className="flex items-start gap-2">
              <span className="font-bold">✓ Success:</span>
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-xs font-mono font-bold hover:text-emerald-950">Dismiss</button>
          </div>
        )}

        {/* Dynamic Route/Tab Display rendering */}
        {activeTab === 'home' && (
          <Home 
            onBookNow={() => setActiveTab('doctors')}
            onExploreDoctors={() => setActiveTab('doctors')}
          />
        )}

        {activeTab === 'doctors' && (
          <Doctors 
            doctors={doctors}
            onBookAppointment={handleBookNowTrigger}
            loading={loadingDoctors}
          />
        )}

        {/* Dashboard Access Protection */}
        {activeTab === 'dashboard' && (
          userProfile ? (
            <Dashboard user={userProfile} />
          ) : (
            <Auth onSignIn={handleSignIn} loading={loadingAuth} />
          )
        )}

        {/* Admin Access Protection */}
        {activeTab === 'admin' && (
          userProfile && userProfile.role === UserRole.ADMIN ? (
            <AdminPanel />
          ) : (
            <div className="max-w-md mx-auto my-16 bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-md">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
              <h2 className="text-lg font-bold text-slate-900 mt-4">Administrative Privilege Required</h2>
              <p className="text-slate-500 text-xs mt-2 font-normal">
                Access is strictly restricted. Only hospital administrators can access this view. If you have administrative credentials, please sign in with an authorized account.
              </p>
              <button
                onClick={handleSignIn}
                className="mt-6 w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold border border-slate-950 transition-colors cursor-pointer"
              >
                Sign In with Administrative Credentials
              </button>
            </div>
          )
        )}

      </main>

      {/* Booking Modal Popup */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBook={handleConfirmBooking}
        />
      )}

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-medium text-slate-500">Hospital Portal System • Certified Medical Group Outpatient Services</p>
          <p className="text-[10px] font-normal leading-relaxed">
            All clinical logs, reports, and communication records are subject to strict electronic record security protocols (HIPAA and board compliance active).
          </p>
        </div>
      </footer>

    </div>
  );
}
