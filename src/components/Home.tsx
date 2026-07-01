import { useState } from 'react';
import { 
  Heart, 
  Baby, 
  Brain, 
  Bone, 
  Stethoscope, 
  ShieldCheck, 
  CalendarCheck, 
  Clock, 
  Activity, 
  Users, 
  Award, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { DEPARTMENTS } from '../data';
import { Department } from '../types';

interface HomeProps {
  onBookNow: () => void;
  onExploreDoctors: () => void;
}

export default function Home({ onBookNow, onExploreDoctors }: HomeProps) {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Heart': return <Heart className="w-8 h-8 text-emerald-600" />;
      case 'Baby': return <Baby className="w-8 h-8 text-emerald-600" />;
      case 'Brain': return <Brain className="w-8 h-8 text-emerald-600" />;
      case 'Bone': return <Bone className="w-8 h-8 text-emerald-600" />;
      case 'Stethoscope': return <Stethoscope className="w-8 h-8 text-emerald-600" />;
      default: return <Stethoscope className="w-8 h-8 text-emerald-600" />;
    }
  };

  const quickStats = [
    { value: '45+', label: 'Specialist Doctors', icon: <Users className="w-5 h-5 text-emerald-600" /> },
    { value: '25,000+', label: 'Successful Treatments', icon: <Activity className="w-5 h-5 text-emerald-600" /> },
    { value: '99.4%', label: 'Patient Satisfaction', icon: <Award className="w-5 h-5 text-emerald-600" /> },
    { value: '24/7', label: 'Emergency Response', icon: <Clock className="w-5 h-5 text-emerald-600" /> }
  ];

  return (
    <div id="home-view" className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 pt-16 pb-20 overflow-hidden border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200 mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Accredited Multi-Specialty Clinic
              </span>
              <h1 className="text-4xl sm:text-5xl font-sans tracking-tight text-slate-900 font-extrabold leading-tight">
                Healthcare Crafted for <br />
                <span className="text-emerald-600 font-medium">Your Family’s Well-being</span>
              </h1>
              <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                Connect with world-class medical specialists, book appointments effortlessly, and access clinical medical records, and reports securely from anywhere.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  id="hero-book-btn"
                  onClick={onBookNow}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold border border-emerald-700 shadow-md transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Schedule Appointment
                </button>
                <button
                  id="hero-doctors-btn"
                  onClick={onExploreDoctors}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 shadow-sm transition-all cursor-pointer"
                >
                  Browse Medical Staff
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Hero Banner */}
            <div className="mt-12 lg:mt-0 lg:col-span-6 relative flex justify-center">
              <div className="w-full max-w-lg aspect-square relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-emerald-50">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600&h=600" 
                  alt="Modern Hospital Clinic Team"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/25 shadow-lg flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500 rounded-xl text-white">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Emergency Services</h4>
                    <p className="text-sm font-medium text-emerald-800">+1 (800) 247-HEAL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Clinical Departments</h2>
          <p className="text-slate-600 mt-2 text-sm">
            We provide specialized, high-acuity medical care and outpatient consultations across a wide range of departments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DEPARTMENTS.map((dept) => {
            const isOpen = selectedDept === dept.id;
            return (
              <div
                key={dept.id}
                id={`dept-card-${dept.id}`}
                className={`bg-white rounded-2xl border p-6 transition-all shadow-sm flex flex-col justify-between cursor-pointer ${
                  isOpen 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                    : 'border-slate-100 hover:border-emerald-300'
                }`}
                onClick={() => setSelectedDept(isOpen ? null : dept.id)}
              >
                <div>
                  <div className="p-3 bg-emerald-50/80 rounded-xl w-fit mb-4">
                    {getIcon(dept.icon)}
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-emerald-600">
                  <span className="text-xs font-semibold">Learn more</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Department Modal/Accordion panel below */}
        {selectedDept && (
          <div id="dept-details-panel" className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/60 animate-fade-in">
            {(() => {
              const dept = DEPARTMENTS.find(d => d.id === selectedDept);
              if (!dept) return null;
              return (
                <div className="sm:flex justify-between items-center gap-8">
                  <div className="space-y-3 max-w-3xl">
                    <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase font-mono">Detailed Clinical Profile</span>
                    <h3 className="text-xl font-bold text-slate-900">{dept.name} Care</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{dept.detailedInfo}</p>
                  </div>
                  <div className="mt-6 sm:mt-0 shrink-0">
                    <button
                      id={`dept-action-btn-${dept.id}`}
                      onClick={() => onExploreDoctors()}
                      className="px-5 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      View Specialists
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* Clinic Features */}
      <section className="bg-slate-50/60 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Our Standard of Professional Clinical Excellence
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hospital Portal delivers comprehensive medical services backed by verified credentials, state-of-the-art facilities, and certified doctors.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Verified Board-Certified Doctors</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Every doctor possesses validated MD credentials and decades of expertise.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Secure HIPAA-Compliant Portals</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Your medical test reports, diagnosis documents, and charts are fully encrypted.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 lg:col-span-7 grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 w-fit">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Instant Booking Engine</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select available dates, times, and instantly reserve slots with your preferred specialist doctor.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Dynamic Patient Dashboard</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Check upcoming consultations, cancel appointments dynamically, and secure electronic health documents.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Encrypted Reports Vault</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Safely upload PDFs, medical prescriptions, and test results into a secure cloud environment.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 w-fit">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Administrative Tracker</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Administrators can manage appointments, update doctor status, check overall patient records in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
