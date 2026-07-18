import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db, idbStorage } from '../services/db'
import { 
  Calendar, CreditCard, Award, User, Settings, ShieldAlert, 
  MapPin, Clock, Download, Eye, QrCode, Upload, CheckCircle, 
  AlertCircle, Lock, Edit2, CheckSquare, Trash2, X
} from 'lucide-react'
import { useAlert } from '../context/AlertContext'

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
  const { user, updateProfile, openAuth, migrateEmail } = useAuth()
  const { showAlert } = useAlert()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const activeTab = searchParams.get('tab') || 'eventos'
  const userCerts = (user && user.dni)
    ? db.getCertificates().filter(c => c.dni === user.dni)
    : []

  // Modals state
  const [selectedEventDetails, setSelectedEventDetails] = useState(null)
  const [activeQrModal, setActiveQrModal] = useState(null) // Ticket object
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null)
  const [activePdfUrl, setActivePdfUrl] = useState(null)
  const [activePdfCertCode, setActivePdfCertCode] = useState(null)
  
  // Account Migration state
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false)
  const [migratePassword, setMigratePassword] = useState('')
  const [migrateNewEmail, setMigrateNewEmail] = useState('')
  const [migrateError, setMigrateError] = useState('')
  
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

  // Handle Mercado Pago return redirect fallback
  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status')
    if (paymentStatus === 'approved' && user) {
      const isAlreadyRegistered = db.isUserRegistered(user.email, 'sep3')
      
      if (!isAlreadyRegistered) {
        let savedComps = []
        try {
          const rawComps = localStorage.getItem('pending_companions_sep3')
          if (rawComps) savedComps = JSON.parse(rawComps)
        } catch (err) {
          console.error(err)
        }

        const res = db.registerUserToEvent(user.email, 'sep3', [], savedComps)
        
        if (res.success) {
          showAlert('¡Tu pago fue procesado con éxito y tus entradas han sido emitidas!', '¡Compra Completada!', 'success')
          
          searchParams.delete('payment_status')
          setSearchParams(searchParams)
        }
      }
      
      localStorage.removeItem('pending_companions_sep3')
      localStorage.removeItem('pending_qty_sep3')
    }
  }, [searchParams, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
  }

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

  const handleMigrateSubmit = (e) => {
    e.preventDefault()
    setMigrateError('')

    if (!migratePassword) {
      setMigrateError('Por favor ingrese su contraseña actual para verificar su identidad.')
      return
    }

    if (!migrateNewEmail.trim()) {
      setMigrateError('Por favor ingrese el nuevo correo electrónico.')
      return
    }

    const res = migrateEmail(migratePassword, migrateNewEmail)
    if (res.success) {
      setIsMigrateModalOpen(false)
      showAlert('Cuenta migrada con éxito al nuevo correo.', 'Migración Completada', 'success')
      setProfileForm(f => ({ ...f, email: migrateNewEmail }))
    } else {
      setMigrateError(res.error)
    }
  }

  // Handle Profile Update
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    if (!profileForm.nombres.trim() || !profileForm.apellidos.trim() || !profileForm.email.trim()) {
      setProfileError('Los campos Nombres, Apellidos y Correo son obligatorios.')
      return
    }

    if (profileForm.dni && !/^\d{8}$/.test(profileForm.dni)) {
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
        showAlert('La imagen es demasiado grande. El límite es de 2MB.', 'Imagen Excede Límite', 'warning')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfile({ profilePic: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancelRegistration = (eventId) => {
    const confirmText = '¿Está seguro de que desea cancelar su inscripción a este evento? Se liberará su cupo y se anularán sus pases de acceso.'
    
    if (window.confirm(confirmText)) {
      const res = db.unregisterUserFromEvent(user.email, eventId)
      if (res.success) {
        const updatedUsers = db.getUsers()
        const updatedUser = updatedUsers.find(u => u.email === user.email)
        if (updatedUser) {
          updateProfile({
            registeredEvents: updatedUser.registeredEvents || [],
            tickets: updatedUser.tickets || []
          })
        }
        showAlert('Su inscripción al evento ha sido cancelada con éxito.', 'Inscripción Cancelada', 'success')
        setSelectedEventDetails(null)
      } else {
        showAlert(res.message, 'Error', 'error')
      }
    }
  }

  const handleRemoveConference = (confId) => {
    const confirmText = '¿Está seguro de remover esta ponencia de su agenda personal?'
    const executeRemove = () => {
      const updatedEvents = (user.registeredEvents || []).map(ev => {
        if (ev.id === selectedEventDetails.id) {
          return {
            ...ev,
            conferences: (ev.conferences || []).filter(c => c !== confId)
          }
        }
        return ev
      })
      const updatedTickets = (user.tickets || []).map(t => {
        if (t.eventId === selectedEventDetails.id) {
          return {
            ...t,
            conferences: (t.conferences || []).filter(c => c !== confId)
          }
        }
        return t
      })
      
      const storedUsers = JSON.parse(localStorage.getItem('uni_eventos_users') || '[]')
      const userIdx = storedUsers.findIndex(u => u.email === user.email)
      if (userIdx !== -1) {
        storedUsers[userIdx].registeredEvents = updatedEvents
        storedUsers[userIdx].tickets = updatedTickets
        localStorage.setItem('uni_eventos_users', JSON.stringify(storedUsers))
        
        updateProfile({
          registeredEvents: updatedEvents,
          tickets: updatedTickets
        })
        
        setSelectedEventDetails(prev => ({
          ...prev,
          conferences: (prev.conferences || []).filter(c => c !== confId)
        }))
        
        showAlert('Ponencia removida con éxito de su itinerario.', 'Ponencia Removida', 'success')
      }
    }

    if (window.confirm(confirmText)) {
      executeRemove()
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

  // View PDF Certificate
  const handleViewCert = async (cert) => {
    try {
      // 1. Check IndexedDB
      const fileBlob = await idbStorage.getFile(cert.id)
      if (fileBlob) {
        const url = URL.createObjectURL(fileBlob)
        setActivePdfUrl(url)
        setActivePdfCertCode(cert.codigoValidacion)
        return
      }
    } catch (err) {
      console.error("Error retrieving PDF from IndexedDB:", err)
    }

    // 2. Check pdfUrl
    if (cert.pdfUrl) {
      setActivePdfUrl(cert.pdfUrl)
      setActivePdfCertCode(cert.codigoValidacion)
      return
    }

    // 3. Fallback: generate simulated raw PDF
    const pdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 842 595] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 550 >>
stream
BT
/F1 26 Tf
180 480 Td
(UNIVERSIDAD NACIONAL DE INGENIERIA) Tj
/F1 16 Tf
30 -60 Td
(CERTIFICADO OFICIAL DE ${cert.tipo.toUpperCase()}) Tj
/F1 12 Tf
0 -40 Td
(Otorgado a la participacion de:) Tj
/F1 18 Tf
0 -30 Td
(${user.nombres.toUpperCase()} ${user.apellidos.toUpperCase()}) Tj
/F1 11 Tf
0 -40 Td
(Por haber asistido satisfactoriamente al evento oficial de la celebracion del Sesquicentenario:) Tj
/F1 14 Tf
0 -25 Td
(${cert.evento}) Tj
/F1 10 Tf
0 -35 Td
(Emitido: ${cert.emitido}) Tj
0 -20 Td
(Codigo de Autenticidad: ${cert.codigoValidacion}) Tj
0 -45 Td
(Firma de Autoridad: Dr. Alfonso Fujimori Morel - Rector de la UNI) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000249 00000 n 
0000000322 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
920
%%EOF`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    setActivePdfUrl(url)
    setActivePdfCertCode(cert.codigoValidacion)
  }

  // Download PDF Certificate
  const handleDownloadCert = async (cert) => {
    try {
      // 1. Check IndexedDB
      const fileBlob = await idbStorage.getFile(cert.id)
      if (fileBlob) {
        const url = URL.createObjectURL(fileBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Certificado-${cert.codigoValidacion}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return
      }
    } catch (err) {
      console.error("Error retrieving PDF from IndexedDB:", err)
    }

    // 2. Check pdfUrl
    if (cert.pdfUrl) {
      window.open(cert.pdfUrl, '_blank')
      return
    }

    // 3. Fallback: generate simulated raw PDF
    const pdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 842 595] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 550 >>
stream
BT
/F1 26 Tf
180 480 Td
(UNIVERSIDAD NACIONAL DE INGENIERIA) Tj
/F1 16 Tf
30 -60 Td
(CERTIFICADO OFICIAL DE ${cert.tipo.toUpperCase()}) Tj
/F1 12 Tf
0 -40 Td
(Otorgado a la participacion de:) Tj
/F1 18 Tf
0 -30 Td
(${user.nombres.toUpperCase()} ${user.apellidos.toUpperCase()}) Tj
/F1 11 Tf
0 -40 Td
(Por haber asistido satisfactoriamente al evento oficial de la celebracion del Sesquicentenario:) Tj
/F1 14 Tf
0 -25 Td
(${cert.evento}) Tj
/F1 10 Tf
0 -35 Td
(Emitido: ${cert.emitido}) Tj
0 -20 Td
(Codigo de Autenticidad: ${cert.codigoValidacion}) Tj
0 -45 Td
(Firma de Autoridad: Dr. Alfonso Fujimori Morel - Rector de la UNI) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000249 00000 n 
0000000322 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
920
%%EOF`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Certificado-${cert.codigoValidacion}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header bar banner */}
      <div className="bg-[#800404] text-white py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between w-full">
          <div className="flex items-start gap-4 text-left w-full">
            <div className="relative group w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-md bg-white/10 flex items-center justify-center shrink-0">
              <img 
                src={user.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              {/* Hover overlay with options */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <label className="text-[8px] font-black hover:text-red-200 cursor-pointer uppercase tracking-widest block text-center w-full py-1">
                  Subir
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>
                <button 
                  type="button"
                  onClick={() => setPreviewPhotoUrl(user.profilePic)}
                  className="text-[8px] font-black hover:text-red-200 cursor-pointer uppercase tracking-widest border-t border-white/20 w-full text-center py-1 block"
                >
                  Ver
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="bg-white/25 text-white text-[9px] font-black tracking-widest px-2 py-0.5 uppercase">
                Panel Universitario
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black mt-1 leading-tight break-words">{user.nombres} {user.apellidos}</h1>
              <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 break-all sm:break-normal">{user.email} · DNI: {user.dni}</p>
            </div>
          </div>
          
          {!user.verified && (
            <div className="bg-amber-500/25 border border-amber-500 text-amber-200 px-4 py-2 text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={14} className="shrink-0 text-amber-300" />
              <span>Correo sin verificar. Por favor valida tu cuenta.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid content */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-8">
        
        {/* Sidebar Nav (Desktop / Mobile Grid) */}
        <aside className="lg:col-span-1">
          <div className="grid grid-cols-3 lg:flex lg:flex-col gap-1 w-full pb-1 lg:pb-0">
          {[
            { id: 'eventos', label: 'Mis Eventos', icon: <Calendar size={15} /> },
            { id: 'certificados', label: 'Certificados', icon: <Award size={15} /> },
            { id: 'perfil', label: 'Perfil Personal', icon: <User size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center justify-center lg:justify-start gap-1.5 lg:gap-3 px-2 lg:px-4 py-2.5 lg:py-3 text-[10px] sm:text-xs lg:text-sm font-bold transition-all border-b-2 lg:border-b-0 lg:border-l-4 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white border-[#800404] text-[#800404] shadow-sm'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
          </div>
        </aside>

        {/* Dynamic Panels */}
        <main className="lg:col-span-3 bg-white border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
          
          {/* TAB: MIS EVENTOS */}
          {activeTab === 'eventos' && (() => {
            const allTickets = user.tickets || []
            const registeredEvents = user.registeredEvents || []
            
            const ticketEventIds = new Set(allTickets.map(t => String(t.eventId)))
            const legacyOnly = registeredEvents.filter(ev => !ticketEventIds.has(String(ev.id)))
            
            const allCatalogEvents = db.getEvents()
            const getEventStatus = (eventId) => {
              const found = allCatalogEvents.find(e => String(e.id) === String(eventId))
              return found ? found.status : 'pre' // 'pre' = upcoming, 'post' = past
            }

            const upcomingTickets = allTickets.filter(t => getEventStatus(t.eventId) !== 'post')
            const legacyUpcoming = legacyOnly.filter(ev => getEventStatus(ev.id) !== 'post')
            
            const pastTickets = allTickets.filter(t => getEventStatus(t.eventId) === 'post')
            const legacyPast = legacyOnly.filter(ev => getEventStatus(ev.id) === 'post')
            
            const userCerts = db.getCertificates().filter(c => c.dni === user.dni)
            const totalCount = allTickets.length + legacyOnly.length
            const hasUpcoming = upcomingTickets.length > 0 || legacyUpcoming.length > 0
            const hasPast = pastTickets.length > 0 || legacyPast.length > 0

            return (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Mis Eventos y Accesos</h2>
                    <p className="text-xs text-gray-400 mt-1">Administra tus entradas y revisa tu historial de eventos anteriores.</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 font-bold">
                    {totalCount} Inscripción(es)
                  </span>
                </div>

                {totalCount > 0 ? (
                  <div className="space-y-8">
                    {/* UPCOMING SECTION: ACTIVE TICKETS & ACCESS PASSES */}
                    {hasUpcoming && (
                      <div>
                        <h3 className="text-xs font-black text-[#800404] uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                          <Calendar size={14} /> Próximos Eventos y Entradas
                        </h3>
                        <div className="space-y-4">
                          {upcomingTickets.map(ticket => (
                            <div key={ticket.id} className="border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#800404] transition-all">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-red-50 text-[#800404] text-[10px] font-black px-2.5 py-0.5 border border-[#800404]/20 uppercase">
                                    {ticket.status}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-bold">ID: {ticket.id}</span>
                                </div>
                                <h4 className="font-black text-gray-900 text-lg leading-tight mb-2 group-hover:text-[#800404] transition-colors">{ticket.eventTitle}</h4>
                                
                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                                  <span className="flex items-center gap-1"><Calendar size={13} /> {ticket.date}</span>
                                  <span className="flex items-center gap-1"><MapPin size={13} /> {ticket.location}</span>
                                  {ticket.time && <span className="flex items-center gap-1"><Clock size={13} /> {ticket.time}</span>}
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
                                <button
                                  type="button"
                                  onClick={() => handleCancelRegistration(ticket.eventId)}
                                  className="flex-1 md:w-40 flex items-center justify-center gap-2 border border-red-200 hover:border-red-600 text-red-600 hover:bg-red-50 py-2 text-xs font-bold transition-all cursor-pointer bg-white"
                                >
                                  Cancelar inscripción
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Legacy upcoming events */}
                          {legacyUpcoming.map(ev => {
                            const fullInfo = eventsCatalog[ev.id] || ev
                            return (
                              <div key={ev.id} className="border border-gray-200 hover:border-[#800404] transition-all p-5 flex items-center justify-between group">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-0.5 border border-green-200">
                                      {ev.status || 'Confirmado'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">{ev.date}</span>
                                  </div>
                                  <h4 className="font-black text-gray-900 text-base leading-snug group-hover:text-[#800404] transition-colors">{ev.title}</h4>
                                  <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {ev.time}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedEventDetails(ev)}
                                  className="border border-gray-200 group-hover:border-[#800404] text-gray-700 group-hover:text-white group-hover:bg-[#800404] px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                                >
                                  Ver Detalles
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* PAST SECTION: HISTORY OF COMPLETED EVENTS */}
                    {hasPast && (
                      <div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                          <CheckSquare size={14} /> Eventos Anteriores (Historial)
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {pastTickets.map(ticket => {
                            const hasCert = userCerts.some(c => c.evento === ticket.eventTitle)
                            return (
                              <div key={ticket.id} className="border border-gray-200 bg-gray-50/50 flex flex-col">
                                <div className="h-1 bg-gray-300" />
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="bg-gray-150 text-gray-600 text-[10px] font-black px-2 py-0.5 border border-gray-250 flex items-center gap-1">
                                        <CheckCircle size={10} /> Concluido
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-bold">{ticket.date}</span>
                                    </div>
                                    <h4 className="font-black text-gray-700 text-base leading-tight mb-2 font-bold text-gray-700">
                                      {ticket.eventTitle}
                                    </h4>
                                    <div className="space-y-1 text-xs text-gray-400">
                                      <div className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-gray-300" />
                                        <span className="truncate">{ticket.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {hasCert ? (
                                    <Link
                                      to="/dashboard?tab=certificados"
                                      onClick={() => handleTabChange('certificados')}
                                      className="w-full mt-4 text-center bg-amber-50 border border-amber-200 text-amber-700 py-2 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
                                    >
                                      <Award size={13} /> Certificado Disponible
                                    </Link>
                                  ) : (
                                    <span className="w-full mt-4 text-center text-gray-400 py-2 text-xs font-medium border border-gray-200">
                                      Certificado pendiente
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}

                          {legacyPast.map(ev => {
                            const hasCert = userCerts.some(c => c.evento === ev.title)
                            return (
                              <div key={ev.id} className="border border-gray-200 bg-gray-50/50 flex flex-col">
                                <div className="h-1 bg-gray-300" />
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="bg-gray-150 text-gray-600 text-[10px] font-black px-2 py-0.5 border border-gray-250 flex items-center gap-1">
                                        <CheckCircle size={10} /> Concluido
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-bold">{ev.date}</span>
                                    </div>
                                    <h4 className="font-black text-gray-700 text-base leading-tight mb-2 font-bold text-gray-700">
                                      {ev.title}
                                    </h4>
                                    <div className="space-y-1 text-xs text-gray-400">
                                      <div className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-gray-300" />
                                        <span className="truncate">{ev.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {hasCert ? (
                                    <Link
                                      to="/dashboard?tab=certificados"
                                      onClick={() => handleTabChange('certificados')}
                                      className="w-full mt-4 text-center bg-amber-50 border border-amber-200 text-amber-700 py-2 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
                                    >
                                      <Award size={13} /> Certificado Disponible
                                    </Link>
                                  ) : (
                                    <span className="w-full mt-4 text-center text-gray-400 py-2 text-xs font-medium border border-gray-200">
                                      Certificado pendiente
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
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
            )
          })()}

          {/* TAB: CERTIFICADOS */}
          {activeTab === 'certificados' && (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Mis Certificados</h2>
                  <p className="text-xs text-gray-400 mt-1">Certificados oficiales emitidos a tu nombre correspondientes a tu DNI.</p>
                </div>
              </div>

              {userCerts && userCerts.length > 0 ? (
                <div className="space-y-4">
                  {userCerts.map(cert => (
                    <div key={cert.id} className="border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#800404] transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Código: {cert.codigoValidacion}</span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight mb-2">{cert.evento}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                          <span>Emitido: {cert.emitido}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 pl-0 border-gray-200">
                        <button
                          onClick={() => handleViewCert(cert)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 border border-[#800404] text-[#800404] hover:bg-red-50 text-xs font-bold px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                          Ver
                        </button>
                        <button
                          onClick={() => handleDownloadCert(cert)}
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
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">DNI</label>
                    <input
                      type="text"
                      name="dni"
                      maxLength={8}
                      value={profileForm.dni}
                      onChange={e => setProfileForm(f => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
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
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Universidad o Institución</label>
                  <input
                    type="text"
                    name="institucion"
                    value={profileForm.institucion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#800404]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico *</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 focus:outline-none cursor-not-allowed select-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={14} />
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMigratePassword('')
                        setMigrateNewEmail('')
                        setMigrateError('')
                        setIsMigrateModalOpen(true)
                      }}
                      className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-4 py-2.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Migrar Cuenta
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">El correo principal no se puede editar directamente por seguridad. Usa la opción de migración para cambiarlo.</p>
                </div>

                {/* Password modification header */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-1.5">
                    <Lock size={15} />
                    Modificar Contraseña
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Dejar en blanco si no deseas cambiar tu contraseña.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
      {selectedEventDetails && (() => {
        // Resolve date restriction limit checks
        const eventInDb = db.getEvents().find(e => e.id === selectedEventDetails.id || e.id === `jul${selectedEventDetails.id}` || e.id === `sep${selectedEventDetails.id}`)
        // Let events of July default to July 10, September to Sept 1, otherwise June 15 (expired)
        const defaultLimit = selectedEventDetails.id === 1 ? '2026-07-10T23:59:59Z' : (selectedEventDetails.date?.includes('Sep') ? '2026-09-01T23:59:59Z' : '2026-06-15T23:59:59Z')
        const maxEditDateStr = eventInDb?.max_edit_date || defaultLimit
        const maxEditDate = new Date(maxEditDateStr)
        const canEdit = new Date() < maxEditDate

        return (
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

                {/* Lock banner if editing has expired */}
                {!canEdit && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 text-[11px] text-amber-700 flex items-start gap-2 select-none">
                    <Lock size={14} className="shrink-0 mt-0.5 text-amber-500" />
                    <span>
                      La fecha límite para editar o cancelar ponencias venció el <strong>{maxEditDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>. El registro está cerrado.
                    </span>
                  </div>
                )}

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
                            
                            {canEdit ? (
                              <button
                                onClick={() => handleRemoveConference(confId)}
                                title="Remover de mi agenda"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            ) : (
                              <span className="bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 border border-green-150 rounded-sm shrink-0 flex items-center gap-0.5">
                                <Lock size={9} /> Confirmado
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setSelectedEventDetails(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 font-bold text-xs transition-colors cursor-pointer rounded-none"
                  >
                    Cerrar Detalles
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => handleCancelRegistration(selectedEventDetails.id)}
                      className="flex-1 border border-red-600 hover:bg-red-50 text-red-600 py-2.5 font-bold text-xs transition-colors cursor-pointer rounded-none"
                    >
                      Cancelar Registro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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

              {/* QR Code Area */}
              <div className="bg-gray-50 border border-gray-200 p-6 max-w-[210px] mx-auto mb-6 flex flex-col items-center">
                <div className="w-40 h-40 bg-white p-2 border border-gray-300 flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(activeQrModal.qrCode)}`}
                    alt="Código QR de la entrada"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-semibold">DNI: {user.dni || 'No registrado'}</p>
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

      {/* Photo Preview Modal */}
      {previewPhotoUrl && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white p-2 shadow-2xl border border-gray-200 rounded-none animate-in fade-in duration-200">
            <button
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute -top-9 -right-1 text-white hover:text-gray-200 transition-colors p-1 cursor-pointer"
            >
              <X size={24} />
            </button>
            <img 
              src={previewPhotoUrl} 
              alt="Preview" 
              className="w-full h-auto max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Account Migration Modal */}
      {isMigrateModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4">
          <form onSubmit={handleMigrateSubmit} className="relative max-w-md w-full bg-white p-6 shadow-2xl border border-gray-200 rounded-none animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setIsMigrateModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="mb-5 text-center sm:text-left">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                <Lock size={16} className="text-[#800404]" />
                Migrar Cuenta de Usuario
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Al migrar tu cuenta a una nueva dirección de correo electrónico, se transferirán todos tus registros de eventos, entradas QR y certificados al nuevo correo de forma segura.
              </p>
            </div>

            {migrateError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{migrateError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Correo Electrónico Actual</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400 focus:outline-none cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nuevo Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@nuevo.com"
                  value={migrateNewEmail}
                  onChange={e => setMigrateNewEmail(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#800404]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Contraseña Actual *</label>
                <input
                  type="password"
                  required
                  placeholder="Confirma tu contraseña actual"
                  value={migratePassword}
                  onChange={e => setMigratePassword(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#800404]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsMigrateModalOpen(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#800404] hover:bg-[#5a0303] text-white py-2.5 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Confirmar Migración
              </button>
            </div>
          </form>
        </div>
      )}
      {/* PDF VIEWER MODAL OVERLAY */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative border-t-8 border-t-[#800404] rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h3 className="text-base font-black text-gray-900">
                Visualización de Certificado ({activePdfCertCode})
              </h3>
              <button 
                onClick={() => {
                  if (activePdfUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(activePdfUrl);
                  }
                  setActivePdfUrl(null);
                  setActivePdfCertCode(null);
                }}
                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Body: iframe */}
            <div className="flex-1 bg-gray-100 overflow-hidden relative">
              <iframe
                src={`${activePdfUrl}#toolbar=0&navpanes=0`}
                title="Certificado PDF"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
