import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  DEFAULT_PRICING,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  InquiryItem,
  PricingTierItem,
  ProjectCategory,
  ProjectItem,
  ServiceItem,
} from '../data/defaultData';

interface PortfolioContextValue {
  projects: ProjectItem[];
  services: ServiceItem[];
  pricing: PricingTierItem[];
  inquiries: InquiryItem[];
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  signInAdmin: () => Promise<void>;
  signOutAdmin: () => Promise<void>;
  saveProject: (project: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  savePricingTier: (tier: PricingTierItem) => Promise<void>;
  resetPricingToDefaults: () => Promise<void>;
  resetSinglePricingTier: (id: string) => Promise<void>;
  submitInquiry: (inquiry: Omit<InquiryItem, 'id' | 'createdAt'>) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  seedDefaultsToFirestore: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

const FIXED_PRICING_STORAGE_KEY = 'meduua_fixed_pricing_v3';
const FIXED_PRICING_BASELINE_DATE = '2026-10-25T12:00:00.000Z';

function loadMergedFixedPricing(remoteDocs?: PricingTierItem[]): PricingTierItem[] {
  let localMap: Record<string, PricingTierItem> = {};
  try {
    const raw = localStorage.getItem(FIXED_PRICING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PricingTierItem[];
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && item.id) {
            localMap[item.id] = item;
          }
        }
      }
    }
  } catch {
    // ignore storage errors
  }

  const remoteMap: Record<string, PricingTierItem> = {};
  if (Array.isArray(remoteDocs)) {
    for (const docItem of remoteDocs) {
      // Only apply remote doc if it was edited after our new fixed-package baseline
      if (
        docItem &&
        docItem.id &&
        docItem.updatedAt &&
        docItem.updatedAt > FIXED_PRICING_BASELINE_DATE
      ) {
        remoteMap[docItem.id] = docItem;
      }
    }
  }

  return DEFAULT_PRICING.map((fixedSlot, index) => {
    const localEdit = localMap[fixedSlot.id];
    const remoteEdit = remoteMap[fixedSlot.id];

    let chosen = fixedSlot;
    if (localEdit && remoteEdit) {
      chosen =
        (remoteEdit.updatedAt || '') >= (localEdit.updatedAt || '')
          ? remoteEdit
          : localEdit;
    } else if (localEdit) {
      chosen = localEdit;
    } else if (remoteEdit) {
      chosen = remoteEdit;
    }

    return {
      ...fixedSlot,
      ...chosen,
      id: fixedSlot.id,
      order: index + 1,
    };
  });
}

function saveFixedPricingToStorage(tiers: PricingTierItem[]) {
  try {
    localStorage.setItem(FIXED_PRICING_STORAGE_KEY, JSON.stringify(tiers));
  } catch {
    // ignore storage quota errors
  }
}

function clampStr(val: string, min: number, max: number, fallback: string): string {
  const trimmed = (val || '').trim();
  if (trimmed.length < min) return fallback.slice(0, max);
  return trimmed.slice(0, max);
}

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 100);
  return cleaned || `item-${Date.now()}`;
}

