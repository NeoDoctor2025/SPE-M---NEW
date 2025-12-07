# SPE-M - Sistema de Avaliação Clínica

## Funcionalidades Implementadas

### 1. Sistema de Autenticação e Perfil

- **Autenticação Completa com Supabase**
  - Login com email e senha
  - Registro de novos usuários
  - Recuperação de senha
  - Validação de sessão automática
  - Renovação de token de sessão

- **Perfil do Médico**
  - Visualização de perfil com nome completo e CRM
  - Sistema de avatar com foto de perfil
  - Status de presença (online/offline)
  - Informações exibidas no sidebar

### 2. Sistema de Validação de Formulários

Todos os formulários incluem validação em tempo real:

- **Validação de CPF** - Algoritmo completo com dígitos verificadores
- **Validação de Email** - Formato correto de email
- **Validação de Telefone** - Formato brasileiro (11) 98765-4321
- **Validação de Data** - Datas válidas com verificação de limites
- **Validação de Imagens** - Tipo, tamanho e formato de arquivo

Formatação automática enquanto o usuário digita:
- CPF: 123.456.789-00
- Telefone: (11) 98765-4321

### 3. Sistema de Notificações Toast

Sistema de notificações elegante e não intrusivo:

- **Tipos de Notificação**:
  - Sucesso (verde)
  - Erro (vermelho)
  - Aviso (amarelo)
  - Informação (azul)

- **Recursos**:
  - Duração configurável
  - Fechamento automático
  - Animações suaves
  - Empilhamento de múltiplas notificações
  - Posicionamento no canto inferior direito

### 4. Sistema de Sincronização Híbrida

O sistema funciona tanto online quanto offline:

- **Modo Online (Supabase)**:
  - Dados sincronizados em tempo real
  - Backup automático na nuvem
  - Acesso de múltiplos dispositivos

- **Modo Offline (localStorage)**:
  - Funcionamento sem conexão
  - Dados preservados localmente
  - Sincronização automática quando a conexão retornar

- **Indicador Visual**:
  - Badge de status "Online" (verde) ou "Offline" (amarelo)
  - Verificação de conectividade a cada 30 segundos
  - Transição suave entre estados

### 5. Componentes de Formulário Reutilizáveis

Componentes prontos para uso em todo o sistema:

- **FormInput** - Campo de texto com label, erro e help text
- **FormTextArea** - Área de texto multi-linha
- **FormSelect** - Dropdown com opções
- **ImageUpload** - Upload de imagens com:
  - Preview em tempo real
  - Validação de tipo e tamanho
  - Compressão automática
  - Interface drag-and-drop
  - Botões de editar e remover

### 6. Compressão de Imagens

Sistema automático de otimização:

- **Compressão Inteligente**:
  - Redimensionamento para máximo de 1024x1024
  - Qualidade ajustável (padrão 80%)
  - Redução de tamanho mantendo qualidade visual
  - Conversão para formato otimizado

- **Benefícios**:
  - Upload mais rápido
  - Economia de espaço no storage
  - Melhor performance

### 7. Storage de Imagens com Supabase

Sistema seguro de armazenamento:

- **Buckets Configurados**:
  - `patient-photos` - Fotos de perfil de pacientes (limite 5MB)
  - `evaluation-images` - Imagens de avaliações (limite 10MB)

- **Políticas de Segurança (RLS)**:
  - Usuários só acessam suas próprias imagens
  - Upload, visualização, atualização e exclusão controlados
  - Validação de tipos MIME (JPEG, PNG, WebP)

### 8. Hooks Customizados

Funcionalidades reutilizáveis:

- **useDebounce** - Atrasa execução de funções
- **useLocalStorage** - Persistência de dados local
- **useAutoSave** - Salvamento automático de rascunhos
- **useClickOutside** - Detecta cliques fora de elementos
- **useKeyPress** - Atalhos de teclado
- **usePagination** - Paginação automática de listas

### 9. Sistema de Estatísticas e Métricas

Cálculos automáticos para o Dashboard:

- **Estatísticas Gerais**:
  - Total de pacientes
  - Pacientes ativos
  - Pacientes em risco
  - Total de avaliações
  - Avaliações completas vs rascunhos
  - Atividade recente (últimos 30 dias)
  - Avaliações do mês atual

