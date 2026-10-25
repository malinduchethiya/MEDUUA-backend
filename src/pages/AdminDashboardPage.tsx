import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Settings,
  Menu,
  Bell,
  Search,
  Plus,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  LogIn,
  LogOut,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../data/defaultData';
import { PageRoute } from '../components/Layout';
import { BOOTSTRAPPED_ADMIN_EMAIL } from '../firebase';

interface AdminDashboardPageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'services'
  | 'media'
  | 'inquiries'
  | 'pages'
  | 'settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    projects,
    inquiries,
    user,
    isAdmin,
    signInAdmin,
    signOutAdmin,
    saveProject,
    deleteProject,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.categorySubtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenAdd = () => {
    const newProject: ProjectItem = {
      id: `project-${Date.now()}`,
      title: '',
      cardTitle: '',
      slug: '',
      category: 'Mobile App',
      categorySubtitle: 'Mobile App | Development',
      client: 'MEDUUA Client',
      year: '2024',
      shortDescription: '',
      overview: '',
      challenge: '',
      solution: '',
      technologies: ['Kotlin', 'Android Native'],
      features: ['Modern UI', 'Performance'],
      screenshotUrl: '/assets/extracted/project_whiteroom.png',
      liveUrl: '',
      featured: true,
      order: projects.length + 1,
      status: 'Published',
      date: 'Oct 24, 2024',
      updatedAt: new Date().toISOString(),
    };
    setEditingProject(newProject);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (proj: ProjectItem) => {
    setEditingProject({ ...proj });
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      setStatusMessage(
        isAdmin
          ? 'Project deleted from Firebase Firestore.'
          : 'Project removed from preview session.'
      );
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    try {
      const slugVal =
        editingProject.slug ||
        editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      await saveProject({
        ...editingProject,
        slug: slugVal,
        updatedAt: new Date().toISOString(),
      });
      setIsEditorOpen(false);
      setStatusMessage(
        isAdmin
          ? 'Project saved and synced to Firebase Cloud Firestore.'
          : 'Project saved to preview session. (Sign in with admin account to sync to Cloud)'
      );
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage('Failed to save project. Ensure Firestore rules are deployed.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Mobile App':
        return 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]';
      case 'Web Platform':
        return 'bg-[#ede9fe] text-[#7c3aed] border-[#ddd6fe]';
      case 'Streaming':
        return 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]';
      default:
        return 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#16a34a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            Published
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef3c7] text-[#d97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
            In Progress
          </span>
        );
      case 'Planning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            Planning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#111715] flex flex-col lg:flex-row">
      {/* 08A — Left Dark Green Sidebar matching Screen 08 */}
      <aside className="w-full lg:w-64 bg-[#0a1310] text-[#f5f2eb] border-r border-[#1a2822] flex flex-col justify-between shrink-0 relative overflow-hidden">
        {/* Background architectural aura */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/admin_sidebar_bg.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1310]/90 via-[#0a1310]/95 to-[#0a1310] pointer-events-none" />

        <div className="p-6 relative z-10 space-y-8">
          {/* Top Logo and Hamburger */}
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xl font-bold tracking-[0.2em] uppercase text-[#f5f2eb] hover:text-[#c9a66b] transition-colors"
              >
                MEDUUA
              </button>
              <p className="text-[9px] tracking-[0.2em] uppercase text-[#94a3b8] font-mono-tabular">
                Digital Development Studio
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              title="Return to Public Site"
              className="p-1.5 text-[#94a3b8] hover:text-white rounded border border-[#1f2e27]"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/60 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Services</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries</span>
              </div>
              {inquiries.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#c9a66b] text-[#0b1210] font-bold">
                  {inquiries.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Studio Motto matching Screen 08 */}
        <div className="p-6 relative z-10 border-t border-[#1b2b24] space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-serif-editorial text-[#f5f2eb] leading-tight">
              Create Extraordinary Digital Experiences.
            </p>
            <div className="w-8 h-[1px] bg-[#c9a66b] my-2" />
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#f5f2eb]">
              MEDUUA
            </p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-[#64748b]">
              Digital Development Studio
            </p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-[#64748b]">Sri Lanka</p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-[11px] text-[#c9a66b] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Website</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 08B — Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching Screen 08 */}
        <header className="bg-white border-b border-[#e5dfd3] px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, media, pages..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8f6f0] border border-[#e2dcd0] rounded-xl text-xs sm:text-sm text-[#111715] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#c9a66b]"
            />
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin Cloud Status Badge */}
            {isAdmin ? (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                Cloud Synced
              </span>
            ) : (
              <button
                type="button"
                onClick={signInAdmin}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] hover:bg-[#fde68a] transition-colors cursor-pointer"
                title="Sign in with admin Google account"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign in for Cloud Sync</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#f8f6f0] border border-[#e2dcd0] flex items-center justify-center text-[#64748b] hover:text-[#111715]"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 border-2 border-white" />
            </div>

            {/* User Profile Dropdown matching Screen 08 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#f8f6f0] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#111715] text-[#f5f2eb] font-bold text-xs flex items-center justify-center">
                  N
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#111715]">Naveen Silva</p>
                  <p className="text-[10px] text-[#64748b]">
                    {isAdmin ? 'Admin' : 'Guest Admin'}
                  </p>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e5dfd3] rounded-xl shadow-xl py-2 z-30">
                  <div className="px-4 py-2 border-b border-[#f1ece1] text-xs">
                    <p className="font-bold text-[#111715]">Naveen Silva</p>
                    <p className="text-[11px] text-[#64748b]">
                      {user ? user.email : BOOTSTRAPPED_ADMIN_EMAIL}
                    </p>
                  </div>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => {
                        signOutAdmin();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        signInAdmin();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#111715] hover:bg-[#f8f6f0] flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Authenticate with Google</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Status Toast */}
        {statusMessage && (
          <div className="m-6 p-4 bg-[#102b25] text-[#f5f2eb] rounded-xl flex items-center gap-3 border border-[#c9a66b]/40 shadow-lg text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#c9a66b]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 08C — Main Content Page */}
        <main className="p-6 lg:p-8 space-y-8 flex-1">
          {activeTab === 'inquiries' ? (
            /* Inquiries View */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                  <span>Customer Leads</span>
                </div>
                <h1 className="font-serif-editorial text-3xl font-bold text-[#111715]">
                  Inquiries ({inquiries.length})
                </h1>
                <p className="text-xs text-[#64748b]">
                  Messages submitted via the contact form and WhatsApp channels.
                </p>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#e5dfd3] rounded-2xl space-y-2">
                  <p className="font-serif-editorial text-lg text-[#111715]">No inquiries yet</p>
                  <p className="text-xs text-[#64748b]">
                    Submissions from the public Contact page will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 bg-white border border-[#e5dfd3] rounded-2xl space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-[#111715]">{inq.name}</h3>
                          <p className="text-xs text-[#64748b]">
                            {inq.email} · {inq.phone}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f5f2eb] text-[#102b25]">
                          {inq.packageInterest}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#334155] bg-[#f8f6f0] p-4 rounded-xl border border-[#e2dcd0]">
                        {inq.message}
                      </p>
                      <div className="flex justify-between items-center text-[11px] text-[#94a3b8]">
                        <span>Budget: {inq.budget || 'Not specified'}</span>
                        <span>{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Projects Table View matching Screen 08 */
            <div className="space-y-6">
              {/* Projects Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                    <span>Projects</span>
                    <span className="w-8 h-[1px] bg-[#64748b]/40" />
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#111715]">
                    Projects
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b] max-w-2xl leading-relaxed">
                    Manage and organize your digital projects. Add new projects, update content,
                    manage media and keep your portfolio up to date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl hover:bg-[#d8b77e] transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Filters Bar matching Screen 08 */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#111715] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#c9a66b]"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#475569] font-medium focus:outline-none focus:border-[#c9a66b]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web Platform">Web Platform</option>
                    <option value="Streaming">Streaming</option>
                  </select>

                  {/* Status Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#475569] font-medium focus:outline-none focus:border-[#c9a66b]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>

                {/* Sort control */}
                <button
                  type="button"
                  className="px-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs font-medium text-[#475569] flex items-center gap-1.5 hover:text-[#111715]"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort by</span>
                </button>
              </div>

              {/* Table Card matching Screen 08 */}
              <div className="bg-white border border-[#e5dfd3] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fcfaf7] border-b border-[#e5dfd3] text-[#64748b] font-semibold">
                      <tr>
                        <th className="py-3.5 pl-6 pr-3 w-10">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              selectedIds.length === filteredProjects.length &&
                              filteredProjects.length > 0
                            }
                            className="rounded border-[#d6cfc0] text-[#c9a66b] focus:ring-[#c9a66b]"
                          />
                        </th>
                        <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                          Project
                        </th>
                        <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                          Category
                        </th>
                        <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                          Status
                        </th>
                        <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                          Last Updated
                        </th>
                        <th className="py-3.5 pr-6 pl-4 font-bold uppercase tracking-wider text-[11px] text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1ece1]">
                      {filteredProjects.map((p) => {
                        const isSelected = selectedIds.includes(p.id);

                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-[#fcfaf7] transition-colors ${
                              isSelected ? 'bg-[#f8f6f0]' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 pl-6 pr-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(p.id)}
                                className="rounded border-[#d6cfc0] text-[#c9a66b] focus:ring-[#c9a66b]"
                              />
                            </td>

                            {/* Project Thumb & Title */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3.5 min-w-[240px]">
                                <div className="w-16 h-10 rounded-lg overflow-hidden bg-[#0c1613] border border-[#d6cfc0] shrink-0">
                                  <img
                                    src={p.screenshotUrl}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-[#111715] hover:text-[#c9a66b] cursor-pointer">
                                    {p.cardTitle || p.title}
                                  </p>
                                  <p className="text-[11px] text-[#64748b]">
                                    {p.categorySubtitle}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category Badge */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getCategoryBadgeClass(
                                  p.category
                                )}`}
                              >
                                {p.category}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {getStatusBadge(p.status)}
                            </td>

                            {/* Last Updated */}
                            <td className="py-4 px-4 text-[11px] text-[#64748b] whitespace-nowrap">
                              <p className="font-medium text-[#111715]">{p.date}</p>
                              <p className="text-[10px]">Updated recently</p>
                            </td>

                            {/* Actions */}
                            <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5 text-[#64748b]">
                                <button
                                  type="button"
                                  onClick={() => onNavigate('case-study', p.slug)}
                                  title="View Public Page"
                                  className="p-1.5 rounded-lg hover:text-[#111715] hover:bg-[#f1ece1] transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(p)}
                                  title="Edit Project"
                                  className="p-1.5 rounded-lg hover:text-[#111715] hover:bg-[#f1ece1] transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(p.id)}
                                  title="Delete Project"
                                  className="p-1.5 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="More Options"
                                  className="p-1.5 rounded-lg hover:text-[#111715] hover:bg-[#f1ece1] transition-colors"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer & Pagination matching Screen 08 */}
                <div className="px-6 py-4 border-t border-[#e5dfd3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
                  <p>
                    Showing 1 to {filteredProjects.length} of {projects.length} projects
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled
                      className="w-8 h-8 rounded-lg border border-[#e2dcd0] flex items-center justify-center text-[#94a3b8] disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg bg-[#c9a66b] text-[#0b1210] font-bold flex items-center justify-center text-xs"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="w-8 h-8 rounded-lg border border-[#e2dcd0] flex items-center justify-center text-[#94a3b8] disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit / Add Project Modal */}
      {isEditorOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e5dfd3] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f1ece1] pb-4">
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                  {editingProject.title ? `Edit ${editingProject.title}` : 'Add New Project'}
                </h2>
                <p className="text-xs text-[#64748b]">
                  {isAdmin
                    ? 'Signed in as verified admin — changes sync to Cloud Firestore.'
                    : 'Guest Admin mode — changes save in this session. Sign in to sync live to Cloud Firestore.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-[#64748b] hover:text-[#111715]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    placeholder="e.g. WHITE ROOM: THE PROTOCOL"
                    required
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  >
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web Platform">Web Platform</option>
                    <option value="Streaming">Streaming</option>
                    <option value="Websites">Websites</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Subtitle / Spec</label>
                  <input
                    type="text"
                    value={editingProject.categorySubtitle}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        categorySubtitle: e.target.value,
                      })
                    }
                    placeholder="e.g. Mobile App | Psychological Experience"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  >
                    <option value="Published">Published</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProject.shortDescription}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Screenshot URL</label>
                <input
                  type="text"
                  value={editingProject.screenshotUrl}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      screenshotUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#f1ece1]">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-[#d6cfc0] rounded-lg text-[#64748b] hover:text-[#111715]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c9a66b] text-[#0b1210] font-bold rounded-lg hover:bg-[#d8b77e] flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
