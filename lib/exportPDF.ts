import { jsPDF } from 'jspdf';
import { Patient, Evaluation } from '../types';

export const exportPatientListToPDF = (patients: Patient[], doctorName: string): void => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('SPE-M - Lista de Pacientes', 20, 20);

  doc.setFontSize(10);
  doc.text(`Médico: ${doctorName}`, 20, 30);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
  doc.text(`Total de pacientes: ${patients.length}`, 20, 40);

  let y = 50;
  doc.setFontSize(12);
  doc.text('Lista de Pacientes:', 20, y);
  y += 10;

  doc.setFontSize(9);
  patients.forEach((patient, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${index + 1}. ${patient.name}`, 20, y);
    y += 5;
    doc.text(`   CPF: ${patient.cpf} | Email: ${patient.email}`, 20, y);
    y += 5;
    doc.text(`   Telefone: ${patient.phone} | Status: ${patient.status}`, 20, y);
    y += 5;
    doc.text(`   Última visita: ${new Date(patient.lastVisit).toLocaleDateString('pt-BR')}`, 20, y);
    y += 10;
  });

  doc.save(`pacientes-${Date.now()}.pdf`);
};

export const exportEvaluationToPDF = (evaluation: Evaluation, patient: Patient, doctorName: string): void => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('SPE-M - Relatório de Avaliação', 20, 20);

  doc.setFontSize(10);
  doc.text(`Médico: ${doctorName}`, 20, 30);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);

  doc.setFontSize(14);
  doc.text('Dados do Paciente', 20, 50);

  doc.setFontSize(10);
  doc.text(`Nome: ${patient.name}`, 20, 60);
  doc.text(`CPF: ${patient.cpf}`, 20, 65);
  doc.text(`Email: ${patient.email}`, 20, 70);
  doc.text(`Telefone: ${patient.phone}`, 20, 75);

  doc.setFontSize(14);
  doc.text('Dados da Avaliação', 20, 90);

  doc.setFontSize(10);
  doc.text(`Tipo: ${evaluation.type}`, 20, 100);
  doc.text(`Nome: ${evaluation.name}`, 20, 105);
  doc.text(`Data: ${new Date(evaluation.date).toLocaleDateString('pt-BR')}`, 20, 110);
  doc.text(`Status: ${evaluation.status}`, 20, 115);
  doc.text(`Score: ${evaluation.score !== null ? evaluation.score : 'N/A'}`, 20, 120);

  doc.save(`avaliacao-${patient.name.replace(/\s/g, '-')}-${Date.now()}.pdf`);
};

export const exportReportToPDF = (
  patients: Patient[],
  evaluations: Evaluation[],
  stats: any,
  doctorName: string
): void => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('SPE-M - Relatório Geral', 20, 20);

  doc.setFontSize(10);
  doc.text(`Médico: ${doctorName}`, 20, 30);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);

  doc.setFontSize(14);
  doc.text('Estatísticas Gerais', 20, 50);

  doc.setFontSize(10);
  let y = 60;
  doc.text(`Total de Pacientes: ${stats.totalPatients}`, 20, y);
  y += 5;
  doc.text(`Pacientes Ativos: ${stats.activePatients}`, 20, y);
  y += 5;
  doc.text(`Pacientes em Risco: ${stats.patientsAtRisk}`, 20, y);
  y += 5;
  doc.text(`Total de Avaliações: ${stats.totalEvaluations}`, 20, y);
  y += 5;
  doc.text(`Avaliações Completas: ${stats.completedEvaluations}`, 20, y);
  y += 5;
  doc.text(`Avaliações em Rascunho: ${stats.draftEvaluations}`, 20, y);
  y += 5;
  doc.text(`Avaliações este Mês: ${stats.evaluationsThisMonth}`, 20, y);

  doc.save(`relatorio-geral-${Date.now()}.pdf`);
};
