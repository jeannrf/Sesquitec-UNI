import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, CreditCard, Award, User, Settings, ShieldAlert, 
  MapPin, Clock, Download, Eye, QrCode, Upload, CheckCircle, 
  AlertCircle, Lock, Edit2, CheckSquare, Trash2
} from 'lucide-react'

// Dummy events catalog to query details
const eventsCatalog = {
  1: {
    title: 'Encuentro Internacional de Ingeniería UNI',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Teatro UNI, Lima',
    time: '08:00 – 18:00',
    date: '14 JUL 2026',
    desc: 'El evento académico del año de la UNI, reuniendo a ponentes nacionales e internacionales de primer nivel en inteligencia artificial, energías renovables, e infraestructura sostenible.',
    bg: 'bg-gradient-to-br from-[#800404] to-[#5a0303]'
  },
  2: {
    title: 'Cena de Gala de Egresados',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Gran Hotel Bolívar, Lima',
    time: '19:00 – 23:00',
    date: '22 AGO 2026',
    desc: 'Cena de conmemoración oficial por los 150 años de la Universidad Nacional de Ingeniería. Un espacio de integración y gala para egresados, docentes y autoridades.',
    bg: 'bg-gradient-to-br from-gray-800 to-gray-600'
  },
  3: {
    title: 'Exposición Histórica: 150 Años de Ingeniería',
    organizer: 'Facultad de Ciencias / Museos UNI',
    location: 'Campus UNI, Lima',
    time: '09:00 – 17:00',
    date: '01 JUN – 30 NOV 2026',
    desc: 'Un recorrido histórico por los hitos y legados de la ingeniería peruana a través de planos, modelos a escala y archivos históricos de la UNI.',
    bg: 'bg-gradient-to-br from-[#3a0202] to-[#800404]'
  },
  4: {
    title: 'Feria de Empleo UNI 2026',
    organizer: 'Bienestar Universitario',
    location: 'Pabellón Central, UNI',
    time: '09:00 – 14:00',
    date: '15 SEP 2026',
    desc: 'La feria laboral más grande del sector ingeniería, conectando a estudiantes y egresados de la UNI con empresas transnacionales líderes del país.',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-700'
  }
}

// Conferences details helper
const conferencesCatalog = {
  'c1': { title: 'Inteligencia Artificial en la Ingeniería Peruana', speaker: 'Dr. Roberto Vargas', room: 'Auditorium A' },
  'c2': { title: 'Gestión de Proyectos con Metodologías Ágiles', speaker: 'Mg. Sofia Herrera', room: 'Auditorium B' },
  'c3': { title: 'Infraestructura Sostenible para el Siglo XXI', speaker: 'Mg. Carmen Flores', room: 'Auditorium C' },
  'c4': { title: 'Ciberseguridad en Sistemas Críticos', speaker: 'Dr. Andrés Gutiérrez', room: 'Aula Magna' },
  'c5': { title: 'Robótica e Industria 4.0 en el Perú', speaker: 'Ing. María Quispe', room: 'Auditorium A' },
  'c6': { title: 'Modelado BIM para Construcción Moderna', speaker: 'Arq. Javier Romero', room: 'Auditorium B' },
  'c7': { title: 'Energías Renovables y Transición Energética', speaker: 'Dr. Ana Torres', room: 'Auditorium C' },
  'c8': { title: 'Emprendimiento Tecnológico Universitario', speaker: 'Ing. Luis Mendoza', room: 'Aula Magna' },
  'c9': { title: 'Minería Sostenible y Tecnología Verde', speaker: 'Dr. Pablo Díaz', room: 'Auditorium A' },
  'c10': { title: 'Algoritmos para Optimización Industrial', speaker: 'Mg. Rosa Salinas', room: 'Auditorium B' }
}

