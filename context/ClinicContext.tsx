import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Evaluation } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPatients = async () => {
    if (!user) return;

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