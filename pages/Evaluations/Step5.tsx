import React from 'react';
import { EvaluationStepData } from '../../types/evaluationTypes';

interface Step5Props {
  data: EvaluationStepData['step5'];
  onChange: (data: EvaluationStepData['step5']) => void;
}

export const Step5 = ({ data, onChange }: Step5Props) => {
  const formData = data || {
    poreSize: 3,
    skinTexture: 3,
    hyperpigmentation: 2,
    acneScars: 1,
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
            Tamanho dos Poros
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.poreSize}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.poreSize/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.poreSize}
            onChange={(e) => updateField('poreSize', Number(e.target.value))}
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
            Textura da Pele
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.skinTexture}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.skinTexture/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.skinTexture}
            onChange={(e) => updateField('skinTexture', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Hiperpigmentação
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.hyperpigmentation}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.hyperpigmentation/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.hyperpigmentation}
            onChange={(e) => updateField('hyperpigmentation', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Cicatrizes de Acne
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.acneScars}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.acneScars/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.acneScars}
            onChange={(e) => updateField('acneScars', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Observações - Textura e Pigmentação
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={3}
          placeholder="Notas sobre textura da pele e pigmentação..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
