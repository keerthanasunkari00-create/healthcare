import { useState } from 'react';
import { Search, Filter, Calendar, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { Doctor } from '../types';
import { DEPARTMENTS } from '../data';

interface DoctorsProps {
  doctors: Doctor[];
  onBookAppointment: (doctor: Doctor) => void;
  loading: boolean;
}

export default function Doctors({ doctors, onBookAppointment, loading }: DoctorsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div id="doctors-view" className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-emerald-800 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent)]"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase font-mono">Specialist Directories</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Elite Medical Specialists</h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Consult with highly qualified, board-certified healthcare professionals across five specialized departments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              id="doctor-search-input"
              type="text"
              placeholder="Search by name, specialty, education or credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Department selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Filter className="w-4 h-4 text-emerald-600" />
            <select
              id="doctor-dept-filter"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full md:w-56 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
          <p className="text-sm text-slate-500 font-mono">Synchronizing clinical registry...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100">
          <p className="text-slate-500 text-base">No medical specialists matched your exact query.</p>
          <button
            id="reset-search-btn"
            onClick={() => { setSearchTerm(''); setSelectedDept('all'); }}
            className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const deptObj = DEPARTMENTS.find(d => d.id === doc.department);
            return (
              <div 
                key={doc.id}
                id={`doctor-card-${doc.id}`}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Doctor Bio and Top Card details */}
                <div>
                  <div className="relative aspect-video bg-emerald-50 overflow-hidden border-b border-slate-50">
                    <img 
                      src={doc.avatar} 
                      alt={doc.name} 
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                      {deptObj?.name || 'Medical Care'}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{doc.name}</h3>
                      <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mt-0.5">{doc.specialty}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{doc.bio}</p>

                    <div className="space-y-2 pt-2 border-t border-slate-50 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{doc.education}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{doc.experience} Years of Clinical Experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Available: {doc.availability.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking trigger */}
                <div className="p-6 pt-0 border-t border-slate-50/50 mt-auto bg-slate-50/30">
                  <button
                    id={`book-doctor-btn-${doc.id}`}
                    onClick={() => onBookAppointment(doc)}
                    className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Book Consultation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