- **Dados para Gráficos**:
  - Avaliações por tipo (Cardiologia, Dermatologia, etc.)
  - Pacientes por status (Ativo, Pendente, Alerta, Inativo)
  - Evolução de avaliações ao longo do tempo
  - Score médio por tipo de avaliação

### 10. Exportação de Relatórios em PDF

Sistema completo de geração de PDFs:

- **Lista de Pacientes**:
  - Informações completas de todos os pacientes
  - Dados de contato e status
  - Data da última visita

- **Avaliação Individual**:
  - Dados do paciente
  - Detalhes da avaliação
  - Tipo, data, status e score

- **Relatório Geral**:
  - Estatísticas completas
  - Resumo de atividades
  - Métricas consolidadas

### 11. Componentes de UI

Componentes polidos e consistentes:

- **LoadingSpinner**:
  - Três tamanhos (sm, md, lg)
  - Modo fullscreen
  - Mensagem opcional

- **FormInput, FormTextArea, FormSelect**:
  - Estilo consistente em toda aplicação
  - Estados de erro claros
  - Help text opcional
  - Indicador de campo obrigatório

- **ImageUpload**:
  - Interface intuitiva
  - Preview em tempo real
  - Estados de loading
  - Validação visual

### 12. Modo Desenvolvedor

Sistema de desenvolvimento rápido:

- **Ativação**: Configurável via variável de ambiente `VITE_DEV_MODE=true`
- **Recursos**:
  - Bypass de autenticação
  - Dados mock automáticos
  - Persistência em localStorage
  - Badge visual "DEV MODE"
  - Usuário e perfil configuráveis

### 13. Integração Completa com Supabase

Sistema de dados robusto:

- **Tabelas Configuradas**:
  - `profiles` - Perfis de médicos
  - `patients` - Pacientes
  - `evaluations` - Avaliações clínicas

- **Row Level Security (RLS)**:
  - Políticas restritivas por padrão
  - Usuários só acessam seus próprios dados
  - Validação de propriedade em todas operações

- **Triggers e Índices**:
  - Atualização automática de `updated_at`
  - Índices para queries eficientes
  - Foreign keys com CASCADE

### 14. Sistema de Temas

Suporte completo a dark mode:

- **Temas Disponíveis**:
  - Light mode (padrão)
  - Dark mode

- **Transições**:
  - Animações suaves
  - Persistência da preferência
  - Toggle fácil no header

### 15. Responsividade

Design adaptável:

- **Breakpoints**:
  - Mobile (< 768px)
  - Tablet (768px - 1024px)
  - Desktop (> 1024px)

- **Componentes Responsivos**:
  - Layout adapta conforme tela
  - Sidebar colapsável (mobile)
  - Grids responsivos
  - Formulários otimizados

## Arquitetura do Sistema

### Estrutura de Pastas

```
/project
├── components/        # Componentes React reutilizáveis
├── context/          # Context API (Auth, Clinic)
├── lib/              # Utilitários e helpers
├── pages/            # Páginas da aplicação
├── supabase/         # Migrações do banco de dados
└── types.ts          # Definições TypeScript
```

### Fluxo de Dados

1. **Autenticação** → AuthContext → Supabase Auth
2. **Dados Clínicos** → ClinicContext → Supabase Database / localStorage
3. **Sincronização** → SyncManager → Verifica conectividade
4. **Notificações** → ToastProvider → UI Feedback

### Segurança

- RLS habilitado em todas as tabelas
- Validação no cliente e servidor
- Storage com políticas restritivas
- Autenticação JWT
- HTTPS obrigatório em produção

## Próximos Passos Sugeridos

1. Implementar gráficos interativos no Dashboard com Recharts
2. Adicionar sistema de notificações em tempo real com Supabase Realtime
3. Criar wizard completo para avaliações com múltiplas etapas
4. Implementar comparação visual de avaliações
5. Adicionar ferramenta de anotação de imagens com canvas
6. Criar sistema de templates para avaliações
7. Implementar busca avançada com filtros
8. Adicionar exportação em outros formatos (Excel, CSV)

## Manutenção e Suporte

- Logs estruturados para debugging
- Tratamento de erros em toda aplicação
- Mensagens amigáveis ao usuário
- Validações preventivas
- Sistema de retry automático

## Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Roteamento**: React Router v7
- **Gráficos**: Recharts
- **PDF**: jsPDF
- **Build**: Vite

---

Sistema desenvolvido com foco em robustez, segurança e experiência do usuário.
