import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Settings,
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
  Copy,
  Check,
  RefreshCw,
  Home,
  Star,
  ExternalLink,
  Mail,
  Phone,
  Sparkles,
  Download,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ProjectItem,
  ServiceItem,
  PricingTierItem,
} from '../data/defaultData';
import { PageRoute } from '../components/Layout';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  getWhatsAppUrl,
  WHATSAPP_NUMBER_DISPLAY,
} from '../firebase';

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

type SortOption = 'order' | 'title' | 'date' | 'status';

interface MediaAsset {
  name: string;
  url: string;
  group: 'Projects' | 'Services' | 'Case Studies' | 'Hero & Banners';
}

const STUDIO_MEDIA_ASSETS: MediaAsset[] = [
  { name: 'White Room Showcase', url: '/assets/extracted/project_whiteroom.png', group: 'Projects' },
  { name: 'White Room Card', url: '/assets/extracted/project_whiteroom_card.png', group: 'Projects' },
  { name: 'Kaisel Studio Showcase', url: '/assets/extracted/project_kaisel.png', group: 'Projects' },
  { name: 'Kaisel Card', url: '/assets/extracted/project_kaisel_card.png', group: 'Projects' },
  { name: 'Sinhala Learning Showcase', url: '/assets/extracted/project_sinhala.png', group: 'Projects' },
  { name: 'Sinhala Card', url: '/assets/extracted/project_sinhala_card.png', group: 'Projects' },
  { name: 'IPTV Player Showcase', url: '/assets/extracted/project_iptv.png', group: 'Projects' },
  { name: 'IPTV Card', url: '/assets/extracted/project_iptv_card.png', group: 'Projects' },
  { name: 'Web Development Service', url: '/assets/extracted/service_web_dev.png', group: 'Services' },
  { name: 'Android Apps Service', url: '/assets/extracted/service_android.png', group: 'Services' },
  { name: 'UI/UX Design Service', url: '/assets/extracted/service_uiux.png', group: 'Services' },
  { name: 'Custom Software Service', url: '/assets/extracted/service_software.png', group: 'Services' },
  { name: 'Full-Stack Service', url: '/assets/extracted/service_fullstack.png', group: 'Services' },
  { name: 'Optimization Service', url: '/assets/extracted/service_optimization.png', group: 'Services' },
  { name: 'Case Study Dual Phones', url: '/assets/extracted/casestudy_dual_phones.png', group: 'Case Studies' },
  { name: 'Case Study Trailer Thumb', url: '/assets/extracted/casestudy_trailer_thumb.png', group: 'Case Studies' },
  { name: 'Case Study Screen 1', url: '/assets/extracted/casestudy_screen1.png', group: 'Case Studies' },
  { name: 'Case Study Screen 2', url: '/assets/extracted/casestudy_screen2.png', group: 'Case Studies' },
  { name: 'Case Study Screen 3', url: '/assets/extracted/casestudy_screen3.png', group: 'Case Studies' },
  { name: 'Case Study Screen 4', url: '/assets/extracted/casestudy_screen4.png', group: 'Case Studies' },
  { name: 'Case Study Screen 5', url: '/assets/extracted/casestudy_screen5.png', group: 'Case Studies' },
  { name: 'Case Study Screen 6', url: '/assets/extracted/casestudy_screen6.png', group: 'Case Studies' },
  { name: 'Hero Devices Showcase', url: '/assets/extracted/hero_devices_showcase.png', group: 'Hero & Banners' },
  { name: 'Home Hero Full', url: '/assets/extracted/home_hero_full.png', group: 'Hero & Banners' },
  { name: 'Services Hero', url: '/assets/extracted/services_hero.png', group: 'Hero & Banners' },
  { name: 'Pricing Hero', url: '/assets/extracted/pricing_hero.png', group: 'Hero & Banners' },
  { name: 'Pricing Custom Banner', url: '/assets/extracted/pricing_custom_banner.png', group: 'Hero & Banners' },
  { name: 'About Hero Full', url: '/assets/extracted/about_hero_full.png', group: 'Hero & Banners' },
  { name: 'About Executive Studio', url: '/assets/extracted/about_executive_studio.png', group: 'Hero & Banners' },
  { name: 'About CTA Banner', url: '/assets/extracted/about_cta_banner.png', group: 'Hero & Banners' },
  { name: 'Contact Hero', url: '/assets/extracted/contact_hero.png', group: 'Hero & Banners' },
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    projects,
    services,
    pricing,
    inquiries,
    user,
    isAdmin,
    signInAdmin,
    signOutAdmin,
    saveProject,
    deleteProject,
    saveService,
    deleteService,
    savePricingTier,
    resetPricingToDefaults,
    resetSinglePricingTier,
    submitInquiry,
    deleteInquiry,
    seedDefaultsToFirestore,
  } = usePortfolio();

  // Navigation & Filters State
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('order');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Selection & Inline Menus State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);

  // Top Header Popovers
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Toast & Busy State
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);

  // Project Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  // Service Editor Modal State
  const [isServiceEditorOpen, setIsServiceEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(null);

  // Pricing Editor Modal State
  const [isPricingEditorOpen, setIsPricingEditorOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<PricingTierItem | null>(null);
  const [pricingFeaturesInput, setPricingFeaturesInput] = useState('');

  // Media Library State
  const [mediaGroupFilter, setMediaGroupFilter] = useState<string>('All');
  const [copiedMediaUrl, setCopiedMediaUrl] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaAsset | null>(null);
  const [assignProjectTargetId, setAssignProjectTargetId] = useState<string>('');

  // Inquiries Modal State
  const [isAddInquiryOpen, setIsAddInquiryOpen] = useState(false);
  const [newInquiryForm, setNewInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    packageInterest: 'Business Package',
    budget: '$1,500 - $3,000',
    message: '',
  });
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState<string | null>(null);

  // Studio Settings State (persisted in localStorage)
  const [studioSettings, setStudioSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('meduua_studio_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return {
      studioName: 'MEDUUA',
      tagline: 'Independent Digital Development Studio — Sri Lanka',
      primaryPage: 'home',
      adminName: 'Naveen Silva',
      contactEmail: BOOTSTRAPPED_ADMIN_EMAIL,
      whatsappDisplay: WHATSAPP_NUMBER_DISPLAY,
      location: 'Colombo, Sri Lanka',
    };
  });

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.cardTitle || '').toLowerCase().includes(q) ||
          p.categorySubtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'date') return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      return (a.order || 0) - (b.order || 0);
    });
  }, [projects, categoryFilter, statusFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const safePageNum = Math.min(currentPageNum, totalPages);
  const paginatedProjects = useMemo(() => {
    const start = (safePageNum - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, safePageNum, pageSize]);

  const cycleSortBy = () => {
    const order: SortOption[] = ['order', 'title', 'status', 'date'];
    const next = order[(order.indexOf(sortBy) + 1) % order.length];
    setSortBy(next);
  };

  const sortLabels: Record<SortOption, string> = {
    order: 'Order (1–16)',
    title: 'Title (A–Z)',
    status: 'Status',
    date: 'Recently Updated',
  };

  // Selection Handlers
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

  // Bulk Actions
  const handleBulkStatusChange = async (newStatus: ProjectItem['status']) => {
    for (const id of selectedIds) {
      const target = projects.find((p) => p.id === id);
      if (target) {
        await saveProject({
          ...target,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        });
      }
    }
    showToast(`Updated ${selectedIds.length} project(s) to "${newStatus}".`);
    setSelectedIds([]);
  };

  const handleBulkDeleteConfirmed = async () => {
    const count = selectedIds.length;
    for (const id of selectedIds) {
      await deleteProject(id);
    }
    setSelectedIds([]);
    setConfirmBulkDelete(false);
    showToast(`Deleted ${count} selected project(s).`);
  };

  // Project CRUD Handlers
  const handleOpenAddProject = () => {
    const newProj: ProjectItem = {
      id: `project-${Date.now()}`,
      title: '',
      cardTitle: '',
      slug: '',
      category: 'Mobile App',
      categorySubtitle: 'Mobile App | Custom Development',
      client: 'MEDUUA Client',
      year: new Date().getFullYear().toString(),
      shortDescription: '',
      overview: '',
      challenge: '',
      solution: '',
      technologies: ['Kotlin', 'Android Native'],
      features: ['Modern UI', 'High Performance'],
      screenshotUrl: '/assets/extracted/project_whiteroom.png',
      liveUrl: '',
      featured: true,
      order: projects.length + 1,
      status: 'Published',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      updatedAt: new Date().toISOString(),
    };
    setEditingProject(newProj);
    setTechInput(newProj.technologies.join(', '));
    setFeaturesInput(newProj.features.join(', '));
    setIsEditorOpen(true);
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
    setEditingProject({ ...proj });
    setTechInput((proj.technologies || []).join(', '));
    setFeaturesInput((proj.features || []).join(', '));
    setIsEditorOpen(true);
    setOpenRowMenuId(null);
  };

  const handleDuplicateProject = async (proj: ProjectItem) => {
    const copy: ProjectItem = {
      ...proj,
      id: `project-${Date.now()}`,
      title: `${proj.title} (Copy)`,
      cardTitle: `${proj.cardTitle || proj.title} (Copy)`,
      slug: `${proj.slug}-copy-${Date.now().toString().slice(-4)}`,
      order: projects.length + 1,
      updatedAt: new Date().toISOString(),
    };
    await saveProject(copy);
    setOpenRowMenuId(null);
    showToast(`Duplicated "${proj.title}".`);
  };

  const handleToggleProjectFeatured = async (proj: ProjectItem) => {
    await saveProject({
      ...proj,
      featured: !proj.featured,
      updatedAt: new Date().toISOString(),
    });
    setOpenRowMenuId(null);
    showToast(
      !proj.featured
        ? `"${proj.title}" marked as Featured.`
        : `"${proj.title}" removed from Featured.`
    );
  };

  const handleQuickStatusChange = async (
    proj: ProjectItem,
    status: ProjectItem['status']
  ) => {
    await saveProject({
      ...proj,
      status,
      updatedAt: new Date().toISOString(),
    });
    setOpenRowMenuId(null);
    showToast(`Updated "${proj.title}" status to ${status}.`);
  };

  const handleDeleteProjectConfirmed = async (id: string) => {
    await deleteProject(id);
    setConfirmDeleteId(null);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast(
      isAdmin
        ? 'Project deleted from Cloud Firestore.'
        : 'Project removed from current session.'
    );
  };

  const handleSaveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    try {
      const slugVal =
        editingProject.slug.trim() ||
        editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const parsedTech = techInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedFeatures = featuresInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await saveProject({
        ...editingProject,
        cardTitle: editingProject.cardTitle?.trim() || editingProject.title.trim(),
        slug: slugVal,
        technologies: parsedTech.length > 0 ? parsedTech : ['TypeScript', 'React'],
        features: parsedFeatures.length > 0 ? parsedFeatures : ['Custom Architecture'],
        updatedAt: new Date().toISOString(),
      });
      setIsEditorOpen(false);
      showToast(
        isAdmin
          ? 'Project saved and synced to Cloud Firestore.'
          : 'Project saved to active portfolio session.'
      );
    } catch {
      showToast('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  // Service CRUD Handlers
  const handleOpenAddService = () => {
    const nextNum = String(services.length + 1).padStart(2, '0');
    const newSvc: ServiceItem = {
      id: `service-${Date.now()}`,
      number: nextNum,
      title: '',
      description: '',
      deliverables: ['Custom Architecture', 'Responsive UI', 'Deployment & QA'],
      iconName: 'Code2',
      imageUrl: '/assets/extracted/service_web_dev.png',
      order: services.length + 1,
      updatedAt: new Date().toISOString(),
    };
    setEditingService(newSvc);
    setDeliverablesInput(newSvc.deliverables.join(', '));
    setIsServiceEditorOpen(true);
  };

  const handleOpenEditService = (svc: ServiceItem) => {
    setEditingService({ ...svc });
    setDeliverablesInput((svc.deliverables || []).join(', '));
    setIsServiceEditorOpen(true);
  };

  const handleSaveServiceModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);
    try {
      const parsedDeliverables = deliverablesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await saveService({
        ...editingService,
        deliverables:
          parsedDeliverables.length > 0 ? parsedDeliverables : ['Full-Cycle Delivery'],
        updatedAt: new Date().toISOString(),
      });
      setIsServiceEditorOpen(false);
      showToast('Service capability saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteServiceConfirmed = async (id: string) => {
    await deleteService(id);
    setConfirmDeleteServiceId(null);
    showToast('Service capability removed.');
  };

  // Pricing CRUD Handlers
  const handleOpenEditPricing = (tier: PricingTierItem) => {
    setEditingPricing({ ...tier });
    setPricingFeaturesInput((tier.features || []).join('\n'));
    setIsPricingEditorOpen(true);
  };

  const handleSavePricingModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricing) return;
    setSaving(true);
    try {
      const parsedFeatures = pricingFeaturesInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      await savePricingTier({
        ...editingPricing,
        features: parsedFeatures.length > 0 ? parsedFeatures : ['Custom Scoping'],
        updatedAt: new Date().toISOString(),
      });
      setIsPricingEditorOpen(false);
      showToast(`Pricing package "${editingPricing.name}" updated.`);
    } finally {
      setSaving(false);
    }
  };

  // Media Handlers
  const handleCopyMediaUrl = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedMediaUrl(url);
    showToast(`Copied asset path: ${url}`);
    setTimeout(() => setCopiedMediaUrl(null), 2500);
  };

  const handleAssignMediaToProject = async (url: string, projectId: string) => {
    if (!projectId) return;
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    await saveProject({
      ...target,
      screenshotUrl: url,
      updatedAt: new Date().toISOString(),
    });
    showToast(`Assigned image to "${target.title}".`);
  };

  // Inquiry Handlers
  const handleAddSampleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiryForm.name || !newInquiryForm.email || !newInquiryForm.message) return;
    setSaving(true);
    try {
      await submitInquiry({
        name: newInquiryForm.name,
        email: newInquiryForm.email,
        phone: newInquiryForm.phone || '+94 78 910 9693',
        packageInterest: newInquiryForm.packageInterest,
        budget: newInquiryForm.budget,
        message: newInquiryForm.message,
      });
      setIsAddInquiryOpen(false);
      setNewInquiryForm({
        name: '',
        email: '',
        phone: '',
        packageInterest: 'Business Package',
        budget: '$1,500 - $3,000',
        message: '',
      });
      showToast('Lead inquiry recorded.');
    } finally {
      setSaving(false);
    }
  };

  // Cloud Sync & Settings Handlers
  const handleSyncCatalogToCloud = async () => {
    setSyncingDefaults(true);
    try {
      await seedDefaultsToFirestore();
      showToast(
        isAdmin
          ? 'All 16 default projects, services, and pricing packages synced to Cloud Firestore!'
          : 'Portfolio catalog refreshed in active session.'
      );
    } finally {
      setSyncingDefaults(false);
    }
  };

  const handleSaveStudioSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('meduua_studio_settings', JSON.stringify(studioSettings));
    } catch {
      // ignore storage quota errors
    }
    showToast('Studio configuration saved.');
  };

  const handleExportPortfolioJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      studio: studioSettings,
      projects,
      services,
      pricing,
      inquiries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meduua-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio JSON backup downloaded.');
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Mobile App':
        return 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]';
      case 'Web Platform':
        return 'bg-[#ede9fe] text-[#7c3aed] border-[#ddd6fe]';
      case 'Streaming':
        return 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]';
      case 'UI/UX':
        return 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]';
      case 'Websites':
        return 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]';
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

  const filteredMediaAssets = useMemo(() => {
    return STUDIO_MEDIA_ASSETS.filter((item) => {
      if (mediaGroupFilter !== 'All' && item.group !== mediaGroupFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.url.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [mediaGroupFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#111715] flex flex-col lg:flex-row">
      {/* 08A — Left Dark Green Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0a1310] text-[#f5f2eb] border-r border-[#1a2822] flex flex-col justify-between shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/admin_sidebar_bg.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1310]/90 via-[#0a1310]/95 to-[#0a1310] pointer-events-none" />

        <div className="p-6 relative z-10 space-y-7">
          {/* Top Logo and Return to Home button */}
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xl font-bold tracking-[0.2em] uppercase text-[#f5f2eb] hover:text-[#c9a66b] transition-colors cursor-pointer"
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
              title="Go to Primary Home Page"
              className="px-2.5 py-1.5 text-[11px] font-semibold text-[#c9a66b] hover:bg-[#15231e] rounded-lg border border-[#1f2e27] flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#15231e] text-[#94a3b8]">
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Services</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#15231e] text-[#94a3b8]">
                {services.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Media</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#15231e] text-[#94a3b8]">
                {STUDIO_MEDIA_ASSETS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#c9a66b] text-[#0b1210] font-bold">
                {inquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Pages &amp; Pricing</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#15231e] text-[#c9a66b] border border-[#c9a66b]/50 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#121d19]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Studio Motto */}
        <div className="p-6 relative z-10 border-t border-[#1b2b24] space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-serif-editorial text-[#f5f2eb] leading-tight">
              Create Extraordinary Digital Experiences.
            </p>
            <div className="w-8 h-[1px] bg-[#c9a66b] my-2" />
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#f5f2eb]">
              {studioSettings.studioName}
            </p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-[#64748b]">
              Digital Development Studio
            </p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-[#64748b]">
              {studioSettings.location}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-[11px] text-[#c9a66b] hover:underline flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Home Page</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 08B — Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#e5dfd3] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              placeholder="Search projects, services, media..."
              className="w-full pl-9 pr-8 py-2 bg-[#f8f6f0] border border-[#e2dcd0] rounded-xl text-xs sm:text-sm text-[#111715] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#c9a66b]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#111715]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Home Link in Top Bar */}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f8f6f0] hover:bg-[#efeae0] text-[#111715] border border-[#e2dcd0] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#c9a66b]" />
              <span>View Live Site</span>
            </button>

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
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] hover:bg-[#fde68a] transition-colors cursor-pointer"
                title="Sign in with admin Google account"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign in for Cloud Sync</span>
              </button>
            )}

            {/* Notification Bell with Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setUserDropdownOpen(false);
                }}
                aria-label="Notifications"
                className="w-9 h-9 rounded-full bg-[#f8f6f0] border border-[#e2dcd0] flex items-center justify-center text-[#64748b] hover:text-[#111715] cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 border-2 border-white" />

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e5dfd3] rounded-2xl shadow-xl py-3 z-30 text-xs">
                  <div className="px-4 pb-2 border-b border-[#f1ece1] flex items-center justify-between">
                    <span className="font-bold text-[#111715]">Studio Activity</span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#94a3b8] hover:text-[#111715]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-[#f1ece1] max-h-64 overflow-y-auto">
                    <div className="px-4 py-2.5 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#111715]">
                          {projects.length} Active Projects
                        </p>
                        <p className="text-[11px] text-[#64748b]">
                          4×4 Home Showcase grid is active.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('projects');
                          setNotificationsOpen(false);
                        }}
                        className="text-[#c9a66b] font-bold hover:underline shrink-0"
                      >
                        Manage
                      </button>
                    </div>
                    <div className="px-4 py-2.5 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#111715]">
                          {inquiries.length} Client Inquiries
                        </p>
                        <p className="text-[11px] text-[#64748b]">
                          {inquiries.length > 0
                            ? `Latest from ${inquiries[0].name}`
                            : 'No unread inquiries right now.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('inquiries');
                          setNotificationsOpen(false);
                        }}
                        className="text-[#c9a66b] font-bold hover:underline shrink-0"
                      >
                        View
                      </button>
                    </div>
                    <div className="px-4 py-2.5 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#111715]">
                          {isAdmin ? 'Cloud Firestore Connected' : 'Local Preview Mode'}
                        </p>
                        <p className="text-[11px] text-[#64748b]">
                          {isAdmin
                            ? 'Changes persist live to Cloud.'
                            : 'Edits apply immediately in session.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('settings');
                          setNotificationsOpen(false);
                        }}
                        className="text-[#c9a66b] font-bold hover:underline shrink-0"
                      >
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#f8f6f0] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#111715] text-[#f5f2eb] font-bold text-xs flex items-center justify-center">
                  {studioSettings.adminName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#111715]">{studioSettings.adminName}</p>
                  <p className="text-[10px] text-[#64748b]">
                    {isAdmin ? 'Verified Admin' : 'Studio Manager'}
                  </p>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-[#e5dfd3] rounded-xl shadow-xl py-2 z-30">
                  <div className="px-4 py-2 border-b border-[#f1ece1] text-xs">
                    <p className="font-bold text-[#111715]">{studioSettings.adminName}</p>
                    <p className="text-[11px] text-[#64748b] truncate">
                      {user ? user.email : BOOTSTRAPPED_ADMIN_EMAIL}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#111715] hover:bg-[#f8f6f0] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>Studio Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('home');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#111715] hover:bg-[#f8f6f0] flex items-center gap-2 cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>Return to Home Page</span>
                  </button>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => {
                        signOutAdmin();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-[#f1ece1] mt-1 pt-2 cursor-pointer"
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
                      className="w-full px-4 py-2 text-left text-xs text-[#111715] hover:bg-[#f8f6f0] flex items-center gap-2 border-t border-[#f1ece1] mt-1 pt-2 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#c9a66b]" />
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
          <div className="mx-6 mt-4 p-3.5 bg-[#102b25] text-[#f5f2eb] rounded-xl flex items-center justify-between gap-3 border border-[#c9a66b]/40 shadow-lg text-xs font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c9a66b] shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-[#94a3b8] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 08C — Main Content Area Switching Across All 7 Admin Tabs */}
        <main className="p-6 lg:p-8 space-y-8 flex-1">
          {/* =====================================================================
              TAB 1: DASHBOARD OVERVIEW
          ===================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                    <span>Executive Overview</span>
                    <span className="w-8 h-[1px] bg-[#64748b]/40" />
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#111715]">
                    Studio Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Real-time overview of your portfolio projects, capabilities, packages, and client inquiries.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenAddProject}
                    className="px-4 py-2.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl hover:bg-[#d8b77e] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncCatalogToCloud}
                    disabled={syncingDefaults}
                    className="px-4 py-2.5 bg-white border border-[#d6cfc0] text-[#111715] text-xs font-semibold rounded-xl hover:border-[#c9a66b] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingDefaults ? 'animate-spin' : ''}`} />
                    <span>{syncingDefaults ? 'Syncing...' : 'Sync Catalog'}</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => setActiveTab('projects')}
                  className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-2 shadow-xs hover:border-[#c9a66b] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Total Projects
                    </span>
                    <FolderGit2 className="w-4 h-4 text-[#c9a66b]" />
                  </div>
                  <p className="font-serif-editorial text-3xl font-bold text-[#111715]">
                    {projects.length}
                  </p>
                  <p className="text-[11px] text-[#16a34a] font-medium">
                    {projects.filter((p) => p.status === 'Published').length} Published in 4×4 Grid
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('services')}
                  className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-2 shadow-xs hover:border-[#c9a66b] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Core Services
                    </span>
                    <Layers className="w-4 h-4 text-[#c9a66b]" />
                  </div>
                  <p className="font-serif-editorial text-3xl font-bold text-[#111715]">
                    {services.length}
                  </p>
                  <p className="text-[11px] text-[#64748b]">
                    Active engineering &amp; design capabilities
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('pages')}
                  className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-2 shadow-xs hover:border-[#c9a66b] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Pricing Packages
                    </span>
                    <FileText className="w-4 h-4 text-[#c9a66b]" />
                  </div>
                  <p className="font-serif-editorial text-3xl font-bold text-[#111715]">
                    {pricing.length}
                  </p>
                  <p className="text-[11px] text-[#64748b]">
                    Starter, Business &amp; Custom tiers
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-2 shadow-xs hover:border-[#c9a66b] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Client Inquiries
                    </span>
                    <MessageSquare className="w-4 h-4 text-[#c9a66b]" />
                  </div>
                  <p className="font-serif-editorial text-3xl font-bold text-[#111715]">
                    {inquiries.length}
                  </p>
                  <p className="text-[11px] text-[#64748b]">
                    Direct leads &amp; WhatsApp requests
                  </p>
                </div>
              </div>

              {/* Recent Projects & Quick Navigation Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Projects */}
                <div className="lg:col-span-8 bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif-editorial text-xl font-bold text-[#111715]">
                        Top Showcase Projects
                      </h2>
                      <p className="text-xs text-[#64748b]">
                        First 6 projects displayed on the primary Home page
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-bold text-[#c9a66b] hover:underline cursor-pointer"
                    >
                      View All ({projects.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-[#f1ece1]">
                    {projects.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        className="py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.screenshotUrl}
                            alt={p.title}
                            className="w-12 h-8 rounded object-cover border border-[#d6cfc0] shrink-0"
                          />
                          <div className="truncate">
                            <p className="font-bold text-[#111715] truncate">
                              {p.cardTitle || p.title}
                            </p>
                            <p className="text-[11px] text-[#64748b] truncate">
                              {p.category} • {p.year}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getStatusBadge(p.status)}
                          <button
                            type="button"
                            onClick={() => handleOpenEditProject(p)}
                            className="p-1.5 rounded-lg hover:bg-[#f8f6f0] text-[#64748b] hover:text-[#111715] cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Page Jump & Category Summary */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-4 shadow-xs">
                    <h2 className="font-serif-editorial text-xl font-bold text-[#111715]">
                      Public Website Pages
                    </h2>
                    <p className="text-xs text-[#64748b]">
                      Home is configured as the primary landing page.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(
                        [
                          { label: 'Home (Primary)', page: 'home' },
                          { label: 'Work / Projects', page: 'projects' },
                          { label: 'Services', page: 'services' },
                          { label: 'Pricing', page: 'pricing' },
                          { label: 'About Studio', page: 'about' },
                          { label: 'Contact', page: 'contact' },
                        ] as { label: string; page: PageRoute }[]
                      ).map((item) => (
                        <button
                          key={item.page}
                          type="button"
                          onClick={() => onNavigate(item.page)}
                          className="px-3 py-2 rounded-xl border border-[#e2dcd0] bg-[#f8f6f0] hover:border-[#c9a66b] text-left font-semibold text-[#111715] flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{item.label}</span>
                          <ExternalLink className="w-3 h-3 text-[#c9a66b] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0e1714] text-[#f5f2eb] border border-[#1f2e27] rounded-2xl p-6 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-[#c9a66b] text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>4×4 Home Showcase Active</span>
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      The Selected Projects section on the primary Home page automatically displays 16 projects arranged in 4 columns and 4 rows.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('home')}
                      className="w-full py-2 bg-[#c9a66b] text-[#0b1210] font-bold text-xs rounded-xl hover:bg-[#d8b77e] transition-colors cursor-pointer"
                    >
                      Inspect Home Page Grid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 2: PROJECTS MANAGER
          ===================================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Projects Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                    <span>Projects</span>
                    <span className="w-8 h-[1px] bg-[#64748b]/40" />
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#111715]">
                    Projects ({projects.length})
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b] max-w-2xl leading-relaxed">
                    Manage and organize your digital projects. Add new projects, update case study content, manage media, and keep your 4×4 Home showcase up to date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProject}
                  className="px-5 py-2.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl hover:bg-[#d8b77e] transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Filters & Sort Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPageNum(1);
                      }}
                      placeholder="Search projects..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#111715] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#c9a66b]"
                    />
                  </div>

                  {/* Category Dropdown (All Categories Included) */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPageNum(1);
                    }}
                    className="px-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#475569] font-medium focus:outline-none focus:border-[#c9a66b] cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web Platform">Web Platform</option>
                    <option value="Streaming">Streaming</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Websites">Websites</option>
                  </select>

                  {/* Status Dropdown (All Statuses Included) */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPageNum(1);
                    }}
                    className="px-3 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#475569] font-medium focus:outline-none focus:border-[#c9a66b] cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Working Sort Control & Page Size */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cycleSortBy}
                    className="px-3.5 py-2 bg-white border border-[#e2dcd0] hover:border-[#c9a66b] rounded-xl text-xs font-medium text-[#111715] flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Click to cycle sort order"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#c9a66b]" />
                    <span>Sort: {sortLabels[sortBy]}</span>
                  </button>

                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPageNum(1);
                    }}
                    className="px-2.5 py-2 bg-white border border-[#e2dcd0] rounded-xl text-xs text-[#475569] font-medium focus:outline-none focus:border-[#c9a66b] cursor-pointer"
                  >
                    <option value={8}>8 / page</option>
                    <option value={16}>16 / page</option>
                    <option value={50}>All ({projects.length})</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions Bar when rows are selected */}
              {selectedIds.length > 0 && (
                <div className="p-3.5 bg-[#102b25] text-[#f5f2eb] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs border border-[#c9a66b]/40">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="px-2 py-0.5 rounded bg-[#c9a66b] text-[#0b1210] font-bold">
                      {selectedIds.length}
                    </span>
                    <span>project(s) selected</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBulkStatusChange('Published')}
                      className="px-3 py-1.5 rounded-lg bg-[#16382e] hover:bg-[#1e4b3e] text-[#f5f2eb] font-medium cursor-pointer"
                    >
                      Set Published
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkStatusChange('Draft')}
                      className="px-3 py-1.5 rounded-lg bg-[#16382e] hover:bg-[#1e4b3e] text-[#f5f2eb] font-medium cursor-pointer"
                    >
                      Set Draft
                    </button>
                    {confirmBulkDelete ? (
                      <div className="flex items-center gap-1.5 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-400">
                        <span className="text-red-200 font-semibold">Confirm delete?</span>
                        <button
                          type="button"
                          onClick={handleBulkDeleteConfirmed}
                          className="px-2 py-0.5 bg-red-600 text-white font-bold rounded cursor-pointer"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmBulkDelete(false)}
                          className="px-2 py-0.5 text-gray-300 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmBulkDelete(true)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-semibold cursor-pointer"
                      >
                        Delete Selected
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIds([]);
                        setConfirmBulkDelete(false);
                      }}
                      className="px-2.5 py-1.5 text-[#94a3b8] hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Table Card */}
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
                            className="rounded border-[#d6cfc0] text-[#c9a66b] focus:ring-[#c9a66b] cursor-pointer"
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
                      {paginatedProjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#64748b]">
                            No projects match your current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedProjects.map((p) => {
                          const isSelected = selectedIds.includes(p.id);
                          const isConfirmingDelete = confirmDeleteId === p.id;
                          const isMenuOpen = openRowMenuId === p.id;

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
                                  className="rounded border-[#d6cfc0] text-[#c9a66b] focus:ring-[#c9a66b] cursor-pointer"
                                />
                              </td>

                              {/* Project Thumbnail & Clickable Title */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3.5 min-w-[240px]">
                                  <div
                                    onClick={() => handleOpenEditProject(p)}
                                    className="w-16 h-10 rounded-lg overflow-hidden bg-[#0c1613] border border-[#d6cfc0] shrink-0 cursor-pointer"
                                  >
                                    <img
                                      src={p.screenshotUrl}
                                      alt={p.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditProject(p)}
                                        className="font-bold text-xs text-[#111715] hover:text-[#c9a66b] cursor-pointer text-left"
                                      >
                                        {p.cardTitle || p.title}
                                      </button>
                                      {p.featured && (
                                        <span title="Featured on Home Page">
                                          <Star className="w-3 h-3 text-[#c9a66b] fill-[#c9a66b]" />
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[#64748b]">
                                      #{p.order} · {p.categorySubtitle}
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
                                <p className="text-[10px]">Order #{p.order}</p>
                              </td>

                              {/* Actions */}
                              <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap relative">
                                {isConfirmingDelete ? (
                                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                                    <span className="text-[11px] text-red-700 font-semibold">
                                      Delete?
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProjectConfirmed(p.id)}
                                      className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-bold rounded hover:bg-red-700 cursor-pointer"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-1.5 py-0.5 text-[11px] text-[#64748b] hover:text-[#111715] cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1 text-[#64748b]">
                                    <button
                                      type="button"
                                      onClick={() => onNavigate('case-study', p.slug)}
                                      title="View Case Study Page"
                                      className="p-1.5 rounded-lg hover:text-[#111715] hover:bg-[#f1ece1] transition-colors cursor-pointer"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditProject(p)}
                                      title="Edit Project"
                                      className="p-1.5 rounded-lg hover:text-[#111715] hover:bg-[#f1ece1] transition-colors cursor-pointer"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(p.id)}
                                      title="Delete Project"
                                      className="p-1.5 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setOpenRowMenuId(isMenuOpen ? null : p.id)
                                        }
                                        title="More Options"
                                        className="p-1.5 rounded-lg hover:text-[#111715] hover:bg-[#f1ece1] transition-colors cursor-pointer"
                                      >
                                        <MoreVertical className="w-3.5 h-3.5" />
                                      </button>

                                      {isMenuOpen && (
                                        <div className="absolute right-0 mt-1 w-48 bg-white border border-[#e5dfd3] rounded-xl shadow-xl py-1.5 z-30 text-left text-xs">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateProject(p)}
                                            className="w-full px-3.5 py-2 hover:bg-[#f8f6f0] text-[#111715] flex items-center gap-2 cursor-pointer"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-[#64748b]" />
                                            <span>Duplicate Project</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleToggleProjectFeatured(p)}
                                            className="w-full px-3.5 py-2 hover:bg-[#f8f6f0] text-[#111715] flex items-center gap-2 cursor-pointer"
                                          >
                                            <Star className="w-3.5 h-3.5 text-[#c9a66b]" />
                                            <span>
                                              {p.featured
                                                ? 'Unmark Featured'
                                                : 'Mark as Featured'}
                                            </span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleQuickStatusChange(
                                                p,
                                                p.status === 'Published' ? 'Draft' : 'Published'
                                              )
                                            }
                                            className="w-full px-3.5 py-2 hover:bg-[#f8f6f0] text-[#111715] flex items-center gap-2 cursor-pointer"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                                            <span>
                                              Set as{' '}
                                              {p.status === 'Published' ? 'Draft' : 'Published'}
                                            </span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Working Table Footer & Pagination */}
                <div className="px-6 py-4 border-t border-[#e5dfd3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
                  <p>
                    Showing{' '}
                    {filteredProjects.length === 0
                      ? 0
                      : (safePageNum - 1) * pageSize + 1}{' '}
                    to {Math.min(safePageNum * pageSize, filteredProjects.length)} of{' '}
                    {filteredProjects.length} projects
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={safePageNum <= 1}
                      onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg border border-[#e2dcd0] flex items-center justify-center text-[#111715] hover:border-[#c9a66b] disabled:opacity-40 cursor-pointer disabled:cursor-default"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPageNum(pageNum)}
                        className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-xs cursor-pointer ${
                          pageNum === safePageNum
                            ? 'bg-[#c9a66b] text-[#0b1210]'
                            : 'border border-[#e2dcd0] text-[#64748b] hover:text-[#111715]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={safePageNum >= totalPages}
                      onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                      className="w-8 h-8 rounded-lg border border-[#e2dcd0] flex items-center justify-center text-[#111715] hover:border-[#c9a66b] disabled:opacity-40 cursor-pointer disabled:cursor-default"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 3: SERVICES MANAGER
          ===================================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                    <span>Capabilities</span>
                    <span className="w-8 h-[1px] bg-[#64748b]/40" />
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#111715]">
                    Services ({services.length})
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Manage the core engineering and design services displayed on the public Services page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="px-5 py-2.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl hover:bg-[#d8b77e] transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="bg-white border border-[#e5dfd3] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/9] bg-[#0c1613] relative overflow-hidden border-b border-[#e5dfd3]">
                        <img
                          src={svc.imageUrl}
                          alt={svc.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0b1210]/85 text-[#c9a66b] font-mono-tabular text-xs font-bold border border-[#c9a66b]/30">
                          {svc.number}
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                          {svc.title}
                        </h3>
                        <p className="text-xs text-[#475569] leading-relaxed">
                          {svc.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {svc.deliverables.map((del) => (
                            <span
                              key={del}
                              className="px-2.5 py-1 rounded-md bg-[#f8f6f0] border border-[#e2dcd0] text-[11px] font-medium text-[#111715]"
                            >
                              {del}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-3.5 bg-[#fcfaf7] border-t border-[#e5dfd3] flex items-center justify-between text-xs">
                      <span className="text-[#64748b]">Order #{svc.order}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditService(svc)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc0] hover:border-[#c9a66b] font-semibold text-[#111715] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {confirmDeleteServiceId === svc.id ? (
                          <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                            <button
                              type="button"
                              onClick={() => handleDeleteServiceConfirmed(svc.id)}
                              className="px-2 py-0.5 bg-red-600 text-white font-bold rounded text-[11px] cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteServiceId(null)}
                              className="px-1.5 py-0.5 text-[#64748b] text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteServiceId(svc.id)}
                            className="p-1.5 rounded-lg text-[#64748b] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 4: MEDIA LIBRARY
          ===================================================================== */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                    <span>Studio Assets</span>
                    <span className="w-8 h-[1px] bg-[#64748b]/40" />
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#111715]">
                    Media Library ({filteredMediaAssets.length})
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Browse extracted studio visuals, copy asset paths, or assign any visual directly to a project card.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(['All', 'Projects', 'Services', 'Case Studies', 'Hero & Banners'] as const).map(
                    (grp) => (
                      <button
                        key={grp}
                        type="button"
                        onClick={() => setMediaGroupFilter(grp)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          mediaGroupFilter === grp
                            ? 'bg-[#c9a66b] text-[#0b1210]'
                            : 'bg-white border border-[#e2dcd0] text-[#475569] hover:text-[#111715]'
                        }`}
                      >
                        {grp}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Quick Project Assignment Selector */}
              <div className="bg-white border border-[#e5dfd3] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#c9a66b]" />
                  <span className="font-semibold text-[#111715]">
                    Quick-Assign Target Project:
                  </span>
                </div>
                <select
                  value={assignProjectTargetId}
                  onChange={(e) => setAssignProjectTargetId(e.target.value)}
                  className="px-3 py-2 bg-[#f8f6f0] border border-[#d6cfc0] rounded-xl text-xs text-[#111715] font-medium min-w-[240px] cursor-pointer"
                >
                  <option value="">-- Select a project to assign images to --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.order} — {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredMediaAssets.map((asset) => (
                  <div
                    key={asset.url}
                    className="bg-white border border-[#e5dfd3] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      <div
                        onClick={() => setPreviewMedia(asset)}
                        className="aspect-[16/10] bg-[#0c1613] overflow-hidden cursor-pointer relative"
                      >
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] text-[#f5f2eb] font-medium">
                          {asset.group}
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="font-bold text-xs text-[#111715] truncate">{asset.name}</p>
                        <p className="text-[10px] text-[#64748b] font-mono-tabular truncate">
                          {asset.url}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyMediaUrl(asset.url)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#f8f6f0] hover:bg-[#efeae0] border border-[#e2dcd0] text-[11px] font-semibold text-[#111715] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedMediaUrl === asset.url ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#64748b]" />
                            <span>Copy Path</span>
                          </>
                        )}
                      </button>

                      {assignProjectTargetId && (
                        <button
                          type="button"
                          onClick={() =>
                            handleAssignMediaToProject(asset.url, assignProjectTargetId)
                          }
                          className="py-1.5 px-2.5 rounded-lg bg-[#c9a66b] hover:bg-[#d8b77e] text-[#0b1210] text-[11px] font-bold cursor-pointer"
                          title="Assign as Project Thumbnail"
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 5: INQUIRIES (CUSTOMER LEADS)
          ===================================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                    <span>Customer Leads</span>
                    <span className="w-8 h-[1px] bg-[#64748b]/40" />
                  </div>
                  <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#111715]">
                    Inquiries ({inquiries.length})
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Messages submitted via the Contact page and WhatsApp direct channels.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddInquiryOpen(true)}
                  className="px-4 py-2.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl hover:bg-[#d8b77e] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Client Inquiry</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#e5dfd3] rounded-2xl space-y-3">
                  <p className="font-serif-editorial text-xl text-[#111715]">No inquiries yet</p>
                  <p className="text-xs text-[#64748b] max-w-md mx-auto">
                    Submissions from the public Contact page appear here in real-time, or you can manually log a client lead using the button above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 bg-white border border-[#e5dfd3] rounded-2xl space-y-4 shadow-xs"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-base text-[#111715]">{inq.name}</h3>
                          <p className="text-xs text-[#64748b]">
                            {inq.email} · {inq.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f5f2eb] text-[#102b25] border border-[#e2dcd0]">
                            {inq.packageInterest}
                          </span>
                          {confirmDeleteInquiryId === inq.id ? (
                            <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-200 text-xs">
                              <button
                                type="button"
                                onClick={async () => {
                                  await deleteInquiry(inq.id);
                                  setConfirmDeleteInquiryId(null);
                                  showToast('Inquiry deleted.');
                                }}
                                className="px-2 py-0.5 bg-red-600 text-white font-bold rounded cursor-pointer"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteInquiryId(null)}
                                className="px-1.5 py-0.5 text-[#64748b] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteInquiryId(inq.id)}
                              className="p-1.5 rounded-lg text-[#64748b] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#334155] bg-[#f8f6f0] p-4 rounded-xl border border-[#e2dcd0] leading-relaxed">
                        {inq.message}
                      </p>

                      <div className="flex flex-wrap justify-between items-center gap-4 pt-1 text-xs">
                        <div className="text-[#64748b]">
                          <span className="font-semibold text-[#111715]">Budget:</span>{' '}
                          {inq.budget || 'Not specified'} ·{' '}
                          <span>{new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${inq.email}?subject=Re: Your MEDUUA Studio Project Inquiry`}
                            className="px-3 py-1.5 rounded-lg bg-[#f8f6f0] hover:bg-[#efeae0] border border-[#d6cfc0] text-[#111715] font-semibold flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#c9a66b]" />
                            <span>Reply via Email</span>
                          </a>
                          <a
                            href={getWhatsAppUrl(
                              `Hi ${inq.name}, thank you for contacting MEDUUA regarding ${inq.packageInterest}!`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#102b25] hover:bg-[#16382e] text-[#f5f2eb] font-semibold flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#c9a66b]" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 6: PAGES & PRICING PACKAGES MANAGER
          ===================================================================== */}
          {activeTab === 'pages' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                  <span>Site Architecture &amp; Packages</span>
                  <span className="w-8 h-[1px] bg-[#64748b]/40" />
                </div>
                <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#111715]">
                  Pages &amp; Pricing Packages
                </h1>
                <p className="text-xs sm:text-sm text-[#64748b]">
                  Navigate directly to any public page or customize the pricing packages displayed on the Pricing page.
                </p>
              </div>

              {/* Public Routes Grid */}
              <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif-editorial text-xl font-bold text-[#111715]">
                      Public Site Pages
                    </h2>
                    <p className="text-xs text-[#64748b]">
                      Home is the primary entry route (`/`) of the application.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(
                    [
                      {
                        title: 'Home (Primary Page)',
                        route: '/',
                        page: 'home',
                        desc: 'Hero showcase, 4×4 Selected Projects grid, Capabilities & CTA',
                      },
                      {
                        title: 'Work / Projects',
                        route: '#/projects',
                        page: 'projects',
                        desc: 'Filterable portfolio of all mobile, web, streaming & UI/UX projects',
                      },
                      {
                        title: 'Case Study Showcase',
                        route: '#/case-study',
                        page: 'case-study',
                        desc: 'In-depth project architecture, trailer modal & screen gallery',
                      },
                      {
                        title: 'Services & Capabilities',
                        route: '#/services',
                        page: 'services',
                        desc: '6 core engineering & design capabilities + 4-step studio process',
                      },
                      {
                        title: 'Pricing & Packages',
                        route: '#/pricing',
                        page: 'pricing',
                        desc: 'Starter, Business, and Custom enterprise project tiers',
                      },
                      {
                        title: 'About & Contact',
                        route: '#/about & #/contact',
                        page: 'about',
                        desc: 'Studio philosophy, founder story & direct inquiry channels',
                      },
                    ] as { title: string; route: string; page: PageRoute; desc: string }[]
                  ).map((item) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-xl bg-[#f8f6f0] border border-[#e2dcd0] flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#111715]">{item.title}</span>
                          <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-white border border-[#e2dcd0] text-[#64748b]">
                            {item.route}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748b] leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.page)}
                        className="w-full py-2 rounded-lg bg-white hover:bg-[#c9a66b] text-[#111715] hover:text-[#0b1210] border border-[#d6cfc0] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Pricing Packages Manager */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                      Fixed Pricing Packages ({pricing.length})
                    </h2>
                    <p className="text-xs text-[#64748b]">
                      All 6 packages have fixed slots and scope, and every field is 100% editable.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={async () => {
                        await resetPricingToDefaults();
                        showToast('All 6 Fixed Packages restored to default values.');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#d6cfc0] hover:border-[#c9a66b] text-xs font-semibold text-[#111715] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#c9a66b]" />
                      <span>Reset All Fixed Packages</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('pricing')}
                      className="px-3.5 py-2 rounded-xl bg-[#102b25] text-[#f5f2eb] text-xs font-semibold hover:bg-[#16382e] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Live Pricing Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#c9a66b]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pricing.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className={`rounded-2xl p-6 flex flex-col justify-between border shadow-xs ${
                        tier.highlighted
                          ? 'bg-[#102b25] text-[#f5f2eb] border-[#c9a66b]'
                          : 'bg-white text-[#111715] border-[#e5dfd3]'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#c9a66b]">
                            FIXED PACKAGE 0{idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {tier.highlighted && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c9a66b] text-[#0b1210]">
                                Most Popular
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={async () => {
                                await resetSinglePricingTier(tier.id);
                                showToast(`Reset "${tier.name}" to default.`);
                              }}
                              title="Reset this package slot to default"
                              className="text-[10px] underline opacity-75 hover:opacity-100 cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-serif-editorial text-xl font-bold">{tier.name}</h3>
                          <p className="font-serif-editorial text-3xl font-bold text-[#c9a66b] mt-1">
                            {tier.price}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              tier.highlighted ? 'text-[#94a3b8]' : 'text-[#64748b]'
                            }`}
                          >
                            {tier.subtitle}
                          </p>
                        </div>
                        <ul className="space-y-2 text-xs pt-2 border-t border-current/10">
                          {tier.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-[#c9a66b] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 mt-6 border-t border-current/10 flex items-center justify-between text-xs">
                        <span className="opacity-75">{tier.deliveryTime}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPricing(tier)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#c9a66b] text-[#0b1210] font-bold hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Fixed Package</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 7: STUDIO SETTINGS & CLOUD SYNC
          ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                  <span>Configuration</span>
                  <span className="w-8 h-[1px] bg-[#64748b]/40" />
                </div>
                <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#111715]">
                  Studio Settings &amp; Cloud Sync
                </h1>
                <p className="text-xs sm:text-sm text-[#64748b]">
                  Manage studio identity, Firebase Cloud Firestore synchronization, and portfolio backups.
                </p>
              </div>

              {/* Cloud Sync & Auth Card */}
              <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1ece1]">
                  <div>
                    <h2 className="font-serif-editorial text-xl font-bold text-[#111715]">
                      Cloud Firestore &amp; Admin Authentication
                    </h2>
                    <p className="text-xs text-[#64748b]">
                      Authorized Admin Email: <span className="font-mono-tabular font-semibold text-[#111715]">{BOOTSTRAPPED_ADMIN_EMAIL}</span>
                    </p>
                  </div>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={signOutAdmin}
                      className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 flex items-center gap-1.5 cursor-pointer self-start"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out ({user?.email})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={signInAdmin}
                      className="px-4 py-2 rounded-xl bg-[#102b25] text-[#f5f2eb] text-xs font-bold hover:bg-[#16382e] flex items-center gap-1.5 cursor-pointer self-start"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#c9a66b]" />
                      <span>Sign In with Google</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-[#111715]">
                      Sync Default 16-Project Catalog &amp; Services
                    </p>
                    <p className="text-[#64748b]">
                      Restores or seeds all 16 default projects, 6 services, and 3 pricing tiers.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleSyncCatalogToCloud}
                      disabled={syncingDefaults}
                      className="px-4 py-2 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingDefaults ? 'animate-spin' : ''}`} />
                      <span>{syncingDefaults ? 'Syncing...' : 'Sync Default Catalog'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportPortfolioJson}
                      className="px-4 py-2 bg-[#f8f6f0] border border-[#d6cfc0] text-[#111715] text-xs font-semibold rounded-xl hover:border-[#c9a66b] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON Backup</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Studio Profile Form */}
              <form
                onSubmit={handleSaveStudioSettings}
                className="bg-white border border-[#e5dfd3] rounded-2xl p-6 space-y-4 shadow-xs text-xs"
              >
                <h2 className="font-serif-editorial text-xl font-bold text-[#111715]">
                  Studio Profile &amp; Primary Routing
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-[#111715]">Studio Brand Name</label>
                    <input
                      type="text"
                      value={studioSettings.studioName}
                      onChange={(e) =>
                        setStudioSettings({ ...studioSettings, studioName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#f8f6f0] border border-[#d6cfc0] rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#111715]">Administrator Name</label>
                    <input
                      type="text"
                      value={studioSettings.adminName}
                      onChange={(e) =>
                        setStudioSettings({ ...studioSettings, adminName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#f8f6f0] border border-[#d6cfc0] rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#111715]">Primary Landing Page</label>
                    <input
                      type="text"
                      value="Home (/)"
                      disabled
                      className="w-full px-3 py-2 bg-[#f1ece1] border border-[#d6cfc0] rounded-lg text-[#475569] font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#111715]">WhatsApp Direct Number</label>
                    <input
                      type="text"
                      value={studioSettings.whatsappDisplay}
                      onChange={(e) =>
                        setStudioSettings({
                          ...studioSettings,
                          whatsappDisplay: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#f8f6f0] border border-[#d6cfc0] rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#c9a66b] text-[#0b1210] font-bold rounded-xl hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Studio Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          MODAL 1: ADD / EDIT PROJECT
      ===================================================================== */}
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
                    : 'Changes apply immediately to the live portfolio session.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-[#64748b] hover:text-[#111715] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Project Title *</label>
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
                    <option value="UI/UX">UI/UX</option>
                    <option value="Websites">Websites</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
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
                        status: e.target.value as ProjectItem['status'],
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Client</label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, client: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, year: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Display Order (1–16)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingProject.order}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        order: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Case Study Overview</label>
                  <textarea
                    rows={2}
                    value={editingProject.overview}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, overview: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">The Challenge</label>
                  <textarea
                    rows={2}
                    value={editingProject.challenge}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, challenge: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React, TypeScript, Kotlin"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">
                    Key Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Offline Mode, Real-time Sync"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#111715]">
                  Screenshot URL or Studio Asset Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  <select
                    value={editingProject.screenshotUrl}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        screenshotUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#f8f6f0] border border-[#d6cfc0] rounded-lg text-xs"
                  >
                    <option value={editingProject.screenshotUrl}>
                      -- Choose from Studio Media Library --
                    </option>
                    {STUDIO_MEDIA_ASSETS.map((a) => (
                      <option key={a.url} value={a.url}>
                        {a.name} ({a.group})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={editingProject.featured}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, featured: e.target.checked })
                  }
                  className="rounded border-[#d6cfc0] text-[#c9a66b]"
                />
                <label htmlFor="featured-toggle" className="font-semibold text-[#111715]">
                  Feature this project on the primary Home page
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#f1ece1]">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-[#d6cfc0] rounded-lg text-[#64748b] hover:text-[#111715] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c9a66b] text-[#0b1210] font-bold rounded-lg hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: ADD / EDIT SERVICE
      ===================================================================== */}
      {isServiceEditorOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#e5dfd3]">
            <div className="flex items-center justify-between border-b border-[#f1ece1] pb-4">
              <h2 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                {editingService.title ? `Edit ${editingService.title}` : 'Add New Service'}
              </h2>
              <button
                type="button"
                onClick={() => setIsServiceEditorOpen(false)}
                className="p-1 text-[#64748b] hover:text-[#111715] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Number</label>
                  <input
                    type="text"
                    value={editingService.number}
                    onChange={(e) =>
                      setEditingService({ ...editingService, number: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-[#111715]">Service Title *</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) =>
                      setEditingService({ ...editingService, title: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Description *</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">
                  Deliverables (comma-separated)
                </label>
                <input
                  type="text"
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Image Asset</label>
                <select
                  value={editingService.imageUrl}
                  onChange={(e) =>
                    setEditingService({ ...editingService, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#f8f6f0] border border-[#d6cfc0] rounded-lg"
                >
                  {STUDIO_MEDIA_ASSETS.map((a) => (
                    <option key={a.url} value={a.url}>
                      {a.name} ({a.group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#f1ece1]">
                <button
                  type="button"
                  onClick={() => setIsServiceEditorOpen(false)}
                  className="px-4 py-2 border border-[#d6cfc0] rounded-lg text-[#64748b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c9a66b] text-[#0b1210] font-bold rounded-lg hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: EDIT PRICING TIER
      ===================================================================== */}
      {isPricingEditorOpen && editingPricing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#e5dfd3]">
            <div className="flex items-center justify-between border-b border-[#f1ece1] pb-4">
              <h2 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                Edit {editingPricing.name}
              </h2>
              <button
                type="button"
                onClick={() => setIsPricingEditorOpen(false)}
                className="p-1 text-[#64748b] hover:text-[#111715] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePricingModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Package Name</label>
                  <input
                    type="text"
                    value={editingPricing.name}
                    onChange={(e) =>
                      setEditingPricing({ ...editingPricing, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Price Display</label>
                  <input
                    type="text"
                    value={editingPricing.price}
                    onChange={(e) =>
                      setEditingPricing({ ...editingPricing, price: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Delivery Time</label>
                  <input
                    type="text"
                    value={editingPricing.deliveryTime}
                    onChange={(e) =>
                      setEditingPricing({ ...editingPricing, deliveryTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingPricing.buttonText}
                    onChange={(e) =>
                      setEditingPricing({ ...editingPricing, buttonText: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Subtitle</label>
                <input
                  type="text"
                  value={editingPricing.subtitle}
                  onChange={(e) =>
                    setEditingPricing({ ...editingPricing, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">
                  Included Fixed Deliverables (one per line)
                </label>
                <textarea
                  rows={5}
                  value={pricingFeaturesInput}
                  onChange={(e) => setPricingFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 font-semibold text-[#111715] cursor-pointer">
                  <input
                    type="checkbox"
                    id="highlight-tier"
                    checked={editingPricing.highlighted}
                    onChange={(e) =>
                      setEditingPricing({ ...editingPricing, highlighted: e.target.checked })
                    }
                  />
                  <span>Highlight as "Most Popular" package</span>
                </label>

                <button
                  type="button"
                  onClick={async () => {
                    await resetSinglePricingTier(editingPricing.id);
                    setIsPricingEditorOpen(false);
                    showToast(`Reset "${editingPricing.name}" to default.`);
                  }}
                  className="text-xs font-semibold text-[#64748b] hover:text-[#111715] underline cursor-pointer"
                >
                  Reset Slot Default
                </button>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#f1ece1]">
                <button
                  type="button"
                  onClick={() => setIsPricingEditorOpen(false)}
                  className="px-4 py-2 border border-[#d6cfc0] rounded-lg text-[#64748b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c9a66b] text-[#0b1210] font-bold rounded-lg hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: LOG CLIENT INQUIRY
      ===================================================================== */}
      {isAddInquiryOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#e5dfd3]">
            <div className="flex items-center justify-between border-b border-[#f1ece1] pb-4">
              <h2 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                Log Client Inquiry
              </h2>
              <button
                type="button"
                onClick={() => setIsAddInquiryOpen(false)}
                className="p-1 text-[#64748b] hover:text-[#111715] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSampleInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newInquiryForm.name}
                    onChange={(e) =>
                      setNewInquiryForm({ ...newInquiryForm, name: e.target.value })
                    }
                    placeholder="e.g. Kasun Perera"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newInquiryForm.email}
                    onChange={(e) =>
                      setNewInquiryForm({ ...newInquiryForm, email: e.target.value })
                    }
                    placeholder="client@company.com"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={newInquiryForm.phone}
                    onChange={(e) =>
                      setNewInquiryForm({ ...newInquiryForm, phone: e.target.value })
                    }
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Package Interest</label>
                  <select
                    value={newInquiryForm.packageInterest}
                    onChange={(e) =>
                      setNewInquiryForm({
                        ...newInquiryForm,
                        packageInterest: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                  >
                    <option value="Starter Package">Starter Package</option>
                    <option value="Business Package">Business Package</option>
                    <option value="Custom / Enterprise">Custom / Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Project Brief / Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={newInquiryForm.message}
                  onChange={(e) =>
                    setNewInquiryForm({ ...newInquiryForm, message: e.target.value })
                  }
                  placeholder="Describe the client's project requirements..."
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc0] rounded-lg"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#f1ece1]">
                <button
                  type="button"
                  onClick={() => setIsAddInquiryOpen(false)}
                  className="px-4 py-2 border border-[#d6cfc0] rounded-lg text-[#64748b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c9a66b] text-[#0b1210] font-bold rounded-lg hover:bg-[#d8b77e] cursor-pointer"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: MEDIA LIGHTBOX PREVIEW
      ===================================================================== */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e1714] border border-[#23382f] rounded-2xl max-w-3xl w-full p-5 space-y-4 text-[#f5f2eb]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-editorial text-xl font-bold">{previewMedia.name}</h3>
                <p className="text-xs text-[#94a3b8] font-mono-tabular">{previewMedia.url}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 text-[#94a3b8] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black border border-[#1f2e27] max-h-[65vh] flex items-center justify-center">
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleCopyMediaUrl(previewMedia.url)}
                className="px-4 py-2 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-xl cursor-pointer"
              >
                Copy Asset Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