function sanitizeSlug(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
  return cleaned || `project-${Date.now()}`;
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [pricing, setPricing] = useState<PricingTierItem[]>(() => loadMergedFixedPricing());
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const isAdmin = Boolean(
    user &&
      user.emailVerified &&
      user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()
  );

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubAuth();
  }, []);

  // Listen to public collections (Projects, Services, Pricing)
  useEffect(() => {
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty) {
          const loaded: ProjectItem[] = [];
          snap.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<ProjectItem, 'id'>) });
          });
          loaded.sort((a, b) => a.order - b.order);
          setProjects(loaded);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'projects');
      }
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (!snap.empty) {
          const loaded: ServiceItem[] = [];
          snap.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<ServiceItem, 'id'>) });
          });
          loaded.sort((a, b) => a.order - b.order);
          setServices(loaded);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'services');
      }
    );

    const unsubPricing = onSnapshot(
      collection(db, 'pricing'),
      (snap) => {
        const loaded: PricingTierItem[] = [];
        snap.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<PricingTierItem, 'id'>) });
        });
        const merged = loadMergedFixedPricing(loaded);
        setPricing(merged);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'pricing');
      }
    );

    return () => {
      unsubProjects();
      unsubServices();
      unsubPricing();
    };
  }, []);

  // Listen to private Inquiries collection ONLY when authenticated as verified Admin
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setInquiries([]);
      return;
    }

    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snap) => {
        const loaded: InquiryItem[] = [];
        snap.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<InquiryItem, 'id'>) });
        });
        loaded.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setInquiries(loaded);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'inquiries');
      }
    );

    return () => unsubInquiries();
  }, [authReady, isAdmin]);

  const signInAdmin = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutAdmin = async () => {
    await firebaseSignOut(auth);
  };

  const saveProject = async (project: ProjectItem) => {
    const docId = sanitizeId(project.id || project.slug);
    const validCategories: ProjectCategory[] = [
      'Mobile App',
      'Web Platform',
      'Streaming',
      'UI/UX',
      'Websites',
    ];
    const category: ProjectCategory = validCategories.includes(project.category as ProjectCategory)
      ? (project.category as ProjectCategory)
      : 'Mobile App';

    const technologies = (project.technologies || [])
      .map((t) => t.trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 10);
    if (technologies.length === 0) technologies.push('React');

    const features = (project.features || [])
      .map((f) => f.trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 10);
    if (features.length === 0) features.push('Responsive modern interface');

    const validStatuses = ['Published', 'In Progress', 'Planning', 'Draft'];
    const status = validStatuses.includes(project.status) ? project.status : 'Published';
    const nowIso = new Date().toISOString();

    const payload = {
      title: clampStr(project.title, 1, 120, 'Untitled Project'),
      cardTitle: clampStr(project.cardTitle || project.title, 1, 120, 'Untitled Project'),
      slug: sanitizeSlug(project.slug || project.title),
      category,
      categorySubtitle: clampStr(project.categorySubtitle, 2, 120, 'Android App / Development'),
      client: clampStr(project.client, 1, 100, 'MEDUUA Client'),
      year: clampStr(project.year, 4, 10, '2024'),
      shortDescription: clampStr(
        project.shortDescription,
        10,
        400,
        'Bespoke digital experience engineered by MEDUUA.'
      ),
      overview: clampStr(
        project.overview,
        20,
        2500,
        'Detailed architectural overview of the digital product and user experience designed by MEDUUA.'
      ),
      challenge: clampStr(
        project.challenge,
        20,
        2500,
        'Delivering high performance, editorial clarity, and resilient technical scalability across devices.'
      ),
      solution: clampStr(
        project.solution,
        20,
        2500,
        'Engineered a modular TypeScript architecture paired with calibrated typography and responsive layouts.'
      ),
      technologies,
      features,
      screenshotUrl: clampStr(
        project.screenshotUrl,
        1,
        500,
        '/assets/extracted/project_whiteroom.png'
      ),
      liveUrl: clampStr(project.liveUrl, 1, 500, 'https://meduua.com'),
      featured: Boolean(project.featured),
      order: Number.isFinite(project.order) ? Number(project.order) : 1,
      status,
      date: clampStr(project.date, 3, 40, 'Jan 15, 2024'),
      updatedAt: nowIso,
    };

    const finalItem: ProjectItem = {
      id: docId,
      ...payload,
    };

    // Always update local React state immediately so user sees the change right away
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === docId || (project.id && p.id === project.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = finalItem;
        return copy.sort((a, b) => a.order - b.order);
      }
      return [...prev, finalItem].sort((a, b) => a.order - b.order);
    });

    // If authenticated as verified admin, persist live to Firestore
    if (isAdmin) {
      try {
        await setDoc(doc(db, 'projects', docId), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `projects/${docId}`);
      }
    }
  };

  const deleteProject = async (id: string) => {
    const docId = sanitizeId(id);
    setProjects((prev) => prev.filter((p) => p.id !== docId && p.id !== id));
    if (isAdmin) {
      try {
        await deleteDoc(doc(db, 'projects', docId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `projects/${docId}`);
      }
    }
  };

  const saveService = async (service: ServiceItem) => {
    const docId = sanitizeId(service.id || `service-${service.number}`);
    const deliverables = (service.deliverables || [])
      .map((d) => d.trim().slice(0, 140))
      .filter(Boolean)
      .slice(0, 8);
    if (deliverables.length === 0) deliverables.push('Custom Architecture');

    const payload = {
      number: clampStr(service.number, 2, 4, '01'),
      title: clampStr(service.title, 2, 120, 'Agency Service'),
      description: clampStr(
        service.description,
        10,
        800,
        'Bespoke engineering and design capability delivered by MEDUUA.'
      ),
      deliverables,
      iconName: clampStr(service.iconName, 2, 40, 'Compass'),
      imageUrl: clampStr(service.imageUrl, 1, 300, '/assets/extracted/service_custom_arch.png'),
      order: Number.isFinite(service.order) ? Number(service.order) : 1,
      updatedAt: new Date().toISOString(),
    };

    const finalItem: ServiceItem = {
      id: docId,
      ...payload,
    };

    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === docId || (service.id && s.id === service.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = finalItem;
        return copy.sort((a, b) => a.order - b.order);
      }
      return [...prev, finalItem].sort((a, b) => a.order - b.order);
    });

    if (isAdmin) {
      try {
        await setDoc(doc(db, 'services', docId), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `services/${docId}`);
      }
    }
  };

  const deleteService = async (id: string) => {
    const docId = sanitizeId(id);
    setServices((prev) => prev.filter((s) => s.id !== docId && s.id !== id));
    if (isAdmin) {
      try {
        await deleteDoc(doc(db, 'services', docId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `services/${docId}`);
      }
    }
  };

  const savePricingTier = async (tier: PricingTierItem) => {
    const docId = sanitizeId(tier.id || `pricing-${tier.name.toLowerCase()}`);
    const features = (tier.features || [])
      .map((f) => f.trim().slice(0, 160))
      .filter(Boolean)
      .slice(0, 20);
    if (features.length === 0) features.push('Responsive custom website design');

    const payload = {
      name: clampStr(tier.name, 2, 80, 'STARTER'),
      price: clampStr(tier.price, 2, 60, 'LKR 10,000'),
      subtitle: clampStr(
        tier.subtitle,
        4,
        160,
        'Perfect for individuals, freelancers, and small businesses taking their first step online.'
      ),
      description: clampStr(
        tier.description,
        10,
        500,
        'Comprehensive design and engineering package tailored to your business goals.'
      ),
      features,
      highlighted: Boolean(tier.highlighted),
      deliveryTime: clampStr(tier.deliveryTime, 2, 80, '3–5 working days'),
      buttonText: clampStr(tier.buttonText, 2, 60, 'GET STARTED'),
      order: Number.isFinite(tier.order) ? Number(tier.order) : 1,
      updatedAt: new Date().toISOString(),
    };

    const finalItem: PricingTierItem = {
      id: docId,
      number: tier.number,
      tagline: tier.tagline,
      featuresHeading: tier.featuresHeading,
      bestFor: tier.bestFor,
      ...payload,
    };

    setPricing((prev) => {
      const idx = prev.findIndex((p) => p.id === docId || (tier.id && p.id === tier.id));
      let nextList: PricingTierItem[];
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          ...finalItem,
          order: copy[idx].order,
        };
        nextList = copy.sort((a, b) => a.order - b.order);
      } else {
        nextList = [...prev, finalItem].sort((a, b) => a.order - b.order);
      }
      saveFixedPricingToStorage(nextList);
      return nextList;
    });

    if (isAdmin) {
      try {
        await setDoc(doc(db, 'pricing', docId), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `pricing/${docId}`);
      }
    }
  };

  const resetSinglePricingTier = async (id: string) => {
    const defaultTier = DEFAULT_PRICING.find((t) => t.id === id);
    if (!defaultTier) return;
    await savePricingTier({
      ...defaultTier,
      updatedAt: new Date().toISOString(),
    });
  };

  const resetPricingToDefaults = async () => {
    const freshDefaults = DEFAULT_PRICING.map((tier, idx) => ({
      ...tier,
      order: idx + 1,
      updatedAt: new Date().toISOString(),
    }));
    setPricing(freshDefaults);
    saveFixedPricingToStorage(freshDefaults);

    if (isAdmin) {
      for (const tier of freshDefaults) {
        const {
          id,
          number: _num,
          tagline: _tag,
          featuresHeading: _fh,
          bestFor: _bf,
          ...payload
        } = tier;
        try {
          await setDoc(doc(db, 'pricing', id), payload);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `pricing/${id}`);
        }
      }
    }
  };

  const submitInquiry = async (inquiry: Omit<InquiryItem, 'id' | 'createdAt'>) => {
    const docId = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();
    const payload = {
      name: clampStr(inquiry.name, 2, 100, 'Prospective Client'),
      email: clampStr(inquiry.email, 5, 150, 'client@example.com'),
      phone: clampStr(inquiry.phone, 5, 40, '+94 74 037 5253'),
      packageInterest: clampStr(inquiry.packageInterest, 2, 100, 'Business Growth Package — LKR 45,000'),
      message: clampStr(
        inquiry.message,
        1,
        2000,
        'Interested in discussing a project with MEDUUA.'
      ),
      createdAt: nowIso,
    };

    const newInquiry: InquiryItem = {
      id: docId,
      ...payload,
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    try {
      await setDoc(doc(db, 'inquiries', docId), payload);
    } catch (error) {
      console.warn('Inquiry recorded in session, cloud sync issue:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    const docId = sanitizeId(id);
    setInquiries((prev) => prev.filter((i) => i.id !== docId && i.id !== id));
    if (isAdmin) {
      try {
        await deleteDoc(doc(db, 'inquiries', docId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `inquiries/${docId}`);
      }
    }
  };

  const seedDefaultsToFirestore = async () => {
    for (const proj of DEFAULT_PROJECTS) {
      await saveProject(proj);
    }
    for (const svc of DEFAULT_SERVICES) {
      await saveService(svc);
    }
    await resetPricingToDefaults();
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        services,
        pricing,
        inquiries,
        user,
        authReady,
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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
