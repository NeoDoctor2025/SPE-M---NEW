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

// Helper to generate dates
const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

const today = new Date();

const MOCK_PATIENTS: Patient[] = [
  { id: '123456', name: 'João Silva', email: 'joao@email.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', birthDate: '1985-05-15', gender: 'Masculino', address: 'Rua A, 123', status: 'Active', lastVisit: subDays(today, 2).toLocaleDateString('pt-BR') },
  { id: '789012', name: 'Maria Almeida', email: 'maria@email.com', phone: '(21) 99876-5432', cpf: '987.654.321-00', birthDate: '1990-02-20', gender: 'Feminino', address: 'Av B, 456', status: 'Pending', lastVisit: subDays(today, 5).toLocaleDateString('pt-BR') },
  { id: '456789', name: 'Carlos Souza', email: 'carlos@email.com', phone: '(31) 99988-7766', cpf: '456.789.123-00', birthDate: '1978-11-10', gender: 'Masculino', address: 'Rua C, 789', status: 'Alert', lastVisit: subDays(today, 1).toLocaleDateString('pt-BR') },
  { id: '321654', name: 'Ana Pereira', email: 'ana@email.com', phone: '(41) 98877-6655', cpf: '321.654.987-00', birthDate: '1995-08-30', gender: 'Feminino', address: 'Av D, 101', status: 'Active', lastVisit: today.toLocaleDateString('pt-BR') },
  { id: '987123', name: 'Roberto Lima', email: 'roberto@email.com', phone: '(51) 97766-5544', cpf: '987.123.456-00', birthDate: '1982-03-25', gender: 'Masculino', address: 'Rua E, 202', status: 'Active', lastVisit: subDays(today, 10).toLocaleDateString('pt-BR') },
];

const MOCK_EVALUATIONS: Evaluation[] = [
  { id: 'EV-001', patientId: '123456', patientName: 'João Silva', name: 'Avaliação Facial', date: subDays(today, 2).toISOString().split('T')[0], score: 88, status: 'Completed', type: 'Dermatology' },
  { id: 'EV-002', patientId: '789012', patientName: 'Maria Almeida', name: 'Avaliação Corporal', date: subDays(today, 5).toISOString().split('T')[0], score: 92, status: 'Completed', type: 'Dermatology' },
  { id: 'EV-003', patientId: '456789', patientName: 'Carlos Souza', name: 'Check-up Cardiológico', date: subDays(today, 1).toISOString().split('T')[0], score: 75, status: 'Completed', type: 'Cardiology' },
  { id: 'EV-004', patientId: '321654', patientName: 'Ana Pereira', name: 'Consulta de Rotina', date: today.toISOString().split('T')[0], score: null, status: 'Draft', type: 'Nutritional' },
  { id: 'EV-005', patientId: '987123', patientName: 'Roberto Lima', name: 'Pós-Operatório', date: subDays(today, 10).toISOString().split('T')[0], score: 85, status: 'Completed', type: 'Orthopedics' },
  { id: 'EV-006', patientId: '123456', patientName: 'João Silva', name: 'Retorno', date: subDays(today, 35).toISOString().split('T')[0], score: 90, status: 'Completed', type: 'Dermatology' },
  { id: 'EV-007', patientId: '789012', patientName: 'Maria Almeida', name: 'Exames Iniciais', date: subDays(today, 40).toISOString().split('T')[0], score: 80, status: 'Completed', type: 'Dermatology' },
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