
import React, { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../types';
import { useClinic } from '../context/ClinicContext';
import { exportEvaluationToPDF } from '../lib/pdfExport';

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

    const handleDownloadPDF = () => {
        if (evaluation && patient) {
            exportEvaluationToPDF(evaluation, patient);
        } else {
            alert('Avaliação ou paciente não encontrado');
        }
    };

    if (!evaluation || !patient) {
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

interface Annotation {
    id: number;
    x: number;
    y: number;
    type: 'point' | 'text';
}

export const ImageAnnotation = () => {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [tool, setTool] = useState<'pointer' | 'marker'>('marker');
    const imageRef = useRef<HTMLDivElement>(null);

    const handleImageClick = (e: React.MouseEvent) => {
        if (tool === 'marker' && imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            setAnnotations([...annotations, {
                id: Date.now(),
                x, y, type: 'point'
            }]);
        }
    };

    const removeAnnotation = (id: number) => {
        setAnnotations(annotations.filter(a => a.id !== id));
    };

    return (
        <div className="fixed inset-0 bg-background dark:bg-slate-950 z-50 flex flex-col font-sans">
            {/* Annotation Header */}
            <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-secondary text-white shrink-0 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-primary/50 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">health_and_safety</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-serif text-lg leading-none">Canvas Cirúrgico</h2>
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Modo de Alta Precisão</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setAnnotations([])}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 font-mono text-xs uppercase tracking-wide transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">delete</span> Limpar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-dark font-mono text-xs uppercase tracking-wide transition-colors shadow-glow">
                        <span className="material-symbols-outlined text-base">save</span> Salvar
                    </button>
                    <Link to={RoutePath.DASHBOARD} className="ml-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-sm transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Toolbar */}
                <aside className="w-16 border-r border-slate-800 flex flex-col items-center py-4 gap-3 bg-secondary text-slate-400">
                    <button 
                        onClick={() => setTool('pointer')}
                        className={`w-10 h-10 flex items-center justify-center rounded-sm ${tool === 'pointer' ? 'text-primary bg-slate-800 border border-primary/50 shadow-glow' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">arrow_selector_tool</span>
                    </button>
                    <div className="w-8 h-px bg-slate-800 my-1"></div>
                    <button 
                        onClick={() => setTool('marker')}
                        className={`w-10 h-10 flex items-center justify-center rounded-sm ${tool === 'marker' ? 'text-primary bg-slate-800 border border-primary/50 shadow-glow' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">radio_button_unchecked</span>
                    </button>
                </aside>

                {/* Canvas Area */}
                <main className="flex-1 bg-slate-900 relative flex flex-col overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-5 pointer-events-none"></div>
                    
                    <div className="flex-1 flex items-center justify-center p-8 relative cursor-crosshair" onClick={handleImageClick}>
                        <div ref={imageRef} className="relative shadow-2xl border border-white/5 inline-block">
                            {/* Crosshair overlay */}
                            <div className="absolute top-0 left-1/2 h-full w-px bg-primary/20 pointer-events-none"></div>
                            <div className="absolute left-0 top-1/2 w-full h-px bg-primary/20 pointer-events-none"></div>
                            
                            <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcBg2f-0Jd81qvftlnSjRo5Z8yWbaq2h-pKNCVVTN4yTLDehB8omAjObDsK2EOhMQ9P7FpHjVRCLn7flx0ImGWlvDX7zo65T_8m4ul70joPe6m-pKCcfzCziXMQEClYEZyaK3QuQzUOTX9mZIsC6jdwLNWuNvl8Foe8uJbXdca4X3dd64pYWRaVn0_2wgOXKn436vrXFp5_ysfXlFypQfcSRFdTEF0R2n03B4kj8iSRY6ucVzTcYioFPm1rb9i6xbyJO62nvzhCUcm" 
                                alt="Face Anatomy"
                                className="max-h-[75vh] object-contain grayscale brightness-75 contrast-125 pointer-events-none select-none"
                            />

                            {/* Render Annotations */}
                            {annotations.map(ann => (
                                <div 
                                    key={ann.id}
                                    style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                                    className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-primary rounded-full bg-primary/20 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-glow"
                                    onClick={(e) => { e.stopPropagation(); removeAnnotation(ann.id); }}
                                >
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="h-32 bg-secondary border-t border-slate-800 p-4 flex justify-center gap-4 overflow-x-auto shrink-0 z-10">
                        <div className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-20 h-20 bg-cover bg-center ring-1 ring-primary shadow-glow opacity-100" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSUE1RRwzEClhcpTTYZcc_E9LkSpJfJheE2nyJWpim-0VxDKf6Ul1v_MabZXzkY_zMA6DlYdvaCpwGyFJC6Z2SIB3ZtVX-C2X4NiP5GSBLk7Qo5jovKsOsoxtk2S4lBsMF3FIjXptKSgWJ_hL2aZwJmt3_OVq8ZFpE2BmXIok9akil6ppe9Kwfqq_8pv3rsxBWj9eKh-igZPqbIl8zk6MGsn2dHOEbxfZeyMblRrojP6bzaHiDy0dB9Fnme2fsS9NrmJJwS6tDyaoH")'}}></div>
                            <span className="font-mono text-[10px] uppercase text-primary tracking-wider">Frontal</span>
                        </div>
                    </div>
                </main>

                {/* Layers Panel */}
                <aside className="w-72 bg-secondary border-l border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-white">Camadas Ativas</h3>
                        <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"><span className="material-symbols-outlined">add</span></button>
                    </div>
                    <div className="p-3 space-y-1">
                        {annotations.map((ann, index) => (
                            <div key={ann.id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-primary/30 rounded-sm">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-500 text-sm">drag_indicator</span>
                                    <span className="font-sans text-sm font-medium text-white">Marcador {index + 1}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => removeAnnotation(ann.id)} className="text-slate-600 hover:text-rose-500"><span className="material-symbols-outlined text-base">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
