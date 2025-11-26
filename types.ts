export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: string;
  address: string;
  status: 'Active' | 'Pending' | 'Inactive' | 'Alert';
  lastVisit: string;
  photoUrl?: string;
}

export interface Evaluation {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  date: string;
  score: number | null;
  status: 'Completed' | 'Draft';
  type: 'Cardiology' | 'Dermatology' | 'Orthopedics' | 'Neurology' | 'Nutritional';
}

export enum RoutePath {
  LOGIN = '/login',
  SIGNUP = '/signup',
  FORGOT_PASSWORD = '/forgot-password',
  DASHBOARD = '/',
  REPORTS = '/reports',
  PATIENTS = '/patients',
  PATIENTS_NEW = '/patients/new',
  PATIENTS_EDIT = '/patients/edit/:id',
  PATIENTS_DETAILS = '/patients/:id',
  EVALUATIONS = '/evaluations',
  EVALUATIONS_NEW = '/evaluations/new', // Select patient
  EVALUATIONS_WIZARD = '/evaluations/wizard/:patientId',
  EVALUATIONS_DETAILS = '/evaluations/:id',
  EVALUATIONS_COMPARE = '/evaluations/compare',
  EVALUATIONS_EXPORT = '/evaluations/export/:id',
  EVALUATIONS_SUCCESS = '/evaluations/success/:id',
  EVALUATIONS_CANVAS = '/evaluations/canvas/:id',
  SETTINGS = '/settings',
  SUPPORT = '/support',
}