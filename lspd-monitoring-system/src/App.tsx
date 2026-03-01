import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  AppWindow, 
  Share2, 
  History, 
  Settings, 
  Search, 
  PlusCircle, 
  Clock, 
  Bell, 
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Lock,
  Trash2,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Filter,
  RefreshCw,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Palette,
  Globe,
  Upload,
  Image as ImageIcon,
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  X,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { fetchNui, useNuiEvent } from './utils/nui';
import { cn } from './lib/utils';

// --- Types ---

type Tab = 'dashboard' | 'register' | 'track' | 'logs' | 'settings' | 'access';

// --- Translations ---

const translations = {
  en: {
    dashboard: 'Dashboard',
    register: 'Register Device',
    track: 'Track Devices',
    logs: 'Archive Logs',
    settings: 'System Settings',
    access: 'User Access',
    panic: 'Panic Button',
    onDuty: 'On-Duty',
    systemTime: 'System Time',
    monitoring: 'Monitoring',
    surveillance: 'Surveillance Analytics',
    newReg: 'New Registration',
    activeTrack: 'Active Tracking',
    dataArchive: 'Data Archive',
    config: 'Configuration',
    officerAccess: 'Officer Access Management',
    monthlyStats: 'Monthly Statistics Dashboard',
    personnelPermissions: 'Personnel Permissions',
    lspdDatabase: 'LSPD Database',
    realTimeAnalytics: 'Real-time surveillance analytics and officer deployment tracking.',
    last30Days: 'Last 30 Days',
    exportReport: 'Export Report',
    totalActive: 'Total Active Monitors',
    appliedMonth: 'Applied This Month',
    removalsArrests: 'Removals/Arrests',
    avgDuration: 'Average Duration',
    days: 'Days',
    monitorsPerDay: 'Monitors Applied per Day',
    deploymentFreq: 'Deployment frequency over the last 30 days',
    line: 'Line',
    bar: 'Bar',
    topOfficers: 'Top Officers',
    mostApps: 'Most applications this month',
    apps: 'Apps',
    viewLeaderboard: 'View Full Leaderboard',
    systemLive: 'System Live',
    lastSync: 'Last Sync',
    server: 'Server',
    health: 'System Health',
    privacy: 'Privacy Policy',
    manual: 'Internal Manual',
    activeMonitors: 'Active Monitors',
    online: 'ONLINE',
    registerNew: 'Register New',
    signalStability: 'Signal Stability',
    trackBtn: 'Track',
    arrestBtn: 'Arrest',
    removeBtn: 'Remove',
    selectedSubject: 'Selected Subject',
    target: 'Target',
    gpsActive: 'GPS Network Active',
    encryption: 'Encryption',
    version: 'Version',
    auditHistory: 'Audit Logs History',
    auditDesc: 'Comprehensive record of all ankle monitor deployments and removals.',
    totalApplied: 'Total Applied',
    totalArrested: 'Total Arrested',
    officerSearch: 'Officer Name/Badge',
    playerSearch: 'Player Name/ID',
    dateRange: 'Date Range',
    last24h: 'Last 24 Hours',
    last7d: 'Last 7 Days',
    last30d: 'Last 30 Days',
    customRange: 'Custom Range',
    applyFilters: 'Apply Filters',
    reset: 'Reset',
    exportCsv: 'Export CSV',
    showing: 'Showing',
    of: 'of',
    results: 'results',
    logsPerPage: 'Logs per page',
    dateTime: 'Date/Time',
    officerName: 'Officer Name',
    action: 'Action',
    playerNameId: 'Player Name [ID]',
    reason: 'Reason',
    applied: 'APPLIED',
    arrested: 'ARRESTED',
    removed: 'REMOVED',
    adminSystem: 'LSPD Administrative Data System',
    tamperEvident: 'All logs are tamper-evident and encrypted.',
    configureUi: 'Configure UI customization, global monitoring parameters, and external integrations.',
    discard: 'Discard Changes',
    save: 'Save Configuration',
    brandingUi: 'Branding & UI',
    primaryColor: 'Primary Interface Color',
    selectAccent: 'Select the accent color for buttons, highlights, and icons.',
    tacticalBlue: 'Tactical Blue',
    emergencyRed: 'Emergency Red',
    custom: 'Custom',
    policeLogo: 'Police Logo',
    customizeLogo: 'Customize the department logo displayed in the header and sidebar.',
    browse: 'Browse Image',
    logoSpecs: 'PNG or SVG, Max 500KB',
    langSelect: 'Language Selection',
    sysLang: 'System Language',
    setLang: 'Set the primary language for all interface elements and reports.',
    generalMon: 'General Monitoring',
    enableGlobal: 'Enable Global Tracking',
    allowRealTime: 'Allows real-time monitoring of all active electronic ankle monitors across the map.',
    officerNotif: 'Officer Notifications',
    sendAlerts: 'Send automated alerts to patrol units when a monitor is tampered with.',
    permMgmt: 'Permissions Management',
    policeRank: 'Police Rank',
    serverInteg: 'Server Integration',
    webhookLogs: 'Discord Webhook URL (Logs)',
    postLogs: 'Post detailed logs of all ankle monitor actions to Discord.',
    test: 'Test',
    adminNote: 'Administrative Note',
    uiBrandingUpdate: 'UI and branding changes will update for all connected MDT clients immediately upon saving.',
    manageAccess: 'Manage administrative access, electronic monitoring privileges, and account status for all law enforcement personnel.',
    inviteOfficer: 'Invite New Officer',
    totalPersonnel: 'Total Personnel',
    lspdActive: 'LSPD Active',
    bcsoActive: 'BCSO Active',
    suspended: 'Suspended',
    searchPlaceholder: 'Search by name, badge, or callsign...',
    all: 'All',
    filter: 'Filter',
    officerDetails: 'Officer Details',
    dept: 'Department',
    accessLevel: 'Access Level',
    accStatus: 'Account Status',
    actions: 'Actions',
    badge: 'Badge',
    active: 'ACTIVE',
    inactive: 'INACTIVE',
    encryptedSession: 'Encrypted Terminal Session',
    legalInfo: 'Legal Information',
    sysSecurity: 'System Security',
    protocolManual: 'Protocol Manual',
    emsSystem: 'ELECTRONIC MONITORING SYSTEM',
    submitRequest: 'Submit a formal request for civilian electronic monitoring. All registrations are logged and archived.',
    subjectInfo: 'Subject Information',
    passportId: 'Passport ID / Player ID',
    playerName: 'Player Name',
    age: 'Age',
    yearsOld: 'Years Old',
    issuanceDetails: 'Issuance Details',
    reasonIssuance: 'Reason for Issuance',
    provideLegal: 'Provide a detailed legal justification for the monitor placement...',
    requiredAudit: 'Required for internal audit and court evidence.',
    monDuration: 'Monitoring Duration',
    hours: 'Hours',
    weeks: 'Weeks',
    priorityLevel: 'Priority Level',
    lowRisk: 'Low Risk',
    highRisk: 'High Risk',
    cancel: 'Cancel',
    confirmReg: 'Confirm Registration',
    securedAccess: 'Secured Terminal Access',
    associatedMonitors: 'Associated Monitors',
    total: 'Total',
    noMonitorsFound: 'No associated monitors found',
    close: 'Close',
    editPermissions: 'Edit Permissions',
    inviteNewOfficer: 'Invite New Officer',
    badgePassport: 'Badge/Passport Number',
    grantAdmin: 'Grant Administrative Privileges',
    grantAdminDesc: 'Allows managing other officers and viewing sensitive ankle monitor logs.',
    sendInvitation: 'Send Invitation',
    fullLegalName: 'Full legal name',
    invalidBadge: 'Badge number must be numeric.',
    requiredFields: 'All fields are required.',
    removeOfficer: 'Remove Officer',
    confirmRemoveOfficer: 'Are you sure you want to remove this officer? This action cannot be undone.',
    zoneSelector: 'Zone Selector',
    definePerimeter: 'Define monitoring perimeter',
    interactiveSelection: 'Interactive Selection',
    referenceMap: 'Reference Map',
    zoneRadius: 'Zone Radius (Meters)',
    instruction: 'Instruction',
    clickMapInstruction: 'Click anywhere on the map to set the center of the monitoring zone.',
    referenceMapInstruction: 'Use this map for reference. Switch to "Interactive Selection" to set the zone.',
    confirmZone: 'Confirm Zone',
    zoneDefined: 'Zone Defined',
    editZone: 'Edit Zone',
    noZoneSelected: 'No Zone Selected',
    globalMonitoringDefault: 'Player will be monitored globally by default.',
    selectZone: 'Select Zone',
    monitoringZone: 'Monitoring Zone',
  },
  pt: {
    dashboard: 'Painel',
    register: 'Registrar Dispositivo',
    track: 'Rastrear Dispositivos',
    logs: 'Logs de Arquivo',
    settings: 'Configurações',
    access: 'Acesso de Usuário',
    panic: 'Botão de Pânico',
    onDuty: 'Em Serviço',
    systemTime: 'Hora do Sistema',
    monitoring: 'Monitoramento',
    surveillance: 'Estatísticas de Vigilância',
    newReg: 'Novo Registro',
    activeTrack: 'Rastreamento Ativo',
    dataArchive: 'Arquivo de Dados',
    config: 'Configuração',
    officerAccess: 'Gerenciamento de Acesso',
    monthlyStats: 'Painel de Estatísticas Mensais',
    personnelPermissions: 'Permissões de Pessoal',
    lspdDatabase: 'Banco de Dados LSPD',
    realTimeAnalytics: 'Análise de vigilância em tempo real e rastreamento de implantação de oficiais.',
    last30Days: 'Últimos 30 Dias',
    exportReport: 'Exportar Relatório',
    totalActive: 'Total de Monitores Ativos',
    appliedMonth: 'Aplicados Este Mês',
    removalsArrests: 'Remoções/Prisões',
    avgDuration: 'Duração Média',
    days: 'Dias',
    monitorsPerDay: 'Tornozeleiras Aplicadas por Dia',
    deploymentFreq: 'Frequência de implantação nos últimos 30 dias',
    line: 'Linha',
    bar: 'Barras',
    topOfficers: 'Principais Oficiais',
    mostApps: 'Mais aplicações este mês',
    apps: 'Aplicações',
    viewLeaderboard: 'Ver Classificação Completa',
    systemLive: 'Sistema Ativo',
    lastSync: 'Última Sincronização',
    server: 'Servidor',
    health: 'Saúde do Sistema',
    privacy: 'Política de Privacidade',
    manual: 'Manual Interno',
    activeMonitors: 'Monitores Ativos',
    online: 'ONLINE',
    registerNew: 'Registrar Novo',
    signalStability: 'Estabilidade do Sinal',
    trackBtn: 'Rastrear',
    arrestBtn: 'Prender',
    removeBtn: 'Remover',
    selectedSubject: 'Indivíduo Selecionado',
    target: 'Alvo',
    gpsActive: 'Rede GPS Ativa',
    encryption: 'Criptografia',
    version: 'Versão',
    auditHistory: 'Histórico de Logs de Auditoria',
    auditDesc: 'Registro abrangente de todas as implantações e remoções de tornozeleiras.',
    totalApplied: 'Total Aplicado',
    totalArrested: 'Total Preso',
    officerSearch: 'Nome/Distintivo do Oficial',
    playerSearch: 'Nome/ID do Jogador',
    dateRange: 'Período',
    last24h: 'Últimas 24 Horas',
    last7d: 'Últimos 7 Dias',
    last30d: 'Últimos 30 Dias',
    customRange: 'Intervalo Personalizado',
    applyFilters: 'Aplicar Filtros',
    reset: 'Resetar',
    exportCsv: 'Exportar CSV',
    showing: 'Mostrando',
    of: 'de',
    results: 'resultados',
    logsPerPage: 'Logs por página',
    dateTime: 'Data/Hora',
    officerName: 'Nome do Oficial',
    action: 'Ação',
    playerNameId: 'Nome do Jogador [ID]',
    reason: 'Motivo',
    applied: 'APLICADO',
    arrested: 'PRESO',
    removed: 'REMOVIDO',
    adminSystem: 'Sistema de Dados Administrativos LSPD',
    tamperEvident: 'Todos os logs são à prova de adulteração e criptografados.',
    configureUi: 'Configure a personalização da UI, parâmetros globais de monitoramento e integrações externas.',
    discard: 'Descartar Alterações',
    save: 'Salvar Configuração',
    brandingUi: 'Marca e UI',
    primaryColor: 'Cor Principal da Interface',
    selectAccent: 'Selecione a cor de destaque para botões, realces e ícones.',
    tacticalBlue: 'Azul Tático',
    emergencyRed: 'Vermelho de Emergência',
    custom: 'Personalizado',
    policeLogo: 'Logo da Polícia',
    customizeLogo: 'Personalize o logotipo do departamento exibido no cabeçalho e na barra lateral.',
    browse: 'Procurar Imagem',
    logoSpecs: 'PNG ou SVG, Máx 500KB',
    langSelect: 'Seleção de Idioma',
    sysLang: 'Idioma do Sistema',
    setLang: 'Defina o idioma principal para todos os elementos da interface e relatórios.',
    generalMon: 'Monitoramento Geral',
    enableGlobal: 'Ativar Rastreamento Global',
    allowRealTime: 'Permite o monitoramento em tempo real de todas as tornozeleiras eletrônicas ativas no mapa.',
    officerNotif: 'Notificações de Oficiais',
    sendAlerts: 'Envie alertas automáticos para unidades de patrulha quando um monitor for adulterado.',
    permMgmt: 'Gerenciamento de Permissões',
    policeRank: 'Cargo Policial',
    serverInteg: 'Integração com Servidor',
    webhookLogs: 'URL do Webhook do Discord (Logs)',
    postLogs: 'Postar logs detalhados de todas as ações de monitoramento no Discord.',
    test: 'Testar',
    adminNote: 'Nota Administrativa',
    uiBrandingUpdate: 'As alterações de UI e marca serão atualizadas para todos os clientes MDT conectados imediatamente após salvar.',
    manageAccess: 'Gerencie o acesso administrativo, privilégios de monitoramento eletrônico e status da conta para todo o pessoal policial.',
    inviteOfficer: 'Convidar Novo Oficial',
    totalPersonnel: 'Total de Pessoal',
    lspdActive: 'LSPD Ativo',
    bcsoActive: 'BCSO Ativo',
    suspended: 'Suspenso',
    searchPlaceholder: 'Pesquisar por nome, distintivo ou callsign...',
    all: 'Todos',
    filter: 'Filtrar',
    officerDetails: 'Detalhes do Oficial',
    dept: 'Departamento',
    accessLevel: 'Nível de Acesso',
    accStatus: 'Status da Conta',
    actions: 'Ações',
    badge: 'Distintivo',
    active: 'ATIVO',
    inactive: 'INATIVO',
    encryptedSession: 'Sessão de Terminal Criptografada',
    legalInfo: 'Informações Legais',
    sysSecurity: 'Segurança do Sistema',
    protocolManual: 'Manual de Protocolo',
    emsSystem: 'SISTEMA DE MONITORAMENTO ELETRÔNICO',
    submitRequest: 'Envie uma solicitação formal para monitoramento eletrônico civil. Todos os registros são logados e arquivados.',
    subjectInfo: 'Informações do Indivíduo',
    passportId: 'ID do Passaporte / ID do Jogador',
    playerName: 'Nome do Jogador',
    age: 'Idade',
    yearsOld: 'Anos de Idade',
    issuanceDetails: 'Detalhes da Emissão',
    reasonIssuance: 'Motivo da Emissão',
    provideLegal: 'Forneça uma justificativa legal detalhada para a colocação do monitor...',
    requiredAudit: 'Obrigatório para auditoria interna e evidência judicial.',
    monDuration: 'Duração do Monitoramento',
    hours: 'Horas',
    weeks: 'Semanas',
    priorityLevel: 'Nível de Prioridade',
    lowRisk: 'Baixo Risco',
    highRisk: 'Alto Risco',
    cancel: 'Cancelar',
    confirmReg: 'Confirmar Registro',
    securedAccess: 'Acesso ao Terminal Protegido',
    associatedMonitors: 'Monitores Associados',
    total: 'Total',
    noMonitorsFound: 'Nenhum monitor associado encontrado',
    close: 'Fechar',
    editPermissions: 'Editar Permissões',
    inviteNewOfficer: 'Convidar Novo Oficial',
    badgePassport: 'Número do Distintivo/Passaporte',
    grantAdmin: 'Conceder Privilégios Administrativos',
    grantAdminDesc: 'Permite gerenciar outros oficiais e visualizar logs sensíveis de tornozeleiras.',
    sendInvitation: 'Enviar Convite',
    fullLegalName: 'Nome completo legal',
    invalidBadge: 'O número do distintivo deve ser numérico.',
    requiredFields: 'Todos os campos são obrigatórios.',
    removeOfficer: 'Remover Oficial',
    confirmRemoveOfficer: 'Tem certeza que deseja remover este oficial? Esta ação não pode ser desfeita.',
    zoneSelector: 'Seletor de Zona',
    definePerimeter: 'Definir perímetro de monitoramento',
    interactiveSelection: 'Seleção Interativa',
    referenceMap: 'Mapa de Referência',
    zoneRadius: 'Raio da Zona (Metros)',
    instruction: 'Instrução',
    clickMapInstruction: 'Clique em qualquer lugar do mapa para definir o centro da zona de monitoramento.',
    referenceMapInstruction: 'Use este mapa para referência. Mude para "Seleção Interativa" para definir a zona.',
    confirmZone: 'Confirmar Zona',
    zoneDefined: 'Zona Definida',
    editZone: 'Editar Zona',
    noZoneSelected: 'Nenhuma Zona Selecionada',
    globalMonitoringDefault: 'O jogador será monitorado globalmente por padrão.',
    selectZone: 'Selecionar Zona',
    monitoringZone: 'Zona de Monitoramento',
  }
};

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean,
  onClick: () => void
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-left",
      active ? "sidebar-active text-primary font-semibold" : "text-slate-300 hover:text-slate-100 hover:bg-white/5"
    )}
  >
    <Icon size={20} className={cn(active ? "text-primary" : "group-hover:text-slate-100")} />
    <span>{label}</span>
  </button>
);

