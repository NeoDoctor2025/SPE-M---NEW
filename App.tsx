
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login, Signup, ForgotPassword } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { PatientsList, PatientForm, PatientDetails, PatientEdit } from './pages/Patients';
import { EvaluationsList, SelectPatientForEvaluation, EvaluationWizard, EvaluationDetails, CompareEvaluations, EvaluationSuccess } from './pages/Evaluations';
import { ExportEvaluation, ImageAnnotation } from './pages/EvaluationTools';
import { Settings, Support } from './pages/SettingsSupport';
import { RoutePath } from './types';
import { ClinicProvider } from './context/ClinicContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './lib/toast';

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ClinicProvider>
          <Router>
        <Routes>
          {/* Public Routes */}
          <Route path={RoutePath.LOGIN} element={<Login />} />
          <Route path={RoutePath.SIGNUP} element={<Signup />} />
          <Route path={RoutePath.FORGOT_PASSWORD} element={<ForgotPassword />} />

          {/* Fullscreen Tool Routes (outside main layout) */}
          <Route path={RoutePath.EVALUATIONS_CANVAS} element={<ImageAnnotation />} />

          {/* Protected Routes (Layout) */}
          <Route element={<Layout />}>
            <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
            <Route path={RoutePath.REPORTS} element={<Reports />} />
            
            {/* Patient Routes */}
            <Route path={RoutePath.PATIENTS} element={<PatientsList />} />
            <Route path={RoutePath.PATIENTS_NEW} element={<PatientForm />} />
            <Route path={RoutePath.PATIENTS_DETAILS} element={<PatientDetails />} />
            <Route path={RoutePath.PATIENTS_EDIT} element={<PatientEdit />} />
            
            {/* Evaluation Routes */}
            <Route path={RoutePath.EVALUATIONS} element={<EvaluationsList />} />
            <Route path={RoutePath.EVALUATIONS_NEW} element={<SelectPatientForEvaluation />} />
            <Route path={RoutePath.EVALUATIONS_WIZARD} element={<EvaluationWizard />} />
            <Route path={RoutePath.EVALUATIONS_DETAILS} element={<EvaluationDetails />} />
            <Route path={RoutePath.EVALUATIONS_COMPARE} element={<CompareEvaluations />} />
            <Route path={RoutePath.EVALUATIONS_EXPORT} element={<ExportEvaluation />} />
            <Route path={RoutePath.EVALUATIONS_SUCCESS} element={<EvaluationSuccess />} />
            
            {/* Misc Routes */}
            <Route path={RoutePath.SETTINGS} element={<Settings />} />
            <Route path={RoutePath.SUPPORT} element={<Support />} />
          </Route>
        </Routes>
        </Router>
        </ClinicProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
