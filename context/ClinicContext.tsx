import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Evaluation } from '../types';

interface ClinicContextType {
  patients: Patient[];
  evaluations: Evaluation[];
  addPatient: (patient: Patient) => void;
  addEvaluation: (evaluation: Evaluation) => void;
  getPatient: (id: string) => Patient | undefined;
  getEvaluation: (id: string) => Evaluation | undefined;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const MOCK_PATIENTS: Patient[] = [
  { id: '123456', name: 'João Silva', email: 'joao@email.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', birthDate: '1985-05-15', gender: 'Masculino', address: 'Rua A, 123', status: 'Active', lastVisit: '15/08/2024' },
  { id: '789012', name: 'Maria Almeida', email: 'maria@email.com', phone: '(21) 99876-5432', cpf: '987.654.321-00', birthDate: '1990-02-20', gender: 'Feminino', address: 'Av B, 456', status: 'Pending', lastVisit: '12/07/2024' },
];

const MOCK_EVALUATIONS: Evaluation[] = [
  { id: 'EV-001', patientId: '123456', patientName: 'João Silva', name: 'Avaliação Facial', date: '2024-08-15', score: 88, status: 'Completed', type: 'Dermatology' },
];

export const ClinicProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize from localStorage or use MOCK data
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('spem_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem('spem_evaluations');
    return saved ? JSON.parse(saved) : MOCK_EVALUATIONS;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('spem_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('spem_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
  };

  const addEvaluation = (evaluation: Evaluation) => {
    setEvaluations(prev => [evaluation, ...prev]);
  };

  const getPatient = (id: string) => patients.find(p => p.id === id);
  const getEvaluation = (id: string) => evaluations.find(e => e.id === id);

  return (
    <ClinicContext.Provider value={{ patients, evaluations, addPatient, addEvaluation, getPatient, getEvaluation }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};