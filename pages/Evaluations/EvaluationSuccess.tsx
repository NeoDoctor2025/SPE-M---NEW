import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { RoutePath } from '../../types';
import { useClinic } from '../../context/ClinicContext';

export const EvaluationSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEvaluation } = useClinic();

  const evaluation = getEvaluation(id || '');

  if (!evaluation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="font-mono text-slate-500 mb-4">Avaliação não encontrada</p>
          <button
            onClick={() => navigate(RoutePath.EVALUATIONS)}
            className="px-6 py-2 bg-primary text-white font-mono text-xs uppercase"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500"></div>

          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500 opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 border-4 border-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400">
                  check_circle
                </span>
              </div>
            </div>

            <h1 className="font-serif text-4xl text-center text-slate-900 dark:text-white mb-4">
              Avaliação Finalizada!
            </h1>

            <p className="text-center text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
              A avaliação de <span className="font-bold text-slate-900 dark:text-white">{evaluation.patientName}</span> foi
              concluída com sucesso e salva no sistema.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                    ID da Avaliação
                  </p>
                  <p className="font-mono text-sm text-slate-900 dark:text-white font-bold">
                    {evaluation.id}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                    Data
                  </p>
                  <p className="font-mono text-sm text-slate-900 dark:text-white font-bold">
                    {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                    Score Final
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-serif text-3xl text-emerald-600 dark:text-emerald-400 font-bold">
                      {evaluation.score}
                    </p>
                    <p className="font-mono text-sm text-slate-400">/100</p>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                    Status
                  </p>
                  <span className="inline-flex px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase tracking-wide">
                    Completo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={RoutePath.EVALUATIONS_DETAILS.replace(':id', evaluation.id)}
                className="flex-1 bg-primary text-white px-6 py-4 font-mono text-xs uppercase tracking-widest text-center hover:bg-primary-dark transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                Ver Detalhes
              </Link>

              <Link
                to={RoutePath.EVALUATIONS_EXPORT.replace(':id', evaluation.id)}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 font-mono text-xs uppercase tracking-widest text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                Exportar PDF
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <Link
                to={RoutePath.EVALUATIONS_NEW}
                className="text-primary hover:text-primary-dark font-mono text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Nova Avaliação
              </Link>

              <Link
                to={RoutePath.EVALUATIONS}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Voltar para Lista
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
