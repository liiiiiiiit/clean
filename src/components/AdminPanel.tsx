import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Search,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Save,
  Users,
  Shield,
  FileText,
  Key,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  Inbox,
  SlidersHorizontal,
  Home,
  Building2,
  Store,
  Sparkle,
  Printer,
  CalendarDays,
  BarChart3,
  Layers,
  CheckCircle,
  X,
  Filter,
  ArrowUpDown,
  Compass,
  Briefcase,
  DollarSign,
  Tag,
  RefreshCw,
} from 'lucide-react';
import type { BookingStatus, ServiceType, StoredBooking } from '../types.ts';
import {
  deleteStoredBooking,
  generateBookingsCSV,
  getStoredBookings,
  saveNewBooking,
  updateBookingInternalNotes,
  updateBookingStatus,
} from '../utils/bookingStorage.ts';
import {
  changeAdminPassword,
  getAdminCredentials,
  isAdminSessionActive,
  resetToDefaultPassword,
  setAdminSession,
  verifyAdminLogin,
} from '../utils/authStorage.ts';
import { formatAMD, SERVICE_RATES } from '../utils/calculator.ts';
import { getAvatarColor, getInitials, getTimeAgo } from '../utils/formatters.ts';

interface AdminPanelProps {
  onBackToWebsite: () => void;
}

type AdminTab = 'requests' | 'analytics' | 'dispatch' | 'security';
type ViewMode = 'split' | 'table';

const STATUS_METADATA: Record<
  BookingStatus,
  {
    label: string;
    stepNumber: number;
    badgeClass: string;
    dotClass: string;
    bgSoft: string;
    borderSoft: string;
    textClass: string;
  }
> = {
  new: {
    label: 'New / Pending',
    stepNumber: 1,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/90',
    dotClass: 'bg-amber-500',
    bgSoft: 'bg-amber-500/10',
    borderSoft: 'border-amber-500/30',
    textClass: 'text-amber-700',
  },
  confirmed: {
    label: 'Confirmed',
    stepNumber: 2,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/90',
    dotClass: 'bg-sky-500',
    bgSoft: 'bg-sky-500/10',
    borderSoft: 'border-sky-500/30',
    textClass: 'text-sky-700',
  },
  in_progress: {
    label: 'In Progress',
    stepNumber: 3,
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/90',
    dotClass: 'bg-indigo-500',
    bgSoft: 'bg-indigo-500/10',
    borderSoft: 'border-indigo-500/30',
    textClass: 'text-indigo-700',
  },
  completed: {
    label: 'Completed',
    stepNumber: 4,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
    dotClass: 'bg-emerald-500',
    bgSoft: 'bg-emerald-500/10',
    borderSoft: 'border-emerald-500/30',
    textClass: 'text-emerald-700',
  },
  cancelled: {
    label: 'Cancelled',
    stepNumber: 0,
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/90',
    dotClass: 'bg-rose-500',
    bgSoft: 'bg-rose-500/10',
    borderSoft: 'border-rose-500/30',
    textClass: 'text-rose-700',
  },
};

const SERVICE_INFO: Record<
  ServiceType,
  { title: string; armenian: string; icon: React.FC<{ className?: string }> }
> = {
  home: { title: 'Home Cleaning', armenian: 'Տների մաքրում', icon: Home },
  office: { title: 'Office Cleaning', armenian: 'Գրասենյակների մաքրում', icon: Building2 },
  commercial: { title: 'Commercial Premises', armenian: 'Առևտրային տարածքներ', icon: Store },
  deep_dryclean: { title: 'Deep & Chemical Dry Cleaning', armenian: 'Քիմմաքրում', icon: Sparkle },
};

const ADD_ON_NAMES: Record<string, string> = {
  windows: 'Window Deep Washing (+6,000 ֏)',
  appliances: 'Oven & Refrigerator Interior (+8,000 ֏)',
  balcony: 'Balcony / Terrace Scrub (+5,000 ֏)',
  sofa_dryclean: 'Sofa Fabric Chemical Extraction (+12,000 ֏)',
  eco_disinfect: 'Full Anti-Allergen Disinfection (+7,000 ֏)',
};

const QUICK_DISPATCH_TAGS = [
  'Team Alpha Assigned',
  'Team Beta Assigned',
  'Kärcher Steam Extractor',
  'Eco Detergents Packed',
  'Keys at Concierge',
  'Call 30m Before Arrival',
  'Invoice Requested',
];

