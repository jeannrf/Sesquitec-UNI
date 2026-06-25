import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { X, Mail, Lock, User, Phone, Landmark, AlertCircle, CheckCircle } from 'lucide-react'

export default function AuthModal({ isOpen, onClose, initialView = 'login', onAuthSuccess }) {
  const { 
    login, 
    register, 
    verifyEmail, 
    resendVerificationCode, 
    loginWithGoogle, 
    completeGoogleRegistration,
    recoverPassword 
  } = useAuth()

  const [view, setView] = useState(initialView) // 'login' | 'register' | 'recover' | 'verify' | 'google-complete'
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    dni: '',
    telefono: '',
    institucion: 'Universidad Nacional de Ingeniería',
    password: '',
    confirmPassword: ''
  })
  
  // Google OAuth specific states
  const [googleTempUser, setGoogleTempUser] = useState(null)
  
  // Success & Error tracking
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedCode, setGeneratedCode] = useState('') // For email verification convenience in local testing

  useEffect(() => {
    if (isOpen) {
      setView(initialView)
      setError('')
      setSuccess('')
      setForm({
        nombres: '',
        apellidos: '',
        email: '',
        dni: '',
        telefono: '',
        institucion: 'Universidad Nacional de Ingeniería',
        password: '',
        confirmPassword: ''
      })
    }
  }, [isOpen, initialView])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // LOGIN FLOW
  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    
    if (!form.email || !form.password) {
      setError('Por favor complete todos los campos.')
      return
    }

    const res = login(form.email, form.password)
    if (res.success) {
      if (onAuthSuccess) onAuthSuccess()
      onClose()
    } else {
      setError(res.error)
    }
  }

  // REGISTER FLOW
  const handleRegister = (e) => {
    e.preventDefault()
    setError('')

    // Validations
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.email.trim() || !form.dni.trim() || !form.password) {
      setError('Por favor complete todos los campos obligatorios (*).')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Por favor ingrese un correo electrónico válido.')
      return
    }

    if (!/^\d{8}$/.test(form.dni)) {
      setError('El DNI debe contener exactamente 8 números.')
      return
    }

    if (form.telefono && !/^\d{9}$/.test(form.telefono)) {
      setError('El teléfono debe tener 9 números (Ej: 999888777).')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const res = register({
      nombres: form.nombres,
      apellidos: form.apellidos,
      email: form.email,
      dni: form.dni,
      telefono: form.telefono,
      institucion: form.institucion,
      password: form.password
    })

    if (res.success) {
      setGeneratedCode(res.verificationCode)
      setView('verify')
    } else {
      setError(res.error)
    }
  }

  // EMAIL VERIFICATION FLOW
  const [verificationCodeInput, setVerificationCodeInput] = useState('')
  const handleVerify = (e) => {
    e.preventDefault()
    setError('')

    const res = verifyEmail(verificationCodeInput)
    if (res.success) {
      setSuccess('¡Correo verificado con éxito!')
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess()
        onClose()
      }, 1500)
    } else {
      setError(res.error)
    }
  }

  const handleResendCode = () => {
    setError('')
    const res = resendVerificationCode()
    if (res.success) {
      setGeneratedCode(res.verificationCode)
      setSuccess('Código reenviado con éxito.')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(res.error)
    }
  }

  // PASSWORD RECOVERY FLOW
  const handleRecover = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email) {
      setError('Por favor ingrese su correo electrónico.')
      return
    }

    const res = recoverPassword(form.email)
    if (res.success) {
      setSuccess('Se ha enviado un enlace de recuperación a su correo electrónico.')
      setTimeout(() => {
        setView('login')
        setSuccess('')
      }, 4000)
    } else {
      setError(res.error)
    }
  }

  // GOOGLE OAUTH SIMULATION FLOW
  const triggerGoogleLogin = () => {
    setError('')
    
    // Simulate google oauth window pop-up
    const mockGoogleAccounts = [
      { nombres: 'Diego', apellidos: 'López Ramos', email: 'diego.lopez@uni.pe', picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
      { nombres: 'Ana Maria', apellidos: 'Castillo Vega', email: 'ana.castillo@gmail.com', picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
    ]

    // Create a simple dialog inside the document to choose account
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans'
    
    const popup = document.createElement('div')
    popup.className = 'bg-white w-full max-w-sm rounded-lg shadow-2xl border border-gray-200 overflow-hidden'
    
    let accountsHtml = mockGoogleAccounts.map((acc, idx) => `
      <button class="account-btn flex items-center gap-3 w-full p-3.5 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors" data-idx="${idx}">
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
        <button id="close-google" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="py-2">
        ${accountsHtml}
        <button id="google-new-account" class="flex items-center gap-3 w-full p-4 hover:bg-gray-50 text-left transition-colors text-sm font-medium text-blue-600">
          <span class="w-9 h-9 rounded-full border border-dashed border-blue-600 flex items-center justify-center shrink-0 text-lg">+</span>
          Usar otra cuenta
        </button>
      </div>
      <div class="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 text-center leading-normal">
        Para continuar, Google compartirá tu nombre, dirección de correo electrónico y foto de perfil con la web de Sesquicentenario UNI.
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

    // Click on pre-made accounts
    popup.querySelectorAll('.account-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = btn.getAttribute('data-idx')
        const account = mockGoogleAccounts[idx]
        cleanup()
        handleGoogleCallback(account)
      }
    })

    // Click on custom account
    document.getElementById('google-new-account').onclick = () => {
      cleanup()
      // Ask email prompt
      const email = prompt('Introduce tu correo de Google (ej: egresado.uni@gmail.com):')
      if (!email) return
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Correo inválido')
        return
      }
      const names = prompt('Introduce tus nombres:')
      if (!names) return
      const apellidos = prompt('Introduce tus apellidos:')
      if (!apellidos) return

      handleGoogleCallback({
        nombres: names,
        apellidos: apellidos,
        email: email,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(names)}`
      })
    }
  }

  const handleGoogleCallback = (googleUser) => {
    const res = loginWithGoogle(googleUser)
    if (res.success) {
      if (res.isNew) {
        setGoogleTempUser(res.tempUser)
        setForm(prev => ({
          ...prev,
          nombres: res.tempUser.nombres,
          apellidos: res.tempUser.apellidos,
          email: res.tempUser.email,
          dni: '',
          telefono: '',
          institucion: 'Universidad Nacional de Ingeniería'
        }))
        setView('google-complete')
      } else {
        if (onAuthSuccess) onAuthSuccess()
        onClose()
      }
    } else {
      setError(res.error)
    }
  }

  const handleGoogleComplete = (e) => {
    e.preventDefault()
    setError('')

    if (!form.dni.trim()) {
      setError('El DNI es obligatorio.')
      return
    }

    if (!/^\d{8}$/.test(form.dni)) {
      setError('El DNI debe contener exactamente 8 números.')
      return
    }

    if (form.telefono && !/^\d{9}$/.test(form.telefono)) {
      setError('El teléfono debe tener 9 números (Ej: 999888777).')
      return
    }

    const res = completeGoogleRegistration({
      nombres: form.nombres,
      apellidos: form.apellidos,
      email: form.email,
      dni: form.dni,
      telefono: form.telefono,
      institucion: form.institucion,
      profilePic: googleTempUser.profilePic
    })

    if (res.success) {
      setSuccess('¡Registro con Google exitoso!')
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess()
        onClose()
      }, 1500)
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden rounded-none flex flex-col max-h-[90vh]">
        {/* Header decoration */}
        <div className="h-1.5 bg-[#800404]" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#800404] transition-colors p-1.5 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto">
          
          {/* Logo / Brand Header */}
          <div className="text-center mb-6">
            <span className="bg-[#800404] text-white text-[10px] font-black px-2.5 py-1 tracking-widest uppercase inline-block mb-3">
              UNI · Sesquicentenario
            </span>
            {view === 'login' && <h2 className="text-2xl font-black text-gray-900">Iniciar Sesión</h2>}
            {view === 'register' && <h2 className="text-2xl font-black text-gray-900">Registrar Cuenta</h2>}
            {view === 'recover' && <h2 className="text-2xl font-black text-gray-900">Recuperar Contraseña</h2>}
            {view === 'verify' && <h2 className="text-2xl font-black text-gray-900">Verificar Correo</h2>}
            {view === 'google-complete' && <h2 className="text-2xl font-black text-gray-900">Completar Registro</h2>}
            
            <p className="text-xs text-gray-400 mt-1">
              {view === 'login' && 'Accede a tus entradas, certificados y perfil institucional.'}
              {view === 'register' && 'Crea tu perfil universitario para participar en los eventos.'}
              {view === 'recover' && 'Te enviaremos las instrucciones de recuperación por correo.'}
              {view === 'verify' && `Hemos enviado un código a ${form.email}.`}
              {view === 'google-complete' && 'Ingresa tus datos adicionales para finalizar la cuenta UNI.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-5 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-5 text-xs text-green-700 flex items-start gap-2">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Verification Code Box Helper */}
          {view === 'verify' && generatedCode && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 mb-5 text-center rounded-none">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Simulación local (Código enviado)</p>
              <p className="text-2xl font-black text-gray-800 tracking-widest">{generatedCode}</p>
              <p className="text-[10px] text-amber-600 mt-1">Ingresa este código abajo o usa '123456' para verificar.</p>
            </div>
          )}

          {/* FORMS */}
          
          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Contraseña</label>
                  <button 
                    type="button" 
                    onClick={() => setView('recover')}
                    className="text-xs text-[#800404] hover:underline"
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
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm mt-2"
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
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 font-bold text-sm transition-colors flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continuar con Google
              </button>

              <p className="text-center text-xs text-gray-500 mt-6 pt-2 border-t border-gray-100">
                ¿No tienes una cuenta?{' '}
                <button 
                  type="button" 
                  onClick={() => setView('register')}
                  className="text-[#800404] font-black hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </form>
          )}

          {/* VIEW: REGISTER */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Juan"
                    value={form.nombres}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    placeholder="Pérez"
                    value={form.apellidos}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">DNI (8 dígitos) *</label>
                  <input
                    type="text"
                    name="dni"
                    placeholder="12345678"
                    maxLength={8}
                    value={form.dni}
                    onChange={e => setForm(f => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300 text-center tracking-wider font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="999888777"
                    maxLength={9}
                    value={e => setForm(f => ({ ...f, telefono: e.target.value.replace(/\D/g, '').slice(0, 9) }))}
                    value={form.telefono}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Universidad o Institución *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Landmark size={15} />
                  </span>
                  <input
                    type="text"
                    name="institucion"
                    placeholder="Universidad Nacional de Ingeniería"
                    value={form.institucion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contraseña *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mín. 6 carc."
                    value={form.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirmar *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repita clave"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm mt-3"
              >
                Registrar Cuenta
              </button>

              <div className="relative flex py-1.5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-medium">o</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={triggerGoogleLogin}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 font-bold text-sm transition-colors flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Registrarse con Google
              </button>

              <p className="text-center text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
                ¿Ya tienes una cuenta?{' '}
                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="text-[#800404] font-black hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            </form>
          )}

          {/* VIEW: RECOVER PASSWORD */}
          {view === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm mt-2"
              >
                Enviar enlace de recuperación
              </button>

              <p className="text-center text-xs text-gray-500 mt-6 pt-2 border-t border-gray-100">
                Volver al{' '}
                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="text-[#800404] font-black hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </form>
          )}

          {/* VIEW: EMAIL VERIFICATION */}
          {view === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 text-center">Código de Verificación</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="X X X X X X"
                  value={verificationCodeInput}
                  onChange={e => setVerificationCodeInput(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 px-4 py-3 text-center text-xl font-black tracking-[0.4em] focus:outline-none focus:border-[#800404] placeholder-gray-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm"
              >
                Verificar Cuenta
              </button>

              <div className="text-center text-xs text-gray-500 mt-4">
                ¿No recibiste el código?{' '}
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  className="text-[#800404] font-black hover:underline"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}

          {/* VIEW: GOOGLE COMPLETE REGISTRATION */}
          {view === 'google-complete' && googleTempUser && (
            <form onSubmit={handleGoogleComplete} className="space-y-4">
              <div className="flex items-center gap-3.5 bg-gray-50 p-4 border border-gray-100 mb-2">
                <img src={googleTempUser.profilePic} className="w-11 h-11 rounded-full border border-gray-200" />
                <div>
                  <p className="text-sm font-black text-gray-800 leading-tight">{googleTempUser.nombres} {googleTempUser.apellidos}</p>
                  <p className="text-xs text-gray-400">{googleTempUser.email}</p>
                </div>
              </div>
              
              <div className="bg-red-50/50 p-3.5 text-xs text-gray-600 border border-[#800404]/10 leading-relaxed mb-4">
                Has iniciado sesión con tu cuenta de Google. Para completar el registro institucional de la UNI, por favor introduce tus datos adicionales.
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">DNI (8 dígitos) *</label>
                  <input
                    type="text"
                    name="dni"
                    placeholder="12345678"
                    maxLength={8}
                    value={form.dni}
                    onChange={e => setForm(f => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300 text-center tracking-wider font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="999888777"
                    maxLength={9}
                    value={form.telefono}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Universidad o Institución *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Landmark size={15} />
                  </span>
                  <input
                    type="text"
                    name="institucion"
                    placeholder="Universidad Nacional de Ingeniería"
                    value={form.institucion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#800404] placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-3 font-bold text-sm tracking-wide transition-colors uppercase shadow-sm mt-3"
              >
                Completar y Acceder
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
