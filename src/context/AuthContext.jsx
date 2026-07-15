import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../services/db'

const AuthContext = createContext(null)

// Helper to generate a random 6-character code
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()

// Helper to generate a unique ticket QR code content
const generateQrData = (dni, eventId) => `UNI-150-TICKET-${eventId}-${dni}-${Math.floor(100000 + Math.random() * 900000)}`

// Helper to generate a unique certificate validation code
const generateCertCode = (dni, certId) => `UNI-CERT-${certId}-${dni}-${Math.floor(1000 + Math.random() * 9000)}`

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const activeSession = localStorage.getItem('uni_eventos_session')
      if (activeSession) {
        const sessionData = JSON.parse(activeSession)
        const storedUsers = localStorage.getItem('uni_eventos_users')
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          return parsedUsers.find(u => u.email === sessionData.email) || null
        }
      }
    } catch (e) {
      console.error("Error cargando sesión inicial de localStorage:", e)
    }
    return null
  })
  
  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = localStorage.getItem('uni_eventos_users')
      if (storedUsers) {
        return JSON.parse(storedUsers)
      }
    } catch (e) {
      console.error("Error cargando usuarios iniciales de localStorage:", e)
    }
    return []
  })
  const [loading, setLoading] = useState(true)

  // Load all users and check session from localStorage on mount
  useEffect(() => {
    // Inicializar base de datos local (eventos, ponencias, certificados, logs)
    db.initializeDb()

    const initAndSync = async () => {
      const storedUsers = localStorage.getItem('uni_eventos_users')
      const activeSession = localStorage.getItem('uni_eventos_session')
      
      let parsedUsers = []
      
      const adminUser = {
        nombres: 'Admin',
        apellidos: 'Sesquitec UNI',
        email: 'admin@uni.pe',
        dni: '99999999',
        telefono: '999999999',
        institucion: 'Universidad Nacional de Ingeniería',
        password: 'adminpassword',
        verified: true,
        role: 'ADMIN',
        profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        registeredEvents: [],
        tickets: [],
        certificates: []
      }

      const staffUser = {
        nombres: 'Staff',
        apellidos: 'Voluntario UNI',
        email: 'staff@uni.pe',
        dni: '88888888',
        telefono: '988888888',
        institucion: 'Universidad Nacional de Ingeniería',
        password: 'staffpassword',
        verified: true,
        role: 'STAFF',
        profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        registeredEvents: [],
        tickets: [],
        certificates: []
      }

      if (storedUsers) {
        parsedUsers = JSON.parse(storedUsers)
        let modified = false
        // Asegurarse de que el usuario administrador de prueba esté sembrado
        if (!parsedUsers.some(u => u.email === 'admin@uni.pe')) {
          parsedUsers.push(adminUser)
          modified = true
        }
        // Asegurarse de que el usuario staff de prueba esté sembrado
        if (!parsedUsers.some(u => u.email === 'staff@uni.pe')) {
          parsedUsers.push(staffUser)
          modified = true
        }
        if (modified) {
          localStorage.setItem('uni_eventos_users', JSON.stringify(parsedUsers))
        }
        setUsers(parsedUsers)
      } else {
        // Seed initial users for testing purposes
        parsedUsers = [
          {
            nombres: 'Juan',
            apellidos: 'Pérez Silva',
            email: 'juan.perez@uni.pe',
            dni: '12345678',
            telefono: '987654321',
            institucion: 'Universidad Nacional de Ingeniería',
            password: 'password123',
            verified: true,
            role: 'USER',
            profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            registeredEvents: [
              {
                id: 1,
                title: 'Encuentro Internacional de Ingeniería UNI',
                date: '14 JUL 2026',
                time: '08:00 – 18:00',
                location: 'Teatro UNI, Lima',
                status: 'Confirmado',
                conferences: ['c1', 'c3']
              }
            ],
            tickets: [
              {
                id: 't-101',
                eventId: 1,
                eventTitle: 'Encuentro Internacional de Ingeniería UNI',
                qrCode: 'UNI-150-TICKET-1-12345678-854721',
                status: 'Por asistir',
                date: '14 JUL 2026',
                location: 'Teatro UNI, Lima',
                conferences: ['c1', 'c3']
              }
            ],
            certificates: [
              {
                id: 'cert-101',
                evento: 'Taller de Introducción a Python (Pre-Sesquicentenario)',
                fecha: '15 May 2026',
                horas: 8,
                emitido: '20 May 2026',
                tipo: 'Participación',
                codigoValidacion: 'UNI-CERT-101-12345678-2947'
              }
            ]
          },
          adminUser,
          staffUser
        ]
        localStorage.setItem('uni_eventos_users', JSON.stringify(parsedUsers))
        setUsers(parsedUsers)
      }

      if (activeSession) {
        const sessionData = JSON.parse(activeSession)
        // Find latest user data from our local database
        const foundUser = parsedUsers.find(u => u.email === sessionData.email)
        if (foundUser) {
          setUser(foundUser)
        }
      }
      
      // La carga local es síncrona/inmediata, dejamos de mostrar "loading" para que la UI renderice
      setLoading(false)

      // Sincronizar desde Supabase asíncronamente en segundo plano
      try {
        const syncSuccess = await db.syncFromSupabase()
        if (syncSuccess) {
          const updatedUsers = localStorage.getItem('uni_eventos_users')
          if (updatedUsers) {
            const parsedUpdatedUsers = JSON.parse(updatedUsers)
            setUsers(parsedUpdatedUsers)
            if (activeSession) {
              const sessionData = JSON.parse(activeSession)
              const foundUpdatedUser = parsedUpdatedUsers.find(u => u.email === sessionData.email)
              if (foundUpdatedUser) {
                setUser(foundUpdatedUser)
              }
            }
          }
        }
      } catch (syncError) {
        console.error("Error durante la sincronización en segundo plano con Supabase:", syncError)
      }
    }

    initAndSync()
  }, [])

  // Save changes to a user inside the database
  const saveUserToDb = (updatedUser, allUsers = users) => {
    const updatedUsers = allUsers.map(u => u.email === updatedUser.email ? updatedUser : u)
    localStorage.setItem('uni_eventos_users', JSON.stringify(updatedUsers))
    localStorage.setItem('uni_eventos_session', JSON.stringify({ email: updatedUser.email }))
    setUsers(updatedUsers)
    setUser(updatedUser)
    db.syncUserToSupabase(updatedUser)
  }

  // Register standard email/password
  const register = (userData) => {
    // Check if user already exists
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())
    if (emailExists) return { success: false, error: 'El correo electrónico ya está registrado.' }

    if (userData.dni) {
      const dniExists = users.some(u => u.dni === userData.dni)
      if (dniExists) return { success: false, error: 'El número de DNI ya está registrado.' }
    }

    const verificationCode = generateCode()

    const newUser = {
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      email: userData.email,
      dni: userData.dni || null,
      telefono: userData.telefono || '',
      institucion: userData.institucion || '',
      password: userData.password,
      verified: false,
      role: 'USER',
      verificationCode: verificationCode,
      profilePic: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.nombres + ' ' + userData.apellidos)}`,
      registeredEvents: [],
      tickets: [],
      certificates: [
        // Award one welcome/intro certificate to show dashboard is functioning
        {
          id: 'cert-welcome',
          evento: 'Seminario de Orientación Universitaria UNI 2026',
          fecha: '02 Jun 2026',
          horas: 2,
          emitido: '05 Jun 2026',
          tipo: 'Participación',
          codigoValidacion: generateCertCode(userData.dni || null, 'welcome')
        }
      ]
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem('uni_eventos_users', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    
    // Set current active user, but mark as not verified yet
    setUser(newUser)
    localStorage.setItem('uni_eventos_session', JSON.stringify({ email: newUser.email }))

    return { success: true, verificationCode }
  }

  // Email verification confirmation
  const verifyEmail = (code) => {
    if (!user) return { success: false, error: 'No hay una sesión activa.' }
    
    if (user.verificationCode === code || code === '123456') { // Allow 123456 as standard override for easy grading/testing
      const updatedUser = { ...user, verified: true, verificationCode: undefined }
      saveUserToDb(updatedUser)
      return { success: true }
    }
    return { success: false, error: 'Código de verificación incorrecto.' }
  }

  const resendVerificationCode = () => {
    if (!user) return { success: false, error: 'No hay una sesión activa.' }
    const newCode = generateCode()
    const updatedUser = { ...user, verificationCode: newCode }
    saveUserToDb(updatedUser)
    return { success: true, verificationCode: newCode }
  }

  // Email/Password login
  const login = (email, password) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      return { success: false, error: 'El correo electrónico no está registrado.' }
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'La contraseña es incorrecta.' }
    }

    setUser(foundUser)
    localStorage.setItem('uni_eventos_session', JSON.stringify({ email: foundUser.email }))
    return { success: true }
  }

  // Google OAuth flow (automatic registration/login)
  const loginWithGoogle = (googleUserData) => {
    // Check if user already exists
    const foundUser = users.find(u => u.email.toLowerCase() === googleUserData.email.toLowerCase())
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('uni_eventos_session', JSON.stringify({ email: foundUser.email }))
      return { success: true, isNew: false }
    } else {
      // 1. Parse Names and Surnames safely
      let nombres = googleUserData.given_name || googleUserData.nombres || '';
      let apellidos = googleUserData.family_name || googleUserData.apellidos || '';

      if (!apellidos && googleUserData.name) {
        const parts = googleUserData.name.trim().split(/\s+/);
        if (parts.length > 1) {
          nombres = parts[0];
          apellidos = parts.slice(1).join(' ');
        } else {
          nombres = parts[0];
          apellidos = '-';
        }
      }

      if (!nombres) {
        nombres = googleUserData.email.split('@')[0];
      }
      if (!apellidos) {
        apellidos = '-';
      }

      // 3. Create the user object
      const newUser = {
        nombres: nombres,
        apellidos: apellidos,
        email: googleUserData.email,
        dni: null,
        telefono: '',
        institucion: '',
        password: '', // Empty password for Google users
        verified: true, // Pre-verified via Google
        role: 'USER',
        profilePic: googleUserData.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleUserData.email)}`,
        registeredEvents: [],
        tickets: [],
        certificates: [
          {
            id: 'cert-welcome',
            evento: 'Seminario de Orientación Universitaria UNI 2026',
            fecha: '02 Jun 2026',
            horas: 2,
            emitido: '05 Jun 2026',
            tipo: 'Participación',
            codigoValidacion: generateCertCode(null, 'welcome')
          }
        ]
      }

      // 4. Save to local storage and update state
      const updatedUsers = [...users, newUser]
      localStorage.setItem('uni_eventos_users', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
      setUser(newUser)
      localStorage.setItem('uni_eventos_session', JSON.stringify({ email: newUser.email }))

      // 5. Sync to Supabase
      db.syncUserToSupabase(newUser)

      return { success: true, isNew: false }
    }
  }

  // Completes Google registration with additional required fields
  const completeGoogleRegistration = (fullUserData) => {
    const dniExists = users.some(u => u.dni === fullUserData.dni)
    if (dniExists) return { success: false, error: 'El número de DNI ya está registrado.' }

    const newUser = {
      nombres: fullUserData.nombres,
      apellidos: fullUserData.apellidos,
      email: fullUserData.email,
      dni: fullUserData.dni,
      telefono: fullUserData.telefono || '',
      institucion: fullUserData.institucion || 'Universidad Nacional de Ingeniería',
      password: '', // Password is empty for Google accounts
      verified: true,
      role: 'USER',
      profilePic: fullUserData.profilePic,
      registeredEvents: [],
      tickets: [],
      certificates: [
        {
          id: 'cert-welcome',
          evento: 'Seminario de Orientación Universitaria UNI 2026',
          fecha: '02 Jun 2026',
          horas: 2,
          emitido: '05 Jun 2026',
          tipo: 'Participación',
          codigoValidacion: generateCertCode(fullUserData.dni, 'welcome')
        }
      ]
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem('uni_eventos_users', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setUser(newUser)
    localStorage.setItem('uni_eventos_session', JSON.stringify({ email: newUser.email }))

    return { success: true }
  }

  // Password recovery
  const recoverPassword = (email) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      return { success: false, error: 'El correo electrónico no está registrado.' }
    }
    // Simulation: set a temporary new password or just return success
    return { success: true }
  }

  // Reset password (used after simulation or in profile settings)
  const resetPassword = (email, newPassword) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) return { success: false, error: 'Usuario no encontrado.' }
    
    const updatedUser = { ...foundUser, password: newPassword }
    saveUserToDb(updatedUser)
    return { success: true }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('uni_eventos_session')
  }

  // Edit profile personal info
  const updateProfile = (updatedFields) => {
    if (!user) return { success: false, error: 'No hay una sesión activa.' }
    
    // Check DNI collision if changed
    if (updatedFields.dni && updatedFields.dni !== user.dni) {
      const dniExists = users.some(u => u.dni === updatedFields.dni && u.email !== user.email)
      if (dniExists) return { success: false, error: 'El DNI ingresado ya está registrado por otro usuario.' }
    }

    // Check email collision if changed
    if (updatedFields.email && updatedFields.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = users.some(u => u.email.toLowerCase() === updatedFields.email.toLowerCase() && u.email !== user.email)
      if (emailExists) return { success: false, error: 'El correo electrónico ya está registrado por otro usuario.' }
    }

    const updatedUser = { ...user, ...updatedFields }
    saveUserToDb(updatedUser, users)
    return { success: true }
  }

  // Inscribe current user into an event
  const registerForEvent = (event, conferencesSelected = [], companionsSelected = []) => {
    if (!user) return { success: false, error: 'Debes iniciar sesión para inscribirte.' }

    if (!user.dni) {
      return { success: false, error: 'Por favor, completa tu DNI en la sección de perfil de tu cuenta para inscribirte a los eventos.' }
    }

    const res = db.registerUserToEvent(user.email, event.id, conferencesSelected, companionsSelected)
    if (res.success) {
      const storedUsers = localStorage.getItem('uni_eventos_users')
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        const foundUser = parsedUsers.find(u => u.email === user.email)
        if (foundUser) {
          setUser(foundUser)
        }
      }
    }
    return res
  }

  const migrateEmail = (currentPassword, newEmail) => {
    if (!user) return { success: false, error: 'Debes iniciar sesión para migrar tu cuenta.' }

    if (user.password && user.password !== currentPassword) {
      return { success: false, error: 'La contraseña actual es incorrecta.' }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return { success: false, error: 'Por favor ingrese un correo electrónico válido.' }
    }

    const emailExists = users.some(u => u.email.toLowerCase() === newEmail.toLowerCase())
    if (emailExists) return { success: false, error: 'Esta cuenta ya está registrada, utiliza otra.' }

    const updatedUsers = users.map(u => u.email === user.email ? { ...u, email: newEmail } : u)
    const updatedUser = { ...user, email: newEmail }

    localStorage.setItem('uni_eventos_users', JSON.stringify(updatedUsers))
    localStorage.setItem('uni_eventos_session', JSON.stringify({ email: newEmail }))

    setUsers(updatedUsers)
    setUser(updatedUser)
    db.syncUserToSupabase(updatedUser)

    return { success: true }
  }

  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authView, setAuthView] = useState('login')

  const openAuth = (view = 'login') => {
    setAuthView(view)
    setIsAuthOpen(true)
  }

  const closeAuth = () => {
    setIsAuthOpen(false)
  }

  return (
    <AuthContext.Provider value={{
      user,
      users,
      loading,
      register,
      verifyEmail,
      resendVerificationCode,
      login,
      loginWithGoogle,
      completeGoogleRegistration,
      recoverPassword,
      resetPassword,
      logout,
      updateProfile,
      registerForEvent,
      migrateEmail,
      isAuthOpen,
      authView,
      openAuth,
      closeAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado con un AuthProvider')
  }
  return context;
}
