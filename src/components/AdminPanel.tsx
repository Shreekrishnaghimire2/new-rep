import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileDown,
  RefreshCw,
  Eye,
  EyeOff,
  MessageSquare,
  ChevronRight,
  X,
  FileText,
  Mail,
  Calendar,
  Layers,
  ArrowLeft,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { Language, AdminInquiry, InquiryStatus, PageId } from '../types';
import { translations } from '../translations';

interface AdminPanelProps {
  lang: Language;
  onNavigateHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ lang, onNavigateHome }) => {
  const t = translations[lang];

  // Auth States
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('skg_admin_token');
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('skg_admin_user');
    } catch {
      return null;
    }
  });

  // Login Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data States
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    received: 0,
    in_review: 0,
    contacted: 0,
    completed: 0,
    archived: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');

  // Detail & Management Drawer
  const [activeInquiry, setActiveInquiry] = useState<AdminInquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [drawerNotification, setDrawerNotification] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Verify token on mount or token change
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        setLoginError('Session expired. Please sign in again.');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
        setStats(data.stats);
      } else {
        setFetchError(data.error || 'Failed to load inquiries.');
      }
    } catch (err) {
      setFetchError('Unable to connect to admin API service.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both username and password/PIN.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Invalid credentials.');
      } else {
        setToken(data.token);
        setAdminUser(data.username);
        try {
          localStorage.setItem('skg_admin_token', data.token);
          localStorage.setItem('skg_admin_user', data.username);
        } catch (err) {
          console.warn('LocalStorage error:', err);
        }
      }
    } catch (err) {
      setLoginError('Network error connecting to auth server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    setToken(null);
    setAdminUser(null);
    setActiveInquiry(null);
    try {
      localStorage.removeItem('skg_admin_token');
      localStorage.removeItem('skg_admin_user');
    } catch {}
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: InquiryStatus) => {
    if (!token) return;
    setIsUpdatingStatus(true);
    setDrawerNotification(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(inquiryId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success && data.inquiry) {
        // Update local state
        setInquiries((prev) =>
          prev.map((i) => (i.id === data.inquiry.id ? data.inquiry : i))
        );
        setActiveInquiry(data.inquiry);
        // Refresh stats
        fetchAdminData();
        setDrawerNotification(`${t.admin.statusUpdated} → ${newStatus.toUpperCase()}`);
        setTimeout(() => setDrawerNotification(null), 3000);
      }
    } catch (err) {
      setDrawerNotification('Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeInquiry || !newNoteText.trim()) return;

    setIsSavingNote(true);
    setDrawerNotification(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(activeInquiry.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noteText: newNoteText.trim() }),
      });

      const data = await res.json();
      if (data.success && data.inquiry) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === data.inquiry.id ? data.inquiry : i))
        );
        setActiveInquiry(data.inquiry);
        setNewNoteText('');
        setDrawerNotification(t.admin.noteAdded);
        setTimeout(() => setDrawerNotification(null), 3000);
      }
    } catch (err) {
      setDrawerNotification('Failed to save note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to permanently delete inquiry ${inquiryId}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(inquiryId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== inquiryId));
        setActiveInquiry(null);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to delete inquiry.');
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'Service', 'Budget', 'Timeline', 'Status', 'SubmittedAt', 'Description', 'NotesCount'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      `"${(i.serviceCategory || '').replace(/"/g, '""')}"`,
      `"${(i.budgetRange || '').replace(/"/g, '""')}"`,
      `"${(i.expectedTimeline || '').replace(/"/g, '""')}"`,
      i.status,
      i.submittedAt,
      `"${i.description.replace(/"/g, '""')}"`,
      i.notes ? i.notes.length : 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skg_inquiries_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (inquiries.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(inquiries, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `skg_inquiries_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      inquiry.name.toLowerCase().includes(query) ||
      inquiry.email.toLowerCase().includes(query) ||
      inquiry.id.toLowerCase().includes(query) ||
      (inquiry.serviceCategory && inquiry.serviceCategory.toLowerCase().includes(query)) ||
      inquiry.description.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'received':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            RECEIVED
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
            IN REVIEW
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono bg-blue-950/80 text-blue-300 border border-blue-500/40">
            CONTACTED
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            COMPLETED
          </span>
        );
      case 'archived':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono bg-slate-900 text-slate-400 border border-slate-700">
            ARCHIVED
          </span>
        );
      default:
        return null;
    }
  };

  // 1. RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!token) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto animate-in fade-in duration-200">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="SKG Enterprises"
            className="w-14 h-14 mx-auto object-contain rounded-xl border border-cyan-400/40 mb-3 shadow-lg"
          />
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {t.admin.loginTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {t.admin.loginSubtitle}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1B32] border border-cyan-500/25 shadow-2xl">
          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-start gap-2 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {t.admin.usernameLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {t.admin.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Preset Credentials Button for development */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('admin');
                  setPasswordInput('skg@admin2026');
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 focus-visible:outline-none focus-visible:underline"
              >
                <span>Autofill Default Dev Credentials (admin / skg@admin2026)</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.admin.loggingIn}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.admin.loginBtn}</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 mt-6 border-t border-slate-800 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER AUTHENTICATED DASHBOARD
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Top Admin Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-[#FFAA18]" />
            <span>SKG ENTERPRISES · ADMIN PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Inquiry Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="text-xs text-slate-400 mr-2 hidden lg:block">
            Signed in as <span className="font-semibold text-white font-mono">{adminUser}</span>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isLoadingData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={inquiries.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.admin.exportCsv}</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={inquiries.length === 0}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <span>{t.admin.exportJson}</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 text-xs font-semibold transition-colors ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.logoutBtn}</span>
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center justify-between gap-3 mb-6">
          <span>{fetchError}</span>
          <button
            onClick={fetchAdminData}
            className="px-2 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: t.admin.stats.total, count: stats.total, color: 'text-white', filter: 'all' as const },
          { label: t.admin.stats.received, count: stats.received, color: 'text-cyan-400', filter: 'received' as const },
          { label: t.admin.stats.in_review, count: stats.in_review, color: 'text-amber-400', filter: 'in_review' as const },
          { label: t.admin.stats.contacted, count: stats.contacted, color: 'text-blue-400', filter: 'contacted' as const },
          { label: t.admin.stats.completed, count: stats.completed, color: 'text-emerald-400', filter: 'completed' as const },
          { label: t.admin.stats.archived, count: stats.archived, color: 'text-slate-400', filter: 'archived' as const },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => setStatusFilter(item.filter)}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === item.filter
                ? 'bg-slate-900 border-cyan-400/80 shadow-md shadow-cyan-950/20'
                : 'bg-[#0B1B32] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 mb-1">{item.label}</div>
            <div className={`text-2xl font-mono font-extrabold ${item.color}`}>
              {item.count}
            </div>
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.admin.searchPlaceholder}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'received', 'in_review', 'contacted', 'completed', 'archived'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st === 'all' ? t.admin.allStatuses : st.replace('_', ' ').toUpperCase()}
              </button>
            )
          )}
        </div>
      </div>

      {/* Inquiries Table / List */}
      {filteredInquiries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B1B32] border border-slate-800 text-slate-400">
          <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium">{t.admin.noInquiries}</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-cyan-400 underline mt-2"
            >
              Clear search query
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-5 rounded-2xl bg-[#0B1B32] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {inquiry.id}
                  </span>
                  {getStatusBadge(inquiry.status)}
                  {inquiry.notes && inquiry.notes.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      <MessageSquare className="w-3 h-3" />
                      <span>{inquiry.notes.length} notes</span>
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">
                    {new Date(inquiry.submittedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {inquiry.name}
                  </h3>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>{inquiry.email}</span>
                  </a>
                  {inquiry.serviceCategory && (
                    <span className="text-xs font-medium text-slate-300 bg-slate-900 px-2 py-0.5 rounded">
                      {inquiry.serviceCategory}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {inquiry.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <button
                  onClick={() => {
                    setActiveInquiry(inquiry);
                    setDrawerNotification(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Manage & Notes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL, STATUS CHANGER & NOTES DRAWER / MODAL */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0B1B32] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveInquiry(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Notification Banner */}
            {drawerNotification && (
              <div className="mb-4 p-3 rounded-xl bg-cyan-950/80 border border-cyan-400 text-xs font-semibold text-cyan-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{drawerNotification}</span>
              </div>
            )}

            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {activeInquiry.id}
                  </span>
                  <button
                    onClick={() => handleCopyId(activeInquiry.id)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Copy ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {getStatusBadge(activeInquiry.status)}
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {activeInquiry.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <a
                  href={`mailto:${activeInquiry.email}`}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeInquiry.email}</span>
                </a>
                <span aria-hidden="true">·</span>
                <span>Submitted: {new Date(activeInquiry.submittedAt).toLocaleString()}</span>
                {activeInquiry.clientIp && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">IP: {activeInquiry.clientIp}</span>
                  </>
                )}
              </div>
            </div>

            {/* Section 1: ONE-CLICK STATUS CHANGER */}
            <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block mb-2.5">
                {t.admin.changeStatus}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['received', 'in_review', 'contacted', 'completed', 'archived'] as const).map(
                  (st) => {
                    const isCurrent = activeInquiry.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(activeInquiry.id, st)}
                        disabled={isUpdatingStatus}
                        className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40 ring-1 ring-white/20'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {st.replace('_', ' ').toUpperCase()}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Section 2: PROJECT SPECIFICATIONS */}
            <div className="mb-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Client Project Requirements
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {activeInquiry.description}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Service Category</div>
                  <div className="font-medium text-white mt-0.5">
                    {activeInquiry.serviceCategory || 'Not specified'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Budget Range</div>
                  <div className="font-medium text-[#FFAA18] mt-0.5">
                    {activeInquiry.budgetRange || 'Flexible'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Timeline</div>
                  <div className="font-medium text-cyan-300 mt-0.5">
                    {activeInquiry.expectedTimeline || 'Flexible'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: INTERNAL TEAM NOTES */}
            <div className="mb-6 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFAA18] mb-3">
                <MessageSquare className="w-4 h-4" />
                <span>{t.admin.notesTitle}</span>
              </div>

              {/* Existing Notes List */}
              {activeInquiry.notes && activeInquiry.notes.length > 0 ? (
                <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-1">
                  {activeInquiry.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-cyan-400 font-mono">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic mb-4">
                  No internal notes added yet. Add private notes below to track phone calls or architectural scoping.
                </p>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={t.admin.addNotePlaceholder}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingNote || !newNoteText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] text-white text-xs font-bold disabled:opacity-40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>{isSavingNote ? 'Saving...' : t.admin.addNoteBtn}</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDeleteInquiry(activeInquiry.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                onClick={() => setActiveInquiry(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
