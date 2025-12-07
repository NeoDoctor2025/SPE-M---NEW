import { Patient, Evaluation } from '../types';

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  totalEvaluations: number;
  completedEvaluations: number;
  draftEvaluations: number;
  patientsAtRisk: number;
  recentActivity: number;
  evaluationsThisMonth: number;
}

export const calculateDashboardStats = (patients: Patient[], evaluations: Evaluation[]): DashboardStats => {
  const activePatients = patients.filter(p => p.status === 'Active').length;
  const patientsAtRisk = patients.filter(p => p.status === 'Alert').length;
  const completedEvaluations = evaluations.filter(e => e.status === 'Completed').length;
  const draftEvaluations = evaluations.filter(e => e.status === 'Draft').length;

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const recentActivity = patients.filter(p => {
    const lastVisitDate = new Date(p.lastVisit);
    return lastVisitDate >= thirtyDaysAgo;
  }).length;

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const evaluationsThisMonth = evaluations.filter(e => {
    const evalDate = new Date(e.date);
    return evalDate.getMonth() === currentMonth && evalDate.getFullYear() === currentYear;
  }).length;

  return {
    totalPatients: patients.length,
    activePatients,
    totalEvaluations: evaluations.length,
    completedEvaluations,
    draftEvaluations,
    patientsAtRisk,
    recentActivity,
    evaluationsThisMonth,
  };
};

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export const getEvaluationsByType = (evaluations: Evaluation[]): ChartData[] => {
  const types = ['Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Nutritional'] as const;

  const colors: Record<string, string> = {
    Cardiology: '#e11d48',
    Dermatology: '#f59e0b',
    Orthopedics: '#10b981',
    Neurology: '#06b6d4',
    Nutritional: '#8b5cf6',
  };

  return types.map(type => ({
    name: type,
    value: evaluations.filter(e => e.type === type).length,
    color: colors[type],
  }));
};

export const getPatientsByStatus = (patients: Patient[]): ChartData[] => {
  const statuses = ['Active', 'Pending', 'Inactive', 'Alert'] as const;

  const colors: Record<string, string> = {
    Active: '#10b981',
    Pending: '#f59e0b',
    Inactive: '#64748b',
    Alert: '#e11d48',
  };

  return statuses.map(status => ({
    name: status,
    value: patients.filter(p => p.status === status).length,
    color: colors[status],
  }));
};

export const getEvaluationsOverTime = (evaluations: Evaluation[], months: number = 6): ChartData[] => {
  const now = new Date();
  const result: ChartData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = targetDate.toLocaleDateString('pt-BR', { month: 'short' });
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();

    const count = evaluations.filter(e => {
      const evalDate = new Date(e.date);
      return evalDate.getMonth() === month && evalDate.getFullYear() === year;
    }).length;

    result.push({
      name: monthName,
      value: count,
    });
  }

  return result;
};

export const getAverageScoreByType = (evaluations: Evaluation[]): ChartData[] => {
  const types = ['Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Nutritional'] as const;

  return types.map(type => {
    const typeEvals = evaluations.filter(e => e.type === type && e.score !== null);
    const avgScore = typeEvals.length > 0
      ? typeEvals.reduce((sum, e) => sum + (e.score || 0), 0) / typeEvals.length
      : 0;

    return {
      name: type,
      value: Math.round(avgScore),
    };
  });
};
