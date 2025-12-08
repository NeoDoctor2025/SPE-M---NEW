import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useClinic } from '../context/ClinicContext';
import { supabase } from '../lib/supabase';
import { RoutePath } from '../types';
import { getStepTitle } from '../lib/scoreCalculator';

interface EvaluationDetails {
  id: string;
  patient_id: string;
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

export const EvaluationCompare = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { evaluations, patients } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [evaluation1Id, setEvaluation1Id] = useState<string>('');
  const [evaluation2Id, setEvaluation2Id] = useState<string>('');
  const [evaluation1, setEvaluation1] = useState<EvaluationDetails | null>(null);
  const [evaluation2, setEvaluation2] = useState<EvaluationDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const patientEvaluations = evaluations.filter(
    (e) => e.patientId === selectedPatientId && e.status === 'Completed'
  );

  useEffect(() => {
    const patientId = searchParams.get('patientId');
    const eval1 = searchParams.get('eval1');
    const eval2 = searchParams.get('eval2');

    if (patientId) setSelectedPatientId(patientId);
    if (eval1) setEvaluation1Id(eval1);
    if (eval2) setEvaluation2Id(eval2);
  }, [searchParams]);

  useEffect(() => {
    if (evaluation1Id && evaluation2Id) {
      loadEvaluations();
    }
  }, [evaluation1Id, evaluation2Id]);

  const loadEvaluations = async () => {
    setLoading(true);

    try {
      const { data: data1 } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', evaluation1Id)
        .single();

      const { data: data2 } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', evaluation2Id)
        .single();

      setEvaluation1(data1);
      setEvaluation2(data2);
    } catch (error) {
      console.error('Error loading evaluations:', error);
    }

    setLoading(false);
  };

  const renderStepComparison = (step: number) => {
    if (!evaluation1 || !evaluation2) return null;

    const step1Data = evaluation1[`step${step}_data` as keyof EvaluationDetails];
    const step2Data = evaluation2[`step${step}_data` as keyof EvaluationDetails];

    if (!step1Data || !step2Data) return null;

    return (
      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6">
        <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-4">
          {getStepTitle(step)}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {new Date(evaluation1.date).toLocaleDateString('pt-BR')}
            </p>
            <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded overflow-auto">
              {JSON.stringify(step1Data, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {new Date(evaluation2.date).toLocaleDateString('pt-BR')}
            </p>
            <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded overflow-auto">
              {JSON.stringify(step2Data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  const renderPhotoComparison = (step: number) => {
    if (!evaluation1 || !evaluation2) return null;

    const photos1 = (evaluation1.photos || []).filter((p) => p.step === step);
    const photos2 = (evaluation2.photos || []).filter((p) => p.step === step);

    if (photos1.length === 0 && photos2.length === 0) return null;

    return (
      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6">
        <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-4">
          Fotos - {getStepTitle(step)}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {new Date(evaluation1.date).toLocaleDateString('pt-BR')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {photos1.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.url}
                  alt={`Foto ${idx + 1}`}
                  className="w-full aspect-square object-cover border border-border dark:border-slate-700"
                />
              ))}
              {photos1.length === 0 && (
                <p className="text-slate-400 dark:text-slate-500 text-sm col-span-2">
                  Sem fotos
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {new Date(evaluation2.date).toLocaleDateString('pt-BR')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {photos2.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.url}
                  alt={`Foto ${idx + 1}`}
                  className="w-full aspect-square object-cover border border-border dark:border-slate-700"
                />
              ))}
              {photos2.length === 0 && (
                <p className="text-slate-400 dark:text-slate-500 text-sm col-span-2">
                  Sem fotos
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-light text-slate-900 dark:text-white">
              Comparação de Avaliações
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mt-2">
              Compare a evolução entre duas avaliações
            </p>
          </div>
          <button
            onClick={() => navigate(RoutePath.EVALUATIONS)}
            className="px-6 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 block">
              Paciente
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                setEvaluation1Id('');
                setEvaluation2Id('');
                setEvaluation1(null);
                setEvaluation2(null);
              }}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm"
            >
              <option value="">Selecione um paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 block">
              Avaliação 1
            </label>
            <select
              value={evaluation1Id}
              onChange={(e) => setEvaluation1Id(e.target.value)}
              disabled={!selectedPatientId}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm disabled:opacity-50"
            >
              <option value="">Selecione uma avaliação</option>
              {patientEvaluations.map((evaluation) => (
                <option key={evaluation.id} value={evaluation.id}>
                  {evaluation.name} - {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 block">
              Avaliação 2
            </label>
            <select
              value={evaluation2Id}
              onChange={(e) => setEvaluation2Id(e.target.value)}
              disabled={!selectedPatientId || !evaluation1Id}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm disabled:opacity-50"
            >
              <option value="">Selecione uma avaliação</option>
              {patientEvaluations
                .filter((e) => e.id !== evaluation1Id)
                .map((evaluation) => (
                  <option key={evaluation.id} value={evaluation.id}>
                    {evaluation.name} - {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">
              progress_activity
            </span>
          </div>
        )}

        {!loading && evaluation1 && evaluation2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 shadow-atlas">
                <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-2">
                  {evaluation1.name}
                </p>
                <p className="font-serif text-6xl font-light mb-2">{evaluation1.score}</p>
                <p className="font-mono text-xs opacity-70">
                  {new Date(evaluation1.date).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 shadow-atlas">
                <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-2">
                  {evaluation2.name}
                </p>
                <p className="font-serif text-6xl font-light mb-2">{evaluation2.score}</p>
                <p className="font-mono text-xs opacity-70">
                  {new Date(evaluation2.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-8">
              <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-4">
                Diferença de Score
              </h2>
              <div className="flex items-center gap-4">
                <span className="font-serif text-5xl text-slate-900 dark:text-white">
                  {evaluation2.score - evaluation1.score > 0 ? '+' : ''}
                  {evaluation2.score - evaluation1.score}
                </span>
                <span
                  className={`font-mono text-sm ${
                    evaluation2.score - evaluation1.score > 0
                      ? 'text-emerald-600'
                      : evaluation2.score - evaluation1.score < 0
                      ? 'text-red-600'
                      : 'text-slate-500'
                  }`}
                >
                  {evaluation2.score - evaluation1.score > 0
                    ? 'Melhora'
                    : evaluation2.score - evaluation1.score < 0
                    ? 'Piora'
                    : 'Sem mudança'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-slate-900 dark:text-white">
                Comparação Detalhada por Etapa
              </h2>

              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div key={step} className="space-y-4">
                  {renderStepComparison(step)}
                  {renderPhotoComparison(step)}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && (!evaluation1 || !evaluation2) && selectedPatientId && (
          <div className="text-center py-12">
            <p className="font-mono text-slate-500">
              Selecione duas avaliações para comparar
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
