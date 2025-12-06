import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RoutePath } from '../types';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate(RoutePath.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Left Branding - Editorial Style */}
      <div className="flex w-full flex-col justify-between bg-secondary dark:bg-slate-950 text-white p-12 lg:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-secondary dark:from-slate-900/50 dark:to-slate-950 pointer-events-none"></div>
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">health_and_safety</span>
            </div>
            <span className="font-mono text-xs tracking-[0.2em] text-white/60 uppercase">Precision Atlas</span>
        </div>

        <div className="relative z-10">
            <h1 className="font-serif text-6xl font-light tracking-tight leading-none mb-6">
                A Arte da <br/>
                <span className="italic text-primary font-normal">Precisão</span> Médica.
            </h1>
            <p className="font-light text-white/60 max-w-md text-lg leading-relaxed border-l-2 border-primary pl-6">
                Diagnósticos elevados ao estado da arte. Uma plataforma onde a ciência encontra a intuição cirúrgica.
            </p>
        </div>

        <div className="relative z-10 flex gap-8 font-mono text-xs text-white/40 uppercase tracking-wider">
            <span>v2.4.0 Stable</span>
            <span>Secure Connection</span>
        </div>
      </div>

      {/* Right Form - Clinical Style */}
      <div className="flex w-full flex-1 items-center justify-center bg-white dark:bg-slate-900 p-8 lg:w-7/12 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-transparent"></div>
        
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="font-serif text-4xl text-slate-900 dark:text-white mb-2">Acessar Console</h2>
            <p className="text-slate-500 font-light">Insira suas credenciais para inicializar o sistema.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <label className="flex flex-col gap-2 group">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 group-focus-within:text-primary transition-colors">Identificação (E-mail)</span>
              <input
                type="email"
                className="w-full bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-4 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-mono text-sm text-slate-900 dark:text-white"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-2 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 group-focus-within:text-primary transition-colors">Chave de Acesso (Senha)</span>
                <Link to={RoutePath.FORGOT_PASSWORD} className="text-xs text-primary hover:text-primary-dark transition-colors">
                    Recuperar?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-4 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-mono text-sm text-slate-900 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-secondary dark:bg-primary text-white font-medium tracking-wide py-4 hover:bg-slate-800 dark:hover:bg-primary-dark transition shadow-lg flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'CARREGANDO...' : 'INICIALIZAR SISTEMA'}</span>
              {!loading && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Novo profissional?{' '}
              <Link
                to={RoutePath.SIGNUP}
                className="text-primary font-medium hover:underline decoration-1 underline-offset-4"
              >
                Solicitar credenciamento
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [crm, setCrm] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await signUp(email, password, fullName, crm);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      navigate(RoutePath.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background dark:bg-slate-950">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg flex flex-col gap-8 bg-white dark:bg-slate-900 p-10 border border-border dark:border-slate-800 shadow-atlas relative">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-4 h-4 bg-primary"></div>
            <div className="absolute top-4 right-0 w-px h-12 bg-primary/20"></div>
            <div className="absolute top-0 right-4 w-12 h-px bg-primary/20"></div>
          </div>

          <div>
            <h2 className="font-serif text-4xl text-slate-900 dark:text-white">Credenciamento</h2>
            <p className="text-slate-500 mt-2 font-light">
              Solicite acesso à plataforma SPE-M.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Nome Completo</span>
                <input
                    type="text"
                    className="form-input w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 focus:border-primary focus:ring-0 outline-none transition-all text-slate-900 dark:text-white"
                    placeholder="Dr. Seu Nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                </label>
                <label className="flex flex-col gap-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">CRM</span>
                <input
                    type="text"
                    className="form-input w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 focus:border-primary focus:ring-0 outline-none transition-all text-slate-900 dark:text-white"
                    placeholder="000000/UF"
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                />
                </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail Profissional</span>
              <input
                type="email"
                className="form-input w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 focus:border-primary focus:ring-0 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Definir Senha</span>
              <input
                type="password"
                className="form-input w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 focus:border-primary focus:ring-0 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="flex items-start gap-3 mt-2 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-primary border-slate-300 rounded-sm focus:ring-0"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Declaro que sou um profissional de saúde habilitado e concordo com os <a href="#" className="text-primary border-b border-primary/20 hover:border-primary">Termos de Uso</a> e <a href="#" className="text-primary border-b border-primary/20 hover:border-primary">Política de Privacidade</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-medium tracking-wide py-3 hover:bg-primary-dark transition-colors shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CARREGANDO...' : 'ENVIAR SOLICITAÇÃO'}
            </button>
          </form>

          <div className="text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-sm text-slate-500">
              Já credenciado?{' '}
              <Link
                to={RoutePath.LOGIN}
                className="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors"
              >
                Acessar console
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Artistic Side */}
      <div className="hidden lg:flex w-5/12 bg-slate-100 dark:bg-slate-800 relative overflow-hidden border-l border-slate-200 dark:border-slate-700">
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract Medical Art */}
            <div className="w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-50 animate-[spin_240s_linear_infinite]"></div>
        </div>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmoLPRNQcvXCACJrHOFubHNPomYKvUoFt0avRqgprg73qT3ChKM2RALX0QjkJ4_frmxxGa8cdaZcAbRs5qTRX341olLOoYbxj7AtB7BIT7t2Z5TaY_AzxH_Rzds-aled9k6bRJLne2lmtaYLQxiQP6xHXj37BivtMHoPODenibC4VoO8Ht5easF0Uoc5cZjcsIBNBJakpo0CBhYCrKFc-Qg_zc1zKtoTeIweWCj_UpIKn2XqH2NzU9I0ykMvB3a-xjFT4l23uw1U_x"
          alt="Medical Team"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay grayscale contrast-125 opacity-60"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80">
          <h3 className="font-serif text-3xl text-slate-900 dark:text-white mb-2">Excelência Clínica</h3>
          <p className="font-light text-slate-600 dark:text-slate-300">
            "Precisão e eficiência para cuidar de quem importa."
          </p>
        </div>
      </div>
    </div>
  );
};

export const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas p-10 relative">
        {/* Technical Marker */}
        <div className="absolute top-4 left-4 w-2 h-2 border-l border-t border-primary"></div>
        <div className="absolute top-4 right-4 w-2 h-2 border-r border-t border-primary"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 border-l border-b border-primary"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-primary"></div>

        <div className="w-12 h-12 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6 bg-primary/5">
          <span className="material-symbols-outlined text-2xl">
            lock_reset
          </span>
        </div>
        
        <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-slate-900 dark:text-white mb-2">
            Redefinir Acesso
            </h2>
            <p className="text-slate-500 font-light text-sm px-4">
            Insira o endereço de e-mail associado à sua conta para receber o link de redefinição seguro.
            </p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 text-sm text-center">
            Link de recuperação enviado! Verifique seu e-mail.
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <label className="flex flex-col gap-1.5 text-left">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail Cadastrado</span>
              <input
                  type="email"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                  placeholder="seuemail@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-bold uppercase text-sm tracking-wider py-3 hover:bg-primary-dark transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ENVIANDO...' : 'Enviar Link de Recuperação'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
            <Link
            to={RoutePath.LOGIN}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar ao Login
            </Link>
        </div>
      </div>
    </div>
  );
};