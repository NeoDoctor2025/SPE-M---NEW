import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { RoutePath } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { isDevMode, getDevProfile } from '../lib/devMode';

const SidebarItem = ({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: string;
  label: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 border-l-2 ${
      active
        ? 'border-primary bg-slate-50 dark:bg-slate-800/50 text-primary'
        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
    }`}
  >
    <span className={`material-symbols-outlined text-[20px] ${active ? 'fill' : ''}`}>
      {icon}
    </span>
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </Link>
);

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const path = location.pathname;
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string; crm: string | null } | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate(RoutePath.LOGIN);
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      if (isDevMode()) {
        setProfile(getDevProfile());
      } else {
        supabase
          .from('profiles')
          .select('full_name, crm')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setProfile(data);
            }
          });
      }
    }
  }, [user]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (route: string) => {
    if (route === RoutePath.DASHBOARD) return path === RoutePath.DASHBOARD;
    return path.startsWith(route);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${RoutePath.PATIENTS}?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(RoutePath.LOGIN);
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border dark:border-slate-800 bg-surface dark:bg-slate-900 z-20 shadow-atlas">
        {/* Doctor Profile - Editorial Style */}
        <div className="p-6 border-b border-border dark:border-slate-800">
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate(RoutePath.SETTINGS)}>
            <div className="relative">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover size-12 grayscale contrast-125"
                    style={{
                    backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLVJ24B3DJWc-uMVyNumflRNxZWZd94xB8RGmyR4ffAXHGORXSazZNbANHVXVJ39pVqwQFf-qjJv2_l-eusDjoRLWHWztrP7J7RS4ULJPg93Wv7RZWGdhwNUSis8zqF3RsGv7vrXoyG9TOFmNAK-ewsABt71oiOXkc3s8so85ly9afvFV4GB8ZjXQnAnrk0TEjo9TepGCnubpE8Q6VJFXXM00ZX1KiBCH1eGt5TQ24F5hBRzspYsrUXJ00jDCg4hkwZnlZY1WQL6NI")',
                    }}
                ></div>
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {profile?.full_name || 'Carregando...'}
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {profile?.crm ? `CRM: ${profile.crm}` : 'Profissional'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col py-4 flex-1">
          <div className="px-4 mb-2">
            <p className="font-mono text-[10px] uppercase text-slate-400 dark:text-slate-600 tracking-widest">Console</p>
          </div>
          <SidebarItem
            to={RoutePath.DASHBOARD}
            icon="grid_view"
            label="Visão Geral"
            active={isActive(RoutePath.DASHBOARD)}
          />
          <SidebarItem
            to={RoutePath.PATIENTS}
            icon="clinical_notes"
            label="Pacientes"
            active={isActive(RoutePath.PATIENTS)}
          />
          <SidebarItem
            to={RoutePath.EVALUATIONS}
            icon="stethoscope"
            label="Avaliações"
            active={isActive(RoutePath.EVALUATIONS)}
          />
          <SidebarItem
            to={RoutePath.EVALUATIONS_COMPARE}
            icon="compare_arrows"
            label="Comparativo"
            active={isActive(RoutePath.EVALUATIONS_COMPARE)}
          />
          <SidebarItem
            to={RoutePath.REPORTS}
            icon="bar_chart"
            label="Relatórios"
            active={isActive(RoutePath.REPORTS)}
          />
          
          <div className="px-4 mb-2 mt-6">
            <p className="font-mono text-[10px] uppercase text-slate-400 dark:text-slate-600 tracking-widest">Sistema</p>
          </div>
          <SidebarItem
            to={RoutePath.SETTINGS}
            icon="tune"
            label="Configurações"
            active={isActive(RoutePath.SETTINGS)}
          />
          <SidebarItem
            to={RoutePath.SUPPORT}
            icon="help_center"
            label="Suporte"
            active={isActive(RoutePath.SUPPORT)}
          />
        </nav>

        <div className="p-4 border-t border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-2 py-2 text-slate-500 dark:text-slate-400 hover:text-critical transition-colors group w-full"
          >
            <span className="material-symbols-outlined group-hover:text-critical transition-colors">power_settings_new</span>
            <span className="font-mono text-xs uppercase tracking-wider">Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-millimeter relative">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-8 border-b border-border dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-sm shrink-0 z-10">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-sm border border-primary/20 text-primary">
                <span className="material-symbols-outlined text-xl">health_and_safety</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight italic text-slate-800 dark:text-slate-100">SPE-M <span className="font-mono text-xs not-italic font-normal text-slate-400 dark:text-slate-600 tracking-widest ml-1">v2.4.0</span></h2>
          </div>

          <div className="flex flex-1 max-w-md mx-12">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-lg group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-b border-slate-300 dark:border-slate-700 bg-transparent placeholder-slate-400 focus:outline-none focus:border-primary text-sm font-mono transition-colors dark:text-slate-200"
                placeholder="BUSCAR PACIENTE OU ID..."
              />
            </form>
          </div>

          <div className="flex items-center gap-6">
            {/* Dark Mode Toggle */}
            <button
                onClick={() => setIsDark(!isDark)}
                className="text-slate-400 hover:text-primary transition-colors"
                title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
                <span className="material-symbols-outlined">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            {isDevMode() && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Dev Mode</span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Online</span>
            </div>
            
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative text-slate-400 hover:text-primary transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-critical"></span>
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-sm z-50 animate-fade-in">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-mono text-xs uppercase tracking-wide text-slate-500">Notificações</span>
                    <span className="text-[10px] text-primary cursor-pointer hover:underline">Marcar lidas</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { type: 'alert', title: 'Paciente Em Risco', desc: 'Carlos Souza apresentou alteração nos sinais vitais.', time: '10m atrás' },
                      { type: 'success', title: 'Avaliação Concluída', desc: 'Laudo de Maria Almeida finalizado com sucesso.', time: '1h atrás' },
                      { type: 'info', title: 'Backup do Sistema', desc: 'Sincronização automática realizada.', time: '2h atrás' }
                    ].map((notif, i) => (
                      <div key={i} className="p-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-critical' : notif.type === 'success' ? 'bg-success' : 'bg-primary'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notif.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.desc}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t border-slate-100 dark:border-slate-800">
                    <button className="text-xs text-primary hover:text-primary-dark font-medium">Ver todas</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};