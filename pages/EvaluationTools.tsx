
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../types';
import { useClinic } from '../context/ClinicContext';
import { exportEvaluationToPDF } from '../lib/pdfExport';
import { exportDetailedEvaluationToPDF } from '../lib/pdfExportDetailed';
import { supabase } from '../lib/supabase';
import { SurgicalCanvas } from '../components/Canvas/SurgicalCanvas';

export const EvaluationSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/80 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        {/* Technical border accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        
        <div className="p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 border-2 border-primary/20 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-2 border-primary rounded-full animate-[spin_3s_linear_infinite] border-t-transparent border-l-transparent"></div>
                <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
            </div>
            
            <h1 className="font-serif text-3xl text-slate-900 dark:text-white mb-2">Protocolo Finalizado</h1>
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-8">Avaliação #8392 registrada com sucesso</p>

            <div className="flex items-center justify-center gap-4 mb-8 w-full">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                    <p className="font-mono text-[10px] uppercase text-slate-400">Score</p>
                    <p className="font-serif text-3xl text-slate-900 dark:text-white">92</p>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                    <p className="font-mono text-[10px] uppercase text-slate-400">Status</p>
                    <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-2">Aprovado</p>
                </div>
            </div>

            <div className="w-full mb-8 text-left">
                <label className="font-mono text-[10px] uppercase text-slate-500 tracking-wider mb-2 block">Recomendações Rápidas</label>
                <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 font-sans text-sm text-slate-900 dark:text-white focus:border-primary outline-none h-24 resize-none"
                    placeholder="Adicione notas finais aqui..."
                ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                    onClick={() => navigate(RoutePath.DASHBOARD)}
                    className="flex-1 py-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                    Dashboard
                </button>
                <button 
                    onClick={() => navigate(RoutePath.EVALUATIONS_EXPORT.replace(':id', id || '8392'))}
                    className="flex-1 py-3 bg-secondary dark:bg-primary text-white font-mono text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-primary-dark transition shadow-sm"
                >
                    Gerar Laudo PDF
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export const ExportEvaluation = () => {
    const { id } = useParams();
    const { getEvaluation, getPatient } = useClinic();
    const evaluation = getEvaluation(id || '');
    const patient = evaluation ? getPatient(evaluation.patientId) : null;
    const [fullEvaluation, setFullEvaluation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFullEvaluation = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('evaluations')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setFullEvaluation(data);
            }
            setLoading(false);
        };

        loadFullEvaluation();
    }, [id]);

    const handleDownloadPDF = async () => {
        if (fullEvaluation && patient) {
            await exportDetailedEvaluationToPDF(fullEvaluation, patient);
        } else {
            alert('Avaliação ou paciente não encontrado');
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                    progress_activity
                </span>
                <p className="font-mono text-slate-500 mt-4">Carregando avaliação...</p>
            </div>
        );
    }

    if (!evaluation || !patient || !fullEvaluation) {
        return (
            <div className="p-8 text-center">
                <p className="font-mono text-slate-500">Avaliação não encontrada.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
            {/* Main Preview Area */}
            <div className="flex-1 flex flex-col gap-6 min-h-0">
                <header className="border-b border-border dark:border-slate-800 pb-4">
                    <h1 className="font-serif text-3xl text-slate-900 dark:text-white italic">Exportação de Documento</h1>
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-wider mt-1">Paciente: {patient.name} &bull; ID: {evaluation.id}</p>
                </header>

                <div className="flex-1 bg-slate-200/50 dark:bg-slate-900 border border-border dark:border-slate-800 flex items-center justify-center p-8 overflow-auto relative">
                    <div className="absolute inset-0 bg-millimeter opacity-50 pointer-events-none"></div>
                    
                    {/* Paper Preview */}
                    <div className="bg-white shadow-2xl w-full max-w-[500px] aspect-[210/297] relative group transition-transform hover:scale-[1.02] duration-500">
                        <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqKzE9-iCxf1aK5sz3pDlNnY2jCsIg1vPNPEWOvCXldQegVRC5YL8uS4Zho845AEvEhPiaoOcL2XqRfu2viK4Q-3RRQ3uWcqA5JcRjOmlm9D9kQPwt_ppCG1ydnYvc6Q398ZCV59OxEkmrVudWZbqvNiMt_xKPEgoX6lb1trvhZS2j_J_eRb-bFh9fgMrrvsNl6iuTP_NyppkAYBJV1HIC_n3FczZpp4xYQWxU7mPMmCXDDKdPWCswoDUnpy7BgQSYA10a9MJwrdt1")'}}></div>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                    </div>
                </div>
            </div>

            {/* Sidebar Options */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6 shadow-atlas sticky top-6">
                    <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">Configuração do Laudo</h3>
                    
                    <div className="flex flex-col gap-4 mb-8">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="font-sans text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Incluir Imagens</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="font-sans text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Ocultar Histórico</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="font-sans text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Marca D'água</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-mono text-xs uppercase tracking-widest py-4 hover:bg-primary-dark shadow-sm transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">download</span> Download PDF
                        </button>
                        <button className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs uppercase tracking-widest py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg">mail</span> Enviar Email
                        </button>
                        <button className="flex items-center justify-center gap-2 w-full text-slate-400 font-mono text-xs uppercase tracking-widest py-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-lg">print</span> Imprimir
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export const ImageAnnotation = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error_outline</span>
                    <h2 className="font-serif text-2xl text-slate-900 mb-2">Avaliação não encontrada</h2>
                    <p className="text-slate-600 mb-6">ID de avaliação inválido</p>
                    <button
                        onClick={() => navigate(RoutePath.DASHBOARD)}
                        className="px-6 py-2 bg-[#0066FF] text-white hover:bg-[#0052CC] font-mono text-xs uppercase tracking-wide transition-colors"
                    >
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <SurgicalCanvas
            evaluationId={id}
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAcBg2f-0Jd81qvftlnSjRo5Z8yWbaq2h-pKNCVVTN4yTLDehB8omAjObDsK2EOhMQ9P7FpHjVRCLn7flx0ImGWlvDX7zo65T_8m4ul70joPe6m-pKCcfzCziXMQEClYEZyaK3QuQzUOTX9mZIsC6jdwLNWuNvl8Foe8uJbXdca4X3dd64pYWRaVn0_2wgOXKn436vrXFp5_ysfXlFypQfcSRFdTEF0R2n03B4kj8iSRY6ucVzTcYioFPm1rb9i6xbyJO62nvzhCUcm"
            imageViews={[
                {
                    angle: 'frontal',
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSUE1RRwzEClhcpTTYZcc_E9LkSpJfJheE2nyJWpim-0VxDKf6Ul1v_MabZXzkY_zMA6DlYdvaCpwGyFJC6Z2SIB3ZtVX-C2X4NiP5GSBLk7Qo5jovKsOsoxtk2S4lBsMF3FIjXptKSgWJ_hL2aZwJmt3_OVq8ZFpE2BmXIok9akil6ppe9Kwfqq_8pv3rsxBWj9eKh-igZPqbIl8zk6MGsn2dHOEbxfZeyMblRrojP6bzaHiDy0dB9Fnme2fsS9NrmJJwS6tDyaoH',
                    label: 'Frontal'
                }
            ]}
        />
    );
}
