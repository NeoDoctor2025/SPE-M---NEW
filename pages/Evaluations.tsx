import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RoutePath } from '../types';

export const EvaluationsList = () => {
  const evaluations = [
    { id: 'EV-001', patient: 'Carlos Almeida', title: 'Avaliação Cardiológica Anual', status: 'Concluído', score: 92, date: '15/07/2024' },
    { id: 'EV-002', patient: 'Beatriz Costa', title: 'Check-up Neurológico', status: 'Rascunho', score: null, date: '12/07/2024' },
    { id: 'EV-003', patient: 'Daniel Ferreira', title: 'Avaliação Dermatológica', status: 'Concluído', score: 88, date: '10/07/2024' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end border-b border-border dark:border-slate-800 pb-6">
        <div>
            <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic">Avaliações</h1>
            <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-wider">Gerenciamento de Laudos</p>
        </div>
        <Link to={RoutePath.EVALUATIONS_NEW} className="bg-primary text-white px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wide hover:bg-primary-dark transition shadow-sm flex items-center gap-2 group">
          <span className="material-symbols-outlined text-lg">add_circle</span> 
          Nova Avaliação
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 border border-border dark:border-slate-800 shadow-sm">
        <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors" placeholder="BUSCAR AVALIAÇÃO..." />
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">filter_list</span> Status
            </button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">stethoscope</span> Especialidade
            </button>
        </div>
      </div>

      {/* Technical Table */}
      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-border dark:border-slate-800">
                <tr>
                    <th className="px-6 py-4 font-medium">ID / Paciente</th>
                    <th className="px-6 py-4 font-medium">Protocolo</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium text-right">Comandos</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
                {evaluations.map((ev, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                            <span className="font-medium text-slate-900 dark:text-white block">{ev.patient}</span>
                            <span className="font-mono text-[10px] text-slate-400">{ev.id}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-sans">{ev.title}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wide ${ev.status === 'Concluído' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                {ev.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {ev.score ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{width: `${ev.score}%`}}></div>
                                    </div>
                                    <span className="font-mono text-xs font-bold dark:text-slate-200">{ev.score}</span>
                                </div>
                            ) : (
                                <span className="font-mono text-xs text-slate-400">--</span>
                            )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{ev.date}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors" title="Visualizar"><span className="material-symbols-outlined text-lg">visibility</span></button>
                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors" title="Exportar"><span className="material-symbols-outlined text-lg">download</span></button>
                            <button className="p-1.5 text-slate-400 hover:text-critical hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-sm transition-colors" title="Excluir"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export const SelectPatientForEvaluation = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<string | null>(null);

    const handleStart = () => {
        if (selected) navigate(`/evaluations/wizard/${selected}`);
    }

    return (
        <div className="flex flex-col items-center py-16 px-4">
            <div className="text-center mb-10">
                <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic mb-2">Nova Sessão de Avaliação</h1>
                <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">Selecione o paciente alvo para iniciar o protocolo</p>
            </div>

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas p-8 relative">
                {/* Decor */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary"></div>

                <div className="relative mb-8">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400">search</span>
                    <input className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors" placeholder="BUSCAR POR NOME, CPF OU ID..." />
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {[
                        { id: '123456', name: 'João Silva', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxnzC__nPVChLn5XJBQx_18mFHeyrM2CWSSrKi7Pta9A3LSD3l8JXBo8HvRyYg-SW0_o8H-eMNy334a_zI_ctil1QJ7Q4tCmsF_kjQHqDambItM9FWPPFfLnlkossRjYFpjlaQygJlQDj7r9A1G5u8zz_4Wo--HZfdlOLq3Dooqi1hKjPCieo_ejnehrTcZBb3AcODyN_-1OKKCmTGcVjyMWFDX-21iAXxOljDCc4eo6RNweodS7Nc9NxkjRUeSxQ6S9bHICBbK03k' },
                        { id: '789012', name: 'Maria Almeida', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4gRg1ppRgZQJOSuWM0X5FE6bB5XVK7swj1BH5JMAxuFBd5DetlQisTv8s7dZrCnzxI68qMSRWIukdcWk25nc9bNd7U2kBwWUTPsaj4gjgM4QkHB4vBc26ZveMMXgB-Z7VjgDHebDPq_iU8wkxpJ8mDIOJqvBmdoj1iLuAUWGLGAft58pR-_VyJYNEilrTk3ocmw45aiVUOO0ok0zTKf0FiMkLEyeS9JDIbIhOvHVq_Qrij-0iqSwwPhFteaU9HdFMtBbhEaoKHP4' }
                    ].map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => setSelected(p.id)}
                            className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all group ${selected === p.id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-sm bg-cover bg-center grayscale group-hover:grayscale-0 transition-all" style={{backgroundImage: `url(${p.img})`}}></div>
                                <div>
                                    <p className="font-serif text-lg text-slate-900 dark:text-white leading-none">{p.name}</p>
                                    <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1">ID: {p.id}</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 border flex items-center justify-center ${selected === p.id ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'}`}>
                                <span className="material-symbols-outlined text-sm font-bold">check</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-end">
                    <button 
                        onClick={handleStart}
                        disabled={!selected}
                        className={`px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${selected ? 'bg-secondary dark:bg-primary text-white hover:bg-slate-800 dark:hover:bg-primary-dark' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
                    >
                        Inicializar
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export const EvaluationWizard = () => {
    const [elasticity, setElasticity] = useState(3);
    const [wrinkles, setWrinkles] = useState(2);

    return (
        <div className="flex flex-col h-full">
            {/* Technical Header */}
            <div className="mb-8 border-b border-border dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="font-serif text-3xl font-light text-slate-900 dark:text-white">Avaliação Facial <span className="text-slate-300 dark:text-slate-700">/</span> <span className="italic text-primary">Elasticidade</span></h1>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Protocolo ID: AF-2024-X92</p>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((step, idx) => (
                            <div key={step} className={`w-8 h-1 ${idx === 0 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 border border-border dark:border-slate-800 shadow-atlas relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                        <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-8">Parâmetros Clínicos</h2>
                        
                        {/* Custom Technical Sliders */}
                        <div className="space-y-10">
                            <div className="group">
                                <div className="flex justify-between mb-4">
                                    <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">Elasticidade da Pele</label>
                                    <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">{elasticity}<span className="text-xs text-slate-400 font-normal">/5</span></span>
                                </div>
                                <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
                                    <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(elasticity/5)*100}%`}}></div>
                                    <input 
                                        type="range" min="1" max="5" value={elasticity} 
                                        onChange={(e) => setElasticity(Number(e.target.value))}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {/* Ticks */}
                                    <div className="absolute top-3 w-full flex justify-between px-1">
                                        {[1, 2, 3, 4, 5].map(n => <div key={n} className="w-px h-2 bg-slate-300 dark:bg-slate-700"></div>)}
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between mb-4">
                                    <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">Rugas Periorbitais</label>
                                    <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">{wrinkles}<span className="text-xs text-slate-400 font-normal">/5</span></span>
                                </div>
                                <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-none">
                                    <div className="absolute top-0 left-0 h-full bg-primary" style={{width: `${(wrinkles/5)*100}%`}}></div>
                                    <input 
                                        type="range" min="1" max="5" value={wrinkles}
                                        onChange={(e) => setWrinkles(Number(e.target.value))}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Radio Grid */}
                        <div className="mt-12">
                            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Nível de Pigmentação</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Leve', 'Moderado', 'Severo', 'Muito Severo'].map((label, idx) => (
                                    <label key={label} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 transition-all">
                                        <div className="relative flex items-center justify-center w-4 h-4 border border-slate-400 dark:border-slate-600 rounded-full has-[:checked]:border-primary">
                                            <input type="radio" name="pigment" defaultChecked={idx === 0} className="peer appearance-none w-full h-full absolute inset-0 cursor-pointer" />
                                            <div className="w-2 h-2 bg-primary rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span className="font-serif text-lg text-slate-900 dark:text-white">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <label className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">Observações Técnicas</label>
                            <textarea className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white" rows={3} placeholder="Insira notas clínicas..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {/* Score Gauge */}
                    <div className="bg-secondary dark:bg-slate-950 text-white p-6 border border-secondary dark:border-slate-800 shadow-atlas relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary opacity-20 rounded-full blur-2xl"></div>
                        <h3 className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">Score em Tempo Real</h3>
                        <div className="flex items-end gap-2">
                            <p className="font-serif text-6xl font-light text-white">7.5</p>
                            <p className="font-mono text-sm mb-2 opacity-60">/ 10</p>
                        </div>
                        
                        {/* Micro Sparkline */}
                        <div className="mt-4 h-8 w-full flex items-end gap-1 opacity-50">
                            <div className="w-1 bg-primary h-[20%]"></div>
                            <div className="w-1 bg-primary h-[40%]"></div>
                            <div className="w-1 bg-primary h-[30%]"></div>
                            <div className="w-1 bg-primary h-[60%]"></div>
                            <div className="w-1 bg-primary h-[50%]"></div>
                            <div className="w-1 bg-white h-[75%]"></div>
                        </div>
                    </div>

                    {/* Anatomy Viewfinder */}
                    <div className="bg-white dark:bg-slate-900 p-1 border border-border dark:border-slate-800 shadow-atlas">
                        <div className="bg-slate-900 aspect-square relative flex items-center justify-center overflow-hidden">
                            {/* Viewfinder UI */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30"></div>
                            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30"></div>
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30"></div>
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10"></div>
                            
                            <span className="material-symbols-outlined text-6xl text-white/20">face</span>
                            <div className="absolute bottom-2 right-2 font-mono text-[10px] text-white/40">CANVAS_V1</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-border dark:border-slate-700 text-center">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Mapeamento Anatômico</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-border dark:border-slate-800 flex justify-between items-center">
                <button className="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Anterior
                </button>
                <button className="px-8 py-3 bg-primary text-white font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                    Próximo Passo
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}

export const EvaluationDetails = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8 border-b border-border dark:border-slate-800 pb-4">
                <Link to={RoutePath.EVALUATIONS} className="text-slate-400 hover:text-primary font-mono text-xs uppercase">Avaliações</Link>
                <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>
                <span className="text-slate-900 dark:text-white font-mono text-xs uppercase font-bold">Relatório Final: EV-2024-88</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="font-serif text-5xl text-slate-900 dark:text-white mb-2">Maria Santos</h1>
                            <p className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">Avaliação Facial Completa &bull; 23/07/2024</p>
                        </div>
                        <div className="bg-secondary dark:bg-slate-950 text-white p-6 border-l-4 border-primary shadow-atlas">
                            <p className="font-mono text-[10px] uppercase tracking-widest opacity-70 mb-1">Score Global</p>
                            <div className="flex items-baseline gap-1">
                                <p className="font-serif text-5xl font-light">88</p>
                                <p className="font-mono text-sm opacity-50">/100</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {[
                            { step: 1, name: 'Face - Terço Superior', criteria: [{n: 'Ritidose Frontal', v: '4/5'}, {n: 'Ptose Superciliar', v: '5/5'}] },
                            { step: 2, name: 'Face - Terço Médio', criteria: [{n: 'Bolsas Palpebrais', v: '3/5'}, {n: 'Sulco Nasogeniano', v: '4/5'}] },
                        ].map((s) => (
                            <div key={s.step} className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700"></div>
                                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                                    <h3 className="font-serif text-lg text-slate-900 dark:text-white italic">{s.name}</h3>
                                    <span className="font-mono text-[10px] text-slate-400 uppercase">Passo 0{s.step}</span>
                                </div>
                                <div className="p-6 grid grid-cols-1 gap-6">
                                    {s.criteria.map(c => (
                                        <div key={c.n} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                                            <span className="font-sans text-sm text-slate-700 dark:text-slate-300">{c.n}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-800 dark:bg-slate-400" style={{width: `${(parseInt(c.v)/5)*100}%`}}></div>
                                                </div>
                                                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{c.v}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {s.step === 1 && (
                                        <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-3 text-xs text-amber-800 dark:text-amber-200 font-mono">
                                            <span className="font-bold mr-2">NOTA CLÍNICA:</span>
                                            Paciente refere leve incômodo com as linhas de expressão.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-80">
                    <div className="sticky top-6 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-1 shadow-atlas">
                            <div className="bg-slate-900 aspect-[3/4] relative">
                                <img 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiE-TZydS1nrIrpnyIAd8sw7lagGWG1UFns-JE5S5SZYibBI2soU8O6vXfmADkIOt3AipAGr1da-NbkJwO2duRbgebWYR7KveYPijqJL5trywgkbqI_lrTLHAVXzoDAT94IgHZboQ4PsoHU-Ewh0f5uVGlt4foXUdeHESraqR5cgPOZ_XMwF9xjtV8j1yHL7iq65KLsZqDre_OF0yZxQ3oxhIL3KkY-mNZHs68PAQtFy8G1Ih0lnrYYjxPRlxhm9T1S6TV_KkOB_8v" 
                                    alt="Anatomy" 
                                    className="object-contain w-full h-full opacity-90"
                                />
                                {/* Overlay UI */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="font-mono text-[10px] text-white uppercase tracking-widest text-center">Visualização Anatômica</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-secondary dark:bg-primary text-white font-mono text-xs uppercase tracking-widest py-4 hover:bg-slate-800 dark:hover:bg-primary-dark transition shadow-sm flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Exportar PDF
                            </button>
                            <button className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-widest py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">compare_arrows</span> Comparar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const CompareEvaluations = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="border-b border-border dark:border-slate-800 pb-6">
                <h1 className="font-serif text-3xl text-slate-900 dark:text-white italic">Comparativo Clínico</h1>
                <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-wider">Análise de Evolução &bull; Paciente: Ricardo Santos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas">
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Ponto A (Referência)</span>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 py-2 px-3 focus:border-primary outline-none font-sans text-slate-900 dark:text-white">
                        <option>Pré-Op 2024-01-15</option>
                    </select>
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Ponto B (Atual)</span>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 py-2 px-3 focus:border-primary outline-none font-sans text-slate-900 dark:text-white">
                        <option>Pós-Op 2024-06-20</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Vertical Divider line */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2 border-l border-dashed border-slate-300 dark:border-slate-700"></div>

                <div className="space-y-6">
                    <h2 className="font-serif text-xl text-slate-900 dark:text-white text-center bg-slate-100 dark:bg-slate-800 py-2 border-y border-slate-200 dark:border-slate-700">Janeiro 2024</h2>
                    <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Sinais Vitais</h3>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Pressão Arterial</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">135/88 mmHg</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Freq. Cardíaca</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">82 bpm</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Laboratorial</h3>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Glicose</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">95 mg/dL</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="font-serif text-xl text-slate-900 dark:text-white text-center bg-slate-100 dark:bg-slate-800 py-2 border-y border-slate-200 dark:border-slate-700">Junho 2024</h2>
                    <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-sm space-y-4 relative">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500"></div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Sinais Vitais</h3>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Pressão Arterial</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1">122/80 mmHg</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Freq. Cardíaca</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1">74 bpm</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-sm space-y-4 relative">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500"></div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Laboratorial</h3>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Glicose</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">92 mg/dL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}