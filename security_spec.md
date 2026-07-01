# Security Specification - Hospital Portal

## 1. Data Invariants
- **Authentication**: All user profiles, appointment booking, report uploading, and admin operations require authenticated Google accounts.
- **Role Control**: There are two roles: `patient` and `admin`. Users are registered as `patient` by default. Only existing admins can escalate roles, or the bootstrapped admin (`keerthanasunkari00@gmail.com`).
- **Data Isolation**: Patients can ONLY view or modify their own appointments and reports. No user can view or list other patients' appointments or reports.
- **Admin Privilege**: Admins can view and list all users, all appointments, and all reports. They can manage doctor listings, and change appointment status.
- **doctor collection**: Viewable by anyone (public read) so users can browse doctors before signing in. But only editable by administrators.

## 2. The "Dirty Dozen" Payloads (Vulnerability Vector Audit)
1. **Self-Escalation Payloads**: A patient attempts to set their role to `'admin'` upon sign-up or profile update.
2. **Identity Spoofing in Appointment**: User A attempts to book an appointment with `patientId` set to User B's UID.
3. **Identity Spoofing in Report**: User A attempts to upload a report with `patientId` set to User B's UID.
4. **Illegal Report Harvesting**: User A attempts to read User B's medical report.
5. **Illegal Appointment Sniffing**: User A attempts to list all appointments in the system.
6. **Doctor Modification Bypass**: User A (patient) attempts to insert or modify a Doctor document.
7. **Illegal Appointment Cancellation**: User A attempts to cancel User B's appointment.
8. **Malicious Long ID Attack**: Attacker injects a 5MB random string as a document ID to crash or bloat indexes.
9. **No-Authentication Bookings**: Anonymous or unauthenticated request attempts to write to appointments.
10. **Timestamp Spoofing**: Client attempts to send a back-dated or future `createdAt` string instead of server timestamp validation patterns.
11. **Malicious Empty Fields**: Client attempts to write a document missing essential keys (e.g., patientName, doctorId).
12. **Status Escalation**: Patient attempts to mark their own appointment status as `'completed'` or `'confirmed'` directly on creation or update.

## 3. Test Runner Concept (`firestore.rules.test.ts`)
The validation functions are modeled directly in `firestore.rules` using the exact layout described in the Zero-Trust Security blueprints. All requests violating any of the twelve security vector conditions return `PERMISSION_DENIED`.
