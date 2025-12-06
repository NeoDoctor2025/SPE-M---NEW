import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useClinic } from '../context/ClinicContext';
import { useNavigate, Link } from 'react-router-dom';
import { RoutePath } from '../types';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#e11d48', '#6366f1'];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary dark:bg-slate-800 border border-border dark:border-slate-700 p-3 rounded-sm shadow-lg">
        <p className="font-mono text-xs text-slate-400 mb-1">{label}</p>
        <p className="font-serif text-sm text-white">
          {payload[0].name}: <span className="font-bold text-primary">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, trend, trendUp, unit }: { label: string; value: string | number; trend: string; trendUp: boolean, unit?: string }) => (
  <div className="relative bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas group hover:border-primary/30 dark:hover:border-primary/30 transition-colors overflow-hidden">
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-slate-200 dark:border-slate-700 group-hover:border-primary/50 transition-colors"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-slate-200 dark:border-slate-700 group-hover:border-primary/50 transition-colors"></div>
    
    <div className="flex flex-col h-full justify-between">
        <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{label}</p>
            <div className="flex items-baseline gap-1">
                <p className="font-serif text-4xl font-medium text-slate-900 dark:text-white">{value}</p>
                {unit && <span className="font-mono text-xs text-slate-400">{unit}</span>}
            </div>
        </div>
        
        <div className="flex items-center mt-4 gap-2">
            <div className={`flex items-center justify-center w-5 h-5 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                <span className="material-symbols-outlined text-sm font-bold">{trendUp ? 'arrow_upward' : 'arrow_downward'}</span>
            </div>
            <span className={`font-mono text-xs font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{trend}</span>
            <span className="font-mono text-[10px] text-slate-400 ml-auto">VS MÊS ANT.</span>
        </div>
    </div>
    
    {/* Decorative Background Chart Line (Fake) */}
    <div className="absolute bottom-0 right-0 w-24 h-12 opacity-5 pointer-events-none">
       <svg viewBox="0 0 100 50" className="w-full h-full stroke-current text-slate-900 dark:text-white" fill="none">
         <path d="M0 40 Q 25 45 50 20 T 100 10" strokeWidth="2" />
       </svg>
    </div>
  </div>
);

export const Dashboard = () => {
  const { patients, evaluations } = useClinic();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Stats Calculations
  const totalPatients = patients.length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const evaluationsToday = evaluations.filter(e => e.date === todayStr).length;
  
  const scores = evaluations.map(e => e.score || 0).filter(s => s > 0);
  const avgScore = scores.length > 0 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) 
    : '0.0';

  // Mock surgeries count based on patient count for dynamism
  const scheduledSurgeries = Math.floor(totalPatients * 0.15); 

  // Chart Data Preparation
  // 1. Area Chart: Group scores by date/sequence to show trend
  const dataLine = evaluations
    .slice(-6) // Last 6 evaluations
    .reverse()
    .map((ev, i) => ({
        name: `Av ${i+1}`,
        score: ev.score || 0,
        date: ev.date
    }));

  // 2. Pie Chart: Group by Type
  const typeCount = evaluations.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataPie = Object.keys(typeCount).map(type => ({
    name: type,
    value: typeCount[type]
  }));

  const totalProcedures = dataPie.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-border dark:border-slate-800 pb-6">
        <div>
          <h1 className="font-serif text-4xl font-light text-slate-900 dark:text-white italic">
            Visão Geral
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-wider">
            Sistema: <span className="text-emerald-600 dark:text-emerald-400">Operacional</span> &bull; Última Sincronização: {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
            Últimos 30 dias
          </button>
          <button 
            onClick={() => navigate(RoutePath.REPORTS)}
            className="px-4 py-2 bg-secondary dark:bg-slate-800 text-white border border-secondary dark:border-slate-700 font-mono text-xs uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Relatório
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Pacientes Totais" value={totalPatients} trend="2.5%" trendUp={true} />
        <StatCard label="Avaliações (Hoje)" value={evaluationsToday} trend="1.2%" trendUp={false} />
        <StatCard label="Cirurgias Agendadas" value={scheduledSurgeries} trend="5.0%" trendUp={true} />
        <StatCard label="Score Médio" value={avgScore} unit="/ 100" trend="0.3%" trendUp={true} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-serif text-xl text-slate-900 dark:text-white">
              Tendência Clínica
            </h3>
            <span className="font-mono text-xs text-slate-400 uppercase">Evolução do Score (Recente)</span>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataLine}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#334155" strokeOpacity={0.1} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'IBM Plex Mono'}} 
                    dy={10} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'IBM Plex Mono'}} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Crosshairs Decoration */}
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-slate-300 dark:border-slate-700"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-slate-300 dark:border-slate-700"></div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl text-slate-900 dark:text-white">
              Procedimentos
            </h3>
            <span className="material-symbols-outlined text-slate-400 text-sm">more_horiz</span>
          </div>
          
          <div className="h-64 w-full relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {dataPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-serif text-4xl font-bold text-slate-900 dark:text-white">{totalProcedures}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Total</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-6 pt-6 border-t border-border dark:border-slate-800">
            {dataPie.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-slate-600 dark:text-slate-300 font-sans">{item.name}</span>
                </div>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  {Math.round((item.value / totalProcedures) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas overflow-hidden">
        <div className="px-6 py-5 border-b border-border dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-serif text-xl text-slate-900 dark:text-white">Pacientes Recentes</h3>
          <Link to={RoutePath.PATIENTS} className="text-primary hover:text-primary-dark font-mono text-xs uppercase tracking-wider flex items-center gap-1">
            Ver Todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-border dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Nome do Paciente</th>
                <th className="px-6 py-4 font-medium">Última Interação</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {patients.slice(0, 5).map((patient, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 dark:text-white block">{patient.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">ID: {patient.id}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 text-xs">{patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm border text-[10px] font-mono uppercase tracking-wide 
                        ${patient.status === 'Active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 
                          patient.status === 'Alert' ? 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' :
                          'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => navigate(RoutePath.PATIENTS_DETAILS.replace(':id', patient.id))}
                        className="text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
