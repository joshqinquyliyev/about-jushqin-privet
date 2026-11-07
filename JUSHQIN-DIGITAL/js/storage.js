/**
 * JUSHQIN DIGITAL — Central Storage System
 * Single source of truth using localStorage
 */

const STORAGE_KEYS = {
  profile: 'jushqin_profile',
  projects: 'jushqin_projects',
  skills: 'jushqin_skills',
  messages: 'jushqin_messages',
  settings: 'jushqin_settings',
  session: 'jushqin_admin_session'
};

const DEFAULT_PROFILE = {
  name: 'Quyliyev Jushqin',
  title: 'Frontend Developer',
  tagline: 'Frontend Developer • Creative Thinker • Digital Explorer',
  heroHeadline: 'QUYLIEV JUSHQIN',
  heroSubtitle: 'Frontend Developer',
  intro: 'Salom, men Quyliyev Jushqin. Men zamonaviy, interaktiv va kreativ web saytlar yarataman. HTML, CSS va JavaScript bilan to\'liq ishlaydigan portfolio, biznes saytlar va interaktiv interfeyslar yasayman.',
  bio: 'Men frontend dasturlashga ishtiyoq bilan yondashaman. HTML, CSS va JavaScript yordamida chiroyli, tez va mobilga mos saytlar yarataman. Portfolio, biznes sahifalar, landing page va interaktiv UI — bular mening asosiy yo\'nalishlarim.',
  story: 'Dasturlashga qiziqishim oddiy veb-sahifalardan boshlangan. Vaqt o\'tishi bilan oddiy kod yozishdan murakkab interaktiv interfeyslar va premium dizayn tizimlarini yaratishga o\'tdim. Har bir loyiha men uchun yangi imkoniyat va o\'sish bosqichidir.',
  journey: 'Frontend yo\'lida HTML asoslaridan boshlab, CSS animatsiyalari, responsive dizayn, JavaScript interaktivligi va zamonaviy UI/UX prinsiplarigacha chuqur o\'rgandim. Har bir loyiha orqali yangi yondashuvlarni sinab ko\'raman.',
  goals: 'Kelajakda yuqori sifatli raqamli mahsulotlar yaratish, kreativ agentliklar bilan ishlash va frontend sohasida o\'z uslubimni yanada rivojlantirish. Foydalanuvchilarga zavq bag\'ishlaydigan tajribalar yaratish asosiy maqsadim.',
  interests: ['Kreativ kodlash', 'UI/UX dizayn', 'Animatsiya va motion', 'Raqamli san\'at', 'Yangi texnologiyalar'],
  philosophy: 'Kod — bu shunchaki funksiya emas, u hissiyot, hikoya va tajriba yaratishi kerak. Har bir pixel va harakat maqsadli bo\'lishi lozim.',
  email: 'jushqin@example.com',
  telegram: 'Coder_Joshqin',
  instagram: 'n1borz__',
  github: 'https://github.com/jushqin',
  profileImage: '',
  resumeUrl: '',
  resumeName: 'Quyliyev_Jushqin_Resume.pdf',
  location: 'Toshkent, O\'zbekiston',
  available: true
};

