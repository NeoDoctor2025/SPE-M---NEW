import { User } from '@supabase/supabase-js';
import { Patient, Evaluation } from '../types';

export const isDevMode = (): boolean => {
  return import.meta.env.VITE_DEV_MODE === 'true';
};

export const getDevUser = (): User => {
  const userId = import.meta.env.VITE_DEV_USER_ID || 'dev-user-123';
  const userEmail = import.meta.env.VITE_DEV_USER_EMAIL || 'dev@spem.com';

  return {
    id: userId,
    email: userEmail,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;
};

export const getDevProfile = () => {
  return {
    full_name: import.meta.env.VITE_DEV_USER_NAME || 'Dr. Dev Mode',
    crm: import.meta.env.VITE_DEV_USER_CRM || '123456/SP',
  };
};

export class DevStorage {
  private prefix = 'dev_spem_';

  get<T>(key: string): T | null {
    const data = localStorage.getItem(this.prefix + key);
    return data ? JSON.parse(data) : null;
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const generateMockData = (): { patients: Patient[], evaluations: Evaluation[] } => {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];

  const patients: Patient[] = [
    {
      id: 'mock-patient-1',
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      birthDate: '1985-03-15',
      gender: 'Feminino',
      address: 'Rua das Flores, 123, São Paulo - SP',
      status: 'Active',
      lastVisit: today,
      photoUrl: undefined,
    },
    {
      id: 'mock-patient-2',
      name: 'João Santos',
      email: 'joao.santos@email.com',
      phone: '(11) 97654-3210',
      cpf: '987.654.321-00',
      birthDate: '1978-07-22',
      gender: 'Masculino',
      address: 'Av. Paulista, 456, São Paulo - SP',
      status: 'Active',
      lastVisit: '2024-12-01',
      photoUrl: undefined,
    },
    {
      id: 'mock-patient-3',
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      phone: '(11) 96543-2109',
      cpf: '456.789.123-00',
      birthDate: '1992-11-08',
      gender: 'Feminino',
      address: 'Rua Augusta, 789, São Paulo - SP',
      status: 'Alert',
      lastVisit: '2024-11-28',
      photoUrl: undefined,
    },
  ];

  const evaluations: Evaluation[] = [
    {
      id: 'mock-eval-1',
      patientId: 'mock-patient-1',
      patientName: 'Maria Silva',
      name: 'Avaliação Cardiológica Completa',
      date: today,
      score: 85,
      status: 'Completed',
      type: 'Cardiology',
    },
    {
      id: 'mock-eval-2',
      patientId: 'mock-patient-2',
      patientName: 'João Santos',
      name: 'Avaliação Ortopédica',
      date: '2024-12-01',
      score: 72,
      status: 'Completed',
      type: 'Orthopedics',
    },
    {
      id: 'mock-eval-3',
      patientId: 'mock-patient-3',
      patientName: 'Ana Oliveira',
      name: 'Avaliação Neurológica',
      date: '2024-11-28',
      score: null,
      status: 'Draft',
      type: 'Neurology',
    },
  ];

  return { patients, evaluations };
};