const YEREVAN_DISTRICTS = [
  'All Districts',
  'Kentron',
  'Arabkir',
  'Davtashen',
  'Nor Nork',
  'Malatia-Sebastia',
  'Ajapnyak',
  'Kanaker-Zeytun',
  'Shengavit',
  'Outside Yerevan / Region',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToWebsite }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isAdminSessionActive());
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('requests');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Bookings list state
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'>('date_desc');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Dispatch / Internal Notes state
  const [currentStaffNotes, setCurrentStaffNotes] = useState('');
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  // Password management state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showChangePasswords, setShowChangePasswords] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showJobSlipModal, setShowJobSlipModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppLanguage, setWhatsAppLanguage] = useState<'hy' | 'ru' | 'en'>('ru');

  // Manual Booking form state
  const [manualForm, setManualForm] = useState({
    fullName: '',
    phoneNumber: '+374 ',
    serviceType: 'home' as ServiceType,
    areaSqM: 80,
    date: new Date().toISOString().slice(0, 10),
    timeSlot: 'morning',
    district: 'Kentron',
    addressDetails: '',
    notes: '',
    addOns: [] as string[],
  });

  // Load bookings
  useEffect(() => {
    if (isLoggedIn) {
      const list = getStoredBookings();
      setBookings(list);
      if (list.length > 0 && !selectedBookingId) {
        setSelectedBookingId(list[0].id);
        setCurrentStaffNotes(list[0].internalNotes || '');
      }
    }
  }, [isLoggedIn]);

  // Selected booking lookup
  const selectedBooking = useMemo(() => {
    return bookings.find((b) => b.id === selectedBookingId) || bookings[0] || null;
  }, [bookings, selectedBookingId]);

  useEffect(() => {
    if (selectedBooking) {
      setCurrentStaffNotes(selectedBooking.internalNotes || '');
    }
  }, [selectedBookingId]);

  // Auth Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminLogin(loginPassword)) {
      setAdminSession(true);
      setIsLoggedIn(true);
      setLoginError('');
      setLoginPassword('');
    } else {
      setLoginError('Incorrect password. Default access password is: shine2026');
    }
  };

  const handleFillDemoPassword = () => {
    setLoginPassword('shine2026');
    setLoginError('');
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsLoggedIn(false);
    setLoginPassword('');
  };

  // Password Change Handler
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeStatus({
        success: false,
        message: 'New password and confirmation do not match.',
      });
      return;
    }

    if (newPasswordInput.length < 4) {
      setPasswordChangeStatus({
        success: false,
        message: 'Password must be at least 4 characters.',
      });
      return;
    }

    const res = changeAdminPassword(currentPasswordInput, newPasswordInput);
    if (res.success) {
      setPasswordChangeStatus({
        success: true,
        message: 'Password successfully updated! Keep your new password secure for future logins.',
      });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } else {
      setPasswordChangeStatus({
        success: false,
        message: res.error || 'Failed to update password.',
      });
    }
  };

  const handleResetPassword = () => {
    if (window.confirm('Reset admin password to default "shine2026"?')) {
      resetToDefaultPassword();
      setPasswordChangeStatus({
        success: true,
        message: 'Password restored to default: shine2026',
      });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1600);
  };

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
  };

  const handleSaveInternalNotes = () => {
    if (!selectedBooking) return;
    const updated = updateBookingInternalNotes(selectedBooking.id, currentStaffNotes);
    setBookings(updated);
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2000);
  };

  const handleAppendDispatchTag = (tag: string) => {
    const separator = currentStaffNotes ? ', ' : '';
    const newNotes = currentStaffNotes.includes(tag)
      ? currentStaffNotes
      : `${currentStaffNotes}${separator}${tag}`;
    setCurrentStaffNotes(newNotes);
    if (selectedBooking) {
      const updated = updateBookingInternalNotes(selectedBooking.id, newNotes);
      setBookings(updated);
      setNotesSavedNotice(true);
      setTimeout(() => setNotesSavedNotice(false), 1500);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this booking request?')) {
      const updated = deleteStoredBooking(id);
      setBookings(updated);
      if (selectedBookingId === id && updated.length > 0) {
        setSelectedBookingId(updated[0].id);
      }
    }
  };

  const handleExportCSV = () => {
    const csv = generateBookingsCSV(bookings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shine-cleaning-requests-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.phoneNumber.trim()) return;

    const rate = SERVICE_RATES[manualForm.serviceType]?.ratePerSqM || 450;
    const estimated = Math.max(manualForm.areaSqM * rate, 18000);

    const fullAddress = `${manualForm.district}, ${manualForm.addressDetails || 'Yerevan'}`;

    const saved = saveNewBooking({
      fullName: manualForm.fullName,
      phoneNumber: manualForm.phoneNumber,
      serviceType: manualForm.serviceType,
      areaSqM: manualForm.areaSqM,
      date: manualForm.date,
      timeSlot: manualForm.timeSlot,
      address: fullAddress,
      notes: manualForm.notes,
      addOns: manualForm.addOns,
      estimatedPriceAMD: estimated,
    });

    const refreshed = getStoredBookings();
    setBookings(refreshed);
    setSelectedBookingId(saved.id);
    setShowManualModal(false);
    setManualForm({
      fullName: '',
      phoneNumber: '+374 ',
      serviceType: 'home',
      areaSqM: 80,
      date: new Date().toISOString().slice(0, 10),
      timeSlot: 'morning',
      district: 'Kentron',
      addressDetails: '',
      notes: '',
      addOns: [],
    });
  };

  // Filtered & Sorted Requests
  const filteredBookings = useMemo(() => {
    let list = bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.fullName.toLowerCase().includes(q) ||
        b.phoneNumber.includes(q) ||
        b.refNumber.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.notes.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesService = serviceFilter === 'all' || b.serviceType === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });

    return list.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'price_desc') {
        return (b.estimatedPriceAMD || 0) - (a.estimatedPriceAMD || 0);
      }
      if (sortBy === 'price_asc') {
        return (a.estimatedPriceAMD || 0) - (b.estimatedPriceAMD || 0);
      }
      return 0;
    });
  }, [bookings, searchQuery, statusFilter, serviceFilter, sortBy]);

  // KPI calculations
  const totalRevenue = useMemo(
    () => bookings.reduce((sum, b) => sum + (b.estimatedPriceAMD || 0), 0),
    [bookings]
  );
  const newRequestsCount = useMemo(
    () => bookings.filter((b) => b.status === 'new').length,
    [bookings]
  );
  const confirmedCount = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed').length,
    [bookings]
  );
  const completedCount = useMemo(
    () => bookings.filter((b) => b.status === 'completed').length,
    [bookings]
  );

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPasswordInput) return 0;
    let score = 0;
    if (newPasswordInput.length >= 4) score += 25;
    if (newPasswordInput.length >= 8) score += 25;
    if (/[0-9]/.test(newPasswordInput)) score += 25;
    if (/[A-Z]/.test(newPasswordInput) || /[^A-Za-z0-9]/.test(newPasswordInput)) score += 25;
    return score;
  }, [newPasswordInput]);

  // WhatsApp Pre-filled message generator
  const getWhatsAppMessage = (b: StoredBooking, lang: 'hy' | 'ru' | 'en') => {
    const srvName = SERVICE_INFO[b.serviceType]?.armenian || b.serviceType;
    if (lang === 'hy') {
      return `Բարև Ձեզ, հարգելի ${b.fullName}։ Ձեզ հետ կապ է հաստատում «Shine Cleaning»-ի պատասխանատու Իրինան (+374 77 442554)։ Մենք ստացել ենք Ձեր մաքրման հայտը (#${b.refNumber}) ${b.areaSqM} քմ տարածքի համար (${srvName})։ Ցանկանում ենք ճշտել հարմար ժամը և մանրամասները։`;
    }
    if (lang === 'ru') {
      return `Здравствуйте, уважаемый(ая) ${b.fullName}! С вами связывается Ирина из «Shine Cleaning» (+374 77 442554) по поводу вашей заявки на уборку #${b.refNumber} (${b.areaSqM} кв.м) в Ереване. Хотим подтвердить удобное для вас время.`;
    }
    return `Hello ${b.fullName}! This is Irina from Shine Cleaning Armenia (+374 77 442554) regarding your cleaning request #${b.refNumber} (${b.areaSqM} m²). We'd like to confirm the scheduled arrival time and details.`;
  };

  /* =========================================================================
     1. MODERN LOGIN SCREEN
     ========================================================================= */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        {/* Modern ambient illumination grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-400/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-9 relative z-10 space-y-6">
          {/* Logo & Brand Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-amber-300 text-white shadow-xl shadow-sky-600/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1.5">
                <Shield className="w-3 h-3 text-sky-600" />
                <span>Authorized Staff Portal</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Shine Operations
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Customer Inquiries & Dispatch Management · Yerevan, Armenia
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="admin"
                  disabled
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/70 px-2 py-0.5 rounded">
                  System
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <span className="text-[11px] text-sky-600 font-medium">Irina & Team</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-3 pr-11 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 active:scale-[0.99] shadow-lg shadow-sky-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Dispatch Dashboard</span>
            </button>
          </form>

          {/* Quick Credential Card with 1-Click Fill Demo Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-slate-200/90 text-xs text-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-slate-900">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Initial Staff Access:</span>
              </span>
              <button
                type="button"
                onClick={handleFillDemoPassword}
                className="px-2.5 py-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors cursor-pointer"
              >
                Auto-Fill shine2026
              </button>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span>Password:</span>
              <code className="font-mono font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                shine2026
              </code>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              You can easily update or personalize this password anytime inside the security tab.
            </p>
          </div>

          {/* Back button */}
          <div className="text-center pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. MODERN AUTHORIZED DASHBOARD
     ========================================================================= */
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Sleek Enterprise Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Brand & Website Return */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
              <span>Public Website</span>
            </button>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-amber-300 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-white tracking-tight">Shine Cleaning</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-sky-400 font-semibold">Admin Workspace</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Irina Active (+374 77 442554)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Requests</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'requests'
                    ? 'bg-sky-700 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {bookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dispatch')}
              className={`px-3 py-1.5 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dispatch'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Security</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Phone Booking</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Download full CSV archive"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-slate-800 transition-colors cursor-pointer"
              title="Log Out Admin"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* =========================================================================
           TAB 1: REQUESTS PIPELINE
           ========================================================================= */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Top KPI Ribbon (Modern Glass Style) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Total Inquiries</span>
                  <Inbox className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-1.5">
                  {bookings.length}
                </div>
                <span className="text-[11px] text-slate-400">All registered web & phone</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-500/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <span>New / Pending</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums mt-1.5">
                  {newRequestsCount}
                </div>
                <span className="text-[11px] text-amber-400/80 font-medium">Requires Irina’s callback</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-sky-500/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <span>Confirmed</span>
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-sky-300 tabular-nums mt-1.5">
                  {confirmedCount}
                </div>
                <span className="text-[11px] text-sky-400/80">Scheduled cleaning jobs</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span>Gross Pipeline</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums mt-1.5">
                  {formatAMD(totalRevenue)}
                </div>
                <span className="text-[11px] text-emerald-400/80">Estimated value (AMD)</span>
              </div>
            </div>

            {/* Filter and View Mode Switcher Header */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 sm:p-4 space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Field */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search client name, Armenian telephone (+374), address, ref..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode & Sorter */}
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setViewMode('split')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        viewMode === 'split'
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Split View (Feed + Dossier)"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Split View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        viewMode === 'table'
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Table View (Full Grid)"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table Grid</span>
                    </button>
                  </div>

                  {/* Sorter */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-950/80 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="price_desc">Highest Price (AMD)</option>
                    <option value="price_asc">Lowest Price (AMD)</option>
                  </select>
                </div>
              </div>

              {/* Status & Service Quick Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {(['all', 'new', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map(
                    (stKey) => {
                      const count =
                        stKey === 'all'
                          ? bookings.length
                          : bookings.filter((b) => b.status === stKey).length;
                      const isSelected = statusFilter === stKey;

                      return (
                        <button
                          key={stKey}
                          type="button"
                          onClick={() => setStatusFilter(stKey)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-white text-slate-900 border-white shadow-xs'
                              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {stKey !== 'all' && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                STATUS_METADATA[stKey as BookingStatus]?.dotClass || 'bg-slate-400'
                              }`}
                            />
                          )}
                          <span>
                            {stKey === 'all'
                              ? 'All Statuses'
                              : STATUS_METADATA[stKey as BookingStatus]?.label.split(' ')[0]}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                              isSelected
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-3 py-1 rounded-xl border border-slate-800 bg-slate-950/80 text-xs font-medium text-slate-300 focus:outline-none"
                  >
                    <option value="all">All Services</option>
                    <option value="home">Home Cleaning (Տների)</option>
                    <option value="office">Office Cleaning (Գրասենյակներ)</option>
                    <option value="commercial">Commercial Premises (Առևտրային)</option>
                    <option value="deep_dryclean">Deep Dry Clean (Քիմմաքրում)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* VIEW MODE A: MODERN MASTER-DETAIL SPLIT */}
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Filterable Feed (5 Columns) */}
                <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Request Queue ({filteredBookings.length})
                    </span>
                    <span className="text-[11px] text-slate-500">Click card to inspect</span>
                  </div>

                  <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-16 text-slate-500 text-xs bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                        <Inbox className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                        <p className="font-bold text-slate-300">No matching requests found</p>
                        <p className="text-[11px] text-slate-500 mt-1">Try resetting the search or status filter</p>
                      </div>
                    ) : (
                      filteredBookings.map((b) => {
                        const isSelected = selectedBooking?.id === b.id;
                        const st = STATUS_METADATA[b.status] || STATUS_METADATA.new;
                        const palette = getAvatarColor(b.fullName);
                        const initials = getInitials(b.fullName);
                        const timeAgo = getTimeAgo(b.createdAt);
                        const srv = SERVICE_INFO[b.serviceType];
                        const SrvIcon = srv?.icon || Home;

                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBookingId(b.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group ${
                              isSelected
                                ? 'border-sky-500 bg-sky-950/30 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500'
                                : 'border-slate-800/90 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80'
                            }`}
                          >
                            {/* Card Top: Ref + Time + Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-black text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/80">
                                  {b.refNumber}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {timeAgo}
                                </span>
                              </div>

                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${st.badgeClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${st.dotClass}`} />
                                <span>{st.label}</span>
                              </span>
                            </div>

                            {/* Card Body: Customer Profile */}
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl ${palette.bg} ${palette.text} font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}
                              >
                                {initials}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                                  {b.fullName}
                                </div>
                                <div className="text-xs text-sky-400 font-mono mt-0.5">
                                  {b.phoneNumber}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-emerald-400 tabular-nums block">
                                  {formatAMD(b.estimatedPriceAMD || 0)}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {b.areaSqM} m²
                                </span>
                              </div>
                            </div>

                            {/* Card Bottom: Address & Service */}
                            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                              <span className="truncate max-w-[210px] flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{b.address || 'Yerevan, Armenia'}</span>
                              </span>
                              <span className="text-slate-300 font-medium flex items-center gap-1 truncate max-w-[140px]">
                                <SrvIcon className="w-3 h-3 text-sky-400 shrink-0" />
                                <span>{srv?.title || b.serviceType}</span>
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Full Modern Customer Dossier (7 Columns) */}
                <div className="lg:col-span-7 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6">
                  {selectedBooking ? (
                    <>
                      {/* Dossier Header with Reference & Direct Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-sky-300 bg-sky-950 px-2.5 py-1 rounded-lg border border-sky-800">
                              {selectedBooking.refNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedBooking.refNumber, 'ref')}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                              title="Copy Reference"
                            >
                              {copiedField === 'ref' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="text-xs text-slate-400">
                              Logged on {new Date(selectedBooking.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Top Action Pills: Print Job Slip & Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowJobSlipModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                            title="Generate Printable Work Order"
                          >
                            <Printer className="w-3.5 h-3.5 text-sky-400" />
                            <span>Work Order</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(selectedBooking.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Interactive 4-Step Visual Progress Stepper */}
                      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                          <span>Request Lifecycle Stage</span>
                          <span className="text-sky-400 font-bold">
                            Current: {STATUS_METADATA[selectedBooking.status]?.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {(['new', 'confirmed', 'in_progress', 'completed'] as BookingStatus[]).map(
                            (stKey, index) => {
                              const meta = STATUS_METADATA[stKey];
                              const isActive = selectedBooking.status === stKey;
                              const isPast =
                                meta.stepNumber <=
                                (STATUS_METADATA[selectedBooking.status]?.stepNumber || 0);

                              return (
                                <button
                                  key={stKey}
                                  type="button"
                                  onClick={() => handleStatusChange(selectedBooking.id, stKey)}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                                    isActive
                                      ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                                      : isPast
                                      ? 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-600'
                                      : 'bg-slate-950 text-slate-500 border-slate-800/80 hover:bg-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold opacity-75">
                                      0{index + 1}
                                    </span>
                                    {isPast && (
                                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    )}
                                  </div>
                                  <span className="text-xs font-bold truncate">
                                    {meta.label.split(' ')[0]}
                                  </span>
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Customer Identity Hero Card with Direct Call & WhatsApp */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-14 h-14 rounded-2xl ${
                              getAvatarColor(selectedBooking.fullName).bg
                            } ${
                              getAvatarColor(selectedBooking.fullName).text
                            } font-black text-lg flex items-center justify-center shadow-md`}
                          >
                            {getInitials(selectedBooking.fullName)}
                          </div>

                          <div>
                            <div className="text-lg font-black text-white">
                              {selectedBooking.fullName}
                            </div>
                            <div className="text-xs text-sky-400 font-mono font-bold flex items-center gap-2 mt-0.5">
                              <span>{selectedBooking.phoneNumber}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedBooking.phoneNumber, 'phone')}
                                className="text-slate-400 hover:text-white cursor-pointer"
                                title="Copy Phone"
                              >
                                {copiedField === 'phone' ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Immediate Communication Buttons */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${selectedBooking.phoneNumber}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Client</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setShowWhatsAppModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>

                      {/* Section 1: Customer Coordinate Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>Location & Coordinates</span>
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              selectedBooking.address || 'Yerevan'
                            )}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                          >
                            <span>Open in Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                          <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{selectedBooking.address || 'Yerevan, Armenia'}</span>
                        </div>
                      </div>

                      {/* Section 2: Service Scope & Financial Breakdown */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                          <span>Service Scope & Price Breakdown</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Service Type
                            </span>
                            <div className="font-bold text-white mt-1 truncate">
                              {SERVICE_INFO[selectedBooking.serviceType]?.title ||
                                selectedBooking.serviceType}
                            </div>
                            <div className="text-[11px] text-sky-400">
                              {SERVICE_INFO[selectedBooking.serviceType]?.armenian}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Area Space
                            </span>
                            <div className="text-base font-black text-sky-400 tabular-nums mt-1">
                              {selectedBooking.areaSqM} m²
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {SERVICE_RATES[selectedBooking.serviceType]?.ratePerSqM} ֏/m²
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Target Date
                            </span>
                            <div className="font-bold text-white mt-1 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-sky-400" />
                              <span>{selectedBooking.date || 'To Be Arranged'}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {selectedBooking.timeSlot || 'Morning window'}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Total (AMD)
                            </span>
                            <div className="text-base font-black text-emerald-400 tabular-nums mt-1">
                              {formatAMD(selectedBooking.estimatedPriceAMD || 0)}
                            </div>
                            <div className="text-[11px] text-emerald-500 font-medium">Estimated quote</div>
                          </div>
                        </div>

                        {/* Add-on pills */}
                        {selectedBooking.addOns && selectedBooking.addOns.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              Add-On Service Extras ({selectedBooking.addOns.length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedBooking.addOns.map((addonId) => (
                                <span
                                  key={addonId}
                                  className="inline-block px-2.5 py-1 text-xs font-semibold bg-sky-950 border border-sky-800 text-sky-300 rounded-lg"
                                >
                                  {ADD_ON_NAMES[addonId] || addonId}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Customer Notes */}
                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Client Special Requests & Access Notes
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                            {selectedBooking.notes
                              ? `“${selectedBooking.notes}”`
                              : 'No special instructions provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Section 3: Staff & Dispatch Internal Notes */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="staff-notes-field"
                            className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Staff & Crew Dispatch Notes</span>
                          </label>
                          {notesSavedNotice && (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Notes saved!</span>
                            </span>
                          )}
                        </div>

                        {/* Quick Preset Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_DISPATCH_TAGS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleAppendDispatchTag(tag)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>

                        <textarea
                          id="staff-notes-field"
                          rows={3}
                          value={currentStaffNotes}
                          onChange={(e) => setCurrentStaffNotes(e.target.value)}
                          placeholder="Log dispatch notes (e.g. Assigned Team 1, bring Kärcher steam cleaner, client confirmed arrival at 11:00 AM)..."
                          className="w-full p-3.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                        />

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveInternalNotes}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shadow-md shadow-sky-600/20"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Dispatch Notes</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-28 text-slate-500">
                      <Inbox className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                      <p className="text-sm font-bold text-slate-300">No request selected</p>
                      <p className="text-xs text-slate-500 mt-1">Select an item from the left queue to view details.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* VIEW MODE B: MODERN ENTERPRISE TABLE GRID */
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                    <span>All Inquiries Table ({filteredBookings.length} records)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Click row or action button</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Ref #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Area</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Price (AMD)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredBookings.map((b) => {
                        const st = STATUS_METADATA[b.status] || STATUS_METADATA.new;
                        const srv = SERVICE_INFO[b.serviceType];
                        const SrvIcon = srv?.icon || Home;

                        return (
                          <tr
                            key={b.id}
                            className="hover:bg-slate-800/40 transition-colors group"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                              {b.refNumber}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              {b.fullName}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-sky-400">
                              {b.phoneNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <SrvIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                <span>{srv?.title || b.serviceType}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 tabular-nums">
                              {b.areaSqM} m²
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                              {b.date || 'TBD'}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400 tabular-nums whitespace-nowrap">
                              {formatAMD(b.estimatedPriceAMD || 0)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={b.status}
                                onChange={(e) =>
                                  handleStatusChange(b.id, e.target.value as BookingStatus)
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold border bg-slate-950 focus:outline-none cursor-pointer ${st.textClass} ${st.borderSoft}`}
                              >
                                <option value="new">New / Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`tel:${b.phoneNumber}`}
                                  className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
                                  title="Call Client"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBookingId(b.id);
                                    setShowWhatsAppModal(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBookingId(b.id);
                                    setViewMode('split');
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="View Full Dossier"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
           TAB 2: ANALYTICS & REVENUE PERFORMANCE
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Operations Intelligence</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Business Performance & Revenue Metrics
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time pipeline breakdown across residential, corporate, and deep dry cleaning jobs.
                </p>
              </div>

              {/* Service Distribution Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Service Volume Distribution
                  </h3>
                  {(['home', 'office', 'commercial', 'deep_dryclean'] as ServiceType[]).map((st) => {
                    const count = bookings.filter((b) => b.serviceType === st).length;
                    const percent = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
                    const srv = SERVICE_INFO[st];

                    return (
                      <div key={st} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{srv?.title}</span>
                          <span className="text-slate-400 font-mono">
                            {count} requests ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-amber-300 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Status Funnel Breakdown
                  </h3>
                  {(['new', 'confirmed', 'in_progress', 'completed'] as BookingStatus[]).map((st) => {
                    const count = bookings.filter((b) => b.status === st).length;
                    const meta = STATUS_METADATA[st];
                    const percent = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;

                    return (
                      <div key={st} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                            <span>{meta.label}</span>
                          </span>
                          <span className="text-slate-400 font-mono">
                            {count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${meta.dotClass}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yerevan District Activity */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Top Armenian Service Hubs (Yerevan & Surrounds)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Center</span>
                    <div className="text-base font-bold text-white mt-0.5">Kentron</div>
                    <span className="text-[11px] text-sky-400">High residential & offices</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">North</span>
                    <div className="text-base font-bold text-white mt-0.5">Arabkir</div>
                    <span className="text-[11px] text-sky-400">Regular recurring homes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">North-West</span>
                    <div className="text-base font-bold text-white mt-0.5">Davtashen</div>
                    <span className="text-[11px] text-sky-400">Deep steam dry cleaning</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">East</span>
                    <div className="text-base font-bold text-white mt-0.5">Nor Nork</div>
                    <span className="text-[11px] text-sky-400">Commercial & apartments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 3: SCHEDULE & DISPATCH CALENDAR
           ========================================================================= */}
        {activeTab === 'dispatch' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>Crew Dispatch Schedule</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Cleaning Appointments Timeline
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule New Job</span>
                  </button>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-3">
                {bookings.map((b) => {
                  const st = STATUS_METADATA[b.status] || STATUS_METADATA.new;
                  const srv = SERVICE_INFO[b.serviceType];
                  const SrvIcon = srv?.icon || Home;

                  return (
                    <div
                      key={b.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shrink-0 text-sky-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[10px] font-mono font-bold mt-0.5">
                            {b.date ? b.date.slice(5) : 'TBD'}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{b.fullName}</span>
                            <span className="text-xs text-sky-400 font-mono">({b.phoneNumber})</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeClass}`}
                            >
                              {st.label}
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-slate-300">
                              <SrvIcon className="w-3.5 h-3.5 text-sky-400" />
                              <span>{srv?.title}</span>
                            </span>
                            <span>•</span>
                            <span className="tabular-nums">{b.areaSqM} m²</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{b.timeSlot || 'Morning window'}</span>
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{b.address || 'Yerevan, Armenia'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <a
                          href={`tel:${b.phoneNumber}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-sky-400" />
                          <span>Call</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBookingId(b.id);
                            setShowJobSlipModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-xs font-bold text-sky-300 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Slip</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
           TAB 4: SECURITY & CREDENTIALS
           ========================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Shield className="w-4 h-4" />
                  <span>Security & Credentials</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Admin Password Settings
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Change the password protecting customer inquiries and dispatch contact information.
                </p>
              </div>

              {passwordChangeStatus && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in ${
                    passwordChangeStatus.success
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {passwordChangeStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Current Password *
                  </label>
                  <input
                    type={showChangePasswords ? 'text' : 'password'}
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    New Password *
                  </label>
                  <input
                    type={showChangePasswords ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password (min. 4 characters)"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  {/* Password strength bar */}
                  {newPasswordInput && (
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 25
                              ? 'bg-rose-500 w-1/4'
                              : passwordStrength <= 50
                              ? 'bg-amber-500 w-2/4'
                              : passwordStrength <= 75
                              ? 'bg-sky-500 w-3/4'
                              : 'bg-emerald-500 w-full'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {passwordStrength <= 25
                          ? 'Weak password'
                          : passwordStrength <= 50
                          ? 'Moderate password'
                          : passwordStrength <= 75
                          ? 'Good password'
                          : 'Strong password'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    type={showChangePasswords ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={showChangePasswords}
                      onChange={() => setShowChangePasswords(!showChangePasswords)}
                      className="rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
                    />
                    <span>Show plain text passwords</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    Restore default (shine2026)
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] shadow-lg shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply & Save New Password</span>
                  </button>
                </div>
              </form>

              {/* Security info footer */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Session Security Status:</span>
                </div>
                <p>Admin session is isolated and active. Passwords are saved persistently in browser storage.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
         MODAL 1: NEW PHONE BOOKING ENTRY
         ========================================================================= */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Log New Phone Booking</h3>
                <span className="text-xs text-sky-400">Coordinator: Irina (+374 77 442554)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.fullName}
                  onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                  placeholder="e.g. Suren Harutyunyan"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.phoneNumber}
                    onChange={(e) => setManualForm({ ...manualForm, phoneNumber: e.target.value })}
                    placeholder="+374 91 XXXXXX"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Service Type</label>
                  <select
                    value={manualForm.serviceType}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, serviceType: e.target.value as ServiceType })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="home">Home Cleaning (Տների)</option>
                    <option value="office">Office Cleaning (Գրասենյակ)</option>
                    <option value="commercial">Commercial Premises (Առևտրային)</option>
                    <option value="deep_dryclean">Deep Dry Clean (Քիմմաքրում)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Area Size (m²)</label>
                  <input
                    type="number"
                    value={manualForm.areaSqM}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, areaSqM: Number(e.target.value) || 20 })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Yerevan District</label>
                  <select
                    value={manualForm.district}
                    onChange={(e) => setManualForm({ ...manualForm, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {YEREVAN_DISTRICTS.filter((d) => d !== 'All Districts').map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Address Details</label>
                  <input
                    type="text"
                    value={manualForm.addressDetails}
                    onChange={(e) => setManualForm({ ...manualForm, addressDetails: e.target.value })}
                    placeholder="e.g. Komitas Ave 24, Apt 18"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Special Client Notes</label>
                <textarea
                  rows={2}
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  placeholder="Special chemical preferences, pet notes, access codes..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl cursor-pointer shadow-md shadow-sky-600/25"
                >
                  Save Booking Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 2: PRINTABLE WORK ORDER / DISPATCH TICKET
         ========================================================================= */}
      {showJobSlipModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 sm:p-8 space-y-5 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Shine Cleaning · Work Order Slip
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operations Dispatch Sheet · Yerevan (+374 77 442554)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJobSlipModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Work Order Ref</span>
                  <div className="text-base font-mono font-black text-sky-800">
                    {selectedBooking.refNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Date</span>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedBooking.date || 'To be confirmed'} ({selectedBooking.timeSlot || 'Morning'})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Client Name</span>
                  <div className="text-sm font-bold text-slate-900">{selectedBooking.fullName}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Direct Contact</span>
                  <div className="text-sm font-bold text-sky-700">{selectedBooking.phoneNumber}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Service Location</span>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">
                  {selectedBooking.address || 'Yerevan, Armenia'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Service</span>
                  <div className="font-bold text-slate-900">
                    {SERVICE_INFO[selectedBooking.serviceType]?.title}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Area</span>
                  <div className="font-bold text-slate-900">{selectedBooking.areaSqM} m²</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</span>
                  <div className="font-black text-emerald-700">
                    {formatAMD(selectedBooking.estimatedPriceAMD || 0)}
                  </div>
                </div>
              </div>

              {/* Equipment Checklist for Crew */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Required Equipment Checklist for Crew:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 font-medium">
                  <div>☑ Kärcher Professional Vacuum</div>
                  <div>☑ Microfiber Sets & Glass Cloths</div>
                  <div>☑ Eco Hypoallergenic Detergents</div>
                  <div>☑ Extension Rods & Squeegees</div>
                </div>
              </div>

              {/* Client Notes */}
              {selectedBooking.notes && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                    Customer Note:
                  </span>
                  <p className="italic text-slate-700">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Supervisor: Irina (+374 77 442554)</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer shadow-sm inline-flex items-center gap-1.5 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowJobSlipModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 3: WHATSAPP DIRECT MESSAGE ASSISTANT
         ========================================================================= */}
      {showWhatsAppModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Send WhatsApp to Client</h3>
                  <span className="text-xs text-slate-400">{selectedBooking.fullName} ({selectedBooking.phoneNumber})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Message Language:</span>
              <div className="flex gap-1.5">
                {(['hy', 'ru', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setWhatsAppLanguage(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      whatsAppLanguage === lang
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'hy' ? 'Հայերեն' : lang === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              {getWhatsAppMessage(selectedBooking, whatsAppLanguage)}
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <a
                href={`https://wa.me/${selectedBooking.phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  getWhatsAppMessage(selectedBooking, whatsAppLanguage)
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
