import React from 'react';
import { EvaluationStepData } from '../../types/evaluationTypes';

interface Step3Props {
  data: EvaluationStepData['step3'];
  onChange: (data: EvaluationStepData['step3']) => void;
}

export const Step3 = ({ data, onChange }: Step3Props) => {
  const formData = data || {
    marionetteLi: 3,
    jawlineDefinition: 3,
    mentalFold: 2,
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
            Linhas de Marionete
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.marionetteLi}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.marionetteLi/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.marionetteLi}
            onChange={(e) => updateField('marionetteLi', Number(e.target.value))}
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
            Definição da Linha Mandibular
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.jawlineDefinition}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.jawlineDefinition/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.jawlineDefinition}
            onChange={(e) => updateField('jawlineDefinition', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="group">
        <div className="flex justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
            Dobra Mentoniana
          </label>
          <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            {formData.mentalFold}<span className="text-xs text-slate-400 font-normal">/5</span>
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
          <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(formData.mentalFold/5)*100}%`}}></div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.mentalFold}
            onChange={(e) => updateField('mentalFold', Number(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Observações - Terço Inferior
        </label>
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white"
          rows={3}
          placeholder="Notas sobre terço inferior e mandíbula..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