const Sidebar = ({ 
  activeTab, 
  onTabChange,
  settings
}: { 
  activeTab: Tab, 
  onTabChange: (tab: Tab) => void,
  settings: any
}) => {
  const t = translations[settings.language as keyof typeof translations] || translations.en;

  return (
    <aside className="w-72 bg-panel-dark border-r border-border-dark flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex flex-col h-full">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-10">
          <div className="size-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Shield className="text-white" size={28} />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight uppercase">LSPD</h1>
            <p className="text-xs text-slate-300 font-medium tracking-widest uppercase">Central LSPD</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 grow">
          <SidebarItem 
            icon={LayoutDashboard} 
            label={t.dashboard} 
            active={activeTab === 'dashboard'} 
            onClick={() => onTabChange('dashboard')}
          />
          <SidebarItem 
            icon={AppWindow} 
            label={t.register} 
            active={activeTab === 'register'} 
            onClick={() => onTabChange('register')}
          />
          <SidebarItem 
            icon={Share2} 
            label={t.track} 
            active={activeTab === 'track'} 
            onClick={() => onTabChange('track')}
          />
          <SidebarItem 
            icon={History} 
            label={t.logs} 
            active={activeTab === 'logs'} 
            onClick={() => onTabChange('logs')}
          />
          <SidebarItem 
            icon={Settings} 
            label={t.settings} 
            active={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')}
          />
          <SidebarItem 
            icon={Users} 
            label={t.access} 
            active={activeTab === 'access'} 
            onClick={() => onTabChange('access')}
          />
        </nav>

        {/* User Profile & Panic Button */}
        <div className="mt-auto pt-6 border-t border-border-dark">
          <div className="flex items-center gap-3 mb-6 p-2 bg-white/5 rounded-xl">
            <div className="size-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
              <img 
                src="https://picsum.photos/seed/officer/100/100" 
                alt="Officer Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Sgt. J. Miller</span>
              <span className="text-[10px] text-police-red font-black uppercase tracking-tighter">{t.onDuty}</span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-police-red hover:bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all uppercase text-xs tracking-widest"
          >
            <AlertTriangle size={14} />
            {t.panic}
          </motion.button>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ activeTab, settings }: { activeTab: Tab, settings: any }) => {
  const [time, setTime] = useState(new Date());
  const t = translations[settings.language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return t.monthlyStats;
      case 'register': return t.register;
      case 'track': return t.track;
      case 'logs': return t.logs;
      case 'settings': return t.settings;
      case 'access': return t.personnelPermissions;
      default: return t.lspdDatabase;
    }
  };

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard': return t.surveillance;
      case 'register': return t.newReg;
      case 'track': return t.activeTrack;
      case 'logs': return t.dataArchive;
      case 'settings': return t.config;
      case 'access': return t.officerAccess;
      default: return '';
    }
  };

  return (
    <header className="h-20 border-b border-border-dark flex items-center justify-between px-8 bg-panel-dark/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">{getTitle()}</h2>
        <nav className="flex text-xs text-slate-300 gap-2">
          <span>{t.dashboard}</span>
          <span>/</span>
          <span className="text-primary font-medium">{t.monitoring}</span>
          <span>/</span>
          <span className="text-slate-200">{getBreadcrumb()}</span>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold font-mono">
            {time.toLocaleTimeString('en-GB', { hour12: false })}
          </span>
          <span className="text-[10px] text-slate-300 uppercase font-medium">{t.systemTime}</span>
        </div>
        <div className="h-8 w-[1px] bg-border-dark"></div>
        <button className="relative p-2 text-slate-200 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 size-2 bg-police-red rounded-full border border-background-dark"></span>
        </button>
      </div>
    </header>
  );
};

