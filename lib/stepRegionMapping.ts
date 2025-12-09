import { ViewAngle } from '../types/canvasTypes';

export interface StepRegion {
  step: number;
  viewAngle: ViewAngle;
  label: string;
  description: string;
}

export const STEP_REGIONS: Record<number, StepRegion> = {
  1: {
    step: 1,
    viewAngle: 'frontal',
    label: 'Dados Gerais',
    description: 'Informações iniciais do paciente',
  },
  2: {
    step: 2,
    viewAngle: 'frontal',
    label: 'Terço Médio Facial',
    description: 'Sulco nasogeniano, bolsas palpebrais, volume malar',
  },
  3: {
    step: 3,
    viewAngle: 'frontal',
    label: 'Terço Inferior Facial',
    description: 'Linhas de marionete, linha mandibular, dobra mentoniana',
  },
  4: {
    step: 4,
    viewAngle: 'frontal',
    label: 'Terço Superior Facial',
    description: 'Rugas frontais, glabelares, região periorbital',
  },
  5: {
    step: 5,
    viewAngle: 'frontal',
    label: 'Análise da Pele',
    description: 'Textura, poros, pigmentação, cicatrizes',
  },
  6: {
    step: 6,
    viewAngle: 'frontal',
    label: 'Volume e Estrutura',
    description: 'Estrutura óssea, volume facial',
  },
  7: {
    step: 7,
    viewAngle: 'frontal',
    label: 'Recomendações',
    description: 'Procedimentos sugeridos',
  },
  8: {
    step: 8,
    viewAngle: 'frontal',
    label: 'Finalização',
    description: 'Revisão e conclusão',
  },
};

export function getStepRegion(step: number): StepRegion {
  return STEP_REGIONS[step] || STEP_REGIONS[1];
}

export function hasCanvasSupport(step: number): boolean {
  return step >= 2 && step <= 6;
}