const DEFAULT_PROJECTS = [
  {
    id: 'proj-001',
    title: 'Poytaxt N1',
    slug: 'poytaxt-n1',
    description: 'Toshkent markazidagi premium gastronomiya maskani uchun zamonaviy veb-sayt. Eksklyuziv atmosfera, organik ingredientlar va yuqori estetika ta\'kidlangan.',
    details: 'Poytaxt Kafe N1 — premium restoran brendi uchun to\'liq veb-platforma. Dizayn minimalizm va neoklassika uyg\'unligida, interaktiv menyu va bron tizimi elementlari bilan.',
    category: 'Business',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://poytaxtn1.netlify.app/',
    githubUrl: '',
    image: '',
    featured: true,
    order: 1,
    createdAt: '2025-01-15T10:00:00.000Z'
  },
  {
    id: 'proj-002',
    title: 'ArcadeChill',
    slug: 'arcadechill',
    description: 'Miyani dam oldiruvchi 20 ta saralangan o\'yinlar to\'plami. Kundalik charchoqlardan xalos bo\'lish uchun virtual sokinlik olami.',
    details: 'ArcadeChill — to\'liq client-side o\'yin hubi. HTML, CSS va JavaScript yordamida yaratilgan, hech qanday backend talab qilmaydigan interaktiv o\'yinlar platformasi.',
    category: 'Entertainment',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://jushqin-arcadechild.netlify.app/',
    githubUrl: '',
    image: '',
    featured: true,
    order: 2,
    createdAt: '2025-02-10T10:00:00.000Z'
  },
  {
    id: 'proj-003',
    title: 'PrimeZiyo',
    slug: 'primeziyo',
    description: 'Kelajak makoni — algoritmlash, grafik san\'at, UI va biznes strategiyasi bo\'yicha amaliy ta\'lim platformasi.',
    details: 'Prime Ziyo — yoshlar uchun real loyihalar asosida o\'qitishga yo\'naltirilgan ta\'lim markazi sayti. Erkin tafakkur va amaliy yondashuv asosida qurilgan.',
    category: 'Education',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://primeziyo1.netlify.app/',
    githubUrl: '',
    image: '',
    featured: true,
    order: 3,
    createdAt: '2025-03-05T10:00:00.000Z'
  },
  {
    id: 'proj-004',
    title: 'Portfolio 2013',
    slug: 'portfolio-2013',
    description: 'POR — zamonaviy veb, mobil va AI dasturlash yechimlari platformasi. Raqamli ekotizim va yuqori sifatli portfolio.',
    details: 'POR platformasi — tezlik, xavfsizlik va responsive dizayn tamoyillariga asoslangan to\'liq raqamli ekotizim. AI integratsiyasi va analitika imkoniyatlari bilan.',
    category: 'Portfolio',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://portfolio2013.netlify.app/',
    githubUrl: '',
    image: '',
    featured: true,
    order: 4,
    createdAt: '2025-04-12T10:00:00.000Z'
  },
  {
    id: 'proj-005',
    title: 'SportPulse',
    slug: 'sportpulse',
    description: 'Jahon va O\'zbekiston sport olamidagi eng so\'nggi yangiliklar, transferlar va chuqur tahliliy maqolalar platformasi.',
    details: 'SportPulse — live natijalar, ekspert tahlillari va tezkor xabarlar bilan sport muxlislariga mo\'ljallangan dinamik veb-platforma.',
    category: 'Media',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://sportpulse12.netlify.app/',
    githubUrl: '',
    image: '',
    featured: true,
    order: 5,
    createdAt: '2025-05-20T10:00:00.000Z'
  },
  {
    id: 'proj-006',
    title: 'NexDev',
    slug: 'nexdev',
    description: 'O\'zbekistondagi etakchi IT studiya. Raqamli g\'oyalarni mukammal arxitekturaga aylantiruvchi high-load yechimlar.',
    details: 'NexDev — yirik bizneslar va startaplar uchun xavfsiz, yuqori yuklamaga chidamli dasturiy ta\'minot ishlab chiqish studiyasi. Premium kodlash va performance fokusida.',
    category: 'Agency',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://nexdev1.netlify.app/',
    githubUrl: '',
    image: '',
    featured: true,
    order: 6,
    createdAt: '2025-06-08T10:00:00.000Z'
  }
];

const DEFAULT_SKILLS = [
  { id: 'skill-001', name: 'HTML5', category: 'Core', level: 95, description: 'Semantic markup, accessibility, modern HTML features', order: 1 },
  { id: 'skill-002', name: 'CSS3', category: 'Core', level: 92, description: 'Advanced layouts, animations, responsive design, CSS variables', order: 2 },
  { id: 'skill-003', name: 'JavaScript', category: 'Core', level: 88, description: 'ES6+, DOM, async, modular code, interactivity', order: 3 },
  { id: 'skill-004', name: 'Responsive Design', category: 'Design', level: 90, description: 'Mobile-first, fluid layouts, breakpoints, touch-friendly UI', order: 4 },
  { id: 'skill-005', name: 'Git', category: 'Tools', level: 85, description: 'Version control, branching, collaboration workflows', order: 5 },
  { id: 'skill-006', name: 'GitHub', category: 'Tools', level: 85, description: 'Repositories, collaboration, deployment integration', order: 6 }
];

