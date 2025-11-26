import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { RoutePath } from '../types';

export const PatientsList = () => {
  const patients = [
    { id: '8492', initials: 'AL', name: 'Ana Luiza Costa', contact: '(11) 98765-4321', last: '15/07/2024', status: 'Ativo', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' },
    { id: '2931', initials: 'BF', name: 'Bruno Ferreira', contact: '(21) 99876-5432', last: '12/07/2024', status: 'Aguardando', statusColor: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' },
    { id: '1029', initials: 'CS', name: 'Carla Souza', contact: '(31) 98888-7777', last: '10/07/2024', status: 'Ativo', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' },
    { id: '5823', initials: 'DM', name: 'Daniel Martins', contact: '(41) 97777-6666', last: '05/06/2024', status: 'Inativo', statusColor: 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400' },
    { id: '9123', initials: 'ER', name: 'Eduarda Rocha', contact: '(51) 96666-5555', last: '01/06/2024', status: 'Alerta', statusColor: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-border dark:border-slate-800 pb-6">
        <div>
            <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic">Pacientes</h1>
            <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-wider">Base de Dados Clínica</p>
        </div>
        <Link
          to={RoutePath.PATIENTS_NEW}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wide hover:bg-primary-dark transition shadow-sm group"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Novo Paciente
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 border border-border dark:border-slate-800 shadow-sm">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            placeholder="BUSCAR NOME, CPF OU CRM..."
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs uppercase font-mono tracking-wide">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs uppercase font-mono tracking-wide">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Data
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-border dark:border-slate-800">
            <tr>
              <th className="w-16 px-6 py-4 text-center">#</th>
              <th className="px-6 py-4 font-medium">Nome / ID</th>
              <th className="px-6 py-4 font-medium">Contato</th>
              <th className="px-6 py-4 font-medium">Última Visita</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-800">
            {patients.map((p, i) => (
              <tr key={i} className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4 text-center">
                  <div className="w-8 h-8 mx-auto bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-serif font-bold text-slate-600 dark:text-slate-400 text-xs">
                    {p.initials}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link to={RoutePath.PATIENTS_DETAILS.replace(':id', String(i))} className="font-medium text-slate-900 dark:text-white hover:text-primary block">
                    {p.name}
                  </Link>
                  <span className="font-mono text-[10px] text-slate-400">ID: {p.id}</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.contact}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.last}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wide ${p.statusColor}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to={RoutePath.PATIENTS_EDIT.replace(':id', String(i))} className="text-slate-400 hover:text-primary p-1 inline-block">
                    <span className="material-symbols-outlined text-lg">edit_square</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="font-mono text-[10px] uppercase text-slate-500 tracking-wide">Exibindo 1-5 de 150</span>
            <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-white font-mono text-xs">1</button>
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs hover:border-primary/50">2</button>
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs hover:border-primary/50">3</button>
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export const PatientForm = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="border-b border-border dark:border-slate-800 pb-6">
        <Link to={RoutePath.PATIENTS} className="text-xs font-mono uppercase text-slate-400 hover:text-primary mb-2 block">&larr; Voltar para lista</Link>
        <h1 className="font-serif text-3xl text-slate-900 dark:text-white">Novo Paciente</h1>
        <p className="text-slate-500 font-light mt-1">Preencha a ficha cadastral completa.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1 */}
        <section className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-8 shadow-atlas relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">badge</span>
                Dados Pessoais
            </h3>

            {/* Photo Upload Block */}
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 transition-all group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 cursor-pointer">
                        <span className="material-symbols-outlined text-2xl mb-1">add_a_photo</span>
                        <span className="font-mono text-[10px] uppercase tracking-wide">Foto</span>
                    </div>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div className="flex flex-col pt-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-1">Imagem de Perfil</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-light max-w-sm leading-relaxed">
                        Carregue uma foto recente para identificação. Formatos aceitos: JPG, PNG (Max 5MB).
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Nome Completo</span>
                    <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white" placeholder="EX: JOÃO SILVA" />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">CPF</span>
                    <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white" placeholder="000.000.000-00" />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Data de Nascimento</span>
                    <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white" />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Gênero</span>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white">
                        <option>Selecione...</option>
                        <option>Masculino</option>
                        <option>Feminino</option>
                        <option>Outro</option>
                    </select>
                </label>
            </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-8 shadow-atlas relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 dark:bg-slate-600"></div>
            <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">contact_mail</span>
                Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail</span>
                    <input type="email" className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white" />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Telefone</span>
                    <input type="tel" className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white" />
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Endereço Completo</span>
                    <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white" />
                </label>
            </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-8 shadow-atlas relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
            <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-lg">clinical_notes</span>
                Informações Médicas
            </h3>
            <div className="flex flex-col gap-6">
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Anamnese Rápida</span>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white h-32 resize-none" placeholder="Descreva o histórico principal..."></textarea>
                </label>
                <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-3 block">Alergias Conhecidas</span>
                    <div className="flex flex-wrap items-center gap-2 border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-950 min-h-[3rem]">
                        <span className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 px-3 py-1 text-xs font-medium flex items-center gap-2 shadow-sm">
                            PENICILINA <button className="hover:text-rose-900 font-bold">×</button>
                        </span>
                        <input className="outline-none flex-1 min-w-[150px] text-sm bg-transparent placeholder-slate-400 text-slate-900 dark:text-white" placeholder="Digitar e pressionar Enter..." />
                    </div>
                </div>
            </div>
        </section>
      </div>

      <div className="flex justify-end pb-10 gap-4">
        <Link to={RoutePath.PATIENTS} className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancelar</Link>
        <button className="bg-secondary dark:bg-primary text-white px-8 py-3 font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 dark:hover:bg-primary-dark transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">save</span>
            Salvar Registro
        </button>
      </div>
    </div>
  );
};

export const PatientEdit = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b border-border dark:border-slate-800 pb-6 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[10px]">ID: 123456</span>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase">Ativo</span>
                    </div>
                    <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic">João da Silva</h1>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xs text-slate-400 uppercase">Última Atualização</p>
                    <p className="font-mono text-sm text-slate-600 dark:text-slate-300">15/08/2024 14:30</p>
                </div>
            </div>

            <div className="flex flex-col gap-px bg-border dark:bg-slate-800 border border-border dark:border-slate-800">
                {/* Accordion Item 1 */}
                <details className="bg-white dark:bg-slate-900 group" open>
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="font-serif text-lg text-slate-900 dark:text-white italic">Dados Pessoais</span>
                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <label className="flex flex-col gap-2 col-span-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Nome Completo</span>
                                <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-sans text-slate-900 dark:text-white" defaultValue="João da Silva" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Data de Nascimento</span>
                                <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white" defaultValue="1985-05-15" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">CPF</span>
                                <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white" defaultValue="123.456.789-00" />
                            </label>
                        </div>
                    </div>
                </details>

                {/* Accordion Item 2 */}
                <details className="bg-white dark:bg-slate-900 group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="font-serif text-lg text-slate-900 dark:text-white italic">Contato</span>
                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Celular</span>
                                <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white" defaultValue="(11) 98765-4321" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail</span>
                                <input className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white" defaultValue="joao.silva@email.com" />
                            </label>
                        </div>
                    </div>
                </details>

                {/* Accordion Item 3 */}
                <details className="bg-white dark:bg-slate-900 group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="font-serif text-lg text-slate-900 dark:text-white italic">Histórico Clínico</span>
                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="pt-6">
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Anotações Gerais</span>
                                <textarea className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none font-sans text-slate-900 dark:text-white h-32" defaultValue="Paciente com histórico de hipertensão. Alergia a penicilina."></textarea>
                            </label>
                        </div>
                    </div>
                </details>
            </div>

            <div className="sticky bottom-0 bg-background/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-border dark:border-slate-800 p-4 mt-8 -mx-8 flex justify-end gap-4">
                <Link to={RoutePath.PATIENTS} className="px-6 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Descartar</Link>
                <button className="bg-primary text-white px-8 py-3 font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-primary-dark transition-colors">
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
}

export const PatientDetails = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-900 p-8 border border-border dark:border-slate-800 shadow-atlas relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-sm border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 shadow-sm">
                            <div className="w-full h-full bg-cover bg-center grayscale contrast-110" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1UW-zq_49mXRU9bYosKN1GPxEXOpOhyUBgw0kE1yuXvmsbKy1MK76L8_Bms3Ovv7jGZB6_PjpiJRTNOSz1KxEJpp4PO6yO07RT6xLAYPgdNAOgnejaCAIimHdp48pT3KUbV-k-upUrD1COCHUoaAISLcgk8NWdRt197oS6Q7WpwG3Wg3fXeOLHJmy_gbGhyF4X9sc7BVKa52-TvGgKL9eO1VoQOSVHfMLOYewReDdaA0IpKDiCaLj_SvnQX1h-X_-pCNiyCLHLThs")'}}></div>
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl text-slate-900 dark:text-white font-bold mb-1">João da Silva</h1>
                            <div className="flex gap-4 text-slate-500 font-mono text-xs uppercase tracking-wide">
                                <span>42 Anos</span>
                                <span>&bull;</span>
                                <span>ID: 123456789</span>
                                <span>&bull;</span>
                                <span className="text-emerald-600 dark:text-emerald-400">Ativo</span>
                            </div>
                        </div>
                    </div>
                    <Link to={RoutePath.PATIENTS_EDIT.replace(':id', '1')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wide transition-colors">
                        <span className="material-symbols-outlined text-base">edit</span>
                        Editar Dados
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border dark:border-slate-800">
                <div className="flex gap-1">
                    <button className="px-6 py-3 border-b-2 border-primary text-primary font-mono text-xs uppercase tracking-widest bg-primary/5">Visão Geral</button>
                    <button className="px-6 py-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Histórico</button>
                    <button className="px-6 py-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Imagens</button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas flex flex-col justify-between min-h-[220px] group hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Última Avaliação</p>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                        <p className="font-serif text-5xl font-light text-slate-900 dark:text-white">8.5<span className="text-lg text-slate-400 dark:text-slate-500 font-sans">/10</span></p>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                        <p className="font-mono text-xs text-slate-500">DATA: 15 AGO 2024</p>
                        <button className="text-primary font-mono text-xs uppercase tracking-wide hover:underline flex items-center gap-1">
                            Ver Detalhes <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas flex flex-col justify-between min-h-[220px]">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Resumo Clínico</p>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">medical_information</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">Alergias</p>
                                <p className="text-slate-900 dark:text-white">Penicilina</p>
                            </div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Condições</p>
                                    <p className="text-slate-900 dark:text-white text-sm">Hipertensão</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Medicação</p>
                                    <p className="text-slate-900 dark:text-white text-sm">Losartana 50mg</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}