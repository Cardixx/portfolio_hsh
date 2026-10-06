import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await api.login(username, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au Portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl p-8 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Espace Administrateur
            </h1>
            <p className="text-xs font-mono text-muted-foreground">
              Connectez-vous pour gérer les projets, compétences et consulter les statistiques
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-semibold tracking-wide hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="pt-4 border-t border-border/50 text-center">
            <p className="text-[11px] font-mono text-muted-foreground">
              Identifiants par défaut : <span className="text-foreground">admin</span> / <span className="text-foreground">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
