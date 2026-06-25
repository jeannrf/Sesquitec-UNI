import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function IniciarSesion() {
  const { login, loginWithGoogle, completeGoogleRegistration, user, openAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Forgot password sub-state
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.verified) {
      navigate(redirectPath)
    }
  }, [user, navigate, redirectPath])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password) {
      setError('Por favor complete todos los campos obligatorios.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingrese un correo electrónico válido.')
      return
    }

    // Call authentication service
    const res = login(email, password)
    if (res.success) {
      setSuccess('¡Inicio de sesión exitoso!')
      setTimeout(() => {
        navigate(redirectPath)
      }, 1000)
    } else {
      setError(res.error || 'Credenciales incorrectas.')
    }
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setError('')
    setForgotSuccess('')

    if (!forgotEmail.trim()) {
      setError('Por favor ingrese su correo electrónico.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setError('Por favor ingrese un correo electrónico válido.')
      return
    }

    // Simulation
    setForgotSuccess('Se ha enviado un enlace de recuperación a su correo electrónico.')
    setTimeout(() => {
      setShowForgot(false)
      setForgotSuccess('')
      setForgotEmail('')
    }, 4000)
  }

  // Google OAuth Popup Selector Simulation
  const triggerGoogleLogin = () => {
    setError('')
    
    const mockGoogleAccounts = [
      { nombres: 'Diego', apellidos: 'López Ramos', email: 'diego.lopez@uni.pe', picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
      { nombres: 'Ana Maria', apellidos: 'Castillo Vega', email: 'ana.castillo@gmail.com', picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
    ]

    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans'
    
    const popup = document.createElement('div')
    popup.className = 'bg-white w-full max-w-sm rounded-lg shadow-2xl border border-gray-200 overflow-hidden'
    
    let accountsHtml = mockGoogleAccounts.map((acc, idx) => `
      <button class="account-btn flex items-center gap-3 w-full p-3.5 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors cursor-pointer" data-idx="${idx}">
        <img src="${acc.picture}" class="w-9 h-9 rounded-full object-cover border border-gray-200" />
        <div>
          <p class="text-sm font-semibold text-gray-800">${acc.nombres} ${acc.apellidos}</p>
          <p class="text-xs text-gray-500">${acc.email}</p>
        </div>
      </button>
    `).join('')

    popup.innerHTML = `
      <div class="p-5 border-b border-gray-100 bg-[#f8f9fa] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.47C21.68,11.83 21.56,11.45 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.58c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.57c-0.9,0.6 -2.07,0.97 -3.23,0.97 -2.48,0 -4.59,-1.67 -5.34,-3.93H2.69v2.66C4.18,18.37 7.84,20.58 12,20.58z" fill="#34A853" />
              <path d="M6.66,12.85c-0.19,-0.57 -0.3,-1.18 -0.3,-1.8s0.11,-1.23 0.3,-1.8V6.59H2.69c-0.64,1.28 -1,2.72 -1,4.24s0.36,2.96 1,4.24L6.66,12.85z" fill="#FBBC05" />
              <path d="M12,5.22c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.53 14.42,1.75 12,1.75c-4.16,0 -7.82,2.21 -9.31,5.18l3.97,2.66C7.41,6.89 9.52,5.22 12,5.22z" fill="#EA4335" />
            </g>
          </svg>
          <span class="text-sm font-semibold text-gray-700">Acceder con Google</span>
        </div>
        <button id="close-google" class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="py-2">
        ${accountsHtml}
        <button id="google-new-account" class="flex items-center gap-3 w-full p-4 hover:bg-gray-50 text-left transition-colors text-sm font-medium text-blue-600 cursor-pointer">
          <span class="w-9 h-9 rounded-full border border-dashed border-blue-600 flex items-center justify-center shrink-0 text-lg">+</span>
          Usar otra cuenta
        </button>
      </div>
      <div class="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 text-center leading-normal">
        Google compartirá tu información de cuenta con la web oficial de Sesquicentenario UNI.
      </div>
    `
    
    document.body.appendChild(overlay)
    overlay.appendChild(popup)

    const cleanup = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay)
      }
    }

    document.getElementById('close-google').onclick = cleanup

    popup.querySelectorAll('.account-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = btn.getAttribute('data-idx')
        const account = mockGoogleAccounts[idx]
        cleanup()
        handleGoogleCallback(account)
      }
    })

    document.getElementById('google-new-account').onclick = () => {
      popup.innerHTML = `
        <div class="p-5 border-b border-gray-100 bg-[#f8f9fa] flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-700">Usar otra cuenta</span>
          <button id="close-google-new" class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form id="google-new-form" class="p-5 space-y-4 font-sans">
          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Correo Electrónico *</label>
            <input type="email" id="google-new-email" required class="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404]" placeholder="ejemplo@correo.com" />
            <p id="google-new-email-error" class="text-red-500 text-xs mt-1 hidden">Correo inválido</p>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Nombres *</label>
            <input type="text" id="google-new-names" required class="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404]" placeholder="Nombres" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Apellidos *</label>
            <input type="text" id="google-new-apellidos" required class="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404]" placeholder="Apellidos" />
          </div>
          <div class="flex gap-2 justify-end pt-2">
            <button type="button" id="google-new-cancel" class="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 transition-colors cursor-pointer">
              Volver
            </button>
            <button type="submit" class="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-bold px-4 py-2 transition-colors cursor-pointer">
              Continuar
            </button>
          </div>
        </form>
      `
      
      document.getElementById('close-google-new').onclick = cleanup
      document.getElementById('google-new-cancel').onclick = () => {
        cleanup()
        triggerGoogleLogin()
      }

      document.getElementById('google-new-form').onsubmit = (e) => {
        e.preventDefault()
        const email = document.getElementById('google-new-email').value.trim()
        const names = document.getElementById('google-new-names').value.trim()
        const apellidos = document.getElementById('google-new-apellidos').value.trim()

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          document.getElementById('google-new-email-error').classList.remove('hidden')
          return
        }

        cleanup()
        handleGoogleCallback({
          nombres: names,
          apellidos: apellidos,
          email: email,
          picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(names)}`
        })
      }
    }
  }

  const handleGoogleCallback = (googleUser) => {
    const res = loginWithGoogle(googleUser)
    if (res.success) {
      if (res.isNew) {
        // Redirect to registration page with google data so they can finish filling it
        navigate(`/registrarse?google=true&email=${encodeURIComponent(googleUser.email)}&nombres=${encodeURIComponent(googleUser.nombres)}&apellidos=${encodeURIComponent(googleUser.apellidos)}&pic=${encodeURIComponent(googleUser.picture)}`)
      } else {
        setSuccess('¡Inicio de sesión con Google exitoso!')
        setTimeout(() => {
          navigate(redirectPath)
        }, 1000)
      }
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 shadow-xl overflow-hidden rounded-none flex flex-col">
        {/* Decorative Top Accent */}
        <div className="h-2 bg-[#800404]" />
        
        <div className="p-8 md:p-10">
          {/* Brand header */}
          <div className="text-center mb-8">
            <span className="bg-[#800404] text-white text-[10px] font-black px-3 py-1 tracking-widest uppercase inline-block mb-3">
              UNI · Sesquicentenario
            </span>
            <h2 className="text-2xl font-black text-gray-900">Iniciar Sesión</h2>
            <p className="text-xs text-gray-400 mt-1.5">
              Accede a tus eventos, entradas QR y certificados académicos oficiales.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3.5 mb-5 text-xs text-red-700 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3.5 mb-5 text-xs text-green-700 flex items-start gap-2">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {forgotSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3.5 mb-5 text-xs text-green-700 flex items-start gap-2">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          {/* FORMS */}
          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-400 rounded-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setError(''); }}
                    className="text-xs text-[#800404] hover:underline font-medium cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-400 rounded-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm cursor-pointer border-0 mt-2"
              >
                Iniciar Sesión
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-medium">o</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={triggerGoogleLogin}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 font-bold text-sm transition-colors flex items-center justify-center gap-2.5 cursor-pointer bg-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continuar con Google
              </button>

              <p className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-100">
                ¿No tienes una cuenta?{' '}
                <Link
                  to="/registrarse"
                  className="text-[#800404] font-black hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setError(''); }}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} /> Volver al Inicio de Sesión
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-400 rounded-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm cursor-pointer border-0 mt-2"
              >
                Enviar Enlace de Recuperación
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
