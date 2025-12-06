import jsPDF from 'jspdf';
import type { Evaluation, Patient } from '../types';

export const exportEvaluationToPDF = (evaluation: Evaluation, patient: Patient) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  doc.setFillColor(0, 102, 153);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SPE-M', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Avaliação Clínica', margin, 32);

  yPosition = 55;

  doc.setDrawColor(0, 102, 153);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Avaliação', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
  yPosition += 5;
  doc.text(`ID da Avaliação: ${evaluation.id}`, margin, yPosition);
  yPosition += 15;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin - 5, yPosition - 7, pageWidth - 2 * margin + 10, 30, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 102, 153);
  doc.text('Dados do Paciente', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Nome: ${patient.name}`, margin, yPosition);
  yPosition += 5;
  doc.text(`CPF: ${patient.cpf}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Data de Nascimento: ${patient.birthDate}`, margin, yPosition);
  yPosition += 15;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin - 5, yPosition - 7, pageWidth - 2 * margin + 10, 35, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 102, 153);
  doc.text('Dados da Avaliação', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Tipo: ${evaluation.type}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Data da Avaliação: ${evaluation.date}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Status: ${evaluation.status === 'Completed' ? 'Concluída' : 'Rascunho'}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Pontuação: ${evaluation.score !== null ? evaluation.score + '/10' : 'N/A'}`, margin, yPosition);
  yPosition += 15;

  if (evaluation.score !== null) {
    doc.setFillColor(240, 240, 240);
    doc.rect(margin - 5, yPosition - 7, pageWidth - 2 * margin + 10, 25, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 153);
    doc.text('Resultado', margin, yPosition);
    yPosition += 8;

    const scoreColor = evaluation.score >= 7 ? [34, 197, 94] : evaluation.score >= 5 ? [251, 191, 36] : [239, 68, 68];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.rect(margin, yPosition - 5, (evaluation.score / 10) * (pageWidth - 2 * margin), 8, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${evaluation.score}/10`, pageWidth - margin - 30, yPosition + 2);
    yPosition += 15;
  }

  yPosition += 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  const disclaimer = 'Este relatório foi gerado automaticamente pelo sistema SPE-M. Para questões médicas, consulte um profissional de saúde.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
  doc.text(disclaimerLines, margin, yPosition);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('SPE-M - Sistema de Avaliação Clínica', margin, pageHeight - 10);
  doc.text(`Página 1 de 1`, pageWidth - margin - 30, pageHeight - 10);

  const fileName = `Avaliacao_${evaluation.id}_${patient.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

export const exportMultipleEvaluationsToPDF = (evaluations: Evaluation[], patients: Patient[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  doc.setFillColor(0, 102, 153);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SPE-M', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Múltiplas Avaliações', margin, 32);

  yPosition = 55;

  doc.setDrawColor(0, 102, 153);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo de Avaliações', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Total de Avaliações: ${evaluations.length}`, margin, yPosition);
  yPosition += 15;

  evaluations.forEach((evaluation, index) => {
    const patient = patients.find(p => p.id === evaluation.patientId);
    if (!patient) return;

    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(245, 245, 245);
    doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 35, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 153);
    doc.text(`${index + 1}. ${patient.name}`, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Tipo: ${evaluation.type}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Data: ${evaluation.date}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Pontuação: ${evaluation.score !== null ? evaluation.score + '/10' : 'N/A'}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Status: ${evaluation.status === 'Completed' ? 'Concluída' : 'Rascunho'}`, margin + 5, yPosition);
    yPosition += 15;
  });

  const fileName = `Avaliacoes_Multiplas_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