const DEFAULT_SETTINGS = {
  siteTitle: 'JUSHQIN DIGITAL',
  theme: 'dark',
  accentPrimary: '#7C3AED',
  accentSecondary: '#22D3EE',
  heroBackground: '',
  logoText: 'JUSHQIN',
  showNoise: true
};

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function getData(key) {
  const storageKey = STORAGE_KEYS[key] || key;
  const raw = localStorage.getItem(storageKey);
  if (raw === null) return null;
  return safeParse(raw, null);
}

function saveData(key, data) {
  const storageKey = STORAGE_KEYS[key] || key;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Storage save failed:', e);
    return false;
  }
}

function updateData(key, updater) {
  const current = getData(key);
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  return saveData(key, next);
}

function deleteData(key) {
  const storageKey = STORAGE_KEYS[key] || key;
  localStorage.removeItem(storageKey);
}

function initializeData() {
  if (!getData('profile')) saveData('profile', DEFAULT_PROFILE);
  if (!getData('projects')) saveData('projects', DEFAULT_PROJECTS);
  if (!getData('skills')) saveData('skills', DEFAULT_SKILLS);
  if (!getData('messages')) saveData('messages', []);
  if (!getData('settings')) saveData('settings', DEFAULT_SETTINGS);
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function getProfile() {
  initializeData();
  return getData('profile') || DEFAULT_PROFILE;
}

function getProjects() {
  initializeData();
  const projects = getData('projects') || DEFAULT_PROJECTS;
  return [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function getSkills() {
  initializeData();
  const skills = getData('skills') || DEFAULT_SKILLS;
  return [...skills].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function getMessages() {
  initializeData();
  return getData('messages') || [];
}

function getSettings() {
  initializeData();
  return getData('settings') || DEFAULT_SETTINGS;
}

function isAuthenticated() {
  return sessionStorage.getItem(STORAGE_KEYS.session) === 'authenticated';
}

function setAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(STORAGE_KEYS.session, 'authenticated');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.session);
  }
}

// Initialize on load

function migrateData() {
  const VERSION = 4;
  const v = parseInt(localStorage.getItem('jushqin_data_version') || '0', 10);
  if (v < VERSION) {
    const p = getData('profile');
    if (p) {
      if (!p.name || p.name === 'JUSHQIN' || p.name === 'Jushqin') {
        p.name = 'Quyliyev Jushqin';
      }
      if (!p.heroHeadline || String(p.heroHeadline).indexOf('BUILDING DIGITAL') !== -1 || String(p.heroHeadline).indexOf('MY WORLD') !== -1) {
        p.heroHeadline = 'QUYLIEV JUSHQIN';
      }
      if (!p.heroSubtitle || String(p.heroSubtitle).indexOf('Creative Thinker') !== -1 || String(p.heroSubtitle).indexOf('JUSHQIN —') !== -1) {
        p.heroSubtitle = 'Frontend Developer';
      }
      if (!p.intro || String(p.intro).indexOf('men JUSHQIN') !== -1) {
        if (!p.telegram || p.telegram === '@jushqin') p.telegram = 'Coder_Joshqin';
      if (!p.instagram || p.instagram === '@jushqin.digital') p.instagram = 'n1borz__';
      p.intro = "Salom, men Quyliyev Jushqin. Men zamonaviy, interaktiv va kreativ web saytlar yarataman. HTML, CSS va JavaScript bilan to'liq ishlaydigan portfolio, biznes saytlar va interaktiv interfeyslar yasayman.";
      }
      saveData('profile', p);
    }
    // Always restore the 6 real project URLs
    saveData('projects', DEFAULT_PROJECTS);
    if (!getData('skills')) saveData('skills', DEFAULT_SKILLS);
    localStorage.setItem('jushqin_data_version', String(VERSION));
  }
}

if (typeof window !== 'undefined') {
  initializeData();
  migrateData();
}
