import React from 'react';
import { EvaluationStepData } from '../../types/evaluationTypes';

interface Step1Props {
  data: EvaluationStepData['step1'];
  onChange: (data: EvaluationStepData['step1']) => void;
}

export const Step1 = ({ data, onChange }: Step1Props) => {
  const formData = data || {
    elasticity: 3,
    wrinkles: 2,
    pigmentation: 'Leve',
    notes: ''
  };

  const updateField = (field: string, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Elasticidade da Pele
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.elasticity}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.elasticity/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.elasticity}
            onChange={(e) => updateField('elasticity', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute top-3 w-full flex justify-between px-1">
            {[1, 2, 3, 4, 5].map(n => <div key={n} className="w-px h-2 bg-slate-300 dark:bg-slate-700"></div>)}
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Rugas Periorbitais
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.wrinkles}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.wrinkles/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.wrinkles}
            onChange={(e) => updateField('wrinkles', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-12">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Nível de Pigmentação
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Leve', 'Moderado', 'Severo', 'Muito Severo'].map((label) => (
            <label
              key={label}
              className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 transition-all"
            >
              <div className="relative flex items-center justify-center w-4 h-4 border border-slate-400 dark:border-slate-600 rounded-full has-[:checked]:border-primary">
                <input
                  type="radio"
                  name="pigment"
                  checked={formData.pigmentation === label}
                  onChange={() => updateField('pigmentation', label)}
                  className="peer appearance-none w-full h-full absolute inset-0 cursor-pointer"
                />
                <div className="w-2 h-2 bg-primary rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="font-serif text-lg text-slate-900 dark:text-white">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Observações Técnicas
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={3}
          placeholder="Insira notas clínicas..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
