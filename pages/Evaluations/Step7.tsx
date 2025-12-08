import React from 'react';
import { EvaluationStepData } from '../../types/evaluationTypes';

interface Step7Props {
  data: EvaluationStepData['step7'];
  onChange: (data: EvaluationStepData['step7']) => void;
}

export const Step7 = ({ data, onChange }: Step7Props) => {
  const formData = data || {
    periorbitalArea: 3,
    lips: 2,
    hands: 2,
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
            Área Periorbital
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.periorbitalArea}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.periorbitalArea/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.periorbitalArea}
            onChange={(e) => updateField('periorbitalArea', Number(e.target.value))}
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
            Lábios (Volume/Contorno)
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.lips}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.lips/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.lips}
            onChange={(e) => updateField('lips', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Mãos (Envelhecimento)
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.hands}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.hands/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.hands}
            onChange={(e) => updateField('hands', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Observações - Áreas Específicas
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={3}
          placeholder="Notas sobre áreas específicas de interesse..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
