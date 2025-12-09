
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePath, PatientMedicalInfo, Medication } from '../types';
import { useClinic } from '../context/ClinicContext';
import { uploadPatientPhoto } from '../lib/storage';
import { useToast } from '../lib/toast';

// --- Utility Functions for Masking & Validation ---

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// --- Components ---

export const PatientsList = () => {
  const { patients } = useClinic();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    setSearchTerm(initialSearch);
    setCurrentPage(1);
  }, [initialSearch]);

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.includes(searchTerm) ||
      p.cpf.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all' && p.lastVisit) {
      const visitDate = new Date(p.lastVisit.split('/').reverse().join('-'));
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === 'last7days') matchesDate = diffDays <= 7;
      else if (dateFilter === 'last30days') matchesDate = diffDays <= 30;
      else if (dateFilter === 'last90days') matchesDate = diffDays <= 90;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Active': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400';
        case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400';
        case 'Alert': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400';
        default: return 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400';
    }
  };

  const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

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
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            placeholder="BUSCAR NOME, CPF OU ID..."
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-4 py-2 border ${statusFilter !== 'all' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'} text-xs uppercase font-mono tracking-wide transition-colors`}
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Status
              {statusFilter !== 'all' && <span className="w-2 h-2 bg-primary rounded-full"></span>}
            </button>
            {showStatusMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg z-10">
                {['all', 'Active', 'Pending', 'Alert', 'Inactive'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusMenu(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-mono uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${statusFilter === status ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {status === 'all' ? 'Todos' : status === 'Active' ? 'Ativo' : status === 'Pending' ? 'Pendente' : status === 'Alert' ? 'Alerta' : 'Inativo'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDateMenu(!showDateMenu)}
              className={`flex items-center gap-2 px-4 py-2 border ${dateFilter !== 'all' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'} text-xs uppercase font-mono tracking-wide transition-colors`}
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Data
              {dateFilter !== 'all' && <span className="w-2 h-2 bg-primary rounded-full"></span>}
            </button>
            {showDateMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg z-10">
                {[
                  { value: 'all', label: 'Todas' },
                  { value: 'last7days', label: 'Últimos 7 dias' },
                  { value: 'last30days', label: 'Últimos 30 dias' },
                  { value: 'last90days', label: 'Últimos 90 dias' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateFilter(option.value);
                      setShowDateMenu(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-mono uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${dateFilter === option.value ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas">
        <div className="overflow-x-auto">
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
                {paginatedPatients.length > 0 ? paginatedPatients.map((p, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4 text-center">
                    <div className="w-8 h-8 mx-auto bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-serif font-bold text-slate-600 dark:text-slate-400 text-xs">
                        {getInitials(p.name)}
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <Link to={RoutePath.PATIENTS_DETAILS.replace(':id', p.id)} className="font-medium text-slate-900 dark:text-white hover:text-primary block">
                        {p.name}
                    </Link>
                    <span className="font-mono text-[10px] text-slate-400">ID: {p.id}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.phone}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.lastVisit}</td>
                    <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wide ${getStatusColor(p.status)}`}>
                        {p.status === 'Active' ? 'Ativo' : p.status === 'Pending' ? 'Pendente' : p.status === 'Alert' ? 'Alerta' : 'Inativo'}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <Link to={RoutePath.PATIENTS_EDIT.replace(':id', p.id)} className="text-slate-400 hover:text-primary p-1 inline-block">
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-mono text-sm">
                            Nenhum paciente encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-4">
            <span className="font-mono text-[10px] uppercase text-slate-500 tracking-wide">
                Exibindo {paginatedPatients.length} de {filteredPatients.length} Pacientes
            </span>
            <div className="flex gap-1">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <div className="flex items-center justify-center h-8 px-3 border border-primary bg-primary text-white font-mono text-xs">
                    Pág {currentPage} / {totalPages || 1}
                </div>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export const PatientForm = () => {
  const navigate = useNavigate();
  const { addPatient } = useClinic();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
      name: '',
      cpf: '',
      birthDate: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      history: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório.";
    if (!formData.cpf || formData.cpf.length < 14) newErrors.cpf = "CPF inválido (use 000.000.000-00).";
    if (!formData.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória.";
    if (formData.email && !validateEmail(formData.email)) newErrors.email = "E-mail inválido.";
    if (!formData.gender) newErrors.gender = "Selecione um gênero.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        showToast('Arquivo muito grande. Tamanho máximo: 5MB', 'error');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast('Formato inválido. Use JPG, PNG ou WEBP', 'error');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
      if (!validate()) return;

      setUploading(true);

      let photoUrl = undefined;
      const tempPatientId = `temp-${Date.now()}`;

      if (photoFile) {
        try {
          photoUrl = await uploadPatientPhoto(tempPatientId, photoFile);
        } catch (error: any) {
          showToast('Erro ao fazer upload da foto: ' + error.message, 'error');
          setUploading(false);
          return;
        }
      }

      const newPatient = await addPatient({
          name: formData.name,
          cpf: formData.cpf,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          address: formData.address,
          status: 'Active',
          lastVisit: new Date().toLocaleDateString('pt-BR'),
          photoUrl
      });

      setUploading(false);

      if (newPatient) {
        showToast('Paciente cadastrado com sucesso!', 'success');
        navigate(RoutePath.PATIENTS);
      } else {
        showToast('Erro ao criar paciente. Tente novamente.', 'error');
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      let value = e.target.value;
      
      // Apply masks
      if (e.target.name === 'cpf') value = maskCPF(value);
      if (e.target.name === 'phone') value = maskPhone(value);

      setFormData({...formData, [e.target.name]: value});
      
      // Clear error on type
      if (errors[e.target.name]) {
          setErrors({...errors, [e.target.name]: ''});
      }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="border-b border-border dark:border-slate-800 pb-6">
        <Link to={RoutePath.PATIENTS} className="text-xs font-mono uppercase text-slate-400 hover:text-primary mb-2 block">&larr; Voltar para lista</Link>
        <h1 className="font-serif text-3xl text-slate-900 dark:text-white">Novo Paciente</h1>
        <p className="text-slate-500 font-light mt-1">Preencha a ficha cadastral completa com precisão.</p>
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
                    {photoPreview ? (
                        <div className="w-24 h-24 relative">
                            <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover border-2 border-primary"
                            />
                            <button
                                onClick={() => {
                                    setPhotoFile(null);
                                    setPhotoPreview(null);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 transition-all group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 cursor-pointer">
                            <span className="material-symbols-outlined text-2xl mb-1">add_a_photo</span>
                            <span className="font-mono text-[10px] uppercase tracking-wide">Foto</span>
                        </div>
                    )}
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handlePhotoChange}
                    />
                </div>
                <div className="flex flex-col pt-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-1">Imagem de Perfil</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-light max-w-sm leading-relaxed">
                        Carregue uma foto recente para identificação. Formatos aceitos: JPG, PNG, WEBP (Max 5MB).
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Nome Completo *</span>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white`} 
                        placeholder="EX: JOÃO SILVA" 
                    />
                    {errors.name && <span className="text-[10px] text-rose-500 font-medium">{errors.name}</span>}
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">CPF *</span>
                    <input 
                        name="cpf" 
                        value={formData.cpf} 
                        onChange={handleChange} 
                        maxLength={14}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.cpf ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white`} 
                        placeholder="000.000.000-00" 
                    />
                    {errors.cpf && <span className="text-[10px] text-rose-500 font-medium">{errors.cpf}</span>}
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Data de Nascimento *</span>
                    <input 
                        name="birthDate" 
                        type="date" 
                        value={formData.birthDate} 
                        onChange={handleChange} 
                        className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.birthDate ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white`} 
                    />
                    {errors.birthDate && <span className="text-[10px] text-rose-500 font-medium">{errors.birthDate}</span>}
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Gênero *</span>
                    <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.gender ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white`}
                    >
                        <option value="">Selecione...</option>
                        <option>Masculino</option>
                        <option>Feminino</option>
                        <option>Outro</option>
                    </select>
                    {errors.gender && <span className="text-[10px] text-rose-500 font-medium">{errors.gender}</span>}
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
                    <input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white`} 
                    />
                    {errors.email && <span className="text-[10px] text-rose-500 font-medium">{errors.email}</span>}
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Telefone</span>
                    <input 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        maxLength={15}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-mono text-slate-900 dark:text-white"
                        placeholder="(00) 00000-0000" 
                    />
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Endereço Completo</span>
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white" />
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
                    <textarea name="history" value={formData.history} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 focus:border-primary outline-none transition-colors font-sans text-slate-900 dark:text-white h-32 resize-none" placeholder="Descreva o histórico principal..."></textarea>
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
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-secondary dark:bg-primary text-white px-8 py-3 font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 dark:hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Salvando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">save</span>
                Salvar Registro
              </>
            )}
        </button>
      </div>
    </div>
  );
};

export const PatientEdit = () => {
    const { id } = useParams();
    const { getPatient, updatePatient } = useClinic();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState<any>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        const p = getPatient(id || '');
        if (p) {
            setFormData(p);
            setPhotoPreview(p.photoUrl || null);
        }
    }, [id, getPatient]);

    if (!formData) return <div className="p-8 text-center font-mono text-slate-500">Paciente não encontrado ou carregando...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (e.target.name === 'cpf') value = maskCPF(value);
        if (e.target.name === 'phone') value = maskPhone(value);

        setFormData({ ...formData, [e.target.name]: value });

        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Nome é obrigatório.";
        if (formData.cpf && formData.cpf.length < 14) newErrors.cpf = "CPF incompleto.";
        if (formData.email && !validateEmail(formData.email)) newErrors.email = "E-mail inválido.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Por favor, selecione um arquivo de imagem.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('A imagem deve ter no máximo 5MB.', 'error');
            return;
        }

        setUploading(true);
        try {
            const photoUrl = await uploadPatientPhoto(id || '', file);
            setPhotoPreview(photoUrl);
            setFormData({ ...formData, photoUrl });
            showToast('Foto carregada com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao carregar foto. Tente novamente.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setFormData({ ...formData, photoUrl: null });
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        const success = await updatePatient(id || '', formData);
        setSaving(false);

        if (success) {
            showToast('Paciente atualizado com sucesso!', 'success');
            navigate(RoutePath.PATIENTS);
        } else {
            showToast('Erro ao atualizar paciente. Tente novamente.', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b border-border dark:border-slate-800 pb-6 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[10px]">ID: {formData.id}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase">Ativo</span>
                    </div>
                    <h1 className="font-serif text-4xl text-slate-900 dark:text-white italic">{formData.name}</h1>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xs text-slate-400 uppercase">Última Atualização</p>
                    <p className="font-mono text-sm text-slate-600 dark:text-slate-300">15/08/2024 14:30</p>
                </div>
            </div>

            <div className="flex flex-col gap-px bg-border dark:bg-slate-800 border border-border dark:border-slate-800">
                {/* Photo Section */}
                <details className="bg-white dark:bg-slate-900 group" open>
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="font-serif text-lg text-slate-900 dark:text-white italic">Foto do Paciente</span>
                        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center gap-4 pt-6">
                            <div className="w-32 h-32 rounded-sm border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 shadow-sm">
                                {photoPreview ? (
                                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url("${photoPreview}")`}}></div>
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-slate-400">person</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <label className="px-4 py-2 bg-primary text-white font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-primary-dark transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">upload</span>
                                    {uploading ? 'Carregando...' : 'Alterar Foto'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                                {photoPreview && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        disabled={uploading}
                                        className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Remover
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 font-mono">Máximo 5MB • JPG, PNG ou GIF</p>
                        </div>
                    </div>
                </details>

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
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none font-sans text-slate-900 dark:text-white`} 
                                />
                                {errors.name && <span className="text-[10px] text-rose-500 font-medium">{errors.name}</span>}
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">Data de Nascimento</span>
                                <input 
                                    name="birthDate" 
                                    type="date" 
                                    value={formData.birthDate} 
                                    onChange={handleChange} 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white" 
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">CPF</span>
                                <input 
                                    name="cpf" 
                                    value={formData.cpf} 
                                    onChange={handleChange} 
                                    maxLength={14}
                                    className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.cpf ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white`} 
                                />
                                {errors.cpf && <span className="text-[10px] text-rose-500 font-medium">{errors.cpf}</span>}
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
                                <input 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    maxLength={15}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white" 
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-mono text-xs uppercase tracking-wider text-slate-500">E-mail</span>
                                <input 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className={`w-full bg-slate-50 dark:bg-slate-950 border-b ${errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} px-3 py-2 focus:border-primary outline-none font-mono text-slate-900 dark:text-white`} 
                                />
                                {errors.email && <span className="text-[10px] text-rose-500 font-medium">{errors.email}</span>}
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
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-white px-8 py-3 font-mono text-xs uppercase tracking-widest shadow-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Salvar Alterações
                    </>
                  )}
                </button>
            </div>
        </div>
    );
}

export const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getPatient, getPatientEvaluations, getMedicalInfo, updateMedicalInfo } = useClinic();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'images'>('overview');
    const [medicalInfo, setMedicalInfo] = useState<PatientMedicalInfo | null>(null);
    const [editingMedical, setEditingMedical] = useState(false);
    const [medicalFormData, setMedicalFormData] = useState({
        allergies: [] as string[],
        conditions: [] as string[],
        medications: [] as Medication[],
        notes: '',
    });

    const patient = getPatient(id || '');
    const patientEvaluations = getPatientEvaluations(id || '');

    useEffect(() => {
        if (id) {
            getMedicalInfo(id).then(info => {
                setMedicalInfo(info);
                if (info) {
                    setMedicalFormData({
                        allergies: info.allergies,
                        conditions: info.conditions,
                        medications: info.medications,
                        notes: info.notes,
                    });
                }
            });
        }
    }, [id]);

    if (!patient) return <div className="p-8 text-center">Paciente não encontrado.</div>;

    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const lastEvaluation = patientEvaluations.length > 0
        ? patientEvaluations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null;

    const handleSaveMedicalInfo = async () => {
        if (!id) return;
        const success = await updateMedicalInfo(id, medicalFormData);
        if (success) {
            showToast('Informações médicas atualizadas com sucesso!', 'success');
            setEditingMedical(false);
            const updated = await getMedicalInfo(id);
            setMedicalInfo(updated);
        } else {
            showToast('Erro ao atualizar informações médicas.', 'error');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 border border-border dark:border-slate-800 shadow-atlas relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-sm border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 shadow-sm">
                            {patient.photoUrl ? (
                                <div className="w-full h-full bg-cover bg-center grayscale contrast-110" style={{backgroundImage: `url("${patient.photoUrl}")`}}></div>
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl text-slate-900 dark:text-white font-bold mb-1">{patient.name}</h1>
                            <div className="flex gap-4 text-slate-500 font-mono text-xs uppercase tracking-wide">
                                <span>{calculateAge(patient.birthDate)} Anos</span>
                                <span>&bull;</span>
                                <span>ID: {patient.id.substring(0, 8)}</span>
                                <span>&bull;</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{patient.status}</span>
                            </div>
                        </div>
                    </div>
                    <Link to={RoutePath.PATIENTS_EDIT.replace(':id', patient.id)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase tracking-wide transition-colors">
                        <span className="material-symbols-outlined text-base">edit</span>
                        Editar Dados
                    </Link>
                </div>
            </div>

            <div className="border-b border-border dark:border-slate-800">
                <div className="flex gap-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 border-b-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                            activeTab === 'overview'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 border-b-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                            activeTab === 'history'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        Histórico
                    </button>
                    <button
                        onClick={() => setActiveTab('images')}
                        className={`px-6 py-3 border-b-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                            activeTab === 'images'
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        Imagens
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas flex flex-col justify-between min-h-[220px]">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Última Avaliação</p>
                                {lastEvaluation && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                            </div>
                            {lastEvaluation ? (
                                <p className="font-serif text-5xl font-light text-slate-900 dark:text-white">
                                    {lastEvaluation.score || '-'}
                                    <span className="text-lg text-slate-400 dark:text-slate-500 font-sans">/10</span>
                                </p>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400">Nenhuma avaliação encontrada</p>
                            )}
                        </div>
                        {lastEvaluation && (
                            <div className="flex justify-between items-end mt-6">
                                <p className="font-mono text-xs text-slate-500">DATA: {lastEvaluation.date}</p>
                                <button
                                    onClick={() => navigate(RoutePath.EVALUATIONS_DETAILS.replace(':id', lastEvaluation.id))}
                                    className="text-primary font-mono text-xs uppercase tracking-wide hover:underline flex items-center gap-1"
                                >
                                    Ver Detalhes <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 border border-border dark:border-slate-800 shadow-atlas flex flex-col justify-between min-h-[220px]">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Resumo Clínico</p>
                                <button
                                    onClick={() => setEditingMedical(!editingMedical)}
                                    className="text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">{editingMedical ? 'close' : 'edit'}</span>
                                </button>
                            </div>
                            {!editingMedical ? (
                                <div className="space-y-4">
                                    {medicalInfo && medicalInfo.allergies.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">Alergias</p>
                                            <p className="text-slate-900 dark:text-white">{medicalInfo.allergies.join(', ')}</p>
                                        </div>
                                    )}
                                    {medicalInfo && (medicalInfo.conditions.length > 0 || medicalInfo.medications.length > 0) && (
                                        <>
                                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {medicalInfo.conditions.length > 0 && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Condições</p>
                                                        <p className="text-slate-900 dark:text-white text-sm">{medicalInfo.conditions.join(', ')}</p>
                                                    </div>
                                                )}
                                                {medicalInfo.medications.length > 0 && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Medicação</p>
                                                        {medicalInfo.medications.map((med, idx) => (
                                                            <p key={idx} className="text-slate-900 dark:text-white text-sm">{med.name} {med.dosage}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {(!medicalInfo || (medicalInfo.allergies.length === 0 && medicalInfo.conditions.length === 0 && medicalInfo.medications.length === 0)) && (
                                        <p className="text-slate-400 text-sm">Nenhuma informação médica cadastrada</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Alergias (separadas por vírgula)"
                                        value={medicalFormData.allergies.join(', ')}
                                        onChange={(e) => setMedicalFormData({...medicalFormData, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:border-primary outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Condições (separadas por vírgula)"
                                        value={medicalFormData.conditions.join(', ')}
                                        onChange={(e) => setMedicalFormData({...medicalFormData, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:border-primary outline-none"
                                    />
                                    <button
                                        onClick={handleSaveMedicalInfo}
                                        className="w-full bg-primary text-white px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-primary-dark transition-colors"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="font-serif text-2xl text-slate-900 dark:text-white italic">Histórico de Avaliações</h2>
                        <p className="text-sm text-slate-500 mt-1">{patientEvaluations.length} avaliação(ões) encontrada(s)</p>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {patientEvaluations.length > 0 ? (
                            patientEvaluations
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((evaluation) => (
                                    <div key={evaluation.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
                                                    <span className="font-mono text-xl font-bold text-primary">{evaluation.score || '-'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-sans text-lg text-slate-900 dark:text-white font-semibold">{evaluation.name}</h3>
                                                <div className="flex gap-4 mt-1 text-xs text-slate-500">
                                                    <span className="font-mono">{evaluation.date}</span>
                                                    <span>&bull;</span>
                                                    <span className="font-mono">{evaluation.type}</span>
                                                    <span>&bull;</span>
                                                    <span className={`font-mono uppercase ${evaluation.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {evaluation.status === 'Completed' ? 'Completa' : 'Rascunho'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(RoutePath.EVALUATIONS_DETAILS.replace(':id', evaluation.id))}
                                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </div>
                                ))
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-6xl mb-4 block">assessment</span>
                                <p className="font-mono text-sm">Nenhuma avaliação encontrada para este paciente</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'images' && (
                <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-atlas p-6">
                    <h2 className="font-serif text-2xl text-slate-900 dark:text-white italic mb-6">Galeria de Imagens</h2>
                    <div className="text-center text-slate-400 py-12">
                        <span className="material-symbols-outlined text-6xl mb-4 block">photo_library</span>
                        <p className="font-mono text-sm">Funcionalidade de galeria em desenvolvimento</p>
                    </div>
                </div>
            )}
        </div>
    );
}
