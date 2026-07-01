import { useState, FormEvent } from 'react';
import { Calendar, Clock, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Doctor } from '../types';
import { TIME_SLOTS } from '../data';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (date: string, time: string, notes: string) => Promise<void>;
}

export default function BookingModal({ doctor, onClose, onBook }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!doctor) return null;

  // Get tomorrow's date string as min date (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please choose a valid date and time slot.');
      return;
    }

    // Verify day of week matches doctor availability
    const bookingDate = new Date(selectedDate);
    const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.availability.includes(dayOfWeek)) {
      setError(`${doctor.name} is only available on: ${doctor.availability.join(', ')}. This date is a ${dayOfWeek}.`);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onBook(selectedDate, selectedTime, notes);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="booking-modal-container"
        className="bg-white rounded-3xl w-full max-w-lg border border-emerald-100 shadow-2xl overflow-hidden animate-fade-in"
      >
        {/* Modal Header */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-5 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Book Clinical Consultation</h3>
            <p className="text-xs font-medium text-emerald-700">Schedule real-time clinical appointments</p>
          </div>
          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-1.5 bg-white text-slate-400 rounded-lg hover:text-slate-600 border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Doctor Brief Info */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <img 
              src={doctor.avatar} 
              alt={doctor.name} 
              className="w-12 h-12 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-800">{doctor.name}</h4>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">{doctor.specialty}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Board Available: {doctor.availability.join(', ')}</p>
            </div>
          </div>

          {error && (
            <div id="booking-error-alert" className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Date Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Select Appointment Date
              </label>
              <input
                id="booking-date-input"
                type="date"
                min={minDate}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setError(null);
                }}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
            </div>

            {/* Time Slot Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Select Time Slot
              </label>
              <div id="booking-time-grid" className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      id={`booking-time-${time.replace(':', '-').replace(' ', '-')}`}
                      type="button"
                      onClick={() => {
                        setSelectedTime(time);
                        setError(null);
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes / Symptoms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Chief Symptoms & Clinical Notes
              </label>
              <textarea
                id="booking-notes-input"
                rows={3}
                placeholder="Briefly explain your primary medical symptoms or reason for consulting..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              id="booking-cancel-btn"
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="booking-confirm-submit-btn"
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold border border-emerald-700 shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Booking slot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
