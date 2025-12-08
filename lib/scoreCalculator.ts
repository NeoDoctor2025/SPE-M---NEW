import { EvaluationStepData } from '../types/evaluationTypes';

export const calculateScore = (data: EvaluationStepData): number => {
  let totalScore = 0;
  let totalFields = 0;

  if (data.step1) {
    totalScore += data.step1.elasticity || 0;
    totalScore += data.step1.wrinkles || 0;
    totalFields += 2;
  }

  if (data.step2) {
    totalScore += data.step2.nasogenianFold || 0;
    totalScore += data.step2.palpebralBags || 0;
    totalScore += data.step2.malarVolume || 0;
    totalFields += 3;
  }

  if (data.step3) {
    totalScore += data.step3.marionetteLi || 0;
    totalScore += data.step3.jawlineDefinition || 0;
    totalScore += data.step3.mentalFold || 0;
    totalFields += 3;
  }

  if (data.step4) {
    totalScore += data.step4.neckSagging || 0;
    totalScore += data.step4.platysmalBands || 0;
    totalScore += data.step4.chestWrinkles || 0;
    totalFields += 3;
  }

  if (data.step5) {
    totalScore += data.step5.poreSize || 0;
    totalScore += data.step5.skinTexture || 0;
    totalScore += data.step5.hyperpigmentation || 0;
    totalScore += data.step5.acneScars || 0;
    totalFields += 4;
  }

  if (data.step6) {
    totalScore += data.step6.telangiectasia || 0;
    totalScore += data.step6.rosacea || 0;
    totalScore += data.step6.spiderVeins || 0;
    totalFields += 3;
  }

  if (data.step7) {
    totalScore += data.step7.periorbitalArea || 0;
    totalScore += data.step7.lips || 0;
    totalScore += data.step7.hands || 0;
    totalFields += 3;
  }

  if (totalFields === 0) return 0;

  const averageScore = (totalScore / totalFields) / 5;
  return Math.round(averageScore * 100);
};

export const getStepTitle = (step: number): string => {
  const titles = [
    'Terço Superior - Elasticidade',
    'Terço Médio Facial',
    'Terço Inferior e Mandíbula',
    'Pescoço e Colo',
    'Textura e Pigmentação',
    'Vascularização',
    'Áreas Específicas',
    'Revisão e Conclusão'
  ];
  return titles[step - 1] || 'Avaliação';
};
