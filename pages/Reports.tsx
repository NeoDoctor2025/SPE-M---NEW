import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Same data as dashboard or extended for reports
const performanceData = [
  { week: 'Sem 1', score: 40, patients: 12 },
  { week: 'Sem 2', score: 55, patients: 18 },
  { week: 'Sem 3', score: 45, patients: 15 },
  { week: 'Sem 4', score: 75, patients: 25 },
  { week: 'Sem 5', score: 60, patients: 20 },
  { week: 'Sem 6', score: 90, patients: 30 },
  { week: 'Sem 7', score: 85, patients: 28 },
  { week: 'Sem 8', score: 92, patients: 32 },
];

const surgeryData = [
  { name: 'Artroplastia de Joelho', value: 60, color: '#4A90E2' }, // Surgical Blue
  { name: 'Artroscopia', value: 25, color: '#06b6d4' }, // Cyan
  { name: 'Outros', value: 15, color: '#94a3b8' }, // Slate
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-sm shadow-lg">
        <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        {payload.map((p: any) => (
            <p key={p.name} className="font-serif text-sm text-slate-900 dark:text-white">
            {p.name === 'score' ? 'Score Médio' : 'Pacientes'}: <span className="font-bold" style={{color: p.stroke}}>{p.value}</span>
            </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Reports = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic">Dashboard de Desempenho</h1>
          <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-wider">Visão geral de desempenho e tendências.</p>
        </div>
        <div className="flex gap-3">
            <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wide cursor-pointer focus:border-primary outline-none">
                    <option>Últimos 30 dias</option>
                    <option>Este Trimestre</option>
                    <option>Este Ano</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-lg">expand_more</span>
            </div>
            <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wide cursor-pointer focus:border-primary outline-none">
                    <option>Cirurgião: Todos</option>
                    <option>Dr. Isabella Rossi</option>
                    <option>Dr. João Silva</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-lg">expand_more</span>
            </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-atlas">
            <p className="font-mono text-[10px] uppercase text-slate-500 tracking-widest mb-2">Total de Pacientes</p>
            <p className="font-serif text-5xl text-slate-900 dark:text-white">1,284</p>
            <div className="flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-emerald-500 text-base">arrow_upward</span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">5% vs. Mês Anterior</span>
            </div>
        </div>

        {/* KPI 2 - Highlighted */}
        <div className="bg-white dark:bg-slate-900 p-6 border-2 border-primary shadow-glow relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary/10 rounded-full"></div>
            <p className="font-mono text-[10px] uppercase text-slate-500 tracking-widest mb-2">Média de Score</p>
            <div className="flex items-baseline gap-1">
                <p className="font-serif text-5xl text-slate-900 dark:text-white font-bold">8.9</p>
                <span className="font-sans text-lg text-slate-400">/10</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-primary text-base">arrow_upward</span>
                <span className="font-mono text-xs font-bold text-primary">+0.2 vs. Mês Anterior</span>
            </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-atlas">
            <p className="font-mono text-[10px] uppercase text-slate-500 tracking-widest mb-2">Avaliações Realizadas M/M</p>
            <p className="font-serif text-5xl text-slate-900 dark:text-white">312</p>
            <div className="flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-slate-400 text-base">arrow_downward</span>
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">3% vs. Mês Anterior</span>
            </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-atlas">
            <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-6">Tendência do Score Médio ao Longo do Tempo</h3>
            
            <div className="h-80 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScoreBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                        <XAxis 
                            dataKey="week" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'IBM Plex Mono'}} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'IBM Plex Mono'}} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#4A90E2" 
                            strokeWidth={3} 
                            fill="url(#colorScoreBlue)" 
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'].map((label, i) => (
                    <div key={i} className="text-center">
                        <p className="font-mono text-[10px] text-slate-400 uppercase">{label}</p>
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{width: `${40 + (i*15)}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-atlas flex flex-col">
            <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-4">Tipos de Cirurgia Mais Avaliados</h3>
            
            <div className="flex-1 relative min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={surgeryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={95}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {surgeryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="font-serif text-5xl text-slate-900 dark:text-white font-bold">189</p>
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mt-1">Total</p>
                </div>
            </div>

            <div className="space-y-4 mt-6">
                {surgeryData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
