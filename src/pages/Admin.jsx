import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../services/db'
import { 
  LayoutDashboard, Calendar, Mic, Users, QrCode, Award, Settings, 
  LogOut, Search, Plus, Trash2, Edit2, ShieldAlert, CheckCircle, 
  AlertTriangle, RefreshCw, UploadCloud, ChevronUp, ChevronDown, Check, X,
  Clock, MapPin, Eye, FileSpreadsheet, EyeOff, ShieldCheck
} from 'lucide-react'

export default function Admin() {
  const { user, logout, updateProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Redirection / Security Guard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/iniciar-sesion?redirect=/admin')
      } else if (user.role !== 'ADMIN') {
        // Redirigir al inicio si es un usuario común
        navigate('/')
      }
    }
  }, [user, loading, navigate])

  // --- STATE FOR ALL MODULES ---
  // General db states for listing
  const [events, setEvents] = useState([])
  const [conferences, setConferences] = useState([])
  const [certificates, setCertificates] = useState([])
  const [usersList, setUsersList] = useState([])
  const [qrLogs, setQrLogs] = useState([])

  // Refresh data from DB
  const refreshAllData = () => {
    setEvents(db.getEvents())
    setConferences(db.getConferences())
    setCertificates(db.getCertificates())
    setUsersList(db.getUsers())
    setQrLogs(db.getQrLogs())
  }

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      refreshAllData()
    }
  }, [user])

  // --- EVENTOS STATE & LOGIC ---
  const [eventSearch, setEventSearch] = useState('')
  const [eventFilterStatus, setEventFilterStatus] = useState('all')
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    organizer: '',
    date: '',
    time: '',
    location: '',
    description: '',
    quota: '',
    status: 'pre',
    isPaid: false,
    imageUrl: '',
    category: 'Académico'
  })

  const handleOpenEventModal = (ev = null) => {
    if (ev) {
      setEditingEvent(ev)
      setEventForm({
        title: ev.title || '',
        organizer: ev.organizer || '',
        date: ev.date || '',
        time: ev.time || '',
        location: ev.location || '',
        description: ev.description || '',
        quota: ev.quota || '',
        status: ev.status || 'pre',
        isPaid: ev.isPaid || false,
        imageUrl: ev.imageUrl || '',
        category: ev.category || 'Académico'
      })
    } else {
      setEditingEvent(null)
      setEventForm({
        title: '',
        organizer: '',
        date: '',
        time: '08:00 – 18:00',
        location: '',
        description: '',
        quota: '300',
        status: 'pre',
        isPaid: false,
        imageUrl: '',
        category: 'Académico'
      })
    }
    setIsEventModalOpen(true)
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!eventForm.title.trim() || !eventForm.date.trim() || !eventForm.location.trim()) {
      alert('Por favor complete los campos obligatorios: Título, Fecha y Ubicación.')
      return
    }

    if (editingEvent) {
      db.updateEvent({
        id: editingEvent.id,
        ...eventForm
      })
    } else {
      db.createEvent({
        ...eventForm
      })
    }
    setIsEventModalOpen(false)
    refreshAllData()
  }

  const handleDeleteEvent = (id) => {
    if (confirm('¿Está seguro de eliminar este evento y todas sus ponencias asociadas?')) {
      db.deleteEvent(id)
      refreshAllData()
    }
  }

  // --- PONENCIAS STATE & LOGIC ---
  const [confSearch, setConfSearch] = useState('')
  const [confFilterEvent, setConfFilterEvent] = useState('all')
  const [isConfModalOpen, setIsConfModalOpen] = useState(false)
  const [editingConf, setEditingConf] = useState(null)
  const [confForm, setConfForm] = useState({
    title: '',
    speaker: '',
    room: '',
    time: '',
    duration: '',
    quota: '',
    eventId: ''
  })

  const handleOpenConfModal = (cf = null) => {
    const availableEvents = db.getEvents()
    if (cf) {
      setEditingConf(cf)
      setConfForm({
        title: cf.title || '',
        speaker: cf.speaker || '',
        room: cf.room || '',
        time: cf.time || '',
        duration: cf.duration || '',
        quota: cf.quota || '',
        eventId: cf.eventId || ''
      })
    } else {
      setEditingConf(null)
      setConfForm({
        title: '',
        speaker: '',
        room: '',
        time: '09:00',
        duration: '60',
        quota: '100',
        eventId: availableEvents.length > 0 ? availableEvents[0].id : ''
      })
    }
    setIsConfModalOpen(true)
  }

  const handleSaveConf = (e) => {
    e.preventDefault()
    if (!confForm.title.trim() || !confForm.speaker.trim() || !confForm.eventId) {
      alert('Por favor complete los campos obligatorios: Título, Expositor y Evento relacionado.')
      return
    }

    if (editingConf) {
      db.updateConference({
        id: editingConf.id,
        ...confForm
      })
    } else {
      db.createConference({
        ...confForm
      })
    }
    setIsConfModalOpen(false)
    refreshAllData()
  }

  const handleDeleteConf = (id) => {
    if (confirm('¿Está seguro de eliminar esta ponencia?')) {
      db.deleteConference(id)
      refreshAllData()
    }
  }

  // --- CRONOGRAMA STATE & LOGIC ---
  const [selectedEventId, setSelectedEventId] = useState('')
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id)
    }
  }, [events])

  const handleReorderConf = (confId, direction) => {
    const eventConfs = conferences.filter(c => c.eventId === selectedEventId)
    const index = eventConfs.findIndex(c => c.id === confId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= eventConfs.length) return

    // Swap elements in local copy
    const reordered = [...eventConfs]
    const temp = reordered[index]
    reordered[index] = reordered[newIndex]
    reordered[newIndex] = temp

    // Save back to db
    const remainingConfs = conferences.filter(c => c.eventId !== selectedEventId)
    db.saveConferences([...remainingConfs, ...reordered])
    refreshAllData()
  }

  const handleQuickUpdateConf = (confId, field, val) => {
    const conf = conferences.find(c => c.id === confId)
    if (conf) {
      db.updateConference({
        ...conf,
        [field]: val
      })
      refreshAllData()
    }
  }

  // --- PARTICIPANTES STATE & LOGIC ---
  const [participantSearch, setParticipantSearch] = useState('')
  const [participantFilterEvent, setParticipantFilterEvent] = useState('all')

  const getParticipantsList = () => {
    const list = []
    usersList.forEach(u => {
      if (u.role === 'ADMIN') return // Exclude admin users
      
      // If user registered to events
      if (u.registeredEvents && u.registeredEvents.length > 0) {
        u.registeredEvents.forEach(re => {
          // Find the ticket status for this event
          const ticket = (u.tickets || []).find(t => String(t.eventId) === String(re.id))
          list.push({
            dni: u.dni,
            nombres: u.nombres,
            apellidos: u.apellidos,
            email: u.email,
            eventId: re.id,
            eventTitle: re.title,
            status: ticket ? ticket.status : 'Inscrito'
          })
        })
      } else {
        // Registered but no event
        list.push({
          dni: u.dni,
          nombres: u.nombres,
          apellidos: u.apellidos,
          email: u.email,
          eventId: 'none',
          eventTitle: '(Ninguno)',
          status: 'No registrado'
        })
      }
    })
    return list
  }

  const filteredParticipants = getParticipantsList().filter(p => {
    const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase()
    const matchesSearch = fullName.includes(participantSearch.toLowerCase()) || 
                          p.dni.includes(participantSearch) || 
                          p.email.toLowerCase().includes(participantSearch.toLowerCase())
    
    const matchesEvent = participantFilterEvent === 'all' || String(p.eventId) === String(participantFilterEvent)
    return matchesSearch && matchesEvent
  })

  const handleExportCSV = () => {
    const headers = ['Nombres', 'Apellidos', 'DNI', 'Correo', 'Evento Inscrito', 'Estado Asistencia']
    const rows = filteredParticipants.map(p => [
      `"${p.nombres}"`,
      `"${p.apellidos}"`,
      `"${p.dni}"`,
      `"${p.email}"`,
      `"${p.eventTitle}"`,
      `"${p.status}"`
    ])
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    // Add BOM for Excel UTF-8 compliance
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `participantes_sesquitec_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- ASISTENCIA QR STATE & LOGIC ---
  const [manualQrInput, setManualQrInput] = useState('')
  const [scanResult, setScanResult] = useState(null) // { success: boolean, message: string, detail?: object }
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef(null)
  const [cameraStream, setCameraStream] = useState(null)
  
  const processQrCode = (qrData) => {
    if (!qrData) return
    
    // QR format: UNI-150-TICKET-{eventId}-{dni}-{random}
    const regex = /^UNI-150-TICKET-([^-]+)-([^-]+)-(\d+)$/
    const match = qrData.match(regex)
    
    if (!match) {
      const log = {
        name: 'Código Desconocido',
        dni: 'N/A',
        eventTitle: 'N/A',
        result: 'Código Inválido',
        detail: qrData
      }
      db.addQrLog(log)
      setScanResult({
        success: false,
        type: 'invalid',
        message: 'Código de barra o QR inválido.',
        detail: 'El formato no corresponde a un ticket oficial del Sesquicentenario.'
      })
      refreshAllData()
      return
    }

    const eventId = match[1]
    const dni = match[2]
    
    // Find event and user
    const dbEvents = db.getEvents()
    const targetEvent = dbEvents.find(e => String(e.id) === String(eventId))
    const allUsers = db.getUsers()
    const targetUser = allUsers.find(u => u.dni === dni)

    if (!targetUser) {
      const log = {
        name: `DNI: ${dni}`,
        dni: dni,
        eventTitle: targetEvent ? targetEvent.title : `ID: ${eventId}`,
        result: 'Usuario no encontrado',
        detail: qrData
      }
      db.addQrLog(log)
      setScanResult({
        success: false,
        type: 'invalid',
        message: 'Participante no registrado.',
        detail: `El DNI ${dni} no coincide con ningún usuario en el sistema.`
      })
      refreshAllData()
      return
    }

    if (!targetEvent) {
      const log = {
        name: `${targetUser.nombres} ${targetUser.apellidos}`,
        dni: dni,
        eventTitle: `Evento ID: ${eventId}`,
        result: 'Evento no encontrado',
        detail: qrData
      }
      db.addQrLog(log)
      setScanResult({
        success: false,
        type: 'invalid',
        message: 'Evento no encontrado.',
        detail: `El código apunta a un evento inexistente (ID: ${eventId}).`
      })
      refreshAllData()
      return
    }

    // Check if registered to this event
    const hasTicket = (targetUser.tickets || []).some(t => String(t.eventId) === String(eventId))
    if (!hasTicket) {
      const log = {
        name: `${targetUser.nombres} ${targetUser.apellidos}`,
        dni: dni,
        eventTitle: targetEvent.title,
        result: 'No inscrito',
        detail: qrData
      }
      db.addQrLog(log)
      setScanResult({
        success: false,
        type: 'invalid',
        message: 'Participante no inscrito en este evento.',
        detail: `${targetUser.nombres} no se ha registrado para este evento particular.`
      })
      refreshAllData()
      return
    }

    // Check for duplicate scan
    const ticket = targetUser.tickets.find(t => String(t.eventId) === String(eventId))
    if (ticket && ticket.status === 'Asistió') {
      const log = {
        name: `${targetUser.nombres} ${targetUser.apellidos}`,
        dni: dni,
        eventTitle: targetEvent.title,
        result: 'Duplicado',
        detail: qrData
      }
      db.addQrLog(log)
      setScanResult({
        success: false,
        type: 'duplicate',
        message: 'Asistencia ya registrada (Duplicado).',
        detail: `El participante ya realizó su ingreso a este evento. DNI: ${dni}.`
      })
      refreshAllData()
      return
    }

    // Success registration
    db.updateUserTicketStatus(dni, eventId, 'Asistió')
    
    const log = {
      name: `${targetUser.nombres} ${targetUser.apellidos}`,
      dni: dni,
      eventTitle: targetEvent.title,
      result: 'Exitoso',
      detail: qrData
    }
    db.addQrLog(log)
    
    setScanResult({
      success: true,
      type: 'success',
      message: 'Asistencia registrada con éxito.',
      detail: {
        name: `${targetUser.nombres} ${targetUser.apellidos}`,
        dni: dni,
        event: targetEvent.title,
        time: new Date().toLocaleTimeString('es-PE')
      }
    })
    setManualQrInput('')
    refreshAllData()
  }

  const handleManualQrSubmit = (e) => {
    e.preventDefault()
    if (!manualQrInput.trim()) return
    processQrCode(manualQrInput.trim())
  }

  const startCamera = async () => {
    setIsCameraActive(true)
    setScanResult(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      // Simulate scanning code automatically in 4 seconds for display/demo if camera is active
      setTimeout(() => {
        if (stream.active) {
          // Try scanning Juan Perez's ticket
          const juanTicket = 'UNI-150-TICKET-1-12345678-854721'
          setManualQrInput(juanTicket)
        }
      }, 4000)

    } catch (err) {
      console.error('No se pudo acceder a la cámara:', err)
      alert('No se pudo acceder a la webcam. Por favor, utilice el simulador de entrada de texto.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setIsCameraActive(false)
  }

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  // --- CERTIFICADOS STATE & LOGIC ---
  const [certSearch, setCertSearch] = useState('')
  const [uploadQueue, setUploadQueue] = useState([])
  const [selectedEventForCert, setSelectedEventForCert] = useState('')
  const [certHours, setCertHours] = useState('4')
  const [certType, setCertType] = useState('Participación')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Validation Test State inside admin
  const [testValidationCode, setTestValidationCode] = useState('')
  const [testValidationResult, setTestValidationResult] = useState(null)
  
  useEffect(() => {
    if (events.length > 0 && !selectedEventForCert) {
      setSelectedEventForCert(events[0].title)
    }
  }, [events])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const list = files.map(file => {
      // Find DNI in filename (8 consecutive digits)
      const dniMatch = file.name.match(/\b\d{8}\b/)
      const dni = dniMatch ? dniMatch[0] : null
      const matchedUser = dni ? usersList.find(u => u.dni === dni) : null
      return {
        id: `uq-${Math.random().toString(36).substring(2, 9)}`,
        fileName: file.name,
        dni: dni || 'No encontrado',
        titular: matchedUser ? `${matchedUser.nombres} ${matchedUser.apellidos}` : 'No registrado',
        userFound: !!matchedUser,
        file: file
      }
    })
    setUploadQueue(prev => [...prev, ...list])
  }

  const handleRemoveFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id))
  }

  const handleProcessUploads = () => {
    if (uploadQueue.length === 0) return
    if (!selectedEventForCert) {
      alert('Por favor seleccione el evento asociado.')
      return
    }

    setIsUploading(true)
    setUploadProgress(10)
    
    // Simulate loading bars
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          
          // Actually create certificates in database
          let count = 0
          uploadQueue.forEach(item => {
            if (item.userFound && item.dni !== 'No encontrado') {
              db.createCertificate({
                dni: item.dni,
                titular: item.titular,
                evento: selectedEventForCert,
                horas: certHours,
                tipo: certType,
              })
              count++
            }
          })
          
          alert(`Carga masiva finalizada. Se procesaron y emitieron ${count} certificados con éxito.`);
          setUploadQueue([])
          setIsUploading(false)
          setUploadProgress(0)
          refreshAllData()
          return 100
        }
        return prev + 15
      })
    }, 200)
  }

  const handleDeleteCertificate = (id) => {
    if (confirm('¿Está seguro de revocar y eliminar permanentemente este certificado?')) {
      db.deleteCertificate(id)
      refreshAllData()
    }
  }

  const handleTestValidate = (e) => {
    e.preventDefault()
    if (!testValidationCode.trim()) return
    const cleanCode = testValidationCode.trim().toUpperCase()
    const found = certificates.find(c => c.codigoValidacion.toUpperCase() === cleanCode || c.id.toUpperCase() === cleanCode)
    setTestValidationResult(found ? { valid: true, ...found } : { valid: false })
  }

  // --- CONFIGURACION STATE & LOGIC ---
  const [profileForm, setProfileForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    dni: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setProfileForm({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        dni: user.dni || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setProfileError('')
      setProfileSuccess('')
    }
  }, [user, activeTab])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    if (!profileForm.nombres.trim() || !profileForm.apellidos.trim() || !profileForm.email.trim()) {
      setProfileError('Todos los campos son obligatorios.')
      return
    }

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
      ...passwordUpdates
    })

    if (res.success) {
      setProfileSuccess('Perfil administrativo actualizado con éxito.')
      setProfileForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } else {
      setProfileError(res.error || 'Ocurrió un error al actualizar el perfil.')
    }
  }

  // --- GENERAL STATS FOR METRIC CARDS ---
  const statTotalUsers = usersList.filter(u => u.role !== 'ADMIN').length
  const statTotalEvents = events.length
  const statTotalConferences = conferences.length
  const statTotalCertificates = certificates.length
  
  // Count checked-in users
  const statTotalCheckedIn = usersList.reduce((acc, u) => {
    if (u.tickets && u.tickets.length > 0) {
      const checkedInCount = u.tickets.filter(t => t.status === 'Asistió').length
      return acc + checkedInCount
    }
    return acc
  }, 0)

  const upcomingEvents = events.filter(e => e.status !== 'post')
  const finishedEvents = events.filter(e => e.status === 'post')

  // Prevent flash of page during auth loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={40} className="text-[#800404] animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500">Cargando Panel Administrativo...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null // Security redirect triggers in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-150 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#800404] text-white flex flex-col shrink-0 shadow-lg">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck size={28} className="text-white/80" />
          <div>
            <h2 className="font-black text-lg tracking-wider">SESQUITEC</h2>
            <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Panel Administrativo</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'eventos', label: 'Eventos', icon: Calendar },
            { id: 'ponencias', label: 'Ponencias', icon: Mic },
            { id: 'cronograma', label: 'Cronograma', icon: Clock },
            { id: 'participantes', label: 'Participantes', icon: Users },
            { id: 'asistencia-qr', label: 'Asistencia QR', icon: QrCode },
            { id: 'certificados', label: 'Certificados', icon: Award },
            { id: 'configuracion', label: 'Configuración', icon: Settings },
          ].map(tab => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-white text-[#800404] shadow-md border-l-4 border-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-white/10 bg-[#5a0303] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={user.profilePic || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"} 
              alt="Admin Profile" 
              className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-black truncate">{user.nombres} {user.apellidos}</p>
              <p className="text-[10px] text-white/60 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/') }} 
            title="Cerrar sesión"
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MAIN MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-y-auto">
        
        {/* Top Header of Main Area */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-red-50 text-[#800404] text-[10px] font-black tracking-wide px-3 py-1 border border-red-200">
              ROL: ADMINISTRADOR
            </span>
            <button 
              onClick={refreshAllData}
              title="Sincronizar base de datos"
              className="p-2 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all rounded-none cursor-pointer"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Tab Component */}
        <div className="p-6">
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Participantes', value: statTotalUsers, icon: Users, color: 'border-l-[#800404] text-[#800404]' },
                  { label: 'Total Eventos', value: statTotalEvents, icon: Calendar, color: 'border-l-blue-600 text-blue-600' },
                  { label: 'Conferencias', value: statTotalConferences, icon: Mic, color: 'border-l-indigo-600 text-indigo-600' },
                  { label: 'Certificados', value: statTotalCertificates, icon: Award, color: 'border-l-amber-600 text-amber-600' },
                  { label: 'Asistencias QR', value: statTotalCheckedIn, icon: QrCode, color: 'border-l-emerald-600 text-emerald-600' },
                ].map((card, idx) => {
                  const Icon = card.icon
                  return (
                    <div key={idx} className={`bg-white border border-gray-200 border-l-4 p-5 flex flex-col justify-between shadow-sm relative ${card.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">{card.label}</span>
                        <Icon size={20} className="opacity-40" />
                      </div>
                      <p className="text-3xl font-black text-gray-900 leading-none">{card.value}</p>
                    </div>
                  )
                })}
              </div>

              {/* Event Lists split */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Upcoming Events Column */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                    Eventos Próximos o Activos ({upcomingEvents.length})
                  </h3>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No hay eventos próximos.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                      {upcomingEvents.map(e => (
                        <div key={e.id} className="py-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-800 leading-tight">{e.title}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                              <Calendar size={11} />{e.date} &nbsp;·&nbsp; <Clock size={11} />{e.time}
                            </p>
                          </div>
                          <span className="shrink-0 bg-red-50 text-[#800404] text-[10px] font-bold px-2 py-0.5 border border-red-200 uppercase">
                            {e.status === 'pre' ? 'Pre-evento' : 'Publicado'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Finished Events Column */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                    Eventos Finalizados (Post-Evento) ({finishedEvents.length})
                  </h3>
                  {finishedEvents.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No hay eventos finalizados.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                      {finishedEvents.map(e => (
                        <div key={e.id} className="py-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-800 leading-tight">{e.title}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                              <Calendar size={11} />{e.date}
                            </p>
                          </div>
                          <span className="shrink-0 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 border border-gray-200 uppercase">
                            Finalizado
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: EVENTOS CRUD */}
          {activeTab === 'eventos' && (
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-6">
              
              {/* Event Table Search Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full sm:max-w-md relative">
                  <input
                    type="text"
                    placeholder="Buscar evento..."
                    value={eventSearch}
                    onChange={e => setEventSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#800404] bg-white text-gray-850"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
                  <select 
                    value={eventFilterStatus}
                    onChange={e => setEventFilterStatus(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-white text-gray-700"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pre">Pre-Evento</option>
                    <option value="active">Activo/Publicado</option>
                    <option value="post">Post-Evento/Finalizado</option>
                  </select>
                  <button
                    onClick={() => handleOpenEventModal(null)}
                    className="bg-[#800404] hover:bg-[#5a0303] text-white text-sm font-black px-4 py-2.5 transition-colors flex items-center gap-2 rounded-none cursor-pointer"
                  >
                    <Plus size={16} /> Crear Evento
                  </button>
                </div>
              </div>

              {/* Event Table View */}
              <div className="overflow-x-auto border border-gray-150">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 font-black text-gray-700 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-3.5 text-left">Título / Organizador</th>
                      <th className="px-6 py-3.5 text-left">Fecha & Hora</th>
                      <th className="px-6 py-3.5 text-left">Ubicación</th>
                      <th className="px-6 py-3.5 text-center">Capacidad</th>
                      <th className="px-6 py-3.5 text-center">Estado</th>
                      <th className="px-6 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {events
                      .filter(e => {
                        const titleMatch = e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                           e.organizer.toLowerCase().includes(eventSearch.toLowerCase())
                        const statusMatch = eventFilterStatus === 'all' || 
                                            (eventFilterStatus === 'pre' && e.status === 'pre') ||
                                            (eventFilterStatus === 'active' && e.status !== 'post' && e.status !== 'pre') ||
                                            (eventFilterStatus === 'post' && e.status === 'post')
                        return titleMatch && statusMatch
                      })
                      .map(ev => {
                        // Count registered count in our database mock
                        const registeredCount = usersList.filter(u => 
                          u.registeredEvents && u.registeredEvents.some(re => String(re.id) === String(ev.id))
                        ).length

                        return (
                          <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 leading-tight">{ev.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{ev.organizer}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-gray-700">{ev.date}</p>
                              <p className="text-xs text-gray-400">{ev.time}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600 truncate max-w-xs block" title={ev.location}>
                                {ev.location}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap font-medium">
                              <span className="text-gray-700">{registeredCount}</span>
                              <span className="text-gray-400"> / {ev.quota || '∞'}</span>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className={`inline-block text-[10px] font-black px-2.5 py-1 uppercase border rounded-none ${
                                ev.status === 'post' 
                                  ? 'bg-gray-50 border-gray-200 text-gray-500'
                                  : ev.status === 'pre'
                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              }`}>
                                {ev.status === 'post' ? 'Post-Evento' : ev.status === 'pre' ? 'Pre-Evento' : 'Publicado'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="flex gap-2 justify-end">
                                {ev.status !== 'post' && (
                                  <button
                                    onClick={() => {
                                      db.updateEvent({ ...ev, status: 'post' })
                                      refreshAllData()
                                    }}
                                    title="Marcar como Post-Evento"
                                    className="border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-600 text-xs px-2 py-1 transition-all rounded-none cursor-pointer"
                                  >
                                    Finalizar
                                  </button>
                                )}
                                {ev.status === 'pre' && (
                                  <button
                                    onClick={() => {
                                      db.updateEvent({ ...ev, status: 'published' })
                                      refreshAllData()
                                    }}
                                    title="Publicar evento"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 transition-all font-black rounded-none cursor-pointer"
                                  >
                                    Publicar
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenEventModal(ev)}
                                  className="p-1 border border-gray-200 hover:border-gray-400 text-blue-600 hover:bg-blue-50 transition-all rounded-none cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(ev.id)}
                                  className="p-1 border border-gray-200 hover:border-gray-400 text-red-600 hover:bg-red-50 transition-all rounded-none cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: PONENCIAS CRUD */}
          {activeTab === 'ponencias' && (
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-6">
              
              {/* Ponencia Table Search Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full sm:max-w-md relative">
                  <input
                    type="text"
                    placeholder="Buscar ponencia..."
                    value={confSearch}
                    onChange={e => setConfSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#800404] bg-white text-gray-850"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
                  <select 
                    value={confFilterEvent}
                    onChange={e => setConfFilterEvent(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-white text-gray-700"
                  >
                    <option value="all">Todos los eventos</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleOpenConfModal(null)}
                    className="bg-[#800404] hover:bg-[#5a0303] text-white text-sm font-black px-4 py-2.5 transition-colors flex items-center gap-2 rounded-none cursor-pointer"
                  >
                    <Plus size={16} /> Crear Ponencia
                  </button>
                </div>
              </div>

              {/* Ponencias Table View */}
              <div className="overflow-x-auto border border-gray-150">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 font-black text-gray-700 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-3.5 text-left">Ponencia / Aula</th>
                      <th className="px-6 py-3.5 text-left">Expositor</th>
                      <th className="px-6 py-3.5 text-left">Evento Relacionado</th>
                      <th className="px-6 py-3.5 text-center">Horario & Duración</th>
                      <th className="px-6 py-3.5 text-center">Aforo</th>
                      <th className="px-6 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {conferences
                      .filter(c => {
                        const searchMatch = c.title.toLowerCase().includes(confSearch.toLowerCase()) ||
                                            c.speaker.toLowerCase().includes(confSearch.toLowerCase())
                        const eventMatch = confFilterEvent === 'all' || String(c.eventId) === String(confFilterEvent)
                        return searchMatch && eventMatch
                      })
                      .map(cf => {
                        const relatedEvent = events.find(e => String(e.id) === String(cf.eventId))
                        return (
                          <tr key={cf.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 leading-tight">{cf.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Lugar: {cf.room || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="font-semibold text-[#800404]">{cf.speaker}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-gray-700 truncate max-w-xs" title={relatedEvent?.title}>
                                {relatedEvent ? relatedEvent.title : `ID: ${cf.eventId}`}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <p className="text-gray-800 font-medium">{cf.time || '00:00'}</p>
                              <p className="text-xs text-gray-400">{cf.duration || 60} mins</p>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-gray-600">
                              {cf.quota || 100}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleOpenConfModal(cf)}
                                  className="p-1 border border-gray-200 hover:border-gray-400 text-blue-600 hover:bg-blue-50 transition-all rounded-none cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteConf(cf.id)}
                                  className="p-1 border border-gray-200 hover:border-gray-400 text-red-600 hover:bg-red-50 transition-all rounded-none cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: CRONOGRAMA DE ACTIVIDADES */}
          {activeTab === 'cronograma' && (
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Cronograma por Evento</h3>
                  <p className="text-sm text-gray-400 mt-0.5">Administra, reordena y edita las actividades/ponencias del cronograma.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">Seleccionar Evento:</span>
                  <select 
                    value={selectedEventId}
                    onChange={e => setSelectedEventId(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-white font-semibold text-gray-800"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Schedule listing */}
              {conferences.filter(c => String(c.eventId) === String(selectedEventId)).length === 0 ? (
                <div className="text-center py-16 text-gray-300">
                  <Clock size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-gray-400 font-bold">No hay ponencias asignadas a este evento.</p>
                  <p className="text-xs text-gray-400 mt-1">Cree una ponencia en la pestaña de Ponencias y elija este evento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                    <div className="w-16 text-center">Orden</div>
                    <div className="flex-1 px-4">Ponencia / Expositor</div>
                    <div className="w-40">Horario de Inicio</div>
                    <div className="w-48">Aula / Ubicación</div>
                    <div className="w-32 text-right">Reordenar</div>
                  </div>
                  
                  <div className="space-y-2">
                    {conferences
                      .filter(c => String(c.eventId) === String(selectedEventId))
                      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                      .map((cf, idx, arr) => (
                        <div key={cf.id} className="bg-white border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-gray-400 transition-colors">
                          
                          {/* Order Indicator */}
                          <div className="w-16 flex items-center justify-center shrink-0">
                            <span className="w-8 h-8 rounded-full bg-red-50 text-[#800404] border border-red-100 flex items-center justify-center font-black text-sm">
                              {idx + 1}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 px-4 min-w-0">
                            <p className="font-bold text-gray-900 leading-snug">{cf.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Ponente: <strong className="text-gray-700 font-bold">{cf.speaker}</strong></p>
                          </div>

                          {/* Time modifier */}
                          <div className="w-40 shrink-0">
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-[#800404]" />
                              <input 
                                type="text" 
                                value={cf.time || '09:00'} 
                                onChange={e => handleQuickUpdateConf(cf.id, 'time', e.target.value)}
                                className="border border-gray-200 hover:border-gray-400 bg-white text-sm font-semibold px-2 py-1 text-center w-20 text-gray-800"
                              />
                              <span className="text-xs text-gray-400 font-medium">hs</span>
                            </div>
                          </div>

                          {/* Location modifier */}
                          <div className="w-48 shrink-0">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-[#800404]" />
                              <input 
                                type="text" 
                                value={cf.room || 'Aula Magna'} 
                                onChange={e => handleQuickUpdateConf(cf.id, 'room', e.target.value)}
                                className="border border-gray-200 hover:border-gray-400 bg-white text-xs font-semibold px-2 py-1 text-gray-800 w-full"
                              />
                            </div>
                          </div>

                          {/* Reordering Controls */}
                          <div className="w-32 shrink-0 flex gap-1 justify-end">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleReorderConf(cf.id, 'up')}
                              className={`p-1.5 border border-gray-200 transition-colors rounded-none ${
                                idx === 0 
                                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-black cursor-pointer'
                              }`}
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              disabled={idx === arr.length - 1}
                              onClick={() => handleReorderConf(cf.id, 'down')}
                              className={`p-1.5 border border-gray-200 transition-colors rounded-none ${
                                idx === arr.length - 1 
                                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-black cursor-pointer'
                              }`}
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>

                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: PARTICIPANTES */}
          {activeTab === 'participantes' && (
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-6">
              
              {/* Participant search header */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full sm:max-w-md relative">
                  <input
                    type="text"
                    placeholder="Buscar por Nombre, DNI o Correo..."
                    value={participantSearch}
                    onChange={e => setParticipantSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#800404] bg-white text-gray-850"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
                  <select 
                    value={participantFilterEvent}
                    onChange={e => setParticipantFilterEvent(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-white text-gray-700"
                  >
                    <option value="all">Todos los inscritos</option>
                    <option value="none">Sin inscripción activa</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleExportCSV}
                    className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-black px-4 py-2.5 transition-colors flex items-center gap-2 rounded-none cursor-pointer"
                  >
                    <FileSpreadsheet size={16} /> Exportar Excel/CSV
                  </button>
                </div>
              </div>

              {/* Table rendering */}
              <div className="overflow-x-auto border border-gray-150">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 font-black text-gray-700 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-3.5 text-left">Nombre Completo</th>
                      <th className="px-6 py-3.5 text-left">DNI</th>
                      <th className="px-6 py-3.5 text-left">Correo Electrónico</th>
                      <th className="px-6 py-3.5 text-left">Evento Inscrito</th>
                      <th className="px-6 py-3.5 text-center">Estado de Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                          No se encontraron participantes con los criterios de búsqueda seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-gray-900 leading-tight">{p.nombres} {p.apellidos}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600 font-semibold">
                            {p.dni}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-650">
                            {p.email}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {p.eventTitle}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className={`inline-block text-[10px] font-black px-2.5 py-1 uppercase rounded-none border ${
                              p.status === 'Asistió'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : p.status === 'Por asistir'
                                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                                  : 'bg-gray-50 border-gray-200 text-gray-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 6: ASISTENCIA QR */}
          {activeTab === 'asistencia-qr' && (
            <div className="space-y-6">
              
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* QR Scanner view simulator */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-2">Escáner de Asistencia</h3>
                    <p className="text-xs text-gray-400 mb-4">Coloque el código QR del ticket frente a la cámara o ingréselo manualmente.</p>
                    
                    {/* Simulated Camera Window */}
                    <div className="aspect-video bg-black relative flex items-center justify-center border border-gray-200 overflow-hidden mb-4">
                      {isCameraActive ? (
                        <>
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                          <div className="absolute inset-0 border-2 border-red-500/30 m-8 pointer-events-none flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-500 animate-bounce" />
                          </div>
                          <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 tracking-wider uppercase">
                            CÁMARA ACTIVA
                          </span>
                        </>
                      ) : (
                        <div className="text-center p-6 flex flex-col items-center">
                          <QrCode size={48} className="text-gray-700 mb-2" />
                          <p className="text-xs text-gray-500 font-bold mb-3">La cámara está desactivada.</p>
                          <button
                            onClick={startCamera}
                            className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-bold px-4 py-2 transition-all cursor-pointer"
                          >
                            Activar Webcam
                          </button>
                        </div>
                      )}
                      
                      {isCameraActive && (
                        <button
                          onClick={stopCamera}
                          className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 cursor-pointer"
                        >
                          Apagar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Keyboard input simulator */}
                  <form onSubmit={handleManualQrSubmit} className="space-y-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Simulación / Ingreso Manual del Código QR
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: UNI-150-TICKET-1-12345678-854721"
                        value={manualQrInput}
                        onChange={e => setManualQrInput(e.target.value)}
                        className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-gray-800 hover:bg-black text-white font-black text-sm px-5 py-2 transition-colors cursor-pointer"
                      >
                        Registrar
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Formato: <span className="font-mono bg-gray-100 p-0.5 rounded text-gray-600">UNI-150-TICKET-[idEvento]-[DNI]-[codigo]</span>
                    </p>
                  </form>
                </div>

                {/* Scan Result Panel */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-4">Resultado del Escaneo</h3>
                    
                    {!scanResult ? (
                      <div className="border border-dashed border-gray-200 rounded-none py-12 text-center text-gray-450">
                        <QrCode size={40} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-bold">Esperando lectura de código QR...</p>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                          Escanee un ticket con la cámara o copie uno de los códigos del perfil de un usuario para simularlo.
                        </p>
                      </div>
                    ) : (
                      <div className={`p-6 border-l-4 rounded-none ${
                        scanResult.type === 'success'
                          ? 'bg-emerald-50/50 border-l-emerald-600 border border-emerald-100'
                          : scanResult.type === 'duplicate'
                            ? 'bg-amber-50/50 border-l-amber-500 border border-amber-100'
                            : 'bg-red-50/50 border-l-red-600 border border-red-100'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {scanResult.type === 'success' ? (
                              <CheckCircle className="text-emerald-600" size={24} />
                            ) : scanResult.type === 'duplicate' ? (
                              <AlertTriangle className="text-amber-500" size={24} />
                            ) : (
                              <ShieldAlert className="text-red-600" size={24} />
                            )}
                          </div>
                          <div>
                            <h4 className={`text-base font-black ${
                              scanResult.type === 'success'
                                ? 'text-emerald-800'
                                : scanResult.type === 'duplicate'
                                  ? 'text-amber-700'
                                  : 'text-red-800'
                            }`}>
                              {scanResult.message}
                            </h4>
                            
                            {scanResult.type === 'success' && scanResult.detail && (
                              <div className="mt-3 text-sm text-gray-700 space-y-1 font-medium">
                                <p>Participante: <strong className="font-bold text-gray-900">{scanResult.detail.name}</strong></p>
                                <p>DNI: <span className="font-mono text-gray-600">{scanResult.detail.dni}</span></p>
                                <p>Evento: <span className="text-[#800404]">{scanResult.detail.event}</span></p>
                                <p className="text-xs text-emerald-600 mt-2 font-bold flex items-center gap-1">
                                  <Check size={14} /> Asistencia registrada a las {scanResult.detail.time}
                                </p>
                              </div>
                            )}

                            {scanResult.type !== 'success' && (
                              <p className="mt-2 text-xs font-semibold text-gray-500 leading-relaxed">
                                {scanResult.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Short Info banner */}
                  <div className="bg-red-50 border border-red-100 p-4 mt-6 text-xs text-red-800 leading-normal flex items-start gap-2">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black">Prueba Rápida:</p>
                      <p className="text-[11px] text-red-700 mt-0.5">
                        Puedes copiar el código <span className="font-mono font-bold bg-white px-1 border border-red-200">UNI-150-TICKET-1-12345678-854721</span> correspondiente a Juan Pérez, pegarlo en la caja de simulación y hacer clic en Registrar.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* History table */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                  Historial de Registros Recientes
                </h3>
                {qrLogs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">El historial está vacío. Comience a escanear tickets.</p>
                ) : (
                  <div className="overflow-x-auto max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left">Hora de Registro</th>
                          <th className="px-6 py-3 text-left">Participante</th>
                          <th className="px-6 py-3 text-left">DNI</th>
                          <th className="px-6 py-3 text-left">Evento</th>
                          <th className="px-6 py-3 text-center">Resultado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {qrLogs.map(log => (
                          <tr key={log.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-2.5 whitespace-nowrap text-xs text-gray-450 font-mono">
                              {log.timestamp}
                            </td>
                            <td className="px-6 py-2.5 font-bold text-gray-800">
                              {log.name}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-gray-600 font-mono">
                              {log.dni}
                            </td>
                            <td className="px-6 py-2.5 text-gray-600 truncate max-w-xs">
                              {log.eventTitle}
                            </td>
                            <td className="px-6 py-2.5 text-center whitespace-nowrap">
                              <span className={`inline-block text-[9px] font-black px-2 py-0.5 uppercase border ${
                                log.result === 'Exitoso'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : log.result === 'Duplicado'
                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                    : 'bg-red-50 border-red-200 text-red-700'
                              }`}>
                                {log.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 7: CERTIFICADOS */}
          {activeTab === 'certificados' && (
            <div className="space-y-6">
              
              {/* Massive upload & internal validation side by side */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Bulk upload block */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-1">Carga Masiva de Certificados</h3>
                    <p className="text-xs text-gray-400 mb-4">Sube múltiples archivos PDF de certificados. El sistema extraerá el DNI del nombre de archivo y lo asociará al participante.</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Horas Curriculares</label>
                        <select 
                          value={certHours}
                          onChange={e => setCertHours(e.target.value)}
                          className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none bg-white text-gray-800"
                        >
                          <option value="2">2 Horas</option>
                          <option value="4">4 Horas</option>
                          <option value="8">8 Horas</option>
                          <option value="12">12 Horas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Certificado</label>
                        <select 
                          value={certType}
                          onChange={e => setCertType(e.target.value)}
                          className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none bg-white text-gray-800"
                        >
                          <option value="Participación">Participación</option>
                          <option value="Ponencia">Ponencia</option>
                          <option value="Organización">Organización</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Evento Asociado</label>
                      <select 
                        value={selectedEventForCert}
                        onChange={e => setSelectedEventForCert(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none bg-white font-bold text-gray-800"
                      >
                        {events.map((ev, i) => (
                          <option key={i} value={ev.title}>{ev.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Drag and drop simulated dropzone */}
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-[#800404] p-6 text-center cursor-pointer transition-colors bg-gray-50 flex flex-col items-center"
                    >
                      <UploadCloud size={32} className="text-gray-400 mb-2" />
                      <p className="text-xs font-bold text-gray-700">Arrastre archivos PDF o haga clic para seleccionar</p>
                      <p className="text-[10px] text-gray-400 mt-1">Los nombres deben incluir un DNI de 8 dígitos (Ej: 12345678.pdf)</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        multiple 
                        accept="application/pdf" 
                        onChange={handleFileSelect}
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Upload queue */}
                  {uploadQueue.length > 0 && (
                    <div className="mt-4 border border-gray-200 max-h-40 overflow-y-auto divide-y divide-gray-100 p-2">
                      <p className="text-[10px] font-black text-[#800404] mb-2 uppercase">Cola de Procesamiento ({uploadQueue.length})</p>
                      {uploadQueue.map(item => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                          <span className="truncate max-w-xs font-mono font-medium text-gray-600" title={item.fileName}>{item.fileName}</span>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                              item.userFound 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                              DNI: {item.dni} ({item.titular})
                            </span>
                            <button 
                              onClick={() => handleRemoveFromQueue(item.id)} 
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload progress & trigger */}
                  {uploadQueue.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                      {isUploading && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Procesando certificados...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-150 h-1.5">
                            <div className="bg-[#800404] h-1.5 transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleProcessUploads}
                        disabled={isUploading}
                        className="w-full bg-[#800404] hover:bg-[#5a0303] text-white font-black py-2.5 text-xs transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                      >
                        <Plus size={14} /> Procesar Carga Masiva
                      </button>
                    </div>
                  )}
                </div>

                {/* Validation Test block inside admin */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-1">Validador Interno de Certificados</h3>
                    <p className="text-xs text-gray-400 mb-4">Comprueba la autenticidad e información de cualquier código de validación del sistema.</p>

                    <form onSubmit={handleTestValidate} className="flex gap-2 mb-6">
                      <input
                        type="text"
                        placeholder="CERT-UNI-2026-XXXXXXXX-XXX"
                        value={testValidationCode}
                        onChange={e => setTestValidationCode(e.target.value.toUpperCase())}
                        className="flex-1 border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#800404] font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-gray-800 hover:bg-black text-white font-black text-xs px-4 py-2 transition-colors cursor-pointer"
                      >
                        Validar
                      </button>
                    </form>

                    {testValidationResult && (
                      <div className={`p-4 border-l-4 rounded-none text-xs space-y-2 ${
                        testValidationResult.valid 
                          ? 'bg-emerald-50/50 border-l-emerald-600 border border-emerald-100 text-gray-800' 
                          : 'bg-red-50/50 border-l-red-600 border border-red-100 text-red-800'
                      }`}>
                        {testValidationResult.valid ? (
                          <>
                            <p className="font-bold text-emerald-800 flex items-center gap-1">
                              <Check size={14} /> CERTIFICADO AUTÉNTICO REGISTRADO
                            </p>
                            <p>Titular: <strong className="font-bold text-gray-900">{testValidationResult.titular}</strong> (DNI: {testValidationResult.dni})</p>
                            <p>Evento: <strong className="font-bold text-gray-900">{testValidationResult.evento}</strong></p>
                            <p>Horas: <span className="text-[#800404] font-bold">{testValidationResult.horas}h extracurriculares</span> &nbsp;·&nbsp; Tipo: {testValidationResult.tipo}</p>
                            <p>Emisión: {testValidationResult.emision} &nbsp;·&nbsp; Firma: {testValidationResult.rector}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-red-800 flex items-center gap-1">
                              <X size={14} /> CÓDIGO NO VÁLIDO / INEXISTENTE
                            </p>
                            <p className="text-gray-500 font-medium">El código de validación ingresado no se encuentra registrado en el sistema oficial.</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Demo files to copy */}
                  <div className="bg-red-50 border border-red-100 p-4 mt-6 text-xs text-red-800 leading-normal flex items-start gap-2">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black">DNI de prueba para cargar:</p>
                      <p className="text-[11px] text-red-700 mt-0.5">
                        Prueba cargando un archivo nombrado <span className="font-mono font-bold bg-white px-1 border border-red-200">12345678.pdf</span> (Juan Pérez). El sistema resolverá su nombre automáticamente.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Certificate Management list table */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <h3 className="text-base font-black text-gray-900">Historial de Certificados Emitidos</h3>
                  <div className="flex gap-2 w-full sm:max-w-xs relative">
                    <input
                      type="text"
                      placeholder="Buscar por DNI o Evento..."
                      value={certSearch}
                      onChange={e => setCertSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-[#800404] bg-white text-gray-850"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-150">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 font-black text-gray-700 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-3.5 text-left">Participante (DNI)</th>
                        <th className="px-6 py-3.5 text-left">Evento Asociado</th>
                        <th className="px-6 py-3.5 text-center">Horas & Tipo</th>
                        <th className="px-6 py-3.5 text-left">Código de Validación</th>
                        <th className="px-6 py-3.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {certificates
                        .filter(c => c.dni.includes(certSearch) || 
                                     c.titular.toLowerCase().includes(certSearch.toLowerCase()) || 
                                     c.evento.toLowerCase().includes(certSearch.toLowerCase()))
                        .map(cert => (
                          <tr key={cert.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3.5">
                              <p className="font-bold text-gray-900">{cert.titular}</p>
                              <p className="text-xs text-gray-400 font-mono">DNI: {cert.dni}</p>
                            </td>
                            <td className="px-6 py-3.5">
                              <p className="text-gray-700 truncate max-w-xs" title={cert.evento}>{cert.evento}</p>
                              <p className="text-xs text-gray-400">Emitido: {cert.emitido}</p>
                            </td>
                            <td className="px-6 py-3.5 text-center whitespace-nowrap">
                              <p className="text-gray-800 font-bold">{cert.horas}h</p>
                              <p className="text-xs text-[#800404] font-medium">{cert.tipo}</p>
                            </td>
                            <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-gray-600">
                              {cert.codigoValidacion}
                            </td>
                            <td className="px-6 py-3.5 text-right whitespace-nowrap">
                              <div className="flex gap-2 justify-end">
                                <a
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); alert(`Simulación de descarga del PDF de certificado: ${cert.codigoValidacion}.pdf`) }}
                                  className="text-xs font-bold text-[#800404] hover:underline"
                                >
                                  Descargar
                                </a>
                                <button
                                  onClick={() => handleDeleteCertificate(cert.id)}
                                  className="p-1 border border-gray-200 hover:border-gray-450 hover:bg-red-50 text-red-600 transition-all rounded-none cursor-pointer"
                                  title="Revocar certificado"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: CONFIGURACION DE PERFIL */}
          {activeTab === 'configuracion' && (
            <div className="max-w-xl bg-white border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 mb-6">
                Perfil del Administrador
              </h3>

              {profileError && (
                <div className="bg-red-50 border-l-4 border-l-red-600 p-4 mb-4 text-xs font-bold text-red-800 leading-normal">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="bg-emerald-50 border-l-4 border-l-emerald-600 p-4 mb-4 text-xs font-bold text-emerald-800 leading-normal">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombres</label>
                    <input
                      type="text"
                      value={profileForm.nombres}
                      onChange={e => setProfileForm(prev => ({ ...prev, nombres: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Apellidos</label>
                    <input
                      type="text"
                      value={profileForm.apellidos}
                      onChange={e => setProfileForm(prev => ({ ...prev, apellidos: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">DNI (Identificación)</label>
                  <input
                    type="text"
                    disabled
                    value={profileForm.dni}
                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="border-t border-gray-150 pt-4 mt-6">
                  <h4 className="text-sm font-black text-gray-800 mb-3">Cambiar Contraseña (Opcional)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contraseña Actual</label>
                      <input
                        type="password"
                        placeholder="Contraseña administrativa actual"
                        value={profileForm.currentPassword}
                        onChange={e => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nueva Contraseña</label>
                        <input
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={profileForm.newPassword}
                          onChange={e => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Confirmar Nueva Contraseña</label>
                        <input
                          type="password"
                          placeholder="Coincidencia exacta"
                          value={profileForm.confirmPassword}
                          onChange={e => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#800404] hover:bg-[#5a0303] text-white font-black py-3 text-sm transition-colors mt-6 rounded-none cursor-pointer"
                >
                  Guardar Cambios de Perfil
                </button>
              </form>
            </div>
          )}

        </div>

      </main>

      {/* MODAL: CREAR O EDITAR EVENTO */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden font-sans">
            
            <div className="bg-[#800404] text-white p-5 flex items-center justify-between">
              <h4 className="font-black text-base">{editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}</h4>
              <button onClick={() => setIsEventModalOpen(false)} className="text-white/60 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                  placeholder="Ej: Congreso de Inteligencia Artificial"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría del Evento *</label>
                  <select
                    value={eventForm.category}
                    onChange={e => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#800404] bg-white text-gray-800"
                  >
                    <option value="Académico">Académico</option>
                    <option value="Egresados">Egresados</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Laboral">Laboral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL de la Portada</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={eventForm.imageUrl}
                      onChange={e => setEventForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="flex-1 border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const randoms = [
                          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1521791136368-1a8684c0286d?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
                          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
                        ];
                        const idx = Math.floor(Math.random() * randoms.length);
                        setEventForm(prev => ({ ...prev, imageUrl: randoms[idx] }));
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold px-2 py-1 cursor-pointer transition-colors shrink-0"
                      title="Usar imagen de prueba aleatoria"
                    >
                      Azar
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organizador</label>
                  <input
                    type="text"
                    value={eventForm.organizer}
                    onChange={e => setEventForm(prev => ({ ...prev, organizer: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                    placeholder="Ej: Rectorado / UNICODE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                    placeholder="Ej: 14 Jul 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horario</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                    placeholder="Ej: 08:00 – 18:00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Aforo Máximo (Cupos) *</label>
                  <input
                    type="number"
                    required
                    value={eventForm.quota}
                    onChange={e => setEventForm(prev => ({ ...prev, quota: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                    placeholder="Ej: 300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ubicación *</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={e => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                  placeholder="Ej: Teatro UNI, Lima"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción del Evento</label>
                <textarea
                  value={eventForm.description}
                  onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                  placeholder="Resumen del evento..."
                ></textarea>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-3 border border-gray-150">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventForm.isPaid}
                    onChange={e => setEventForm(prev => ({ ...prev, isPaid: e.target.checked }))}
                    className="border-gray-300"
                  />
                  ¿Es un evento de pago? (Cena de Gala, etc.)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold px-4 py-2 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#800404] hover:bg-[#5a0303] text-white text-sm font-black px-6 py-2 transition-colors cursor-pointer"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREAR O EDITAR PONENCIA */}
      {isConfModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden font-sans">
            
            <div className="bg-[#800404] text-white p-5 flex items-center justify-between">
              <h4 className="font-black text-base">{editingConf ? 'Editar Ponencia' : 'Crear Nueva Ponencia'}</h4>
              <button onClick={() => setIsConfModalOpen(false)} className="text-white/60 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConf} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título de la Ponencia *</label>
                <input
                  type="text"
                  required
                  value={confForm.title}
                  onChange={e => setConfForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-855"
                  placeholder="Ej: Aplicaciones de Redes Neuronales"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Evento Relacionado *</label>
                <select
                  required
                  value={confForm.eventId}
                  onChange={e => setConfForm(prev => ({ ...prev, eventId: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] bg-white text-gray-800"
                >
                  <option value="" disabled>Seleccione un evento</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expositor (Ponente) *</label>
                <input
                  type="text"
                  required
                  value={confForm.speaker}
                  onChange={e => setConfForm(prev => ({ ...prev, speaker: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-855"
                  placeholder="Ej: Dr. Roberto Vargas"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Inicio</label>
                  <input
                    type="text"
                    value={confForm.time}
                    onChange={e => setConfForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-855 text-center"
                    placeholder="Ej: 09:00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duración (Mins)</label>
                  <input
                    type="number"
                    value={confForm.duration}
                    onChange={e => setConfForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-855 text-center"
                    placeholder="Ej: 60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Aforo Máximo</label>
                  <input
                    type="number"
                    value={confForm.quota}
                    onChange={e => setConfForm(prev => ({ ...prev, quota: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-855 text-center"
                    placeholder="Ej: 100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lugar (Aula/Auditorio)</label>
                <input
                  type="text"
                  value={confForm.room}
                  onChange={e => setConfForm(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-855"
                  placeholder="Ej: Auditorium A / Aula Magna"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfModalOpen(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold px-4 py-2 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#800404] hover:bg-[#5a0303] text-white text-sm font-black px-6 py-2 transition-colors cursor-pointer"
                >
                  Guardar Ponencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
