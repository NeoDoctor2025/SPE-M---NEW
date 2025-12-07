import { supabase } from './supabase';
import { Patient, Evaluation } from '../types';
import { DevStorage, isDevMode } from './devMode';

const storage = new DevStorage();

interface SyncStatus {
  connected: boolean;
  lastSync: Date | null;
  pendingOperations: number;
}

export class SyncManager {
  private static instance: SyncManager;
  private syncStatus: SyncStatus = {
    connected: false,
    lastSync: null,
    pendingOperations: 0,
  };
  private listeners: Array<(status: SyncStatus) => void> = [];

  private constructor() {
    this.checkConnection();
    setInterval(() => this.checkConnection(), 30000);
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  private async checkConnection(): Promise<void> {
    if (isDevMode()) {
      this.updateStatus({ connected: true, lastSync: new Date(), pendingOperations: 0 });
      return;
    }

    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      this.updateStatus({
        connected: !error,
        lastSync: !error ? new Date() : this.syncStatus.lastSync,
        pendingOperations: this.syncStatus.pendingOperations,
      });
    } catch {
      this.updateStatus({ ...this.syncStatus, connected: false });
    }
  }

  private updateStatus(status: Partial<SyncStatus>): void {
    this.syncStatus = { ...this.syncStatus, ...status };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  onStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    listener(this.syncStatus);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  isConnected(): boolean {
    return this.syncStatus.connected;
  }

  async syncPatients(userId: string): Promise<{ success: boolean; data?: Patient[]; error?: string }> {
    if (isDevMode()) {
      const localPatients = storage.get<Patient[]>('patients') || [];
      return { success: true, data: localPatients };
    }

    if (!this.syncStatus.connected) {
      const localPatients = storage.get<Patient[]>('patients') || [];
      return { success: true, data: localPatients };
    }

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const patients: Patient[] = (data || []).map(p => ({
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
      }));

      storage.set('patients', patients);
      this.updateStatus({ lastSync: new Date() });

      return { success: true, data: patients };
    } catch (error) {
      return { success: false, error: 'Erro ao sincronizar pacientes' };
    }
  }

  async syncEvaluations(userId: string): Promise<{ success: boolean; data?: Evaluation[]; error?: string }> {
    if (isDevMode()) {
      const localEvaluations = storage.get<Evaluation[]>('evaluations') || [];
      return { success: true, data: localEvaluations };
    }

    if (!this.syncStatus.connected) {
      const localEvaluations = storage.get<Evaluation[]>('evaluations') || [];
      return { success: true, data: localEvaluations };
    }

    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          *,
          patients (name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const evaluations: Evaluation[] = (data || []).map(e => ({
        id: e.id,
        patientId: e.patient_id,
        patientName: (e.patients as any)?.name || 'Unknown',
        name: e.name,
        date: e.date,
        score: e.score,
        status: e.status,
        type: e.type,
      }));

      storage.set('evaluations', evaluations);
      this.updateStatus({ lastSync: new Date() });

      return { success: true, data: evaluations };
    } catch (error) {
      return { success: false, error: 'Erro ao sincronizar avaliações' };
    }
  }
}

export const syncManager = SyncManager.getInstance();
