import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  api,
  isAuthenticated,
  removeAuthToken,
  resolveMediaUrl,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  ProfileItem,
  StatsSummary,
} from '@/lib/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  LayoutDashboard, FolderGit2, Cpu, Briefcase, User, LogOut, Plus,
  Trash2, Edit, ExternalLink, Play, Image as ImageIcon, Eye, Users,
  TrendingUp, Clock, Globe, Shield, Upload, Check, RefreshCw
} from 'lucide-react'

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'skills' | 'experiences' | 'profile' | 'security'>('stats')

  // Data states
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [profile, setProfile] = useState<ProfileItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // Modals & form states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem>>({
    title: '',
    subtitle: '',
    description: '',
    longDescription: '',
    tag: 'Featured',
    year: '2025',
    stack: [],
    presentationImageUrl: '',
    presentationVideoUrl: '',
    githubUrl: '',
    liveDemoUrl: '',
    featured: false,
    sortOrder: 0,
  })
  const [stackInput, setStackInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // Skill modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend' })

  // Experience modal
  const [isExpModalOpen, setIsExpModalOpen] = useState(false)
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null)
  const [expForm, setExpForm] = useState<Partial<ExperienceItem>>({
    title: '',
    company: '',
    period: '',
    description: '',
    skills: [],
  })
  const [expSkillsInput, setExpSkillsInput] = useState('')

  // Password change form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login')
      return
    }
    loadAllData()
  }, [navigate])

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg)
    setTimeout(() => setFeedbackMessage(null), 3500)
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [statsData, projectsData, skillsData, expsData, profileData] = await Promise.allSettled([
        api.getStatsSummary(),
        api.getProjects(),
        api.getSkills(),
        api.getExperiences(),
        api.getProfile(),
      ])

      if (statsData.status === 'fulfilled') setStats(statsData.value)
      if (projectsData.status === 'fulfilled') setProjects(projectsData.value)
      if (skillsData.status === 'fulfilled') setSkills(skillsData.value)
      if (expsData.status === 'fulfilled') setExperiences(expsData.value)
      if (profileData.status === 'fulfilled') setProfile(profileData.value)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    navigate('/admin/login')
  }

  // --- Project CRUD ---
  const handleOpenProjectModal = (proj?: ProjectItem) => {
    if (proj) {
      setEditingProject(proj)
      setProjectForm({ ...proj })
      setStackInput(proj.stack ? proj.stack.join(', ') : '')
    } else {
      setEditingProject(null)
      setProjectForm({
        title: '',
        subtitle: '',
        description: '',
        longDescription: '',
        tag: 'Featured',
        year: '2025',
        stack: [],
        presentationImageUrl: '',
        presentationVideoUrl: '',
        githubUrl: '',
        liveDemoUrl: '',
        featured: false,
        sortOrder: projects.length + 1,
      })
      setStackInput('')
    }
    setIsProjectModalOpen(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const stackArray = stackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        ...projectForm,
        stack: stackArray,
      }

      if (editingProject?.id) {
        await api.updateProject(editingProject.id, payload)
        showFeedback('Projet mis à jour avec succès')
      } else {
        await api.createProject(payload)
        showFeedback('Nouveau projet créé avec succès')
      }

      setIsProjectModalOpen(false)
      const updated = await api.getProjects()
      setProjects(updated)
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde du projet')
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return
    try {
      await api.deleteProject(id)
      setProjects(projects.filter((p) => p.id !== id))
      showFeedback('Projet supprimé')
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await api.uploadImage(file)
      setProjectForm((prev) => ({ ...prev, presentationImageUrl: res.url }))
      showFeedback('Image de présentation uploadée !')
    } catch (err: any) {
      alert(err.message || 'Échec de l\'upload')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    try {
      const res = await api.uploadVideo(file)
      setProjectForm((prev) => ({ ...prev, presentationVideoUrl: res.url }))
      showFeedback('Vidéo de présentation uploadée avec succès !')
    } catch (err: any) {
      alert(err.message || 'Échec de l\'upload vidéo')
    } finally {
      setUploadingVideo(false)
    }
  }

  // --- Skills CRUD ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillForm.name.trim()) return
    try {
      await api.createSkill({
        name: skillForm.name.trim(),
        category: skillForm.category,
        sortOrder: skills.length + 1,
      })
      setSkillForm({ name: '', category: skillForm.category })
      setIsSkillModalOpen(false)
      const updated = await api.getSkills()
      setSkills(updated)
      showFeedback('Compétence ajoutée')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteSkill = async (id: number) => {
    try {
      await api.deleteSkill(id)
      setSkills(skills.filter((s) => s.id !== id))
      showFeedback('Compétence supprimée')
    } catch (err: any) {
      alert(err.message)
    }
  }

  // --- Experience CRUD ---
  const handleOpenExpModal = (exp?: ExperienceItem) => {
    if (exp) {
      setEditingExp(exp)
      setExpForm({ ...exp })
      setExpSkillsInput(exp.skills ? exp.skills.join(', ') : '')
    } else {
      setEditingExp(null)
      setExpForm({ title: '', company: '', period: '', description: '', skills: [] })
      setExpSkillsInput('')
    }
    setIsExpModalOpen(true)
  }

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const skillsArr = expSkillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      const payload = { ...expForm, skills: skillsArr }
      if (editingExp?.id) {
        await api.updateExperience(editingExp.id, payload)
        showFeedback('Expérience mise à jour')
      } else {
        await api.createExperience(payload)
        showFeedback('Expérience ajoutée')
      }
      setIsExpModalOpen(false)
      const updated = await api.getExperiences()
      setExperiences(updated)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteExp = async (id: number) => {
    if (!confirm('Supprimer cette expérience ?')) return
    try {
      await api.deleteExperience(id)
      setExperiences(experiences.filter((e) => e.id !== id))
      showFeedback('Expérience supprimée')
    } catch (err: any) {
      alert(err.message)
    }
  }

  // --- Profile Save ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    try {
      const updated = await api.updateProfile(profile)
      setProfile(updated)
      showFeedback('Profil mis à jour avec succès')
    } catch (err: any) {
      alert(err.message)
    }
  }

  // --- Password Change ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMessage(null)
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage({ type: 'error', text: 'Les deux mots de passe ne correspondent pas' })
      return
    }
    try {
      await api.changePassword(pwForm.currentPassword, pwForm.newPassword)
      setPwMessage({ type: 'success', text: 'Mot de passe modifié avec succès' })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setPwMessage({ type: 'error', text: err.message || 'Erreur' })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="font-display font-bold text-lg tracking-tight hover:text-primary transition-colors flex items-center gap-2"
          >
            HSH<span className="text-primary">.dev</span>
            <span className="text-xs font-mono text-muted-foreground border border-border px-2 py-0.5 rounded-full flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Voir le site
            </span>
          </Link>
          <span className="h-4 w-px bg-border hidden sm:block" />
          <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
            <Shield className="w-3 h-3" /> Admin Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            title="Rafraîchir les données"
            className="p-2 rounded-xl border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:border-destructive/50 text-xs font-mono text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-4 h-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-border/70 bg-card/40 p-4 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'stats'
                ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Statistiques Visiteurs
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'projects'
                ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Projets & Médias ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'skills'
                ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Compétences ({skills.length})
          </button>

          <button
            onClick={() => setActiveTab('experiences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'experiences'
                ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Expériences ({experiences.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <User className="w-4 h-4" />
            Profil & À propos
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'security'
                ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Shield className="w-4 h-4" />
            Sécurité Admin
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* TAB 1: VISITOR STATISTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight mb-1">
                  Statistiques des Visiteurs
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  Suivi en temps réel de l'audience et de l'intérêt porté à vos projets
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Total Visites</span>
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold font-display text-foreground">
                    {stats?.totalVisits ?? 0}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">Toutes pages confondues</p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Visiteurs Uniques</span>
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold font-display text-primary">
                    {stats?.uniqueVisitors ?? 0}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">Empreintes IP distinctes</p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Aujourd'hui</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold font-display text-foreground">
                    {stats?.todayVisits ?? 0}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">Visites depuis 00h00</p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">7 Derniers Jours</span>
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-3xl font-bold font-display text-foreground">
                    {stats?.weekVisits ?? 0}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">Tendance hebdomadaire</p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur space-y-2 col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Vues Projets</span>
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-3xl font-bold font-display text-amber-400">
                    {stats?.totalProjectViews ?? 0}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">Clics sur présentations</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Daily Visits Chart */}
                <div className="md:col-span-2 p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Visites journalières (30 derniers jours)</span>
                    <span className="text-primary font-bold">Activité</span>
                  </h3>
                  <div className="h-64 w-full">
                    {stats?.dailyVisits && stats.dailyVisits.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.dailyVisits}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="visitDate" stroke="#737373" fontSize={11} tickLine={false} />
                          <YAxis stroke="#737373" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#171717',
                              borderColor: '#333',
                              borderRadius: '8px',
                              fontFamily: 'monospace',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="count" name="Visites totales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="uniqueCount" name="Visiteurs uniques" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs font-mono text-muted-foreground">
                        Enregistrement des premières visites en cours...
                      </div>
                    )}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Répartition par appareil
                  </h3>
                  <div className="h-64 w-full flex items-center justify-center">
                    {stats?.deviceBreakdown && stats.deviceBreakdown.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.deviceBreakdown}
                            dataKey="count"
                            nameKey="device"
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {stats.deviceBreakdown.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#171717',
                              borderColor: '#333',
                              borderRadius: '8px',
                              fontFamily: 'monospace',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs font-mono text-muted-foreground">
                        Données d'appareils non disponibles
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects popularity leaderboard */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Projets les plus consultés (Classement)
                </h3>
                <div className="space-y-3">
                  {projects.map((proj) => {
                    const views = proj.viewCount || 0
                    const maxViews = Math.max(...projects.map((p) => p.viewCount || 0), 1)
                    const percent = Math.round((views / maxViews) * 100)
                    return (
                      <div key={proj.id} className="p-3.5 rounded-xl border border-border/60 bg-background/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-semibold text-foreground">{proj.title}</span>
                          <span className="text-primary font-bold flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> {views} vues
                          </span>
                        </div>
                        <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent visits table */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Dernières visites enregistrées
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground">
                        <th className="pb-3 font-normal">Date & Heure</th>
                        <th className="pb-3 font-normal">Empreinte IP</th>
                        <th className="pb-3 font-normal">Appareil</th>
                        <th className="pb-3 font-normal">Navigateur</th>
                        <th className="pb-3 font-normal">OS</th>
                        <th className="pb-3 font-normal">Page</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {stats?.recentVisits && stats.recentVisits.length > 0 ? (
                        stats.recentVisits.map((v) => (
                          <tr key={v.id} className="hover:bg-muted/20">
                            <td className="py-2.5 text-foreground">
                              {new Date(v.visitedAt).toLocaleString('fr-FR')}
                            </td>
                            <td className="py-2.5 text-muted-foreground">{v.ipHash?.substring(0, 10)}...</td>
                            <td className="py-2.5 text-foreground">{v.deviceType}</td>
                            <td className="py-2.5 text-foreground">{v.browser}</td>
                            <td className="py-2.5 text-foreground">{v.operatingSystem}</td>
                            <td className="py-2.5 text-primary">{v.pageUrl || '/'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            Aucune visite enregistrée pour le moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight">
                    Gestion des Projets
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Ajoutez, modifiez et gérez les présentations vidéo & image de chaque réalisation
                  </p>
                </div>
                <button
                  onClick={() => handleOpenProjectModal()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 shadow-md shadow-primary/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Projet
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-border bg-card/60 overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-colors"
                  >
                    <div>
                      {/* Media Thumbnail */}
                      <div className="relative aspect-video bg-black/50 overflow-hidden">
                        {proj.presentationImageUrl ? (
                          <img
                            src={resolveMediaUrl(proj.presentationImageUrl)}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8 opacity-40" />
                          </div>
                        )}

                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-background/80 backdrop-blur text-[10px] font-mono text-primary border border-border">
                            {proj.tag}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-background/80 backdrop-blur text-[10px] font-mono text-muted-foreground border border-border">
                            {proj.year}
                          </span>
                        </div>

                        {proj.presentationVideoUrl && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-mono flex items-center gap-1 shadow-md">
                            <Play className="w-2.5 h-2.5 fill-current" /> Vidéo active
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <p className="font-mono text-xs text-primary">{proj.subtitle}</p>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.stack?.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-border/60 flex items-center justify-between bg-background/30">
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {proj.viewCount || 0} vues
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenProjectModal(proj)}
                          className="p-2 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => proj.id && handleDeleteProject(proj.id)}
                          className="p-2 rounded-lg border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS CRUD */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight">
                    Compétences & Technologies
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Gérez la liste de vos savoir-faire affichés sur le portfolio
                  </p>
                </div>
                <button
                  onClick={() => setIsSkillModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 shadow-md shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une compétence
                </button>
              </div>

              {/* Skills categorized */}
              <div className="grid md:grid-cols-2 gap-6">
                {['Frontend', 'Backend', 'Databases', 'Tools & DevOps', 'Other'].map((cat) => {
                  const catSkills = skills.filter((s) => s.category === cat)
                  return (
                    <div key={cat} className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                      <h3 className="font-mono text-sm font-semibold text-primary uppercase tracking-wider flex items-center justify-between">
                        <span>{cat}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {catSkills.length} éléments
                        </span>
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((sk) => (
                          <div
                            key={sk.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 text-xs font-mono text-foreground hover:border-primary/50 transition-colors"
                          >
                            <span>{sk.name}</span>
                            <button
                              onClick={() => sk.id && handleDeleteSkill(sk.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Supprimer"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {catSkills.length === 0 && (
                          <p className="text-xs font-mono text-muted-foreground py-2">
                            Aucune compétence dans cette catégorie.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCES CRUD */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight">
                    Parcours & Expériences
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Gérez votre chronologie professionnelle et académique
                  </p>
                </div>
                <button
                  onClick={() => handleOpenExpModal()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 shadow-md shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une expérience
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-2xl border border-border bg-card/60 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-primary uppercase">{exp.period}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-semibold text-foreground text-lg">{exp.title}</span>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground max-w-2xl">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.skills?.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleOpenExpModal(exp)}
                        className="p-2.5 rounded-xl border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exp.id && handleDeleteExp(exp.id)}
                        className="p-2.5 rounded-xl border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & ABOUT CRUD */}
          {activeTab === 'profile' && profile && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">
                  Informations du Profil
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  Personnalisez votre biographie, statut, coordonnées et liens publics
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-8 rounded-3xl border border-border bg-card/60 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Titre Professionnel
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Slogan / Sous-titre section À propos
                  </label>
                  <input
                    type="text"
                    value={profile.subtitle}
                    onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Biographie complète (séparez les paragraphes par un double saut de ligne)
                  </label>
                  <textarea
                    rows={6}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Statut actuel (Currently)
                    </label>
                    <input
                      type="text"
                      value={profile.currentStatus}
                      onChange={(e) => setProfile({ ...profile, currentStatus: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Langues
                    </label>
                    <input
                      type="text"
                      value={profile.languages}
                      onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Focus principal
                    </label>
                    <input
                      type="text"
                      value={profile.focus}
                      onChange={(e) => setProfile({ ...profile, focus: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={profile.githubUrl}
                      onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={profile.linkedinUrl}
                      onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20"
                >
                  Enregistrer les modifications du profil
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SECURITY / CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">
                  Sécurité du Compte Admin
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  Modifiez votre mot de passe d'accès au panneau d'administration
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="p-8 rounded-3xl border border-border bg-card/60 space-y-4">
                {pwMessage && (
                  <div
                    className={`p-3 rounded-xl font-mono text-xs ${
                      pwMessage.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}
                  >
                    {pwMessage.text}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    required
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20 mt-2"
                >
                  Mettre à jour le mot de passe
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: PROJECT CREATE / EDIT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="font-display text-2xl font-bold text-foreground">
                {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Sous-titre / Rôle
                  </label>
                  <input
                    type="text"
                    value={projectForm.subtitle}
                    onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Tag / Catégorie
                  </label>
                  <input
                    type="text"
                    value={projectForm.tag}
                    onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
                    placeholder="Featured, Backend, SaaS..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Année
                  </label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={projectForm.sortOrder}
                    onChange={(e) => setProjectForm({ ...projectForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Description courte (aperçu carte)
                </label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Description détaillée pour la présentation
                </label>
                <textarea
                  rows={4}
                  value={projectForm.longDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                  placeholder="Détails de l'architecture, challenge relevé, impact..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Technologies (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="Spring Boot, React, PostgreSQL, Docker"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* MEDIA SECTION: PRESENTATION IMAGE */}
              <div className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> Image de Présentation
                  </span>
                  <label className="cursor-pointer text-xs font-mono bg-muted/60 hover:bg-muted text-foreground px-3 py-1.5 rounded-lg border border-border flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? 'Upload...' : 'Uploader une image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={projectForm.presentationImageUrl || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, presentationImageUrl: e.target.value })}
                  placeholder="https://... ou chemin /uploads/images/..."
                  className="w-full px-3 py-1.5 rounded-xl border border-border bg-background/50 font-mono text-xs focus:border-primary focus:outline-none"
                />
                {projectForm.presentationImageUrl && (
                  <div className="h-28 rounded-lg overflow-hidden border border-border w-48 relative">
                    <img
                      src={resolveMediaUrl(projectForm.presentationImageUrl)}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* MEDIA SECTION: PRESENTATION VIDEO */}
              <div className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary flex items-center gap-1.5">
                    <Play className="w-4 h-4 fill-current" /> Vidéo de Présentation
                  </span>
                  <label className="cursor-pointer text-xs font-mono bg-muted/60 hover:bg-muted text-foreground px-3 py-1.5 rounded-lg border border-border flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingVideo ? 'Upload vidéo...' : 'Uploader une vidéo (MP4/WebM)'}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={projectForm.presentationVideoUrl || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, presentationVideoUrl: e.target.value })}
                  placeholder="https://... ou lien YouTube / Vimeo ou /uploads/videos/..."
                  className="w-full px-3 py-1.5 rounded-xl border border-border bg-background/50 font-mono text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* LINKS */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Lien Démo Live
                  </label>
                  <input
                    type="text"
                    value={projectForm.liveDemoUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })}
                    placeholder="https://monprojet.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Lien GitHub
                  </label>
                  <input
                    type="text"
                    value={projectForm.githubUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-semibold hover:opacity-90 shadow-md shadow-primary/20"
                >
                  Enregistrer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SKILL CREATE */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-foreground">Ajouter une Compétence</h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">Nom</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="ex: Docker, Spring Boot, Vue.js..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">Catégorie</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Databases">Databases</option>
                  <option value="Tools & DevOps">Tools & DevOps</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXPERIENCE CREATE / EDIT */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-foreground">
              {editingExp ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
            </h3>
            <form onSubmit={handleSaveExp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">Titre du poste *</label>
                <input
                  type="text"
                  required
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Entreprise / Projet *</label>
                  <input
                    type="text"
                    required
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Période</label>
                  <input
                    type="text"
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="2024 — Présent"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Compétences clés (séparées par virgules)
                </label>
                <input
                  type="text"
                  value={expSkillsInput}
                  onChange={(e) => setExpSkillsInput(e.target.value)}
                  placeholder="React, Spring Boot, PostgreSQL"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background/50 font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
