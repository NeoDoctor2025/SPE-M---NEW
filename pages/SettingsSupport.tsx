import React from 'react';

export const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic mb-8">Configurações do Sistema</h1>

        <div className="space-y-8">
            {/* Personal Info */}
            <section className="bg-white dark:bg-slate-900 p-8 border border-border dark:border-slate-800 shadow-atlas relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="flex gap-8 items-start mb-8">
                    <div className="flex-1">
                        <h2 className="font-serif text-2xl text-slate-900 dark:text-white">Perfil Profissional</h2>
                        <p className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">Dados de exibição e credenciais</p>
                    </div>
                    <div className="w-20 h-20 rounded-sm bg-cover bg-center border border-slate-200 dark:border-slate-700 shadow-sm grayscale hover:grayscale-0 transition-all" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC65A-DTPNrZRajuXaAaZV860xZaoqZ1m8Pg3De5zoZ0h1KZ_9IrV6oFNQtG71FwFkwfo65PeqF3Eg5bjnYclFOWSbJvPd3YCbR3EYy9d1hh53Fqr8qw9sblgTP21ONNhqgCkdj90ZpsFRlTfABVvNqf6vxH0Eg0wMXD9DtQthFqJbfTIVVePWPVvsHaKFG5gAZ57VNIUeVFMc8t8Q_wypiQITMFDfisv-JE9CyfFD7OGVu131o0eZ0_wI6FoAiVLBzHN0afYB8F2Po")'}}></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Nome de Exibição</span>
                        <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-serif text-lg text-slate-900 dark:text-white" defaultValue="Dr. Isabella Rossi" />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail Principal</span>
                        <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-sm text-slate-900 dark:text-white" defaultValue="isabella@clinicamedica.com" />
                    </label>
                </div>
            </section>

            {/* System Prefs */}
            <section className="bg-white dark:bg-slate-900 p-8 border border-border dark:border-slate-800 shadow-atlas relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-6">Interface</h2>
                <div className="space-y-8">
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-3">Tema Visual</h3>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 border-2 border-primary bg-primary/5 dark:bg-primary/10 text-primary font-mono text-xs uppercase tracking-wide rounded-sm">
                                <span className="material-symbols-outlined text-lg">auto_awesome</span> Automático
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 font-mono text-xs uppercase tracking-wide rounded-sm transition-colors">
                                <span className="material-symbols-outlined text-lg">contrast</span> Contraste
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div>
                            <span className="font-medium text-slate-900 dark:text-white block">Sistema Métrico</span>
                            <span className="text-sm text-slate-500 font-light">Usar cm/kg para medidas corporais</span>
                        </div>
                        <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-4 pt-4">
                <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Reverter</button>
                <button className="px-8 py-3 bg-secondary dark:bg-primary text-white font-mono text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary-dark transition-colors shadow-lg">Salvar Alterações</button>
            </div>
        </div>
    </div>
  );
};

export const Support = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic mb-8">Central de Ajuda</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/20 pb-2 inline-block">FAQ Técnico</h2>
                        <div className="space-y-4">
                            <details className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 shadow-sm group cursor-pointer">
                                <summary className="font-medium text-slate-800 dark:text-slate-200 flex justify-between items-center list-none">
                                    <span className="group-hover:text-primary transition-colors">Como iniciar uma nova avaliação?</span>
                                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition">expand_more</span>
                                </summary>
                                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-primary/20">
                                    Acesse a rota <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1">/evaluations</span>, selecione o comando 'Nova Avaliação' no topo direito, escolha o paciente na lista e siga o wizard de protocolo.
                                </p>
                            </details>
                            <details className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 shadow-sm group cursor-pointer">
                                <summary className="font-medium text-slate-800 dark:text-slate-200 flex justify-between items-center list-none">
                                    <span className="group-hover:text-primary transition-colors">Onde encontro os relatórios salvos?</span>
                                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition">expand_more</span>
                                </summary>
                                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-primary/20">
                                    Os laudos finalizados são arquivados na seção 'Avaliações' com status <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase">Concluído</span>. Use o filtro de busca por ID para acesso rápido.
                                </p>
                            </details>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-mono text-sm font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/20 pb-2 inline-block">Tutoriais</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 group cursor-pointer shadow-atlas hover:shadow-lg transition-all">
                                <div className="aspect-video bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                                    <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">play_circle</span>
                                </div>
                                <div className="p-4">
                                    <p className="font-serif text-lg text-slate-900 dark:text-white">Canvas de Precisão</p>
                                    <p className="font-mono text-[10px] text-slate-400 mt-1 uppercase">Módulo Avançado</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 group cursor-pointer shadow-atlas hover:shadow-lg transition-all">
                                <div className="aspect-video bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                                    <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">play_circle</span>
                                </div>
                                <div className="p-4">
                                    <p className="font-serif text-lg text-slate-900 dark:text-white">Exportação de Laudos</p>
                                    <p className="font-mono text-[10px] text-slate-400 mt-1 uppercase">Workflow PDF</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-secondary dark:bg-slate-950 text-white p-8 border-t-4 border-primary shadow-atlas">
                        <h2 className="font-serif text-2xl mb-6">Suporte Dedicado</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <div>
                                    <p className="font-mono text-[10px] uppercase opacity-60">Canal Prioritário</p>
                                    <p className="text-sm font-medium">suporte@spe-m.com</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <span className="material-symbols-outlined text-primary">call</span>
                                <div>
                                    <p className="font-mono text-[10px] uppercase opacity-60">Emergência Técnica</p>
                                    <p className="text-sm font-medium">+55 (11) 99999-8888</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas">
                        <h2 className="font-serif text-xl text-slate-900 dark:text-white mb-4">Ticket de Suporte</h2>
                        <form className="space-y-4">
                            <label className="block">
                                <span className="font-mono text-xs uppercase text-slate-500">Assunto</span>
                                <input className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 py-2 px-1 focus:border-primary outline-none text-sm dark:text-white" />
                            </label>
                            <label className="block">
                                <span className="font-mono text-xs uppercase text-slate-500">Descrição Detalhada</span>
                                <textarea className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 py-2 px-1 focus:border-primary outline-none text-sm dark:text-white h-24 resize-none"></textarea>
                            </label>
                            <button className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs uppercase tracking-widest py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
                                Abrir Ticket
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}