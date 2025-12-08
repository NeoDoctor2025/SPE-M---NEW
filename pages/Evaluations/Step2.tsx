import React from 'react';
import { EvaluationStepData } from '../../types/evaluationTypes';

interface Step2Props {
  data: EvaluationStepData['step2'];
  onChange: (data: EvaluationStepData['step2']) => void;
}

export const Step2 = ({ data, onChange }: Step2Props) => {
  const formData = data || {
    nasogenianFold: 3,
    palpebralBags: 2,
    malarVolume: 3,
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
            Sulco Nasogeniano
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.nasogenianFold}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.nasogenianFold/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.nasogenianFold}
            onChange={(e) => updateField('nasogenianFold', Number(e.target.value))}
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
            Bolsas Palpebrais
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.palpebralBags}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.palpebralBags/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.palpebralBags}
            onChange={(e) => updateField('palpebralBags', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Volume Malar
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.malarVolume}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.malarVolume/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.malarVolume}
            onChange={(e) => updateField('malarVolume', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Observações - Terço Médio
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={3}
          placeholder="Notas sobre terço médio facial..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
