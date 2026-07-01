import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  writeBatch 
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { UserProfile, UserRole, Doctor, Appointment, AppointmentStatus, MedicalReport } from '../types';
import { SEED_DOCTORS } from '../data';

// --- USER OPERATIONS ---

/**
 * Ensures user profile exists in Firestore. Seeding admin role if email matches.
 */
export async function syncUserProfile(uid: string, email: string, name: string): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', uid);
  const path = `users/${uid}`;
  try {
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      // Determine if they are admin based on user email or bootstrapped criteria
      const isAdmin = email.toLowerCase() === 'keerthanasunkari00@gmail.com' || email.toLowerCase().endsWith('@hospital.admin');
      const newUser: UserProfile = {
        uid,
        name,
        email,
        role: isAdmin ? UserRole.ADMIN : UserRole.PATIENT,
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Fetch a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}

/**
 * List all patient users (Admin-only)
 */
export async function listAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const q = query(collection(db, 'users'));
    const snap = await getDocs(q);
    const users: UserProfile[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserProfile);
    });
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}


// --- DOCTOR OPERATIONS ---

/**
 * Seeding doctors if database collection is empty
 */
export async function seedDoctorsIfEmpty(): Promise<Doctor[]> {
  const path = 'doctors';
  try {
    const q = query(collection(db, 'doctors'));
    const snap = await getDocs(q);
    if (snap.empty) {
      console.log('Doctors collection empty. Seeding seed doctors into Firestore...');
      try {
        const batch = writeBatch(db);
        for (const d of SEED_DOCTORS) {
          const docRef = doc(db, 'doctors', d.id);
          batch.set(docRef, d);
        }
        await batch.commit();
      } catch (writeErr) {
        console.warn('Seeding doctors to Firestore failed (probably due to missing admin permissions). Returning local seed data:', writeErr);
      }
      return SEED_DOCTORS;
    } else {
      const doctors: Doctor[] = [];
      snap.forEach((d) => {
        doctors.push(d.data() as Doctor);
      });
      return doctors;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Fetch all doctors from Firestore
 */
export async function listAllDoctors(): Promise<Doctor[]> {
  const path = 'doctors';
  try {
    const q = query(collection(db, 'doctors'));
    const snap = await getDocs(q);
    const doctors: Doctor[] = [];
    snap.forEach((d) => {
      doctors.push(d.data() as Doctor);
    });
    return doctors.length > 0 ? doctors : seedDoctorsIfEmpty();
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Add a doctor (Admin-only)
 */
export async function addDoctor(doctor: Doctor): Promise<void> {
  const path = `doctors/${doctor.id}`;
  try {
    await setDoc(doc(db, 'doctors', doctor.id), doctor);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Delete a doctor (Admin-only)
 */
export async function deleteDoctor(id: string): Promise<void> {
  const path = `doctors/${id}`;
  try {
    await deleteDoc(doc(db, 'doctors', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}


// --- APPOINTMENT OPERATIONS ---

/**
 * Book an appointment
 */
export async function bookAppointment(appt: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Promise<Appointment> {
  const apptId = `appt-${Math.random().toString(36).substr(2, 9)}`;
  const path = `appointments/${apptId}`;
  const newAppt: Appointment = {
    ...appt,
    id: apptId,
    status: AppointmentStatus.PENDING,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'appointments', apptId), newAppt);
    return newAppt;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Cancel appointment (User or Admin)
 */
export async function cancelAppointment(id: string): Promise<void> {
  const path = `appointments/${id}`;
  try {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status: AppointmentStatus.CANCELLED });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Update appointment status (Admin-only)
 */
export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  const path = `appointments/${id}`;
  try {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Fetch patient appointments
 */
export async function fetchAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const q = query(collection(db, 'appointments'), where('patientId', '==', patientId));
    const snap = await getDocs(q);
    const appts: Appointment[] = [];
    snap.forEach((d) => {
      appts.push(d.data() as Appointment);
    });
    // Sort appointments: latest first
    return appts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Fetch all appointments (Admin-only)
 */
export async function fetchAllAppointments(): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const q = query(collection(db, 'appointments'));
    const snap = await getDocs(q);
    const appts: Appointment[] = [];
    snap.forEach((d) => {
      appts.push(d.data() as Appointment);
    });
    return appts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}


// --- MEDICAL REPORT OPERATIONS ---

/**
 * Upload a medical report
 */
export async function uploadMedicalReport(report: Omit<MedicalReport, 'id' | 'uploadedAt'>): Promise<MedicalReport> {
  const id = `rep-${Math.random().toString(36).substr(2, 9)}`;
  const path = `reports/${id}`;
  const newReport: MedicalReport = {
    ...report,
    id,
    uploadedAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'reports', id), newReport);
    return newReport;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Fetch patient medical reports
 */
export async function fetchReportsForPatient(patientId: string): Promise<MedicalReport[]> {
  const path = 'reports';
  try {
    const q = query(collection(db, 'reports'), where('patientId', '==', patientId));
    const snap = await getDocs(q);
    const reps: MedicalReport[] = [];
    snap.forEach((d) => {
      reps.push(d.data() as MedicalReport);
    });
    return reps.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Fetch all medical reports (Admin-only)
 */
export async function fetchAllReports(): Promise<MedicalReport[]> {
  const path = 'reports';
  try {
    const q = query(collection(db, 'reports'));
    const snap = await getDocs(q);
    const reps: MedicalReport[] = [];
    snap.forEach((d) => {
      reps.push(d.data() as MedicalReport);
    });
    return reps.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Delete a report
 */
export async function deleteMedicalReport(id: string): Promise<void> {
  const path = `reports/${id}`;
  try {
    await deleteDoc(doc(db, 'reports', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}
