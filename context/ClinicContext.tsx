import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Evaluation, PatientMedicalInfo } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { isDevMode, DevStorage, generateMockData } from '../lib/devMode';

interface ClinicContextType {
  patients: Patient[];
  evaluations: Evaluation[];
  loading: boolean;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<Patient | null>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
  addEvaluation: (evaluation: Omit<Evaluation, 'id'>) => Promise<Evaluation | null>;
  updateEvaluation: (id: string, updates: Partial<Evaluation>) => Promise<boolean>;
  deleteEvaluation: (id: string) => Promise<boolean>;
  getPatient: (id: string) => Patient | undefined;
  getEvaluation: (id: string) => Evaluation | undefined;
  refreshPatients: () => Promise<void>;
  refreshEvaluations: () => Promise<void>;
  getMedicalInfo: (patientId: string) => Promise<PatientMedicalInfo | null>;
  updateMedicalInfo: (patientId: string, info: Partial<Omit<PatientMedicalInfo, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>>) => Promise<boolean>;
  getPatientEvaluations: (patientId: string) => Evaluation[];
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const devStorage = new DevStorage();

export const ClinicProvider = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPatients = async () => {
    if (!user) return;

    if (isDevMode()) {
      const storedPatients = devStorage.get<Patient[]>('patients');
      if (storedPatients) {
        setPatients(storedPatients);
      } else {
        const mockData = generateMockData();
        devStorage.set('patients', mockData.patients);
        setPatients(mockData.patients);
      }
      return;
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPatients(data.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        cpf: p.cpf,
        birthDate: p.birth_date,
        gender: p.gender,
        address: p.address,
        status: p.status,
        lastVisit: p.last_visit,
        photoUrl: p.photo_url || undefined,
      })));
    }
  };

  const refreshEvaluations = async () => {
    if (!user) return;

    if (isDevMode()) {
      const storedEvaluations = devStorage.get<Evaluation[]>('evaluations');
      if (storedEvaluations) {
        setEvaluations(storedEvaluations);
      } else {
        const mockData = generateMockData();
        devStorage.set('evaluations', mockData.evaluations);
        setEvaluations(mockData.evaluations);
      }
      return;
    }

    const { data, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        patients (name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEvaluations(data.map(e => ({
        id: e.id,
        patientId: e.patient_id,
        patientName: (e.patients as any)?.name || 'Unknown',
        name: e.name,
        date: e.date,
        score: e.score,
        status: e.status,
        type: e.type,
      })));
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([refreshPatients(), refreshEvaluations()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  const addPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient | null> => {
    if (!user) return null;

    if (isDevMode()) {
      const newPatient: Patient = {
        ...patient,
        id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const currentPatients = devStorage.get<Patient[]>('patients') || [];
      const updatedPatients = [newPatient, ...currentPatients];
      devStorage.set('patients', updatedPatients);
      setPatients(updatedPatients);
      return newPatient;
    }

    const { data, error } = await supabase
      .from('patients')
      .insert({
        user_id: user.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        cpf: patient.cpf,
        birth_date: patient.birthDate,
        gender: patient.gender,
        address: patient.address,
        status: patient.status,
        last_visit: patient.lastVisit,
        photo_url: patient.photoUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding patient:', error);
      return null;
    }

    const newPatient: Patient = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      birthDate: data.birth_date,
      gender: data.gender,
      address: data.address,
      status: data.status,
      lastVisit: data.last_visit,
      photoUrl: data.photo_url || undefined,
    };

    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = async (id: string, updates: Partial<Patient>): Promise<boolean> => {
    if (!user) return false;

    if (isDevMode()) {
      const currentPatients = devStorage.get<Patient[]>('patients') || [];
      const updatedPatients = currentPatients.map(p =>
        p.id === id ? { ...p, ...updates } : p
      );
      devStorage.set('patients', updatedPatients);
      setPatients(updatedPatients);
      return true;
    }

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.cpf !== undefined) dbUpdates.cpf = updates.cpf;
    if (updates.birthDate !== undefined) dbUpdates.birth_date = updates.birthDate;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.lastVisit !== undefined) dbUpdates.last_visit = updates.lastVisit;
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl;

    const { error } = await supabase
      .from('patients')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating patient:', error);
      return false;
    }

    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    return true;
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    if (!user) return false;

    if (isDevMode()) {
      const currentPatients = devStorage.get<Patient[]>('patients') || [];
      const updatedPatients = currentPatients.filter(p => p.id !== id);
      devStorage.set('patients', updatedPatients);
      setPatients(updatedPatients);
      return true;
    }

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting patient:', error);
      return false;
    }

    setPatients(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addEvaluation = async (evaluation: Omit<Evaluation, 'id'>): Promise<Evaluation | null> => {
    if (!user) return null;

    if (isDevMode()) {
      const newEvaluation: Evaluation = {
        ...evaluation,
        id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const currentEvaluations = devStorage.get<Evaluation[]>('evaluations') || [];
      const updatedEvaluations = [newEvaluation, ...currentEvaluations];
      devStorage.set('evaluations', updatedEvaluations);
      setEvaluations(updatedEvaluations);
      return newEvaluation;
    }

    const { data, error } = await supabase
      .from('evaluations')
      .insert({
        user_id: user.id,
        patient_id: evaluation.patientId,
        name: evaluation.name,
        date: evaluation.date,
        score: evaluation.score,
        status: evaluation.status,
        type: evaluation.type,
      })
      .select(`
        *,
        patients (name)
      `)
      .single();

    if (error) {
      console.error('Error adding evaluation:', error);
      return null;
    }

    const newEvaluation: Evaluation = {
      id: data.id,
      patientId: data.patient_id,
      patientName: (data.patients as any)?.name || 'Unknown',
      name: data.name,
      date: data.date,
      score: data.score,
      status: data.status,
      type: data.type,
    };

    setEvaluations(prev => [newEvaluation, ...prev]);
    return newEvaluation;
  };

  const updateEvaluation = async (id: string, updates: Partial<Evaluation>): Promise<boolean> => {
    if (!user) return false;

    if (isDevMode()) {
      const currentEvaluations = devStorage.get<Evaluation[]>('evaluations') || [];
      const updatedEvaluations = currentEvaluations.map(e =>
        e.id === id ? { ...e, ...updates } : e
      );
      devStorage.set('evaluations', updatedEvaluations);
      setEvaluations(updatedEvaluations);
      return true;
    }

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.score !== undefined) dbUpdates.score = updates.score;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.type !== undefined) dbUpdates.type = updates.type;

    const { error } = await supabase
      .from('evaluations')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating evaluation:', error);
      return false;
    }

    setEvaluations(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    return true;
  };

  const deleteEvaluation = async (id: string): Promise<boolean> => {
    if (!user) return false;

    if (isDevMode()) {
      const currentEvaluations = devStorage.get<Evaluation[]>('evaluations') || [];
      const updatedEvaluations = currentEvaluations.filter(e => e.id !== id);
      devStorage.set('evaluations', updatedEvaluations);
      setEvaluations(updatedEvaluations);
      return true;
    }

    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting evaluation:', error);
      return false;
    }

    setEvaluations(prev => prev.filter(e => e.id !== id));
    return true;
  };

  const getPatient = (id: string) => patients.find(p => p.id === id);
  const getEvaluation = (id: string) => evaluations.find(e => e.id === id);

  const getMedicalInfo = async (patientId: string): Promise<PatientMedicalInfo | null> => {
    if (!user) return null;

    if (isDevMode()) {
      const storedInfo = devStorage.get<PatientMedicalInfo[]>('medicalInfo') || [];
      return storedInfo.find(info => info.patientId === patientId) || null;
    }

    const { data, error } = await supabase
      .from('patient_medical_info')
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      patientId: data.patient_id,
      allergies: data.allergies || [],
      conditions: data.conditions || [],
      medications: data.medications || [],
      notes: data.notes || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  };

  const updateMedicalInfo = async (
    patientId: string,
    info: Partial<Omit<PatientMedicalInfo, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> => {
    if (!user) return false;

    if (isDevMode()) {
      const storedInfo = devStorage.get<PatientMedicalInfo[]>('medicalInfo') || [];
      const existingIndex = storedInfo.findIndex(i => i.patientId === patientId);

      if (existingIndex >= 0) {
        storedInfo[existingIndex] = { ...storedInfo[existingIndex], ...info };
      } else {
        storedInfo.push({
          id: `medinfo-${Date.now()}`,
          patientId,
          allergies: info.allergies || [],
          conditions: info.conditions || [],
          medications: info.medications || [],
          notes: info.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      devStorage.set('medicalInfo', storedInfo);
      return true;
    }

    const existingInfo = await getMedicalInfo(patientId);

    if (existingInfo) {
      const { error } = await supabase
        .from('patient_medical_info')
        .update({
          allergies: info.allergies,
          conditions: info.conditions,
          medications: info.medications,
          notes: info.notes,
        })
        .eq('patient_id', patientId);

      if (error) {
        console.error('Error updating medical info:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('patient_medical_info')
        .insert({
          patient_id: patientId,
          allergies: info.allergies || [],
          conditions: info.conditions || [],
          medications: info.medications || [],
          notes: info.notes || '',
        });

      if (error) {
        console.error('Error inserting medical info:', error);
        return false;
      }
    }

    return true;
  };

  const getPatientEvaluations = (patientId: string): Evaluation[] => {
    return evaluations.filter(e => e.patientId === patientId);
  };

  return (
    <ClinicContext.Provider value={{
      patients,
      evaluations,
      loading,
      addPatient,
      updatePatient,
      deletePatient,
      addEvaluation,
      updateEvaluation,
      deleteEvaluation,
      getPatient,
      getEvaluation,
      refreshPatients,
      refreshEvaluations,
      getMedicalInfo,
      updateMedicalInfo,
      getPatientEvaluations,
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};
