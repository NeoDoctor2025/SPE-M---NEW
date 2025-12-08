import React from 'react';
import { EvaluationStepData } from '../../types/evaluationTypes';

interface Step8Props {
  data: EvaluationStepData['step8'];
  onChange: (data: EvaluationStepData['step8']) => void;
  calculatedScore: number;
}

export const Step8 = ({ data, onChange, calculatedScore }: Step8Props) => {
  const formData = data || {
    overallAssessment: '',
    treatmentPlan: '',
    followUpDate: '',
    finalNotes: ''
  };

  const updateField = (field: string, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="bg-secondary dark:bg-slate-950 text-white p-8 border border-secondary dark:border-slate-800 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary opacity-20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Score Final Calculado</h3>
          <div className="flex items-end gap-3">
            <p className="font-serif text-7xl font-light text-white">{calculatedScore}</p>
            <p className="font-mono text-xl mb-3 opacity-60">/ 100</p>
          </div>
          <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{width: `${calculatedScore}%`}}></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Avaliação Geral
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={4}
          placeholder="Resumo da avaliação geral do paciente..."
          value={formData.overallAssessment}
          onChange={(e) => updateField('overallAssessment', e.target.value)}
        ></textarea>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Plano de Tratamento Sugerido
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={5}
          placeholder="Descreva o plano de tratamento recomendado..."
          value={formData.treatmentPlan}
          onChange={(e) => updateField('treatmentPlan', e.target.value)}
        ></textarea>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Data de Retorno Sugerida
        </label>
        <input
          type="date"
          className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white"
          value={formData.followUpDate}
          onChange={(e) => updateField('followUpDate', e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Observações Finais
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={3}
          placeholder="Quaisquer notas adicionais..."
          value={formData.finalNotes}
          onChange={(e) => updateField('finalNotes', e.target.value)}
        ></textarea>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">info</span>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-amber-800 dark:text-amber-200 font-bold mb-1">
            Revisão Final
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Revise todas as informações antes de finalizar. Após finalizar, a avaliação será salva e você poderá exportá-la em PDF.
          </p>
        </div>
      </div>
    </div>
  );
};