const TrackDevices = ({ 
  monitors, 
  setMonitors, 
  onLogAction,
  settings
}: { 
  monitors: any[], 
  setMonitors: React.Dispatch<React.SetStateAction<any[]>>,
  onLogAction: (action: string, player: string, cid: string, reason: string) => void,
  settings: any
}) => {
  const [selectedId, setSelectedId] = useState<string>(monitors[0]?.id || '');
  const selectedMonitor = monitors.find(m => m.id === selectedId) || monitors[0];
  const t = translations[settings.language as keyof typeof translations] || translations.en;
  const worldToMapPercent = (x: number, y: number) => {
    const minX = -4000;
    const maxX = 4500;
    const minY = -4000;
    const maxY = 8000;
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    const xPct = clamp(((x - minX) / (maxX - minX)) * 100);
    const yPct = clamp(100 - ((y - minY) / (maxY - minY)) * 100);
    return { xPct, yPct };
  };

  const openSelectedOnRealMap = () => {
    fetchNui('openTrackingMap', { x: selectedMonitor?.worldX, y: selectedMonitor?.worldY });
  };

  const removeMonitor = async (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (monitor) {
      onLogAction('REMOVED', monitor.name, monitor.id, 'Manual removal from tracking dashboard.');
    }
    await fetchNui('removeMonitor', { id });
    setMonitors(monitors.filter(m => m.id !== id));
    if (selectedId === id) setSelectedId(monitors[0]?.id || '');
  };

  const arrestMonitor = async (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (monitor) {
      onLogAction('ARRESTED', monitor.name, monitor.id, 'Violation detected or manual arrest order issued.');
    }
    await fetchNui('removeMonitor', { id });
    setMonitors(monitors.filter(m => m.id !== id));
    if (selectedId === id) setSelectedId(monitors[0]?.id || '');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0c10]">
      {/* Left Panel: Monitors List */}
      <div className="w-80 border-r border-border-dark flex flex-col bg-[#10141d] shrink-0">
        <div className="p-4 border-b border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-pulse size-2 bg-primary rounded-full"></div>
              <h3 className="font-bold text-sm uppercase tracking-wider">{t.activeMonitors}</h3>
            </div>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">{monitors.length} {t.online}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {monitors.map((monitor) => (
            <div 
              key={monitor.id}
              onClick={() => setSelectedId(monitor.id)}
              className={cn(
                "p-3 rounded-lg border transition-all cursor-pointer group",
                selectedId === monitor.id 
                  ? "bg-[#161b22] border-primary/50 shadow-lg shadow-primary/5" 
                  : "bg-transparent border-transparent hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md overflow-hidden border border-border-dark">
                  <img src={monitor.avatar} alt={monitor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm truncate">{monitor.name}</h4>
                    <div className={cn(
                      "size-2 rounded-full shadow-sm",
                      monitor.priority === 'High' ? "bg-police-red animate-pulse" : 
                      monitor.battery < 20 ? "bg-amber-500" : 
                      "bg-emerald-500"
                    )}></div>
                  </div>
                  <p className="text-[10px] text-white font-mono uppercase">ID: {monitor.id} • {monitor.location}</p>
                </div>
              </div>

              {selectedId === monitor.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 pt-3 border-t border-border-dark space-y-3"
                >
                  <div>
                    <div className="flex justify-between text-[9px] font-bold uppercase text-white mb-1">
                      <span>{t.signalStability}</span>
                      <span className="text-primary">{monitor.stability}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${monitor.stability}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchNui('openTrackingMap', { x: monitor?.worldX, y: monitor?.worldY });
                      }}
                      className="py-1.5 bg-primary text-white text-[9px] font-bold uppercase rounded hover:bg-blue-600 transition-colors"
                    >
                      {t.trackBtn}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); arrestMonitor(monitor.id); }}
                      className="py-1.5 bg-slate-800 text-slate-300 text-[9px] font-bold uppercase rounded hover:bg-slate-700 transition-colors"
                    >
                      {t.arrestBtn}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeMonitor(monitor.id); }}
                      className="py-1.5 bg-slate-800 text-slate-300 text-[9px] font-bold uppercase rounded hover:bg-police-red/20 hover:text-police-red transition-colors"
                    >
                      {t.removeBtn}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative bg-[#0d0e12] overflow-hidden" onDoubleClick={openSelectedOnRealMap}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,91,236,0.10)_0%,rgba(11,12,16,0.92)_55%,rgba(11,12,16,1)_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

        <AnimatePresence>
          {selectedMonitor && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="absolute top-6 left-6 z-20 w-80 bg-[#161b22]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t.selectedSubject}</span>
                <div className={cn("size-2 rounded-full", selectedMonitor?.worldX && selectedMonitor?.worldY ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
              </div>
              <p className="text-sm font-black text-white truncate">{selectedMonitor.name}</p>
              <p className="text-[10px] text-white font-mono uppercase mt-1">
                ID: {selectedMonitor.id} • {selectedMonitor.status}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-white">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  X: {selectedMonitor?.worldX ? Number(selectedMonitor.worldX).toFixed(1) : '-'}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  Y: {selectedMonitor?.worldY ? Number(selectedMonitor.worldY).toFixed(1) : '-'}
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openSelectedOnRealMap(); }}
                  className="w-full px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg font-bold text-white uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  disabled={!selectedMonitor?.worldX || !selectedMonitor?.worldY}
                >
                  ABRIR NO MAPA REAL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 z-10 pointer-events-none">
          {monitors.map((m) => {
            if (m.worldX == null || m.worldY == null) return null;
            const { xPct, yPct } = worldToMapPercent(Number(m.worldX), Number(m.worldY));
            return (
              <motion.div
                key={m.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
              >
                <motion.div
                  initial={{ opacity: 0.2, scale: 0.9 }}
                  animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className={cn("size-4 rounded-full", selectedId === m.id ? "bg-primary/35" : "bg-white/15")}
                />
                <div className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full border",
                  selectedId === m.id ? "bg-primary border-white/80" : "bg-white/70 border-white/60"
                )} />
              </motion.div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0b0c10]/80 backdrop-blur-sm border-t border-border-dark flex items-center justify-between px-4 text-[9px] font-bold uppercase tracking-widest text-white">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><div className="size-1.5 bg-emerald-500 rounded-full"></div> {t.gpsActive}</span>
            <span className="flex items-center gap-1.5"><div className="size-1.5 bg-primary rounded-full"></div> {t.encryption}: AES-256</span>
          </div>
          <span>© LSPD High-Command Tracking Module {t.version} 4.1.0-Stable</span>
        </div>
      </div>
    </div>
  );
};

const ArchiveLogs = ({ logs, settings }: { logs: any[], settings: any }) => {
  const t = translations[settings.language as keyof typeof translations] || translations.en;
  
  const [officerInput, setOfficerInput] = useState('');
  const [playerInput, setPlayerInput] = useState('');
  const [dateRangeInput, setDateRangeInput] = useState(t.last30d);
  const [actionInput, setActionInput] = useState(t.all);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortColumn, setSortColumn] = useState<'dateTime' | 'player'>('dateTime');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const isNui = typeof (window as any).GetParentResourceName === 'function';
  const [exportStatus, setExportStatus] = useState<'idle' | 'copied' | 'downloaded' | 'error'>('idle');
  
  const [appliedFilters, setAppliedFilters] = useState({
    officer: '',
    player: '',
    dateRange: t.last30d,
    action: t.all
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      officer: officerInput,
      player: playerInput,
      dateRange: dateRangeInput,
      action: actionInput
    });
    setPage(1);
  };

  const handleReset = () => {
    setOfficerInput('');
    setPlayerInput('');
    setDateRangeInput(t.last30d);
    setActionInput(t.all);
    setAppliedFilters({
      officer: '',
      player: '',
      dateRange: t.last30d,
      action: t.all
    });
    setPage(1);
  };

  const handleExportCsv = async () => {
    const headers = ['dateTime', 'officer', 'badge', 'action', 'player', 'cid', 'reason'];
    const escape = (value: any) => {
      const s = String(value ?? '');
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [
      headers.join(','),
      ...filteredLogs.map((l: any) => headers.map(h => escape(l[h])).join(','))
    ].join('\n');

    if (!csv.trim() || filteredLogs.length === 0) {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
      return;
    }

    if (isNui) {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(csv);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = csv;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          textarea.style.top = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
        }
        setExportStatus('copied');
      } catch {
        setExportStatus('error');
      }
      setTimeout(() => setExportStatus('idle'), 2000);
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportStatus('downloaded');
    setTimeout(() => setExportStatus('idle'), 2000);
  };

  const filteredLogs = useMemo(() => {
    const filtered = logs.filter(log => {
      const matchesOfficer = log.officer.toLowerCase().includes(appliedFilters.officer.toLowerCase()) || 
                            log.badge.toLowerCase().includes(appliedFilters.officer.toLowerCase());
      const matchesPlayer = log.player.toLowerCase().includes(appliedFilters.player.toLowerCase()) || 
                           log.cid.toLowerCase().includes(appliedFilters.player.toLowerCase());
      
      const logDate = new Date(log.dateTime.replace(' ', 'T'));
      const now = new Date();
      let matchesDate = true;
      
      if (appliedFilters.dateRange === t.last24h) {
        matchesDate = (now.getTime() - logDate.getTime()) <= 24 * 60 * 60 * 1000;
      } else if (appliedFilters.dateRange === t.last7d) {
        matchesDate = (now.getTime() - logDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      } else if (appliedFilters.dateRange === t.last30d) {
        matchesDate = (now.getTime() - logDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      }

      const matchesAction = appliedFilters.action === t.all || log.action === appliedFilters.action;
      
      return matchesOfficer && matchesPlayer && matchesDate && matchesAction;
    });

    return [...filtered].sort((a, b) => {
      if (sortColumn === 'dateTime') {
        const dateA = new Date(a.dateTime.replace(' ', 'T')).getTime();
        const dateB = new Date(b.dateTime.replace(' ', 'T')).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valA = a.player.toLowerCase();
        const valB = b.player.toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }, [logs, appliedFilters, t, sortOrder, sortColumn]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
  useEffect(() => {
    setPage(p => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(filteredLogs.length, startIndex + perPage);
  const pagedLogs = filteredLogs.slice(startIndex, endIndex);

  const appliedCount = filteredLogs.filter(l => l.action === 'APPLIED').length;
  const arrestedCount = filteredLogs.filter(l => l.action === 'ARRESTED').length;

  return (
    <div className="p-8 max-w-7xl w-full mx-auto relative z-10">
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-3xl font-black tracking-tight text-white uppercase">{t.auditHistory}</h3>
          <p className="text-white mt-1">{t.auditDesc}</p>
        </motion.div>

        <div className="flex gap-4">
          <div className="bg-panel-dark border border-border-dark rounded-xl p-4 flex items-center gap-4 min-w-[200px]">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">{t.totalApplied}</p>
              <p className="text-2xl font-black text-white">{appliedCount.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-panel-dark border border-border-dark rounded-xl p-4 flex items-center gap-4 min-w-[200px]">
            <div className="size-10 rounded-lg bg-police-red/10 flex items-center justify-center text-police-red">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">{t.totalArrested}</p>
              <p className="text-2xl font-black text-white">{arrestedCount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel-dark border border-border-dark rounded-xl p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.officerSearch}</label>
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-white" size={16} />
              <input 
                className="w-full bg-input-dark border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-primary focus:border-primary outline-none" 
                placeholder={t.badge} 
                value={officerInput}
                onChange={(e) => setOfficerInput(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.playerSearch}</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 text-white" size={16} />
              <input 
                className="w-full bg-input-dark border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-primary focus:border-primary outline-none" 
                placeholder="Citizen ID" 
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.action}</label>
            <div className="relative flex items-center">
              <Activity className="absolute left-3 text-white" size={16} />
              <select 
                className="w-full bg-input-dark border-border-dark rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
              >
                <option value={t.all}>{t.all}</option>
                <option value="APPLIED">{t.applied}</option>
                <option value="ARRESTED">{t.arrested}</option>
                <option value="REMOVED">{t.removed}</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.dateRange}</label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-white" size={16} />
              <select 
                className="w-full bg-input-dark border-border-dark rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
                value={dateRangeInput}
                onChange={(e) => setDateRangeInput(e.target.value)}
              >
                <option>{t.last24h}</option>
                <option>{t.last7d}</option>
                <option>{t.last30d}</option>
                <option>{t.customRange}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleApplyFilters}
              className="flex-1 bg-primary hover:bg-blue-600 text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Filter size={14} /> {t.applyFilters}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
            >
              {t.reset}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <button onClick={handleExportCsv} className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
              <Download size={14} /> {t.exportCsv}
            </button>
            {exportStatus === 'copied' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">COPIADO</span>
            )}
            {exportStatus === 'downloaded' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">BAIXADO</span>
            )}
            {exportStatus === 'error' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-police-red">ERRO</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest">
            <span>
              {t.showing} {filteredLogs.length === 0 ? 0 : startIndex + 1}-{endIndex} {t.of} {filteredLogs.length} {t.results}
            </span>
            <div className="flex items-center gap-2">
              <span>{t.logsPerPage}:</span>
              <select
                className="bg-panel-dark border border-border-dark rounded px-2 py-1 text-white outline-none"
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-panel-dark border border-border-dark rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-border-dark">
                <th 
                  className="px-6 py-4 text-[10px] font-bold text-white uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortColumn === 'dateTime') {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('dateTime');
                      setSortOrder('desc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {t.dateTime}
                    <div className="flex flex-col">
                      <ChevronUp size={10} className={cn(sortColumn === 'dateTime' && sortOrder === 'asc' ? "text-primary" : "text-white")} />
                      <ChevronDown size={10} className={cn(sortColumn === 'dateTime' && sortOrder === 'desc' ? "text-primary" : "text-white")} />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-white uppercase tracking-widest">{t.officerName}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white uppercase tracking-widest">{t.action}</th>
                <th 
                  className="px-6 py-4 text-[10px] font-bold text-white uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortColumn === 'player') {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortColumn('player');
                      setSortOrder('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {t.playerNameId}
                    <div className="flex flex-col">
                      <ChevronUp size={10} className={cn(sortColumn === 'player' && sortOrder === 'asc' ? "text-primary" : "text-white")} />
                      <ChevronDown size={10} className={cn(sortColumn === 'player' && sortOrder === 'desc' ? "text-primary" : "text-white")} />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-white uppercase tracking-widest">{t.reason}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {pagedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 text-sm font-mono text-slate-300">{log.dateTime}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-white">{log.officer}</p>
                    <p className="text-[10px] font-bold text-primary uppercase">{log.badge}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      log.action === 'APPLIED' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      log.action === 'ARRESTED' && "bg-police-red/10 text-police-red border-police-red/20",
                      log.action === 'REMOVED' && "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      <div className={cn(
                        "size-1.5 rounded-full",
                        log.action === 'APPLIED' && "bg-emerald-500",
                        log.action === 'ARRESTED' && "bg-police-red",
                        log.action === 'REMOVED' && "bg-amber-500"
                      )}></div>
                      {log.action === 'APPLIED' ? t.applied : log.action === 'ARRESTED' ? t.arrested : t.removed}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                        {log.initials}
                      </div>
                      <p className="text-sm font-bold text-white">{log.player} <span className="text-white font-normal">[CID: {log.cid}]</span></p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-white italic leading-relaxed max-w-xs">{log.reason}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 pt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(1)}
              className="size-8 bg-panel-dark border border-border-dark rounded flex items-center justify-center text-white hover:text-white transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="size-8 bg-panel-dark border border-border-dark rounded flex items-center justify-center text-white hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(1)}
              className={cn("size-8 rounded font-bold text-xs", page === 1 ? "bg-primary text-white" : "bg-panel-dark border border-border-dark text-white hover:text-white transition-colors")}
            >
              1
            </button>
            {totalPages >= 2 && (
              <button
                onClick={() => setPage(2)}
                className={cn("size-8 rounded font-bold text-xs", page === 2 ? "bg-primary text-white" : "bg-panel-dark border border-border-dark text-white hover:text-white transition-colors")}
              >
                2
              </button>
            )}
            {totalPages >= 3 && (
              <button
                onClick={() => setPage(3)}
                className={cn("size-8 rounded font-bold text-xs", page === 3 ? "bg-primary text-white" : "bg-panel-dark border border-border-dark text-white hover:text-white transition-colors")}
              >
                3
              </button>
            )}
            {totalPages > 4 && <span className="size-8 flex items-center justify-center text-white">...</span>}
            {totalPages > 3 && (
              <button
                onClick={() => setPage(totalPages)}
                className={cn("size-8 rounded font-bold text-xs", page === totalPages ? "bg-primary text-white" : "bg-panel-dark border border-border-dark text-white hover:text-white transition-colors")}
              >
                {totalPages}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="size-8 bg-panel-dark border border-border-dark rounded flex items-center justify-center text-white hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              className="size-8 bg-panel-dark border border-border-dark rounded flex items-center justify-center text-white hover:text-white transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-center mt-12 text-[9px] font-bold text-white uppercase tracking-[0.2em]">
        {t.adminSystem} © 2023 - {t.tamperEvident}
      </p>
    </div>
  );
};

const Dashboard = ({ monitors, logs, settings, officers }: { monitors: any[], logs: any[], settings: any, officers: any[] }) => {
  const activeCount = monitors.length;
  const t = translations[settings.language as keyof typeof translations] || translations.en;

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthLogs = logs.filter(l => {
      const d = new Date(l.dateTime.replace(' ', 'T'));
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const applied = monthLogs.filter(l => l.action === 'APPLIED').length;
    const removals = monthLogs.filter(l => l.action === 'REMOVED' || l.action === 'ARRESTED').length;

    // Calculate Average Duration
    const cidGroups: Record<string, any[]> = {};
    logs.forEach(l => {
      if (!cidGroups[l.cid]) cidGroups[l.cid] = [];
      cidGroups[l.cid].push(l);
    });

    let totalDurationMs = 0;
    let completedSessions = 0;

    Object.values(cidGroups).forEach(group => {
      const sorted = [...group].sort((a, b) => new Date(a.dateTime.replace(' ', 'T')).getTime() - new Date(b.dateTime.replace(' ', 'T')).getTime());
      
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].action === 'APPLIED') {
          const endEvent = sorted.slice(i + 1).find(e => e.action === 'REMOVED' || e.action === 'ARRESTED');
          if (endEvent) {
            const start = new Date(sorted[i].dateTime.replace(' ', 'T')).getTime();
            const end = new Date(endEvent.dateTime.replace(' ', 'T')).getTime();
            totalDurationMs += (end - start);
            completedSessions++;
          }
        }
      }
    });

    const avgDurationDays = completedSessions > 0 
      ? Math.round(totalDurationMs / (1000 * 60 * 60 * 24) / completedSessions) 
      : 0;

    // Generate chart data for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyCounts: Record<number, number> = {};
    
    monthLogs.filter(l => l.action === 'APPLIED').forEach(l => {
      const day = new Date(l.dateTime.replace(' ', 'T')).getDate();
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    const chartData = [];
    // Show 7 points across the month for the chart
    const intervals = [1, 5, 10, 15, 20, 25, daysInMonth];
    for (const day of intervals) {
      chartData.push({
        name: day === 1 ? '1st' : day === 21 ? '21st' : day === 22 ? '22nd' : day === 23 ? '23rd' : `${day}th`,
        value: dailyCounts[day] || 0
      });
    }

    return { applied, removals, chartData, avgDurationDays };
  }, [logs]);

  const topOfficers = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.filter(l => l.action === 'APPLIED').forEach(log => {
      counts[log.officer] = (counts[log.officer] || 0) + 1;
    });

    return officers
      .map(officer => ({
        name: officer.name,
        rank: `${officer.rank} • ${officer.dept}`,
        apps: counts[officer.name] || 0,
        avatar: officer.avatar || `https://picsum.photos/seed/${officer.name}/100/100`
      }))
      .sort((a, b) => b.apps - a.apps)
      .slice(0, 5)
      .map((officer, i) => ({
        ...officer,
        medal: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : undefined
      }));
  }, [logs, officers]);

  return (
    <div className="p-8 max-w-7xl w-full mx-auto relative z-10 space-y-8">
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-3xl font-black tracking-tight text-white uppercase">{t.monthlyStats}</h3>
          <p className="text-slate-200 mt-1">{t.realTimeAnalytics}</p>
        </motion.div>
        <div className="flex gap-3">
          <button className="bg-panel-dark border border-border-dark px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Calendar size={14} /> {t.last30Days}
          </button>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
            <Download size={14} /> {t.exportReport}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.totalActive, value: activeCount.toString(), change: '+5.2%', icon: Activity, color: 'text-primary' },
          { label: t.appliedMonth, value: stats.applied.toString(), change: '+12.5%', icon: PlusCircle, color: 'text-emerald-500' },
          { label: t.removalsArrests, value: stats.removals.toString(), change: '+2.4%', icon: Lock, color: 'text-police-red' },
          { label: t.avgDuration, value: `${stats.avgDurationDays} ${t.days}`, change: '-1.2%', icon: Clock, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-panel-dark border border-border-dark rounded-xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg bg-white/5", kpi.color)}>
                <kpi.icon size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1",
                kpi.change.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : 
                kpi.change.startsWith('-') ? "bg-police-red/10 text-police-red" : "bg-slate-500/10 text-slate-300"
              )}>
                {kpi.change.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {kpi.change}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-3xl font-black text-white">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-panel-dark border border-border-dark rounded-xl p-8 min-w-0"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-white">{t.monitorsPerDay}</h4>
              <p className="text-xs text-slate-300">{t.deploymentFreq}</p>
            </div>
            <div className="flex bg-slate-900 rounded-lg p-1">
              <button className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-widest">{t.line}</button>
              <button className="px-3 py-1 text-white text-[10px] font-bold rounded uppercase tracking-widest hover:text-white">{t.bar}</button>
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Officers Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-panel-dark border border-border-dark rounded-xl p-8 flex flex-col"
        >
          <div className="mb-8">
            <h4 className="text-lg font-bold text-white">{t.topOfficers}</h4>
            <p className="text-xs text-slate-300">{t.mostApps}</p>
          </div>
          <div className="space-y-6 flex-1">
            {topOfficers.map((officer, i) => (
              <div key={officer.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="size-10 rounded-full overflow-hidden border border-border-dark group-hover:border-primary/50 transition-all">
                      <img src={officer.avatar} alt={officer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {officer.medal && (
                      <span className="absolute -bottom-1 -right-1 text-xs">{officer.medal}</span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{officer.name}</h5>
                    <p className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter">{officer.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{officer.apps}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{t.apps}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-border-dark rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-200 hover:text-white hover:border-primary transition-all">
            {t.viewLeaderboard}
          </button>
        </motion.div>
      </div>

      {/* System Status Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-border-dark">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{t.systemLive}</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.lastSync}: 14:32:01 • {t.server}: US-WEST-01</p>
        </div>
        <div className="flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">{t.health}</a>
          <a href="#" className="hover:text-primary transition-colors">{t.privacy}</a>
          <a href="#" className="hover:text-primary transition-colors">{t.manual}</a>
        </div>
      </div>
    </div>
  );
};

const SystemSettings = ({ 
  settings, 
  setSettings 
}: { 
  settings: any, 
  setSettings: React.Dispatch<React.SetStateAction<any>> 
}) => {
  const t = translations[settings.language as keyof typeof translations] || translations.en;
  const [permissions] = useState([
    { rank: 'Chief of Police', register: true, track: true, arrest: true, remove: true },
    { rank: 'Lieutenant', register: true, track: true, arrest: true, remove: true },
    { rank: 'Officer', register: true, track: true, arrest: false, remove: false },
  ]);
  const savedSettingsRef = React.useRef(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const saveChanges = () => {
    savedSettingsRef.current = settings;
    try {
      localStorage.setItem('rossmonitor_settings', JSON.stringify(settings));
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="p-8 max-w-7xl w-full mx-auto relative z-10 space-y-10">
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-3xl font-black tracking-tight text-white uppercase">{t.settings}</h3>
          <p className="text-slate-200 mt-1">{t.configureUi}</p>
        </motion.div>
        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">SALVO</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-police-red">ERRO</span>
          )}
          <button onClick={saveChanges} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
            {t.save}
          </button>
        </div>
      </div>

      {/* Branding & UI */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Palette size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest">{t.brandingUi}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-panel-dark border border-border-dark rounded-xl p-6 space-y-4">
            <div>
              <h5 className="font-bold text-white text-sm">{t.primaryColor}</h5>
              <p className="text-[10px] text-slate-300 mt-1">{t.selectAccent}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSettings({...settings, primaryColor: 'blue'})}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                  settings.primaryColor === 'blue' ? "border-primary bg-primary/10" : "border-border-dark hover:border-slate-600"
                )}
              >
                <div className="size-4 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold uppercase text-white">{t.tacticalBlue}</span>
              </button>
              <button 
                onClick={() => setSettings({...settings, primaryColor: 'red'})}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                  settings.primaryColor === 'red' ? "border-police-red bg-police-red/10" : "border-border-dark hover:border-slate-600"
                )}
              >
                <div className="size-4 rounded-full bg-police-red"></div>
                <span className="text-[10px] font-bold uppercase text-white">{t.emergencyRed}</span>
              </button>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-[10px] font-bold uppercase text-slate-300">{t.custom}</span>
                <div className="size-6 rounded bg-primary border border-white/20"></div>
              </div>
            </div>
          </div>
          <div className="bg-panel-dark border border-border-dark rounded-xl p-6 space-y-4">
            <div>
              <h5 className="font-bold text-white text-sm">{t.policeLogo}</h5>
              <p className="text-[10px] text-slate-300 mt-1">{t.customizeLogo}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded bg-slate-800 flex items-center justify-center text-slate-300 border border-dashed border-slate-700 overflow-hidden">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer">
                  {t.browse}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSettings({...settings, logo: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <span className="text-[9px] text-slate-300 uppercase">{t.logoSpecs}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Globe size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest">{t.langSelect}</h4>
        </div>
        <div className="bg-panel-dark border border-border-dark rounded-xl p-6 flex items-center justify-between">
          <div>
            <h5 className="font-bold text-white text-sm">{t.sysLang}</h5>
            <p className="text-[10px] text-slate-300 mt-1">{t.setLang}</p>
          </div>
          <div className="flex bg-slate-900 rounded-lg p-1">
            <button 
              onClick={() => setSettings({...settings, language: 'en'})}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase transition-all",
                settings.language === 'en' ? "bg-slate-800 text-white shadow-sm" : "text-slate-300 hover:text-slate-200"
              )}
            >
              <span className="text-lg">🇺🇸</span> English (US)
            </button>
            <button 
              onClick={() => setSettings({...settings, language: 'pt'})}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase transition-all",
                settings.language === 'pt' ? "bg-slate-800 text-white shadow-sm" : "text-slate-300 hover:text-slate-200"
              )}
            >
              <span className="text-lg">🇧🇷</span> Português (BR)
            </button>
          </div>
        </div>
      </section>

      {/* General Monitoring */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Settings size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest">{t.generalMon}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-panel-dark border border-border-dark rounded-xl p-6 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-white text-sm">{t.enableGlobal}</h5>
              <p className="text-[10px] text-slate-300 mt-1 max-w-[240px]">{t.allowRealTime}</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, globalTracking: !settings.globalTracking})}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                settings.globalTracking ? "bg-primary" : "bg-slate-700"
              )}
            >
              <div className={cn(
                "absolute top-1 size-4 bg-white rounded-full transition-all duration-300",
                settings.globalTracking ? "left-7" : "left-1"
              )} />
            </button>
          </div>
          <div className="bg-panel-dark border border-border-dark rounded-xl p-6 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-white text-sm">{t.officerNotif}</h5>
              <p className="text-[10px] text-slate-300 mt-1 max-w-[240px]">{t.sendAlerts}</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, officerNotifications: !settings.officerNotifications})}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                settings.officerNotifications ? "bg-primary" : "bg-slate-700"
              )}
            >
              <div className={cn(
                "absolute top-1 size-4 bg-white rounded-full transition-all duration-300",
                settings.officerNotifications ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        </div>
      </section>

      {/* Permissions Management */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Shield size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest">{t.permMgmt}</h4>
        </div>
        <div className="bg-panel-dark border border-border-dark rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-border-dark">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.policeRank}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">{t.register}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">{t.track}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">{t.arrestBtn}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">{t.removeBtn}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {permissions.map((p) => (
                <tr key={p.rank} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-white">{p.rank}</td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={p.register} readOnly className="size-4 rounded border-border-dark bg-slate-800 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={p.track} readOnly className="size-4 rounded border-border-dark bg-slate-800 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={p.arrest} readOnly className="size-4 rounded border-border-dark bg-slate-800 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={p.remove} readOnly className="size-4 rounded border-border-dark bg-slate-800 text-primary focus:ring-primary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Server Integration */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <RefreshCw size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest">{t.serverInteg}</h4>
        </div>
        <div className="bg-panel-dark border border-border-dark rounded-xl p-8 space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.webhookLogs}</label>
            <p className="text-[10px] text-slate-200">{t.postLogs}</p>
            <div className="flex gap-3">
              <input 
                type="password"
                value={settings.webhookLogs}
                onChange={(e) => setSettings({...settings, webhookLogs: e.target.value})}
                className="flex-1 bg-input-dark border border-border-dark rounded-lg py-2.5 px-4 text-sm text-white outline-none focus:border-primary transition-all"
                placeholder="https://discord.com/api/webhooks/..."
              />
              <button className="px-6 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2">
                <RefreshCw size={14} /> {t.test}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Administrative Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-4">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Bell size={20} />
        </div>
        <div>
          <h5 className="text-sm font-bold text-primary mb-1">{t.adminNote}</h5>
          <p className="text-xs text-slate-200 leading-relaxed">{t.uiBrandingUpdate}</p>
        </div>
      </div>
    </div>
  );
};

const UserAccess = ({ settings, officers, setOfficers, logs }: { settings: any, officers: any[], setOfficers: React.Dispatch<React.SetStateAction<any[]>>, logs: any[] }) => {
  const t = translations[settings.language as keyof typeof translations] || translations.en;
  const [selectedOfficer, setSelectedOfficer] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmAdmin, setShowConfirmAdmin] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [officerToRemove, setOfficerToRemove] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState(t.all);
  const [error, setError] = useState<string | null>(null);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    badge: '',
    dept: 'LSPD',
    level: 'Level 1 (Limited Access)',
    isAdmin: false
  });

  const toggleStatus = (id: number) => {
    setOfficers(officers.map(o => 
      o.id === id ? { ...o, status: o.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : o
    ));
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newOfficer.name || !newOfficer.badge) {
      setError(t.requiredFields);
      return;
    }

    if (!/^\d+$/.test(newOfficer.badge)) {
      setError(t.invalidBadge);
      return;
    }

    const officerToAdd = {
      id: Date.now(),
      name: newOfficer.name,
      badge: `#${newOfficer.badge}`,
      rank: 'Officer I',
      dept: newOfficer.dept,
      level: newOfficer.isAdmin ? `${newOfficer.level} (Admin)` : newOfficer.level,
      status: 'ACTIVE',
      initials: newOfficer.name.split(' ').map(n => n[0]).join(''),
      avatar: `https://picsum.photos/seed/${newOfficer.name}/100/100`
    };

    setOfficers(prev => [...prev, officerToAdd]);
    setIsInviteModalOpen(false);
    setError(null);
    setNewOfficer({
      name: '',
      badge: '',
      dept: 'LSPD',
      level: 'Level 1 (Limited Access)',
      isAdmin: false
    });
  };

  const handleUpdateOfficer = () => {
    if (!selectedOfficer || !editData) return;

    setOfficers(prev => prev.map(o => 
      o.id === selectedOfficer.id ? { ...o, level: editData.level } : o
    ));
    setSelectedOfficer({ ...selectedOfficer, level: editData.level });
    setIsEditing(false);
  };

  const handleToggleAdmin = () => {
    if (!selectedOfficer || !editData) return;
    
    const currentIsAdmin = editData.level.includes('(Admin)');
    const newLevel = currentIsAdmin 
      ? editData.level.replace(' (Admin)', '') 
      : `${editData.level} (Admin)`;
    
    setEditData({ ...editData, level: newLevel });
    setShowConfirmAdmin(false);
  };

  const handleRemoveOfficer = () => {
    if (!officerToRemove) return;
    setOfficers(prev => prev.filter(o => o.id !== officerToRemove.id));
    if (selectedOfficer?.id === officerToRemove.id) {
      setSelectedOfficer(null);
    }
    setShowConfirmRemove(false);
    setOfficerToRemove(null);
  };

  const officerMonitors = useMemo(() => {
    if (!selectedOfficer) return [];
    return logs.filter(l => l.officer === selectedOfficer.name && l.action === 'APPLIED');
  }, [selectedOfficer, logs]);

  const officerStats = useMemo(() => {
    return {
      total: officers.length,
      lspd: officers.filter(o => o.dept === 'LSPD' && o.status === 'ACTIVE').length,
      bcso: officers.filter(o => o.dept === 'BCSO' && o.status === 'ACTIVE').length,
      suspended: officers.filter(o => o.status === 'INACTIVE').length
    };
  }, [officers]);

  const filteredOfficers = useMemo(() => {
    return officers.filter(officer => {
      const matchesSearch = officer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           officer.badge.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === t.all || officer.dept === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [officers, searchQuery, deptFilter, t.all]);

  return (
    <div className="p-8 max-w-7xl w-full mx-auto relative z-10 space-y-8">
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-3xl font-black tracking-tight text-white uppercase">{t.personnelPermissions}</h3>
          <p className="text-slate-200 mt-1">{t.manageAccess}</p>
        </motion.div>
        <button 
          onClick={() => {
            setIsInviteModalOpen(true);
            setError(null);
          }}
          className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
        >
          <UserPlus size={18} /> {t.inviteOfficer}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t.totalPersonnel, value: officerStats.total, color: 'text-white' },
          { label: t.lspdActive, value: officerStats.lspd, color: 'text-primary' },
          { label: t.bcsoActive, value: officerStats.bcso, color: 'text-amber-500' },
          { label: t.suspended, value: officerStats.suspended, color: 'text-police-red' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-panel-dark border border-border-dark rounded-xl p-6"
          >
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-panel-dark border border-border-dark rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              className="w-full bg-input-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary outline-none transition-all" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-900 rounded-lg p-1">
              {[t.all, 'LSPD', 'BCSO', 'SASP'].map(dept => (
                <button 
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                    dept === deptFilter ? "bg-primary text-white" : "text-slate-300 hover:text-slate-100"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-border-dark rounded-lg text-[10px] font-bold uppercase text-slate-200 hover:text-white transition-all">
              <Filter size={14} /> {t.filter}
            </button>
          </div>
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-panel-dark border border-border-dark rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-border-dark">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.officerDetails}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.dept}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.accessLevel}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.accStatus}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {filteredOfficers.map((officer) => (
              <tr 
                key={officer.id} 
                onClick={() => {
                  setSelectedOfficer(officer);
                  setEditData({ ...officer });
                  setIsEditing(false);
                }}
                className="hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                      {officer.initials}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">{officer.name}</h5>
                      <p className="text-[10px] text-slate-300 font-medium uppercase">{t.badge}: {officer.badge} • {officer.rank}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                    officer.dept === 'LSPD' ? "bg-primary/10 text-primary border-primary/20" :
                    officer.dept === 'BCSO' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {officer.dept}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    {officer.level.includes('Admin') ? <ShieldCheck size={16} className="text-primary" /> : <Lock size={16} className="text-slate-300" />}
                    {officer.level}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleStatus(officer.id)}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors duration-300",
                        officer.status === 'ACTIVE' ? "bg-primary" : "bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 size-4 bg-white rounded-full transition-all duration-300",
                        officer.status === 'ACTIVE' ? "left-5.5" : "left-0.5"
                      )} />
                    </button>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      officer.status === 'ACTIVE' ? "text-emerald-500" : "text-police-red"
                    )}>
                      {officer.status === 'ACTIVE' ? t.active : t.inactive}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <Settings size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Officer Details Modal */}
      <AnimatePresence>
        {selectedOfficer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-panel-dark border border-border-dark rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border-dark flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{selectedOfficer.name}</h4>
                    <p className="text-xs text-white font-bold uppercase tracking-widest">{selectedOfficer.rank} • {selectedOfficer.badge}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOfficer(null)}
                  className="p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">{t.dept}</p>
                    <p className="text-sm font-bold text-white">{selectedOfficer.dept}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">{t.accessLevel}</p>
                    {isEditing ? (
                      <select 
                        value={editData.level.replace(' (Admin)', '')}
                        onChange={(e) => {
                          const isAdmin = editData.level.includes('(Admin)');
                          setEditData({ ...editData, level: isAdmin ? `${e.target.value} (Admin)` : e.target.value });
                        }}
                        className="w-full bg-input-dark border border-border-dark rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-primary"
                      >
                        <option value="Level 1 (Limited Access)">Level 1 (Limited Access)</option>
                        <option value="Level 2 (Standard Access)">Level 2 (Standard Access)</option>
                        <option value="Level 3 (Advanced Access)">Level 3 (Advanced Access)</option>
                        <option value="Level 4 (Full Access)">Level 4 (Full Access)</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        {selectedOfficer.level.includes('Admin') ? <ShieldCheck size={16} className="text-primary" /> : <Lock size={16} className="text-white" />}
                        {selectedOfficer.level}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">{t.accStatus}</p>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                      selectedOfficer.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500" : "bg-police-red/10 text-police-red"
                    )}>
                      {selectedOfficer.status === 'ACTIVE' ? t.active : t.inactive}
                    </span>
                  </div>
                </div>

                {/* Admin Privilege Toggle (Only in Edit Mode) */}
                {isEditing && (
                  <div className="p-4 bg-white/5 border border-border-dark rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{t.grantAdmin}</p>
                      <p className="text-[10px] text-white">{t.grantAdminDesc}</p>
                    </div>
                    <button 
                      onClick={() => setShowConfirmAdmin(true)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-300",
                        editData.level.includes('(Admin)') ? "bg-primary" : "bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 size-4 bg-white rounded-full transition-all duration-300",
                        editData.level.includes('(Admin)') ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                )}

                {/* Associated Monitors */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Activity size={14} className="text-primary" />
                      {t.associatedMonitors}
                    </h5>
                    <span className="text-[10px] font-bold text-white uppercase">{officerMonitors.length} {t.total}</span>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {officerMonitors.length > 0 ? (
                      officerMonitors.map((log: any) => (
                        <div key={log.id} className="p-4 bg-white/5 border border-border-dark rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                              {log.initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{log.player}</p>
                              <p className="text-[10px] text-white font-medium uppercase">{t.passportId}: {log.cid} • {log.dateTime}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                              {t.applied}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center border-2 border-dashed border-border-dark rounded-2xl">
                        <Activity size={32} className="mx-auto text-slate-700 mb-3 opacity-20" />
                        <p className="text-xs text-white font-bold uppercase tracking-widest">{t.noMonitorsFound}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white/5 border-t border-border-dark flex justify-between items-center">
                <button 
                  onClick={() => {
                    setOfficerToRemove(selectedOfficer);
                    setShowConfirmRemove(true);
                  }}
                  className="px-4 py-2 bg-police-red/10 hover:bg-police-red/20 text-police-red rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  {t.removeOfficer}
                </button>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-lg text-xs font-bold text-white hover:text-white transition-all uppercase tracking-widest"
                      >
                        {t.cancel}
                      </button>
                      <button 
                        onClick={handleUpdateOfficer}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest"
                      >
                        {t.save}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setSelectedOfficer(null)}
                        className="px-6 py-2 rounded-lg text-xs font-bold text-white hover:text-white transition-all uppercase tracking-widest"
                      >
                        {t.close}
                      </button>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-primary hover:bg-blue-600 rounded-lg text-xs font-bold text-white shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
                      >
                        {t.editPermissions}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Officer Confirmation Modal */}
      <AnimatePresence>
        {showConfirmRemove && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background-dark/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-panel-dark border border-border-dark rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6"
            >
              <div className="size-16 rounded-full bg-police-red/10 flex items-center justify-center text-police-red mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">{t.removeOfficer}</h4>
                <p className="text-sm text-white leading-relaxed">
                  {t.confirmRemoveOfficer} <span className="text-white font-bold">{officerToRemove?.name}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmRemove(false)}
                  className="flex-1 py-3 rounded-lg font-bold text-white hover:text-white transition-all uppercase text-xs tracking-widest"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleRemoveOfficer}
                  className="flex-1 py-3 bg-police-red hover:bg-red-600 rounded-lg font-bold text-white shadow-xl shadow-police-red/20 transition-all uppercase text-xs tracking-widest"
                >
                  {t.removeOfficer}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Privilege Confirmation Modal */}
      <AnimatePresence>
        {showConfirmAdmin && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background-dark/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-panel-dark border border-border-dark rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6"
            >
              <div className="size-16 rounded-full bg-police-red/10 flex items-center justify-center text-police-red mx-auto">
                <AlertTriangle size={32} />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Confirm Privilege Change</h4>
                <p className="text-sm text-white leading-relaxed">
                  You are about to {editData.level.includes('(Admin)') ? 'revoke' : 'grant'} administrative privileges for <span className="text-white font-bold">{selectedOfficer.name}</span>. This action will significantly change their system access.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmAdmin(false)}
                  className="flex-1 py-3 rounded-lg font-bold text-white hover:text-white transition-all uppercase text-xs tracking-widest"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleToggleAdmin}
                  className="flex-1 py-3 bg-police-red hover:bg-red-600 rounded-lg font-bold text-white shadow-xl shadow-police-red/20 transition-all uppercase text-xs tracking-widest"
                >
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite New Officer Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-panel-dark border border-border-dark rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border-dark flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <UserPlus size={20} />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">{t.inviteNewOfficer}</h4>
                </div>
                <button 
                  onClick={() => {
                    setIsInviteModalOpen(false);
                    setError(null);
                  }}
                  className="p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleInvite} className="p-8 space-y-6">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-police-red/10 border border-police-red/20 rounded-xl flex items-center gap-3 text-police-red text-xs font-bold uppercase tracking-widest"
                  >
                    <AlertTriangle size={16} />
                    {error}
                  </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.officerName}</label>
                    <input 
                      type="text" 
                      required
                      value={newOfficer.name}
                      onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                      className="w-full bg-input-dark border border-border-dark rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-all" 
                      placeholder={t.fullLegalName} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.badgePassport}</label>
                    <input 
                      type="text" 
                      required
                      value={newOfficer.badge}
                      onChange={(e) => setNewOfficer({ ...newOfficer, badge: e.target.value })}
                      className="w-full bg-input-dark border border-border-dark rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-all" 
                      placeholder="e.g. 7124" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.dept}</label>
                    <select 
                      value={newOfficer.dept}
                      onChange={(e) => setNewOfficer({ ...newOfficer, dept: e.target.value })}
                      className="w-full bg-input-dark border border-border-dark rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-all"
                    >
                      <option value="LSPD">LSPD (Los Santos Police Dept)</option>
                      <option value="BCSO">BCSO (Blaine County Sheriff)</option>
                      <option value="SASP">SASP (San Andreas State Patrol)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t.accessLevel}</label>
                    <select 
                      value={newOfficer.level}
                      onChange={(e) => setNewOfficer({ ...newOfficer, level: e.target.value })}
                      className="w-full bg-input-dark border border-border-dark rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-all"
                    >
                      <option value="Level 1 (Limited Access)">Level 1 (Limited Access)</option>
                      <option value="Level 2 (Standard Access)">Level 2 (Standard Access)</option>
                      <option value="Level 3 (Advanced Access)">Level 3 (Advanced Access)</option>
                      <option value="Level 4 (Full Access)">Level 4 (Full Access)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 border border-border-dark rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setNewOfficer({ ...newOfficer, isAdmin: !newOfficer.isAdmin })}
                    className={cn(
                      "size-5 rounded border transition-all flex items-center justify-center shrink-0 mt-0.5",
                      newOfficer.isAdmin ? "bg-primary border-primary" : "bg-slate-800 border-border-dark"
                    )}
                  >
                    {newOfficer.isAdmin && <CheckCircle size={14} className="text-white" />}
                  </button>
                  <div>
                    <p className="text-sm font-bold text-white leading-none mb-1">{t.grantAdmin}</p>
                    <p className="text-xs text-white leading-tight">{t.grantAdminDesc}</p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-dark">
                  <button 
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-6 py-3 rounded-lg font-bold text-white hover:text-white transition-all uppercase text-xs tracking-widest"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg font-bold text-white shadow-xl shadow-primary/20 transition-all uppercase text-xs tracking-widest"
                  >
                    {t.sendInvitation}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-8 border-t border-border-dark">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Encrypted Terminal Session: 88A-710-F02</p>
        <div className="flex gap-6 text-[10px] font-bold text-white uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Legal Information</a>
          <a href="#" className="hover:text-primary transition-colors">System Security</a>
          <a href="#" className="hover:text-primary transition-colors">Protocol Manual</a>
        </div>
      </div>
    </div>
  );
};

