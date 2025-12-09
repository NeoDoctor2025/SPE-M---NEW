import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../../types';
import { EvaluationStepData } from '../../types/evaluationTypes';
import { calculateScore, getStepTitle } from '../../lib/scoreCalculator';
import { useClinic } from '../../context/ClinicContext';
import { evaluationAutoSave } from '../../lib/evaluationAutoSave';
import { EvaluationPhotoUpload } from '../../components/EvaluationPhotoUpload';
import { IntegratedCanvas } from '../../components/Canvas/IntegratedCanvas';
import { getStepRegion, hasCanvasSupport } from '../../lib/stepRegionMapping';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';
import { Step6 } from './Step6';
import { Step7 } from './Step7';
import { Step8 } from './Step8';

export const EvaluationWizard = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { getPatient } = useClinic();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EvaluationStepData>({});
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Array<{ step: number; url: string; uploaded_at: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState<'saving' | 'saved' | null>(null);
  const [annotationsCount, setAnnotationsCount] = useState(0);
  const [showCanvas, setShowCanvas] = useState(true);

  const patient = getPatient(patientId || '');
  const currentScore = calculateScore(formData);
  const stepRegion = getStepRegion(currentStep);
  const canvasSupported = hasCanvasSupport(currentStep);

  useEffect(() => {
    const initializeEvaluation = async () => {
      if (!patientId || !patient) return;

      const existingDraft = await evaluationAutoSave.loadDraft(patientId);

      if (existingDraft) {
        setEvaluationId(existingDraft.id);
        setCurrentStep(existingDraft.current_step || 1);
        setFormData({
          step1: existingDraft.step1_data,
          step2: existingDraft.step2_data,
          step3: existingDraft.step3_data,
          step4: existingDraft.step4_data,
          step5: existingDraft.step5_data,
          step6: existingDraft.step6_data,
          step7: existingDraft.step7_data,
          step8: existingDraft.step8_data,
        });
        setPhotos(existingDraft.photos || []);
      } else {
        const newEvaluationId = await evaluationAutoSave.createDraft(patientId, patient.name);
        setEvaluationId(newEvaluationId);
      }

      setLoading(false);
    };

    initializeEvaluation();
  }, [patientId, patient]);

  useEffect(() => {
    if (!evaluationId || !formData[`step${currentStep}` as keyof EvaluationStepData]) return;

    const autoSaveTimer = setTimeout(async () => {
      setAutoSaveIndicator('saving');
      const success = await evaluationAutoSave.saveStep(
        evaluationId,
        currentStep,
        formData[`step${currentStep}` as keyof EvaluationStepData]
      );

      if (success) {
        setAutoSaveIndicator('saved');
        setTimeout(() => setAutoSaveIndicator(null), 2000);
      } else {
        setAutoSaveIndicator(null);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData, currentStep, evaluationId]);

  const updateStepData = (step: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [`step${step}`]: data
    }));
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalize = async () => {
    if (!evaluationId) return;

    setSaving(true);

    const success = await evaluationAutoSave.finalize(evaluationId, currentScore, formData);

    setSaving(false);

    if (success) {
      navigate(RoutePath.EVALUATIONS_SUCCESS.replace(':id', evaluationId));
    }
  };

  const renderStep = () => {
    let stepComponent;

    switch (currentStep) {
      case 1:
        stepComponent = <Step1 data={formData.step1} onChange={(data) => updateStepData(1, data)} />;
        break;
      case 2:
        stepComponent = <Step2 data={formData.step2} onChange={(data) => updateStepData(2, data)} />;
        break;
      case 3:
        stepComponent = <Step3 data={formData.step3} onChange={(data) => updateStepData(3, data)} />;
        break;
      case 4:
        stepComponent = <Step4 data={formData.step4} onChange={(data) => updateStepData(4, data)} />;
        break;
      case 5:
        stepComponent = <Step5 data={formData.step5} onChange={(data) => updateStepData(5, data)} />;
        break;
      case 6:
        stepComponent = <Step6 data={formData.step6} onChange={(data) => updateStepData(6, data)} />;
        break;
      case 7:
        stepComponent = <Step7 data={formData.step7} onChange={(data) => updateStepData(7, data)} />;
        break;
      case 8:
        stepComponent = <Step8 data={formData.step8} onChange={(data) => updateStepData(8, data)} calculatedScore={currentScore} />;
        break;
      default:
        return null;
    }

    return (
      <>
        {stepComponent}
        {evaluationId && (
          <div className="mt-12 pt-8 border-t border-border dark:border-slate-800">
            <EvaluationPhotoUpload
              evaluationId={evaluationId}
              step={currentStep}
              photos={photos}
              onPhotosChange={setPhotos}
            />
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">
            progress_activity
          </span>
          <p className="font-mono text-slate-500">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="font-mono text-slate-500 mb-4">Paciente não encontrado</p>
          <button
            onClick={() => navigate(RoutePath.EVALUATIONS_NEW)}
            className="px-6 py-2 bg-primary text-white font-mono text-xs uppercase"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8 border-b border-border dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-slate-900 dark:text-white">
              Avaliação Facial <span className="text-slate-300 dark:text-slate-700">/</span>{' '}
              <span className="italic text-primary">{getStepTitle(currentStep)}</span>
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">
              Paciente: {patient.name} • ID: {patient.id}
              {autoSaveIndicator && (
                <span className="ml-4 text-emerald-600 dark:text-emerald-400">
                  {autoSaveIndicator === 'saving' ? '⟳ Salvando...' : '✓ Salvo'}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div
                key={step}
                className={`w-8 h-1 transition-colors ${
                  step === currentStep
                    ? 'bg-primary'
                    : step < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className={`grid gap-8 ${canvasSupported && showCanvas ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
        <div className={canvasSupported && showCanvas ? 'space-y-8' : 'lg:col-span-2 space-y-8'}>
          <div className="bg-white dark:bg-slate-900 p-8 border border-border dark:border-slate-800 shadow-atlas relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-slate-900 dark:text-white">
                Etapa {currentStep} de 8
              </h2>
              {canvasSupported && (
                <button
                  onClick={() => setShowCanvas(!showCanvas)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showCanvas ? 'visibility_off' : 'visibility'}
                  </span>
                  {showCanvas ? 'Ocultar Canvas' : 'Mostrar Canvas'}
                </button>
              )}
            </div>
            {renderStep()}
          </div>
        </div>

        {canvasSupported && showCanvas && evaluationId && (
          <div className="space-y-6">
            <div className="h-[600px]">
              <IntegratedCanvas
                evaluationId={evaluationId}
                stepNumber={currentStep}
                viewAngle={stepRegion.viewAngle}
                imageUrl={photos.find((p) => p.step === currentStep)?.url}
                onAnnotationsChange={setAnnotationsCount}
              />
            </div>

            <div
              className="bg-white dark:bg-slate-900 p-4 border border-border dark:border-slate-800 shadow-atlas cursor-pointer group"
              onClick={() => navigate(RoutePath.EVALUATIONS_CANVAS.replace(':id', evaluationId))}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/60">open_in_full</span>
                </div>
                <div className="flex-1">
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Canvas Completo
                  </p>
                  <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    Abrir editor avançado com todas as ferramentas
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        )}

        {(!canvasSupported || !showCanvas) && (
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-secondary dark:bg-slate-950 text-white p-6 border border-secondary dark:border-slate-800 shadow-atlas relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary opacity-20 rounded-full blur-2xl"></div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">
                Score em Tempo Real
              </h3>
              <div className="flex items-end gap-2">
                <p className="font-serif text-6xl font-light text-white">{currentScore}</p>
                <p className="font-mono text-sm mb-2 opacity-60">/ 100</p>
              </div>

              <div className="mt-4 h-8 w-full flex items-end gap-1 opacity-50">
                <div className="w-1 bg-primary h-[20%]"></div>
                <div className="w-1 bg-primary h-[40%]"></div>
                <div className="w-1 bg-primary h-[30%]"></div>
                <div className="w-1 bg-primary h-[60%]"></div>
                <div className="w-1 bg-primary h-[50%]"></div>
                <div className="w-1 bg-white h-[75%]"></div>
              </div>
            </div>

            {evaluationId && (
              <div
                className="bg-white dark:bg-slate-900 p-1 border border-border dark:border-slate-800 shadow-atlas cursor-pointer group"
                onClick={() => navigate(RoutePath.EVALUATIONS_CANVAS.replace(':id', evaluationId))}
              >
                <div className="bg-slate-900 aspect-square relative flex items-center justify-center overflow-hidden group-hover:ring-1 ring-primary transition-all">
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10"></div>

                  <span className="material-symbols-outlined text-6xl text-white/20 group-hover:text-white/40 transition-colors">
                    face
                  </span>
                  <div className="absolute bottom-2 right-2 font-mono text-[10px] text-white/40">CANVAS_V1</div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="font-mono text-xs text-white uppercase tracking-wider border border-white/50 px-3 py-1">
                      Expandir
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-border dark:border-slate-700 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Mapeamento Anatômico
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-border dark:border-slate-800 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Anterior
        </button>

        {currentStep < 8 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-primary text-white font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            Próxima Etapa
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={handleFinalize}
            disabled={saving}
            className="px-8 py-3 bg-emerald-600 text-white font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Salvando...
              </>
            ) : (
              <>
                Finalizar Protocolo
                <span className="material-symbols-outlined text-sm">check_circle</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