export default function Dashboard() {
  const { user, updateProfile, openAuth } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const activeTab = searchParams.get('tab') || 'eventos'

  // Modals state
  const [selectedEventDetails, setSelectedEventDetails] = useState(null)
  const [activeQrModal, setActiveQrModal] = useState(null) // Ticket object
  
  // Profile form states
  const [profileForm, setProfileForm] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    institucion: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  // Sync user data to form
  useEffect(() => {
    if (user) {
      setProfileForm({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        dni: user.dni || '',
        email: user.email || '',
        telefono: user.telefono || '',
        institucion: user.institucion || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setProfileError('')
      setProfileSuccess('')
    }
  }, [user, activeTab])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-5 text-[#800404]">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-sm text-gray-500 mb-6">
            Debes iniciar sesión con tu cuenta de usuario para acceder al panel privado del Sesquicentenario.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/iniciar-sesion"
              className="bg-[#800404] hover:bg-[#5a0303] text-white py-2.5 font-bold text-sm transition-colors block text-center"
            >
              Iniciar Sesión
            </Link>
            <button
              onClick={() => navigate('/')}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 font-bold text-sm transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Handle tab clicks
  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName })
  }

  // Handle Profile Update
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    if (!profileForm.nombres.trim() || !profileForm.apellidos.trim() || !profileForm.email.trim() || !profileForm.dni.trim()) {
      setProfileError('Los campos Nombres, Apellidos, DNI y Correo son obligatorios.')
      return
    }

    if (!/^\d{8}$/.test(profileForm.dni)) {
      setProfileError('El DNI debe contener exactamente 8 números.')
      return
    }

    if (profileForm.telefono && !/^\d{9}$/.test(profileForm.telefono)) {
      setProfileError('El teléfono debe tener 9 números (Ej: 999888777).')
      return
    }

    // Password modification check
    let passwordUpdates = {}
    if (profileForm.newPassword) {
      if (user.password && user.password !== profileForm.currentPassword) {
        setProfileError('La contraseña actual es incorrecta.')
        return
      }
      if (profileForm.newPassword.length < 6) {
        setProfileError('La nueva contraseña debe tener al menos 6 caracteres.')
        return
      }
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileError('Las nuevas contraseñas no coinciden.')
        return
      }
      passwordUpdates = { password: profileForm.newPassword }
    }

    const res = updateProfile({
      nombres: profileForm.nombres,
      apellidos: profileForm.apellidos,
      email: profileForm.email,
      dni: profileForm.dni,
      telefono: profileForm.telefono,
      institucion: profileForm.institucion,
      ...passwordUpdates
    })

    if (res.success) {
      setProfileSuccess('Perfil actualizado con éxito.')
      setProfileForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } else {
      setProfileError(res.error)
    }
  }

  // Handle base64 photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El límite es de 2MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfile({ profilePic: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  // PDF Ticket generator (Downloads styled SVG)
  const downloadTicketSvg = (ticket) => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 350" width="800" height="350" style="font-family: Arial, sans-serif;">
        <rect width="800" height="350" fill="#ffffff" stroke="#800404" stroke-width="6"/>
        <rect x="20" y="20" width="760" height="310" fill="none" stroke="#e5e7eb" stroke-width="2"/>
        
        <!-- Left Side: Details -->
        <rect x="30" y="30" width="500" height="290" fill="#fcfcfc"/>
        <path d="M 30 30 L 530 30 L 530 320 L 30 320 Z" fill="none" stroke="#f3f4f6" stroke-width="1"/>
        
        <text x="50" y="70" font-size="12" font-weight="900" fill="#800404" letter-spacing="2">UNI - SESQUICENTENARIO 2026</text>
        <text x="50" y="105" font-size="20" font-weight="900" fill="#111827">${ticket.eventTitle.toUpperCase()}</text>
        
        <text x="50" y="145" font-size="11" font-weight="bold" fill="#6b7280">FECHA Y HORA</text>
        <text x="50" y="165" font-size="13" font-weight="bold" fill="#374151">${ticket.date} · 08:00 - 18:00</text>
        
        <text x="50" y="205" font-size="11" font-weight="bold" fill="#6b7280">LUGAR</text>
        <text x="50" y="225" font-size="13" font-weight="bold" fill="#374151">${ticket.location}</text>
        
        <text x="50" y="265" font-size="11" font-weight="bold" fill="#6b7280">PARTICIPANTE</text>
        <text x="50" y="285" font-size="14" font-weight="bold" fill="#800404">${user.nombres.toUpperCase()} ${user.apellidos.toUpperCase()}</text>
        <text x="320" y="285" font-size="12" font-weight="bold" fill="#374151">DNI: ${user.dni}</text>

        <!-- Ticket separator line -->
        <line x1="560" y1="30" x2="560" y2="320" stroke="#800404" stroke-dasharray="6,6" stroke-width="2"/>
        
        <!-- Right Side: QR Area -->
        <rect x="585" y="45" width="165" height="165" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
        <!-- Simulated QR patterns -->
        <rect x="595" y="55" width="45" height="45" fill="#800404"/>
        <rect x="605" y="65" width="25" height="25" fill="#ffffff"/>
        <rect x="695" y="55" width="45" height="45" fill="#800404"/>
        <rect x="705" y="65" width="25" height="25" fill="#ffffff"/>
        <rect x="595" y="155" width="45" height="45" fill="#800404"/>
        <rect x="605" y="165" width="25" height="25" fill="#ffffff"/>
        
        <rect x="655" y="115" width="25" height="25" fill="#800404"/>
        <rect x="680" y="140" width="20" height="20" fill="#800404"/>
        <rect x="640" y="140" width="15" height="15" fill="#800404"/>
        <rect x="690" y="105" width="15" height="30" fill="#800404"/>
        
        <text x="667" y="240" font-size="11" font-weight="bold" fill="#111827" text-anchor="middle">ENTRADA DIGITAL</text>
        <text x="667" y="260" font-size="10" font-weight="bold" fill="#6b7280" text-anchor="middle">${ticket.status.toUpperCase()}</text>
        <text x="667" y="285" font-size="8" font-weight="bold" fill="#9ca3af" text-anchor="middle">ID: ${ticket.id}</text>
        <text x="667" y="300" font-size="7" fill="#9ca3af" text-anchor="middle">${ticket.qrCode}</text>
      </svg>
    `
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `entrada-${ticket.id}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // PDF Certificate Generator (Downloads vector SVG)
  const downloadCertSvg = (cert) => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700" style="font-family: Georgia, Times, serif;">
        <rect width="1000" height="700" fill="#fdfcf7" stroke="#800404" stroke-width="16"/>
        <rect x="25" y="25" width="950" height="650" fill="none" stroke="#d4af37" stroke-width="3"/>
        
        <!-- Headers -->
        <text x="500" y="110" font-size="18" font-weight="bold" fill="#800404" font-family="Arial, sans-serif" letter-spacing="3" text-anchor="middle">UNIVERSIDAD NACIONAL DE INGENIERÍA</text>
        <line x1="400" y1="130" x2="600" y2="130" stroke="#d4af37" stroke-width="2"/>
        <text x="500" y="160" font-size="12" font-style="italic" fill="#6b7280" font-family="Arial, sans-serif" letter-spacing="1" text-anchor="middle">COMISIÓN ORGANIZADORA DEL SESQUICENTENARIO</text>
        
        <!-- Certificate Word -->
        <text x="500" y="240" font-size="42" font-weight="normal" fill="#111827" text-anchor="middle" letter-spacing="4">Otorgan el presente Diploma de</text>
        <text x="500" y="300" font-size="34" font-weight="bold" fill="#800404" font-family="Arial, sans-serif" text-anchor="middle" letter-spacing="2">${cert.tipo.toUpperCase()}</text>
        
        <!-- Recipient -->
        <text x="500" y="360" font-size="16" fill="#475569" text-anchor="middle">A:</text>
        <text x="500" y="405" font-size="28" font-weight="bold" font-style="italic" fill="#111827" text-anchor="middle">${user.nombres.toUpperCase()} ${user.apellidos.toUpperCase()}</text>
        <text x="500" y="440" font-size="14" fill="#475569" font-family="Arial, sans-serif" text-anchor="middle">Identificado con DNI N° ${user.dni}</text>
        
        <!-- Event -->
        <text x="500" y="480" font-size="15" fill="#475569" text-anchor="middle">Por haber asistido y aprobado en calidad de asistente al evento académico:</text>
        <text x="500" y="515" font-size="18" font-weight="bold" fill="#111827" font-family="Arial, sans-serif" text-anchor="middle">"${cert.evento}"</text>
        <text x="500" y="545" font-size="13" fill="#6b7280" font-family="Arial, sans-serif" text-anchor="middle">Realizado el ${cert.fecha} con una duración de ${cert.horas} horas académicas extracurriculares.</text>
        
        <!-- Date -->
        <text x="500" y="585" font-size="12" fill="#6b7280" font-family="Arial, sans-serif" text-anchor="middle">Emitido en Lima, el ${cert.emitido}.</text>
        
        <!-- Signatures & Verification -->
        <!-- Left Sign: Rector -->
        <line x1="200" y1="630" x2="380" y2="630" stroke="#9ca3af" stroke-width="1"/>
        <text x="290" y="645" font-size="11" font-weight="bold" fill="#374151" font-family="Arial, sans-serif" text-anchor="middle">Dr. Alfonso López Chau</text>
        <text x="290" y="660" font-size="9" fill="#6b7280" font-family="Arial, sans-serif" text-anchor="middle">Rector - Universidad Nacional de Ingeniería</text>
        
        <!-- Right Sign: Commission -->
        <line x1="620" y1="630" x2="800" y2="630" stroke="#9ca3af" stroke-width="1"/>
        <text x="710" y="645" font-size="11" font-weight="bold" fill="#374151" font-family="Arial, sans-serif" text-anchor="middle">Presidente Comisión Organizadora</text>
        <text x="710" y="660" font-size="9" fill="#6b7280" font-family="Arial, sans-serif" text-anchor="middle">150 Años de Historia UNI</text>
        
        <!-- Validation code details at bottom -->
        <text x="50" y="670" font-size="8" fill="#9ca3af" font-family="Arial, sans-serif">CÓDIGO DE VALIDACIÓN: ${cert.codigoValidacion}</text>
      </svg>
    `
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificado-${cert.id}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header bar banner */}
      <div className="bg-[#800404] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={user.profilePic} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-md"
              />
              <label className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white">
                <Upload size={16} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>
            <div>
              <span className="bg-white/25 text-white text-[9px] font-black tracking-widest px-2 py-0.5 uppercase">
                Panel Universitario
              </span>
              <h1 className="text-3xl font-black mt-1 leading-tight">{user.nombres} {user.apellidos}</h1>
              <p className="text-xs text-white/70 mt-0.5">{user.email} · DNI: {user.dni}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!user.verified && (
              <div className="bg-amber-500/25 border border-amber-500 text-amber-200 px-4 py-2 text-xs flex items-center gap-2 font-medium">
                <AlertCircle size={14} className="shrink-0 text-amber-300" />
                <span>Correo sin verificar. Por favor valida tu cuenta.</span>
              </div>
            )}
            <div className="bg-white/10 px-4 py-2 border border-white/15 text-center text-xs">
              <p className="text-white/60">Eventos Inscritos</p>
              <p className="text-xl font-black mt-0.5">{user.registeredEvents?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="max-w-7xl mx-auto px-4 py-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav (Desktop) */}
        <aside className="lg:col-span-1 space-y-1">
          {[
            { id: 'eventos', label: 'Mis Eventos', icon: <Calendar size={18} /> },
            { id: 'entradas', label: 'Mis Entradas', icon: <CreditCard size={18} /> },
            { id: 'certificados', label: 'Certificados', icon: <Award size={18} /> },
            { id: 'perfil', label: 'Perfil Personal', icon: <User size={18} /> },
            { id: 'configuracion', label: 'Configuración', icon: <Settings size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all border-l-4 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white border-[#800404] text-[#800404] shadow-sm'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Dynamic Panels */}
        <main className="lg:col-span-3 bg-white border border-gray-200 p-8 shadow-sm">
          
          {/* TAB: MIS EVENTOS */}
          {activeTab === 'eventos' && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Mis Eventos</h2>
                  <p className="text-xs text-gray-400 mt-1">Historial de tus eventos académicos y ponencias registradas.</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 font-bold">
                  {user.registeredEvents?.length || 0} Evento(s)
                </span>
              </div>

              {user.registeredEvents && user.registeredEvents.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {user.registeredEvents.map(ev => {
                    const fullInfo = eventsCatalog[ev.id] || ev
                    return (
                      <div key={ev.id} className="border border-gray-200 hover:border-[#800404] transition-all flex flex-col group">
                        {/* Event Header background indicator */}
                        <div className={`h-2.5 ${fullInfo.bg || 'bg-[#800404]'}`} />
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-0.5 border border-green-200">
                                {ev.status || 'Confirmado'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">{ev.date}</span>
                            </div>
                            <h3 className="font-black text-gray-900 text-base leading-snug group-hover:text-[#800404] transition-colors mb-4 line-clamp-2">
                              {ev.title}
                            </h3>
                            <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-gray-400" />
                                <span>{ev.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-gray-400" />
                                <span className="truncate">{ev.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setSelectedEventDetails(ev)}
                            className="w-full text-center border border-gray-200 group-hover:border-[#800404] text-gray-700 group-hover:text-white group-hover:bg-[#800404] py-2 text-xs font-bold transition-all cursor-pointer"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-200">
                  <Calendar className="mx-auto text-gray-200 mb-4" size={48} />
                  <h3 className="font-bold text-gray-700 mb-1">Aún no estás inscrito en ningún evento</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                    Consulta el cronograma oficial de ponencias del Sesquicentenario de la UNI e inscríbete hoy mismo.
                  </p>
                  <button
                    onClick={() => navigate('/cronograma')}
                    className="bg-[#800404] text-white hover:bg-[#5a0303] text-xs font-bold px-5 py-2.5 transition-colors cursor-pointer"
                  >
                    Ver Cronograma de Eventos
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: MIS ENTRADAS */}
          {activeTab === 'entradas' && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Mis Entradas</h2>
                  <p className="text-xs text-gray-400 mt-1">Tus pases de acceso QR digitalizados vinculados a tu DNI.</p>
                </div>
              </div>

              {user.tickets && user.tickets.length > 0 ? (
                <div className="space-y-4">
                  {user.tickets.map(ticket => (
                    <div key={ticket.id} className="border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#800404] transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-50 text-[#800404] text-[10px] font-black px-2.5 py-0.5 border border-[#800404]/20 uppercase">
                            {ticket.status}
                          </span>
                          <span className="text-[10px] text-gray-400">ID: {ticket.id}</span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight mb-2">{ticket.eventTitle}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                          <span className="flex items-center gap-1"><Calendar size={13} /> {ticket.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={13} /> {ticket.location}</span>
                        </div>
                        
                        {ticket.conferences && ticket.conferences.length > 0 && (
                          <div className="mt-3.5 bg-gray-50 p-3 border border-gray-100">
                            <p className="text-xs font-bold text-gray-600 mb-1">Ponencias seleccionadas ({ticket.conferences.length}):</p>
                            <ul className="text-[11px] text-gray-500 space-y-1">
                              {ticket.conferences.map(confId => {
                                const details = conferencesCatalog[confId]
                                return (
                                  <li key={confId} className="flex items-center gap-1">
                                    <span className="text-[#800404]">✓</span>
                                    <span className="font-semibold text-gray-700">{details?.title || confId}</span>
                                    <span className="text-gray-400">({details?.speaker})</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* QR Action panel */}
                      <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-6">
                        <button
                          onClick={() => setActiveQrModal(ticket)}
                          className="flex-1 md:w-40 flex items-center justify-center gap-2 border border-gray-300 hover:border-[#800404] text-gray-700 hover:text-[#800404] py-2 text-xs font-bold transition-all cursor-pointer bg-white"
                        >
                          <QrCode size={14} />
                          Mostrar QR
                        </button>
                        <button
                          onClick={() => downloadTicketSvg(ticket)}
                          className="flex-1 md:w-40 flex items-center justify-center gap-2 bg-[#800404] hover:bg-[#5a0303] text-white py-2 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Download size={14} />
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-200">
                  <CreditCard className="mx-auto text-gray-200 mb-4" size={48} />
                  <h3 className="font-bold text-gray-700 mb-1">No posees entradas activas</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Inscríbete a los eventos para generar tus códigos de acceso institucionales.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICADOS */}
          {activeTab === 'certificados' && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Mis Certificados</h2>
                  <p className="text-xs text-gray-400 mt-1">Certificados oficiales emitidos a tu nombre correspondientes a tu DNI.</p>
                </div>
              </div>

              {user.certificates && user.certificates.length > 0 ? (
                <div className="space-y-4">
                  {user.certificates.map(cert => (
                    <div key={cert.id} className="border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#800404] transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2.5 py-0.5 border border-amber-200 uppercase">
                            {cert.tipo}
                          </span>
                          <span className="text-[10px] text-gray-400">Código: {cert.codigoValidacion}</span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight mb-2">{cert.evento}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                          <span>Fecha: {cert.fecha}</span>
                          <span>Horas: <strong className="text-[#800404]">{cert.horas}h extracurriculares</strong></span>
                          <span>Emitido: {cert.emitido}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 pl-0 border-gray-200">
                        <button
                          onClick={() => navigate(`/validar?code=${cert.codigoValidacion}`)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 border border-[#800404] text-[#800404] hover:bg-red-50 text-xs font-bold px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          <CheckSquare size={14} />
                          Validar
                        </button>
                        <button
                          onClick={() => downloadCertSvg(cert)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-bold px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          <Download size={14} />
                          Descargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-200">
                  <Award className="mx-auto text-gray-200 mb-4" size={48} />
                  <h3 className="font-bold text-gray-700 mb-1">No posees certificados aún</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Los certificados se emiten de forma autónoma una vez completada la asistencia requerida a las conferencias.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: PERFIL PERSONAL */}
          {activeTab === 'perfil' && (
            <div>
              <div className="border-b border-gray-100 pb-5 mb-6">
                <h2 className="text-xl font-black text-gray-900">Perfil Personal</h2>
                <p className="text-xs text-gray-400 mt-1">Gestiona y actualiza los datos oficiales de tu cuenta UNI.</p>
              </div>

              {profileError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3.5 mb-5 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3.5 mb-5 text-xs text-green-700 flex items-start gap-2">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                
                {/* Photo profile selection */}
                <div className="bg-gray-50 p-5 border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                  <img 
                    src={user.profilePic} 
                    alt="Current Profile" 
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-bold text-gray-700 mb-1">Foto de Perfil</p>
                    <p className="text-[11px] text-gray-400 mb-3">Formatos JPG, PNG. Máximo 2MB.</p>
                    <label className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 inline-block">
                      <Upload size={13} />
                      Subir Nueva Foto
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombres *</label>
                    <input
                      type="text"
                      name="nombres"
                      value={profileForm.nombres}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apellidos *</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={profileForm.apellidos}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">DNI *</label>
                    <input
                      type="text"
                      name="dni"
                      maxLength={8}
                      value={profileForm.dni}
                      onChange={e => setProfileForm(f => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404] font-bold text-center tracking-wider"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      maxLength={9}
                      value={profileForm.telefono}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Universidad o Institución *</label>
                  <input
                    type="text"
                    name="institucion"
                    value={profileForm.institucion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                    required
                  />
                </div>

                {/* Password modification header */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-1.5">
                    <Lock size={15} />
                    Modificar Contraseña
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Dejar en blanco si no deseas cambiar tu contraseña.</p>
                  
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Clave Actual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={profileForm.currentPassword}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nueva Clave</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={profileForm.newPassword}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirmar Nueva</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profileForm.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#800404] hover:bg-[#5a0303] text-white px-8 py-3 font-bold text-sm transition-colors cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: CONFIGURACION (Simple details) */}
          {activeTab === 'configuracion' && (
            <div>
              <div className="border-b border-gray-100 pb-5 mb-6">
                <h2 className="text-xl font-black text-gray-900">Configuración de Cuenta</h2>
                <p className="text-xs text-gray-400 mt-1">Ajustes de privacidad y estado de la cuenta institucional.</p>
              </div>

              <div className="space-y-6 divide-y divide-gray-100">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Estado del Perfil</h4>
                    <p className="text-xs text-gray-400 mt-0.5">El DNI y correo están vinculados a la Base de Datos UNI.</p>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs font-black px-2.5 py-1 border border-green-200">
                    Sincronizado
                  </span>
                </div>

                <div className="pt-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Verificación de Correo</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Estado de validación de seguridad de tu cuenta de correo.</p>
                  </div>
                  {user.verified ? (
                    <span className="bg-green-50 text-green-700 text-xs font-black px-2.5 py-1 border border-green-200 flex items-center gap-1">
                      <CheckCircle size={12} /> Verificado
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 text-xs font-black px-2.5 py-1 border border-amber-200">
                      No Verificado
                    </span>
                  )}
                </div>

                <div className="pt-5">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Seguridad y Datos</h4>
                  <p className="text-xs text-gray-400 leading-normal mb-4">
                    La plataforma web de Sesquicentenario UNI se rige bajo las directrices de seguridad de la Oficina de Tecnología de la Información (OTI). Los datos de asistencia recogidos mediante QR digital son auditados automáticamente para la acreditación académica.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: EVENT DETAILS */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border border-gray-200 rounded-none shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 bg-[#800404]" />
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <span className="bg-red-50 text-[#800404] text-[10px] font-black px-2 py-0.5 border border-[#800404]/20 uppercase">
                  Detalles del Registro
                </span>
                <button
                  onClick={() => setSelectedEventDetails(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="font-black text-gray-900 text-xl leading-tight mb-4">{selectedEventDetails.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                {eventsCatalog[selectedEventDetails.id]?.desc || 'Detalles del evento registrado.'}
              </p>

              <div className="space-y-3 bg-gray-50 p-4 border border-gray-150 text-xs text-gray-700 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-[#800404]" />
                  <span><strong>Fecha:</strong> {selectedEventDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-[#800404]" />
                  <span><strong>Horario:</strong> {selectedEventDetails.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#800404]" />
                  <span><strong>Ubicación:</strong> {selectedEventDetails.location}</span>
                </div>
              </div>

              {selectedEventDetails.conferences && selectedEventDetails.conferences.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-black text-gray-700 uppercase mb-3 tracking-wider">Conferencias seleccionadas:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedEventDetails.conferences.map(confId => {
                      const details = conferencesCatalog[confId]
                      return (
                        <div key={confId} className="bg-white border border-gray-200 p-3 flex justify-between items-center gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-800 leading-tight">{details?.title || confId}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{details?.speaker} · {details?.room}</p>
                          </div>
                          <span className="bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 border border-green-150 rounded-sm shrink-0">
                            Confirmado
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedEventDetails(null)}
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-2.5 font-bold text-sm transition-colors cursor-pointer"
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TICKET QR EXPANDED */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm border border-gray-200 rounded-none shadow-2xl overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 bg-[#800404]" />
            <div className="p-8">
              <div className="flex justify-end mb-1">
                <button
                  onClick={() => setActiveQrModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <span className="bg-red-50 text-[#800404] text-[10px] font-black px-2.5 py-1 border border-[#800404]/20 uppercase inline-block mb-4">
                Pase de Acceso Oficial
              </span>
              
              <h3 className="font-black text-gray-900 text-lg leading-tight mb-6">{activeQrModal.eventTitle}</h3>

              {/* QR Code Simulation Area */}
              <div className="bg-gray-50 border border-gray-200 p-6 max-w-[210px] mx-auto mb-6 flex flex-col items-center">
                <div className="w-40 h-40 bg-white p-3 border border-gray-300 relative flex flex-col justify-between">
                  {/* Fake QR pattern design */}
                  <div className="flex justify-between w-full">
                    <div className="w-11 h-11 bg-black border border-white" />
                    <div className="w-11 h-11 bg-black border border-white" />
                  </div>
                  <div className="w-16 h-16 bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <span className="text-[7px] text-white font-bold leading-none uppercase tracking-tighter">UNI 150</span>
                  </div>
                  <div className="flex justify-between items-end w-full">
                    <div className="w-11 h-11 bg-black border border-white" />
                    <div className="w-11 h-11 flex flex-col justify-end items-end gap-1 p-0.5">
                      <div className="w-2 h-2 bg-black" />
                      <div className="w-5 h-5 bg-black" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-semibold">DNI: {user.dni}</p>
                <p className="text-[9px] text-gray-400 font-mono select-all truncate max-w-full overflow-hidden mt-1">{activeQrModal.qrCode}</p>
              </div>

              <div className="text-left border-t border-gray-200 pt-4 mb-6">
                <p className="text-xs text-gray-500 leading-relaxed text-center">
                  Presenta este código QR desde tu pantalla en la entrada de los auditorios de la UNI. El personal escaneará el código al ingresar y salir.
                </p>
              </div>

              <button
                onClick={() => setActiveQrModal(null)}
                className="w-full bg-[#800404] hover:bg-[#5a0303] text-white py-2.5 font-bold text-sm transition-colors cursor-pointer"
              >
                Cerrar QR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