const MapSelector = ({ 
  onClose,
  initialRadius,
  language = 'en'
}: { 
  onClose: () => void,
  initialRadius?: number,
  language: string
}) => {
  const t = translations[language as keyof typeof translations];
  const [radius, setRadius] = useState(initialRadius ?? 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-panel-dark border border-border-dark rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-border-dark flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight">{t.zoneSelector}</h4>
              <p className="text-xs text-white">{t.definePerimeter}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-[#0b0c10] overflow-hidden">
          <div className="p-8 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h5 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Seleção pelo mapa da base</h5>
              <p className="text-sm text-white leading-relaxed">
                Clique em <span className="text-primary font-bold">ABRIR MAPA</span>, no mapa da base marque um waypoint (o ponto da zona) e feche o mapa.
                O sistema volta automaticamente com as coordenadas.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border-dark bg-white/5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex-1 max-w-xs">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">
                {t.zoneRadius}
              </label>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-[9px] text-white font-mono">
                <span>50m</span>
                <span className="text-primary font-bold">{radius}m</span>
                <span>1000m</span>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-border-dark"></div>
            
            <div className="text-xs text-white">
              <p className="font-bold text-white mb-1">{t.instruction}:</p>
              Marque o waypoint no mapa da base.
            </div>
          </div>

          <button 
            onClick={() => fetchNui('selectZoneFromMap', { radius })}
            className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg font-bold text-white shadow-xl shadow-primary/20 transition-all uppercase text-xs tracking-widest flex items-center gap-2"
            type="button"
          >
            <CheckCircle size={16} />
            ABRIR MAPA
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isVisible, setIsVisible] = useState(false);
  const isNui = typeof (window as any).GetParentResourceName === 'function';

  useNuiEvent('setVisible', (data: any) => {
    setIsVisible(data.visible);
  });

  useNuiEvent('updateData', (data: any) => {
    if (data.monitors) setMonitors(data.monitors);
    if (data.officers) setOfficers(data.officers);
    if (data.logs) setLogs(data.logs);
  });

  useNuiEvent('zoneSelected', (data: any) => {
    setSelectedZone({
      x: Number(data.x),
      y: Number(data.y),
      z: Number(data.z ?? 0),
      radius: Number(data.radius ?? 100)
    });
    setShowMapSelector(false);
  });

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (isVisible && ['Escape'].includes(e.code)) {
        fetchNui('closeUI');
        setIsVisible(false);
      }
    }
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [isVisible]);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [priority, setPriority] = useState<'low' | 'high'>('high');
  const [passportId, setPassportId] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('0');
  const [durationType, setDurationType] = useState('Hours');
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [selectedZone, setSelectedZone] = useState<{ x: number, y: number, z: number, radius: number } | null>(null);

  const [monitors, setMonitors] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const defaultSettings = {
    globalTracking: true,
    officerNotifications: true,
    autoRemoveOnJail: false,
    webhookLogs: '',
    webhookAlerts: '',
    primaryColor: 'blue',
    language: 'en',
    logo: null as string | null
  };

  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('rossmonitor_settings');
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);
      return { ...defaultSettings, ...parsed, logo: parsed?.logo ?? null };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    const color = settings.primaryColor === 'red' ? '#ef4444' : '#135bec';
    document.documentElement.style.setProperty('--color-primary', color);
  }, [settings.primaryColor]);

  useEffect(() => {
    if (isNui || !settings.globalTracking) return;

    const interval = setInterval(() => {
      setMonitors(prev => prev.map(m => ({
        ...m,
        x: Math.max(5, Math.min(95, m.x + (Math.random() - 0.5) * 1.5)),
        y: Math.max(5, Math.min(95, m.y + (Math.random() - 0.5) * 1.5)),
        stability: Math.max(85, Math.min(100, m.stability + (Math.random() - 0.5) * 4))
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, [isNui, settings.globalTracking]);

  const addLog = (action: string, player: string, cid: string, reason: string) => {
    const newLog = {
      id: Date.now(),
      dateTime: new Date().toISOString().replace('T', ' ').split('.')[0],
      officer: 'Sgt. J. Miller',
      badge: '#1024',
      action,
      player,
      cid,
      initials: player.split(' ').map(n => n[0]).join(''),
      reason
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const resetRegisterForm = () => {
    setPassportId('');
    setReason('');
    setDuration('0');
    setSelectedZone(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportId || !reason) return;

    const durationNumber = Math.max(0, parseFloat(duration || '0'));
    const durationHours = durationType === 'Weeks'
      ? Math.round(durationNumber * 24 * 7)
      : durationType === 'Days'
        ? Math.round(durationNumber * 24)
        : Math.round(durationNumber);

    const zoneRadius = selectedZone?.radius ?? 100;
    const response = await fetchNui('applyMonitor', {
      id: passportId,
      duration: durationHours,
      zone: {
        x: selectedZone?.x ?? 0,
        y: selectedZone?.y ?? 0,
        z: selectedZone?.z ?? 0,
        radius: zoneRadius,
        type: 'circle'
      },
      reason
    });

    if (response?.mock) {
      const newMonitor = {
        id: passportId,
        name: `ID: ${passportId}`,
        age: null,
        status: 'Active',
        battery: 100,
        location: 'Active',
        priority: priority === 'high' ? 'High' : 'Low',
        stability: 100,
        x: 50,
        y: 50,
        zone: selectedZone,
        avatar: `https://picsum.photos/seed/${passportId}/100/100`
      };

      setMonitors(prev => [...prev, newMonitor]);
      addLog('APPLIED', newMonitor.name, newMonitor.id, reason);
    }
    
    resetRegisterForm();
    setActiveTab('track');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md text-white">
      <div className="w-[1280px] h-[820px] max-w-[96vw] max-h-[92vh] bg-background-dark rounded-2xl border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.85)] overflow-hidden flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} settings={settings} />
        
        <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
        {/* Background Decoration */}
        <div className="fixed top-0 right-0 p-8 opacity-5 pointer-events-none select-none z-0">
          <Shield size={240} className="text-white" />
        </div>

        <Header activeTab={activeTab} settings={settings} />

        {activeTab === 'dashboard' && <Dashboard monitors={monitors} logs={logs} settings={settings} officers={officers} />}

        {activeTab === 'register' && (
          <div className="p-8 max-w-5xl w-full mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                <PlusCircle className="text-primary" size={32} />
                {translations[settings.language as keyof typeof translations].emsSystem}
              </h3>
              <p className="text-white mt-1">{translations[settings.language as keyof typeof translations].submitRequest}</p>
            </motion.div>

            {/* Main Form Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-panel-dark rounded-xl border border-border-dark p-8 shadow-2xl"
            >
              <form className="space-y-8" onSubmit={handleRegister}>
                {/* Section 1: Subject Identification */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="size-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">01</span>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300">{translations[settings.language as keyof typeof translations].subjectInfo}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">{translations[settings.language as keyof typeof translations].passportId}</label>
                      <div className="relative flex items-center">
                        <input 
                          value={passportId}
                          onChange={(e) => setPassportId(e.target.value)}
                          className="w-full bg-input-dark border-border-dark rounded-lg focus:ring-primary focus:border-primary text-white py-3 pl-4 pr-12 placeholder:text-white/60 outline-none transition-all" 
                          placeholder="e.g. 10243" 
                          type="text"
                          required
                        />
                        <button type="button" className="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-md transition-colors">
                          <Search size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-1 opacity-60">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">{translations[settings.language as keyof typeof translations].playerName}</label>
                      <input 
                        className="w-full bg-slate-900/50 border-border-dark/50 rounded-lg text-white py-3 px-4 cursor-not-allowed outline-none" 
                        readOnly 
                        type="text" 
                        value="John 'Soap' MacTavish"
                      />
                    </div>
                    <div className="md:col-span-1 opacity-60">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">{translations[settings.language as keyof typeof translations].age}</label>
                      <input 
                        className="w-full bg-slate-900/50 border-border-dark/50 rounded-lg text-white py-3 px-4 cursor-not-allowed outline-none" 
                        readOnly 
                        type="text" 
                        value={`34 ${translations[settings.language as keyof typeof translations].yearsOld}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-border-dark"></div>

                {/* Section 2: Case Details */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="size-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">02</span>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300">{translations[settings.language as keyof typeof translations].issuanceDetails}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">{translations[settings.language as keyof typeof translations].reasonIssuance}</label>
                      <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-input-dark border-border-dark rounded-lg focus:ring-primary focus:border-primary text-white p-4 placeholder:text-white/60 resize-none outline-none transition-all" 
                        placeholder={translations[settings.language as keyof typeof translations].provideLegal} 
                        rows={5}
                        required
                      />
                      <p className="text-[10px] text-white mt-2 italic font-medium tracking-tight">{translations[settings.language as keyof typeof translations].requiredAudit}</p>
                    </div>
                    <div className="md:col-span-1 flex flex-col gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">{translations[settings.language as keyof typeof translations].monDuration}</label>
                        <div className="flex items-center bg-input-dark border border-border-dark rounded-lg focus-within:border-primary overflow-hidden transition-all">
                          <input 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-white py-3 px-4 outline-none" 
                            placeholder="0" 
                            type="number"
                          />
                          <select 
                            value={durationType}
                            onChange={(e) => setDurationType(e.target.value)}
                            className="bg-white/5 border-none focus:ring-0 text-white text-xs font-bold uppercase py-3 pr-8 cursor-pointer border-l border-border-dark outline-none"
                          >
                            <option>{translations[settings.language as keyof typeof translations].hours}</option>
                            <option>{translations[settings.language as keyof typeof translations].days}</option>
                            <option>{translations[settings.language as keyof typeof translations].weeks}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">{translations[settings.language as keyof typeof translations].priorityLevel}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => setPriority('low')}
                            className={cn(
                              "border py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                              priority === 'low' 
                                ? "border-primary bg-primary/10 text-primary" 
                                : "border-border-dark text-white hover:border-primary hover:text-white"
                            )}
                            type="button"
                          >
                            {translations[settings.language as keyof typeof translations].lowRisk}
                          </button>
                          <button 
                            onClick={() => setPriority('high')}
                            className={cn(
                              "border py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                              priority === 'high' 
                                ? "border-police-red bg-police-red/10 text-police-red" 
                                : "border-border-dark text-white hover:border-police-red hover:text-white"
                            )}
                            type="button"
                          >
                            {translations[settings.language as keyof typeof translations].highRisk}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 03 Monitoring Zone */}
                <div className="flex items-center gap-2 mb-6 mt-8 border-t border-border-dark pt-8">
                  <span className="size-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">03</span>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300">{translations[settings.language as keyof typeof translations].monitoringZone}</h4>
                </div>
                
                <div className="mb-8">
                  {selectedZone ? (
                    <div className="flex items-center justify-between gap-4 bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white uppercase tracking-wider">{translations[settings.language as keyof typeof translations].zoneDefined}</h5>
                          <p className="text-xs text-white font-mono">
                            X: {selectedZone.x.toFixed(2)} | Y: {selectedZone.y.toFixed(2)} | R: {selectedZone.radius}m
                          </p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowMapSelector(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider transition-all"
                      >
                        {translations[settings.language as keyof typeof translations].editZone}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 bg-slate-800/30 border border-white/5 p-4 rounded-lg border-dashed group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-white/5 group-hover:bg-primary/10 flex items-center justify-center text-white group-hover:text-primary transition-colors">
                          <Target size={20} />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white group-hover:text-primary transition-colors uppercase tracking-wider">{translations[settings.language as keyof typeof translations].noZoneSelected}</h5>
                          <p className="text-xs text-white">
                            {translations[settings.language as keyof typeof translations].globalMonitoringDefault}
                          </p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowMapSelector(true)}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded text-[10px] font-bold text-primary uppercase tracking-wider transition-all flex items-center gap-2"
                      >
                        <MapPin size={14} />
                        {translations[settings.language as keyof typeof translations].selectZone}
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border-dark">
                  <button 
                    onClick={() => {
                      resetRegisterForm();
                      setActiveTab('dashboard');
                    }}
                    className="px-8 py-3 rounded-lg font-bold text-white hover:text-white hover:bg-white/5 transition-all uppercase text-xs tracking-widest" 
                    type="button"
                  >
                    {translations[settings.language as keyof typeof translations].cancel}
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-3 bg-primary hover:bg-blue-600 rounded-lg font-bold text-white shadow-xl shadow-primary/30 transition-all flex items-center gap-2 uppercase text-xs tracking-widest" 
                    type="submit"
                  >
                    <CheckCircle size={18} />
                    {translations[settings.language as keyof typeof translations].confirmReg}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Footer Meta */}
            <div className="mt-6 flex justify-between items-center text-[10px] text-white font-medium uppercase tracking-widest">
              <div className="flex items-center gap-4">
                <span>{translations[settings.language as keyof typeof translations].server}: San Andreas RP #1</span>
                <span>•</span>
                <span>{translations[settings.language as keyof typeof translations].version}: 2.4.0-Stable</span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Shield size={12} />
                <span>{translations[settings.language as keyof typeof translations].securedAccess}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'track' && <TrackDevices monitors={monitors} setMonitors={setMonitors} onLogAction={addLog} settings={settings} />}

        {activeTab === 'logs' && <ArchiveLogs logs={logs} settings={settings} />}

        {activeTab === 'settings' && <SystemSettings settings={settings} setSettings={setSettings} />}

        {activeTab === 'access' && <UserAccess settings={settings} officers={officers} setOfficers={setOfficers} logs={logs} />}
        </main>

        {showMapSelector && (
          <MapSelector 
            onClose={() => setShowMapSelector(false)}
            initialRadius={selectedZone?.radius}
            language={settings.language}
          />
        )}
      </div>
    </div>
  );
}
