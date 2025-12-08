import jsPDF from 'jspdf';
import { getStepTitle } from './scoreCalculator';

interface EvaluationData {
  id: string;
  name: string;
  date: string;
  score: number;
  status: string;
  type: string;
  step1_data?: any;
  step2_data?: any;
  step3_data?: any;
  step4_data?: any;
  step5_data?: any;
  step6_data?: any;
  step7_data?: any;
  step8_data?: any;
  photos?: Array<{ step: number; url: string; uploaded_at: string }>;
}

interface PatientData {
  name: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
}

export const exportDetailedEvaluationToPDF = async (
  evaluation: EvaluationData,
  patient: PatientData,
  clinicName: string = 'SPE-M Clínica'
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const primaryColor: [number, number, number] = [0, 102, 153];
  const secondaryColor: [number, number, number] = [52, 73, 94];
  const lightGray: [number, number, number] = [245, 245, 245];

  const addHeader = () => {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(clinicName, margin, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Avaliação Facial Completa', margin, 23);
    doc.text(`ID: ${evaluation.id}`, pageWidth - margin - 40, 23);
  };

  const addFooter = (pageNumber: number, totalPages: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`${clinicName} - ${new Date().toLocaleDateString('pt-BR')}`, margin, pageHeight - 10);
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPosition = margin + 10;
      return true;
    }
    return false;
  };

  addHeader();
  yPosition = 45;

  doc.setFillColor(...lightGray);
  doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 40, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Dados do Paciente', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Nome: ${patient.name}`, margin, yPosition);
  yPosition += 6;
  doc.text(`CPF: ${patient.cpf}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Data de Nascimento: ${patient.birthDate}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Email: ${patient.email}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Telefone: ${patient.phone}`, margin, yPosition);
  yPosition += 15;

  checkPageBreak(40);

  doc.setFillColor(...lightGray);
  doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 30, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Resumo da Avaliação', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Data da Avaliação: ${new Date(evaluation.date).toLocaleDateString('pt-BR')}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Tipo: ${evaluation.type}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Status: ${evaluation.status === 'Completed' ? 'Concluída' : 'Em Andamento'}`, margin, yPosition);
  yPosition += 15;

  checkPageBreak(35);

  const scoreBarWidth = 140;
  const scoreBarHeight = 20;
  const scorePercentage = evaluation.score / 100;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, scoreBarWidth, scoreBarHeight, 'F');

  const scoreColor: [number, number, number] =
    evaluation.score >= 80 ? [34, 197, 94] :
    evaluation.score >= 60 ? [251, 191, 36] : [239, 68, 68];

  doc.setFillColor(...scoreColor);
  doc.rect(margin, yPosition, scoreBarWidth * scorePercentage, scoreBarHeight, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...scoreColor);
  doc.text(`${evaluation.score}`, margin + 5, yPosition + 14);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('/100', margin + 20, yPosition + 14);

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('Score Global', margin + scoreBarWidth + 10, yPosition + 12);

  yPosition += 35;

  for (let step = 1; step <= 8; step++) {
    const stepData = evaluation[`step${step}_data` as keyof EvaluationData];
    if (!stepData) continue;

    checkPageBreak(60);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text(`Etapa ${step}: ${getStepTitle(step)}`, margin, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const dataString = JSON.stringify(stepData, null, 2);
    const lines = doc.splitTextToSize(dataString, pageWidth - 2 * margin - 10);

    for (const line of lines) {
      checkPageBreak(10);
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;
    }

    const stepPhotos = (evaluation.photos || []).filter(p => p.step === step);
    if (stepPhotos.length > 0) {
      yPosition += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(`${stepPhotos.length} foto(s) anexada(s) nesta etapa`, margin + 5, yPosition);
      yPosition += 5;
    }

    yPosition += 10;
  }

  checkPageBreak(30);
  yPosition += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  const disclaimer = 'Este relatório foi gerado automaticamente pelo sistema SPE-M. As informações contidas neste documento são confidenciais e destinadas exclusivamente ao paciente e profissionais de saúde autorizados. Para questões médicas, consulte um profissional de saúde qualificado.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
  doc.text(disclaimerLines, margin, yPosition);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  const fileName = `Avaliacao_Completa_${evaluation.id}_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const exportComparisonToPDF = async (
  evaluation1: EvaluationData,
  evaluation2: EvaluationData,
  patient: PatientData,
  clinicName: string = 'SPE-M Clínica'
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const primaryColor: [number, number, number] = [0, 102, 153];

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(clinicName, margin, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Comparação de Avaliações', margin, 23);

  yPosition = 45;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`Paciente: ${patient.name}`, margin, yPosition);
  yPosition += 15;

  const columnWidth = (pageWidth - 3 * margin) / 2;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin - 5, yPosition - 5, columnWidth + 5, 30, 'F');
  doc.rect(margin + columnWidth + 5, yPosition - 5, columnWidth + 5, 30, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Avaliação 1', margin, yPosition);
  doc.text('Avaliação 2', margin + columnWidth + 10, yPosition);
  yPosition += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${new Date(evaluation1.date).toLocaleDateString('pt-BR')}`, margin, yPosition);
  doc.text(`Data: ${new Date(evaluation2.date).toLocaleDateString('pt-BR')}`, margin + columnWidth + 10, yPosition);
  yPosition += 6;
  doc.text(`Score: ${evaluation1.score}`, margin, yPosition);
  doc.text(`Score: ${evaluation2.score}`, margin + columnWidth + 10, yPosition);
  yPosition += 15;

  const scoreDiff = evaluation2.score - evaluation1.score;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const diffColor: [number, number, number] = scoreDiff > 0 ? [34, 197, 94] : scoreDiff < 0 ? [239, 68, 68] : [100, 100, 100];
  doc.setTextColor(...diffColor);
  doc.text(
    `Diferença: ${scoreDiff > 0 ? '+' : ''}${scoreDiff} pontos`,
    margin,
    yPosition
  );
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(
    scoreDiff > 0 ? 'Melhora observada' : scoreDiff < 0 ? 'Declínio observado' : 'Sem mudança significativa',
    margin,
    yPosition
  );

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`${clinicName}`, margin, pageHeight - 10);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
  }

  const fileName = `Comparacao_${evaluation1.id}_vs_${evaluation2.id}_${patient.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
