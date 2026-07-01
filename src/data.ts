import { Department, Doctor } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'Heart',
    description: 'Expert diagnostics and treatment for all heart and vascular diseases.',
    detailedInfo: 'Our cardiology unit is equipped with advanced mapping and imaging technology to diagnose, prevent, and treat structural heart issues, coronary artery diseases, and rhythmic anomalies with unparalleled precision.'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: 'Baby',
    description: 'Specialized healthcare from infancy through adolescence.',
    detailedInfo: 'Dedicated pediatricians provide compassionate wellness checkups, allergy therapies, vaccination programs, and developmental monitoring in a welcoming, child-friendly atmosphere.'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: 'Brain',
    description: 'Advanced neurological therapies and cognitive rehabilitation.',
    detailedInfo: 'Using advanced electroencephalograms and neuroimaging tools, our neurologists treat chronic migraines, neuropathy, sleep disorders, epilepsy, and assist in cognitive rehabilitation.'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    icon: 'Bone',
    description: 'Joint reconstruction, sports injuries, and spine corrections.',
    detailedInfo: 'From minor bone fractures and ligament tears to advanced arthroscopic surgeries and joint replacements, our orthopedic specialists restore mobility and enhance quality of life.'
  },
  {
    id: 'general_medicine',
    name: 'General Medicine',
    icon: 'Stethoscope',
    description: 'Comprehensive primary care, chronic diseases, and systemic health.',
    detailedInfo: 'The cornerstones of our facility, general practitioners handle preventive physicals, coordinate multi-system diseases, manage hypertension/diabetes, and provide general health education.'
  }
];

export const SEED_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Senior Pediatrician',
    department: 'pediatrics',
    experience: 14,
    education: 'MD - Harvard Medical School',
    bio: 'Dr. Jenkins is highly regarded for her gentle, patient-centric approach to childhood development and complex pediatric chronic conditions.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    availability: ['Monday', 'Tuesday', 'Thursday']
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    specialty: 'Interventional Cardiologist',
    department: 'cardiology',
    experience: 18,
    education: 'MD, FACC - Johns Hopkins University',
    bio: 'Dr. Vance has performed over 2,000 successful cardiac catheterizations and is a pioneering researcher in coronary stent designs.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    availability: ['Wednesday', 'Thursday', 'Friday']
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    specialty: 'Cognitive Neurologist',
    department: 'neurology',
    experience: 12,
    education: 'MD, PhD - Stanford University School of Medicine',
    bio: 'Dr. Rostova specializes in motor neuron pathways, clinical stroke interventions, and early onset memory preservation therapies.',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=300&h=300',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'doc-4',
    name: 'Dr. Robert Chen',
    specialty: 'Orthopedic Surgeon',
    department: 'orthopedics',
    experience: 15,
    education: 'MD - University of California, San Francisco',
    bio: 'A former consultant for Olympic teams, Dr. Chen specializes in minimally invasive knee and shoulder arthroscopy and sports rehabilitation.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    availability: ['Tuesday', 'Thursday']
  },
  {
    id: 'doc-5',
    name: 'Dr. Amira Patel',
    specialty: 'Internal Medicine Specialist',
    department: 'general_medicine',
    experience: 10,
    education: 'MD - Yale School of Medicine',
    bio: 'Dr. Patel focuses on holistic adult care, proactive lifestyle medicine, metabolic corrections, and coordinating care for complex geriatric patients.',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
  }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM'
];
