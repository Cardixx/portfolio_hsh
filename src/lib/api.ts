export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('hsh_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('hsh_admin_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('hsh_admin_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

function getHeaders(contentType = 'application/json'): HeadersInit {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Interfaces
export interface ProjectItem {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  stack: string[];
  accent?: string;
  tag?: string;
  year?: string;
  presentationImageUrl?: string;
  presentationVideoUrl?: string;
  galleryImages?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  featured?: boolean;
  sortOrder?: number;
  viewCount?: number;
  createdAt?: string;
}

export interface ExperienceItem {
  id?: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  sortOrder?: number;
}

export interface SkillItem {
  id?: number;
  name: string;
  category: string;
  sortOrder?: number;
}

export interface ProfileItem {
  id?: number;
  fullName: string;
  title: string;
  subtitle: string;
  bio: string;
  currentStatus: string;
  languages: string;
  focus: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  heroImageUrl?: string;
  resumeUrl?: string;
}

export interface VisitorStatItem {
  id: number;
  ipHash: string;
  deviceType: string;
  browser: string;
  operatingSystem: string;
  pageUrl: string;
  referer: string;
  visitedAt: string;
}

export interface StatsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  weekVisits: number;
  totalProjectViews: number;
  topProjects: ProjectItem[];
  deviceBreakdown: { device: string; count: number }[];
  dailyVisits: { visitDate: string; count: number; uniqueCount: number }[];
  recentVisits: VisitorStatItem[];
}

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Identifiants invalides');
    }
    const data = await res.json();
    setAuthToken(data.token);
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Non authentifié');
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors du changement de mot de passe');
    }
    return res.json();
  },

  // Projects
  async getProjects(): Promise<ProjectItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/projects`);
    if (!res.ok) throw new Error('Impossible de charger les projets');
    return res.json();
  },

  async getProject(id: number): Promise<ProjectItem> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    if (!res.ok) throw new Error('Projet introuvable');
    return res.json();
  },

  async createProject(project: Partial<ProjectItem>): Promise<ProjectItem> {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Échec de création du projet');
    return res.json();
  },

  async updateProject(id: number, project: Partial<ProjectItem>): Promise<ProjectItem> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Échec de mise à jour du projet');
    return res.json();
  },

  async deleteProject(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Échec de suppression du projet');
  },

  async recordProjectView(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/projects/${id}/view`, {
        method: 'POST',
      });
    } catch {
      // Non-blocking
    }
  },

  // Skills
  async getSkills(): Promise<SkillItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/skills`);
    if (!res.ok) throw new Error('Impossible de charger les compétences');
    return res.json();
  },

  async createSkill(skill: Partial<SkillItem>): Promise<SkillItem> {
    const res = await fetch(`${API_BASE_URL}/api/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('Échec de création de la compétence');
    return res.json();
  },

  async updateSkill(id: number, skill: Partial<SkillItem>): Promise<SkillItem> {
    const res = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('Échec de mise à jour de la compétence');
    return res.json();
  },

  async deleteSkill(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Échec de suppression de la compétence');
  },

  // Experiences
  async getExperiences(): Promise<ExperienceItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/experiences`);
    if (!res.ok) throw new Error('Impossible de charger les expériences');
    return res.json();
  },

  async createExperience(experience: Partial<ExperienceItem>): Promise<ExperienceItem> {
    const res = await fetch(`${API_BASE_URL}/api/experiences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(experience),
    });
    if (!res.ok) throw new Error('Échec de création de l\'expérience');
    return res.json();
  },

  async updateExperience(id: number, experience: Partial<ExperienceItem>): Promise<ExperienceItem> {
    const res = await fetch(`${API_BASE_URL}/api/experiences/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(experience),
    });
    if (!res.ok) throw new Error('Échec de mise à jour de l\'expérience');
    return res.json();
  },

  async deleteExperience(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/experiences/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Échec de suppression de l\'expérience');
  },

  // Profile
  async getProfile(): Promise<ProfileItem> {
    const res = await fetch(`${API_BASE_URL}/api/profile`);
    if (!res.ok) throw new Error('Impossible de charger le profil');
    return res.json();
  },

  async updateProfile(profile: Partial<ProfileItem>): Promise<ProfileItem> {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Échec de mise à jour du profil');
    return res.json();
  },

  // Statistics
  async recordVisit(pageUrl = window.location.pathname, referer = document.referrer) {
    try {
      await fetch(`${API_BASE_URL}/api/stats/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageUrl, referer }),
      });
    } catch {
      // Non-blocking analytics
    }
  },

  async getStatsSummary(): Promise<StatsSummary> {
    const res = await fetch(`${API_BASE_URL}/api/stats/summary`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Impossible de charger les statistiques');
    return res.json();
  },

  async getRecentVisits(limit = 20): Promise<VisitorStatItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/stats/recent?limit=${limit}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Impossible de charger les visites récentes');
    return res.json();
  },

  // Uploads
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();

    const res = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) throw new Error('Échec de l\'envoi de l\'image');
    return res.json();
  },

  async uploadVideo(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();

    const res = await fetch(`${API_BASE_URL}/api/upload/video`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) throw new Error('Échec de l\'envoi de la vidéo');
    return res.json();
  },
};
