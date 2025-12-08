export interface EvaluationStepData {
  step1?: {
    elasticity: number;
    wrinkles: number;
    pigmentation: string;
    notes: string;
  };
  step2?: {
    nasogenianFold: number;
    palpebralBags: number;
    malarVolume: number;
    notes: string;
  };
  step3?: {
    marionetteLi: number;
    jawlineDefinition: number;
    mentalFold: number;
    notes: string;
  };
  step4?: {
    neckSagging: number;
    platysmalBands: number;
    chestWrinkles: number;
    notes: string;
  };
  step5?: {
    poreSize: number;
    skinTexture: number;
    hyperpigmentation: number;
    acneScars: number;
    notes: string;
  };
  step6?: {
    telangiectasia: number;
    rosacea: number;
    spiderVeins: number;
    notes: string;
  };
  step7?: {
    periorbitalArea: number;
    lips: number;
    hands: number;
    notes: string;
  };
  step8?: {
    overallAssessment: string;
    treatmentPlan: string;
    followUpDate: string;
    finalNotes: string;
  };
}

export interface WizardState {
  currentStep: number;
  data: EvaluationStepData;
  patientId: string;
  patientName: string;
}
