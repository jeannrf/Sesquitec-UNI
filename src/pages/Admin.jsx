import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../services/db'
import { supabase } from '../services/supabaseClient'
import { useAlert } from '../context/AlertContext'
import { 
  LayoutDashboard, Calendar, Mic, Users, QrCode, Award, 
  LogOut, Search, Plus, Trash2, Edit2, ShieldAlert, CheckCircle, 
  AlertTriangle, RefreshCw, UploadCloud, ChevronUp, ChevronDown, Check, X,
  Clock, MapPin, Eye, FileSpreadsheet, EyeOff, ShieldCheck, ChevronRight
} from 'lucide-react'

const cleanNameFromFileName = (fileName, Dni) => {
  let name = fileName.replace(/\.[^/.]+$/, ""); // remove extension
  if (Dni) name = name.replace(Dni, ""); // remove Dni
  name = name.replace(/[_\-\.]/g, " "); // replace delimiters
  name = name.trim().replace(/\s+/g, " "); // collapse spaces
  // Capitalize first letters
  return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") || "Participante";
}

export default function Admin() {
  const { user, logout, loading } = useAuth()
  const { showAlert, showConfirm } = useAlert()
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

  // --- CMS STATE ---
  const [cmsActiveSubTab, setCmsActiveSubTab] = useState('inicio')
  
  // Inicio states
  const [cmsHomeForm, setCmsHomeForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    stats: [
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' }
    ],
    programaGeneral: []
  })

  // Eventos states
  const [cmsEventsForm, setCmsEventsForm] = useState({
    title: '',
    subtitle: ''
  })

  // Encuentro states
  const [cmsMeetForm, setCmsMeetForm] = useState({
    speakers: [],
    phases: []
  })

  // Certificados states
  const [cmsCertsForm, setCmsCertsForm] = useState({
    title: '',
    subtitle: ''
  })

  // Load CMS data on mount / refresh
  const loadCmsData = () => {
    // 1. Inicio
    setCmsHomeForm({
      heroTitle: db.getCmsValue('home_hero_title', 'Sesquicentenario UNI 150 Años'),
      heroSubtitle: db.getCmsValue('home_hero_subtitle', 'Celebrando un siglo y medio de excelencia académica, científica, tecnológica y de contribución al desarrollo del Perú.'),
      stats: db.getCmsValue('home_stats', [
        { value: '150', label: 'Años de historia' },
        { value: '+50', label: 'Eventos programados' },
        { value: '+30', label: 'Agrupaciones participantes' },
        { value: '+10', label: 'Facultades involucradas' }
      ]),
      programaGeneral: db.getCmsValue('home_programa_general', [
        { date: 'JUEVES 2 DE JULIO', time: '10:00 a.m.', title: 'Ceremonia solemne de distinción honorífica "Doctor Honoris Causa" al Ph.D. Francisco Sagasti Hochhausler, expresidente de la República.', location: 'Auditorio de la Facultad de Ingeniería Industrial y de Sistemas.' },
        { date: 'JUEVES 2 DE JULIO', time: '03:00 p.m.', title: 'Inauguración de la exposición temporal de obras de arte José Tola: "La danza de las sombras vivas".', location: 'Museo de Artes y Ciencias, Ing. Eduardo de Habich (Primer piso del pabellón central).' },
        { date: 'VIERNES 3 DE JULIO', time: '10:00 a.m.', title: 'Ceremonia solemne de distinción honorífica "Doctor Honoris Causa" al Ing. James Valenzuela Murillo, fundador y CEO de RESEMIN.', location: 'Sala de Consejo Universitario.' },
        { date: 'DOMINGO 5 DE JULIO', time: '10:00 a.m.', title: 'Paseo e izamiento de la bandera y desfile cívico.', location: 'Plaza a la Bandera - Pueblo Libre.' },
        { date: 'VIERNES 10 DE JULIO', time: '11:00 a.m.', title: 'Reconocimiento a la excelencia académica e institucional.', location: 'Gran Teatro.' },
        { date: 'SÁBADO 11 DE JULIO', time: '11:00 a.m.', title: 'Ceremonia de premiación "Olimpiada Nacional de Matemáticas" nivel escolar y nivel universitario.', location: 'Sala de Consejo Universitario.' },
        { date: 'MARTES 14 DE JULIO', time: '11:00 a.m.', title: 'Romería en homenaje a los personajes ilustres de la UNI.', location: 'Puerta N.° 4 - Cementerio Presbítero Maestro - Barrios Altos / Lima.' },
        { date: 'MARTES 14 DE JULIO', time: '04:00 p.m.', title: 'Presentación de libro "Universidad Nacional de Ingeniería: Una historia desde la intimidad (1876-2000)".', location: 'Sala de Consejo Universitario.' },
        { date: 'MIÉRCOLES 15 DE JULIO', time: '06:00 p.m.', title: 'La historia de la UNI: 150 años el musical.', location: 'Gran Teatro.' },
        { date: 'JUEVES 16 DE JULIO', time: '11:00 a.m.', title: 'Ceremonia de presentación de la moneda conmemorativa del Sesquicentenario.', location: 'Auditorio del Banco Central de Reserva del Perú / Jr. Sta. Rosa 441 - Lima.' },
        { date: 'JUEVES 16 DE JULIO', time: '03:00 p.m.', title: 'Foro: Aportes que construyen país.', location: 'Gran Teatro.' },
        { date: 'VIERNES 17 DE JULIO', time: '09:00 a.m.', title: 'Gran desfile cívico institucional del Sesquicentenario.', location: 'Cuadras 2 y 3 de Av. Habich - San Martín de Porres.' },
        { date: 'LUNES 20 DE JULIO', time: '10:00 a.m.', title: 'Misa Te Deum.', location: 'Catedral de Lima - Plaza de Armas de Lima, Jr. Carabaya s/n.' },
        { date: 'MARTES 21 DE JULIO', time: '10:00 a.m.', title: 'Inauguración de la olimpiada interuniversitaria (Fútbol, Vóley, Natación).', location: 'Estadio.' },
        { date: 'MIÉRCOLES 22 DE JULIO', time: '08:00 a.m.', title: 'Izamiento de banderas y colocación de ofrendas florales.', location: 'Plazuela externa del pabellón central.' },
        { date: 'MIÉRCOLES 22 DE JULIO', time: '09:30 a.m.', title: 'Ceremonia de cápsula del tiempo.', location: 'Plazuela interna del pabellón central.' },
        { date: 'MIÉRCOLES 22 DE JULIO', time: '11:00 a.m.', title: 'Ceremonia central sesión solemne.', location: 'Gran Teatro.' },
        { date: 'LUNES 3 DE AGOSTO', time: '03:00 p.m.', title: 'Ceremonia solemne de distinción honorífica "Doctor Honoris Causa" al Ing. Jorge Rodríguez Rodríguez, presidente fundador del Grupo Gloria.', location: 'Sala de Consejo Universitario.' }
      ])
    })

    // 2. Eventos
    setCmsEventsForm({
      title: db.getCmsValue('events_title', 'Eventos'),
      subtitle: db.getCmsValue('events_subtitle', 'Todos los eventos del Sesquicentenario UNI 2026')
    })

    // 3. Encuentro Internacional
    setCmsMeetForm({
      speakers: db.getCmsValue('meet_speakers', [
        { name: 'Dr. Kenji Tanaka', org: 'University of Tokyo', topic: 'Inteligencia Artificial y Ciudades Inteligentes', country: '🇯🇵 Japón' },
        { name: 'Dra. Elena Rodríguez', org: 'MIT - Massachusetts Institute of Technology', topic: 'Infraestructura Resiliente ante el Cambio Climático', country: '🇺🇸 EE.UU.' },
        { name: 'Dr. Hans Weber', org: 'ETH Zurich', topic: 'Ingeniería de Materiales Avanzados', country: '🇨🇭 Suiza' },
        { name: 'Ing. Priya Sharma', org: 'Indian Institute of Technology Delhi', topic: 'Energía Solar a Gran Escala', country: '🇮🇳 India' },
        { name: 'Dr. Roberto Vargas', org: 'Universidad Nacional de Ingeniería', topic: 'IA en la Ingeniería Peruana', country: '🇵🇪 Perú' },
        { name: 'Dra. Ana Müller', org: 'Technische Universität München', topic: 'Robótica Industrial y Manufactura', country: '🇩🇪 Alemania' }
      ]),
      phases: db.getCmsValue('meet_phases', [
        {
          id: 'sep1',
          label: 'FASE I',
          title: 'Conferencias Internacionales',
          date: '08 – 09 Sep 2026',
          time: '09:00 – 18:00',
          location: 'Teatro UNI, Lima',
          quota: 960,
          description: 'Dos días de conferencias magistrales con ponentes internacionales líderes en sus campos. Incluye paneles de discusión, networking y coffee breaks.',
          color: 'from-[#800404] to-[#b91c1c]',
          badge: 'Académico',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'sep2',
          label: 'FASE II',
          title: 'Feria Tecnológica Internacional',
          date: '10 Sep 2026',
          time: '10:00 – 20:00',
          location: 'Explanada de la UNI, Lima',
          quota: 1500,
          description: 'La feria tecnológica más grande del Sesquicentenario. Exhibición de prototipos, stands empresariales, demostraciones en vivo y ponencias de innovación.',
          color: 'from-gray-800 to-gray-600',
          badge: 'Tecnología',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'sep3',
          label: 'FASE III',
          title: 'Cena de Reconocimiento',
          date: '12 Sep 2026',
          time: '20:00 – 23:59',
          location: 'Gran Hotel Bolívar, Lima',
          quota: 500,
          description: 'Homenaje central del Sesquicentenario para egresados, personalidades destacadas y autoridades. Cena de honor con música en vivo y reconocimientos especiales.',
          color: 'from-amber-700 to-amber-500',
          badge: 'Gala',
          isPaid: true,
          price: 'S/ 180',
          imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800'
        }
      ])
    })

    // 4. Certificados
    setCmsCertsForm({
      title: db.getCmsValue('certs_title', 'Mis Certificados'),
      subtitle: db.getCmsValue('certs_subtitle', 'Busca y descarga los certificados de tu participación en eventos del Sesquicentenario')
    })
  }

  const handleSaveCmsHome = (e) => {
    e.preventDefault()
    db.updateCmsValue('home_hero_title', cmsHomeForm.heroTitle)
    db.updateCmsValue('home_hero_subtitle', cmsHomeForm.heroSubtitle)
    db.updateCmsValue('home_stats', cmsHomeForm.stats)
    db.updateCmsValue('home_programa_general', cmsHomeForm.programaGeneral)
    showAlert('Página de Inicio guardada correctamente.', 'Guardado exitoso', 'success')
  }

  const handleSaveCmsEvents = (e) => {
    e.preventDefault()
    db.updateCmsValue('events_title', cmsEventsForm.title)
    db.updateCmsValue('events_subtitle', cmsEventsForm.subtitle)
    showAlert('Cabecera de Eventos guardada correctamente.', 'Guardado exitoso', 'success')
  }

  const handleSaveCmsMeet = (e) => {
    e.preventDefault()
    db.updateCmsValue('meet_speakers', cmsMeetForm.speakers)
    db.updateCmsValue('meet_phases', cmsMeetForm.phases)
    showAlert('Datos del Encuentro Internacional guardados correctamente.', 'Guardado exitoso', 'success')
  }

  const handleSaveCmsCerts = (e) => {
    e.preventDefault()
    db.updateCmsValue('certs_title', cmsCertsForm.title)
    db.updateCmsValue('certs_subtitle', cmsCertsForm.subtitle)
    showAlert('Cabecera de Certificados guardada correctamente.', 'Guardado exitoso', 'success')
  }

  const handleAddSpeaker = () => {
    setCmsMeetForm(prev => ({
      ...prev,
      speakers: [...prev.speakers, { name: 'Nuevo Ponente', org: 'Organización', topic: 'Tema de ponencia', country: '🇵🇪 Perú' }]
    }))
  }

  const handleEditSpeaker = (index, field, val) => {
    const updated = [...cmsMeetForm.speakers]
    updated[index] = { ...updated[index], [field]: val }
    setCmsMeetForm(prev => ({ ...prev, speakers: updated }))
  }

  const handleRemoveSpeaker = (index) => {
    const updated = cmsMeetForm.speakers.filter((_, i) => i !== index)
    setCmsMeetForm(prev => ({ ...prev, speakers: updated }))
  }

  const handleEditPhase = (index, field, val) => {
    const updated = [...cmsMeetForm.phases]
    updated[index] = { ...updated[index], [field]: val }
    setCmsMeetForm(prev => ({ ...prev, phases: updated }))
  }

  const handleAddHomeActivity = () => {
    setCmsHomeForm(prev => ({
      ...prev,
      programaGeneral: [...prev.programaGeneral, { date: 'DÍA X DE JULIO', time: '10:00 a.m.', title: 'Nueva Actividad', location: 'Ubicación' }]
    }))
  }

  const handleEditHomeActivity = (index, field, val) => {
    const updated = [...cmsHomeForm.programaGeneral]
    updated[index] = { ...updated[index], [field]: val }
    setCmsHomeForm(prev => ({ ...prev, programaGeneral: updated }))
  }

  const handleRemoveHomeActivity = (index) => {
    const updated = cmsHomeForm.programaGeneral.filter((_, i) => i !== index)
    setCmsHomeForm(prev => ({ ...prev, programaGeneral: updated }))
  }

  // Refresh data from DB
  const refreshAllData = () => {
    setEvents(db.getEvents())
    setConferences(db.getConferences())
    setCertificates(db.getCertificates())
    setUsersList(db.getUsers())
    setQrLogs(db.getQrLogs())
    loadCmsData()
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
    category: 'Académico',
    tags: ''
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
        category: ev.category || 'Académico',
        tags: ev.tags ? ev.tags.join(', ') : ''
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
        category: 'Académico',
        tags: ''
      })
    }
    setIsEventModalOpen(true)
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!eventForm.title.trim() || !eventForm.date.trim() || !eventForm.location.trim()) {
      showAlert('Por favor complete los campos obligatorios: Título, Fecha y Ubicación.', 'Campos Requeridos', 'warning')
      return
    }

    const parsedTags = typeof eventForm.tags === 'string'
      ? eventForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : eventForm.tags || []

    const eventData = {
      ...eventForm,
      tags: parsedTags
    }

    if (editingEvent) {
      db.updateEvent({
        id: editingEvent.id,
        ...eventData
      })
    } else {
      db.createEvent({
        ...eventData
      })
    }
    setIsEventModalOpen(false)
    refreshAllData()
  }

  const handleDeleteEvent = (id) => {
    showConfirm('¿Está seguro de eliminar este evento y todas sus ponencias asociadas?', () => {
      db.deleteEvent(id)
      refreshAllData()
    }, 'Confirmar Eliminación', 'warning')
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
      showAlert('Por favor complete los campos obligatorios: Título, Expositor y Evento relacionado.', 'Campos Requeridos', 'warning')
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
    showConfirm('¿Está seguro de eliminar esta ponencia?', () => {
      db.deleteConference(id)
      refreshAllData()
    }, 'Confirmar Eliminación', 'warning')
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
            role: u.role || 'USER',
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
          role: u.role || 'USER',
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
  const [selectedEventIdForQr, setSelectedEventIdForQr] = useState('')
  const [qrParticipantSearch, setQrParticipantSearch] = useState('')
  const [showCameraScanner, setShowCameraScanner] = useState(false)
  const [manualQrInput, setManualQrInput] = useState('')
  const [scanResult, setScanResult] = useState(null) // { success: boolean, message: string, detail?: object }
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef(null)
  const [cameraStream, setCameraStream] = useState(null)
  
  const processQrCode = (qrData) => {
    if (!qrData) return
    
    let eventId = null
    let dni = null

    const isTicketFormat = qrData.startsWith('UNI-150-TICKET-')
    if (!isTicketFormat) {
      // Treat as raw DNI/Document number
      if (!selectedEventIdForQr) {
        setScanResult({
          success: false,
          type: 'invalid',
          message: 'Evento no seleccionado.',
          detail: 'Por favor, seleccione un evento de la lista para registrar asistencia usando DNI.'
        })
        return
      }
      dni = qrData
      eventId = selectedEventIdForQr
    } else {
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

      eventId = match[1]
      dni = match[2]
    }
    
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

  const handleToggleAttendance = (userDni, status) => {
    db.updateUserTicketStatus(userDni, selectedEventIdForQr, status)
    const targetUser = usersList.find(u => u.dni === userDni)
    const currentSelectedEvent = events.find(e => String(e.id) === String(selectedEventIdForQr))
    if (targetUser && currentSelectedEvent) {
      const log = {
        name: `${targetUser.nombres} ${targetUser.apellidos}`,
        dni: userDni,
        eventTitle: currentSelectedEvent.title,
        result: status === 'Asistió' ? 'Exitoso' : 'Anulado',
        detail: `Asistencia modificada manualmente a ${status} por el administrador.`
      }
      db.addQrLog(log)
    }
    refreshAllData()
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
      showAlert('No se pudo acceder a la webcam. Por favor, utilice el simulador de entrada de texto.', 'Error de Cámara', 'error')
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
  const [certHours, setCertHours] = useState('0')
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
      // Find DNI in filename (8 consecutive digits anywhere)
      const dniMatch = file.name.match(/\d{8}/)
      const dni = dniMatch ? dniMatch[0] : null
      const matchedUser = dni ? usersList.find(u => u.dni === dni) : null
      const titular = matchedUser 
        ? `${matchedUser.nombres} ${matchedUser.apellidos}` 
        : (dni ? cleanNameFromFileName(file.name, dni) : 'No registrado')
      return {
        id: `uq-${Math.random().toString(36).substring(2, 9)}`,
        fileName: file.name,
        dni: dni || 'No encontrado',
        titular: titular,
        userFound: !!matchedUser,
        file: file
      }
    })
    setUploadQueue(prev => [...prev, ...list])
  }

  const handleRemoveFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id))
  }

  const handleProcessUploads = async () => {
    if (uploadQueue.length === 0) return
    if (!selectedEventForCert) {
      showAlert('Por favor seleccione el evento asociado.', 'Evento Requerido', 'warning')
      return
    }

    setIsUploading(true)
    setUploadProgress(5)
    
    if (supabase) {
      try {
        let count = 0
        const total = uploadQueue.length

        for (let i = 0; i < total; i++) {
          const item = uploadQueue[i]
          if (item.dni !== 'No encontrado') {
            const file = item.file
            const fileExt = file.name.split('.').pop()
            const fileName = `${item.dni}.${fileExt}`
            const filePath = `${fileName}`

            // Subir archivo al bucket 'certificados'
            const { error: uploadError } = await supabase.storage
              .from('certificados')
              .upload(filePath, file, { cacheControl: '3600', upsert: true })

            if (uploadError) {
              console.error(`Error al subir archivo de DNI ${item.dni} a Storage:`, uploadError)
            }

            // Obtener URL pública
            const { data } = supabase.storage
              .from('certificados')
              .getPublicUrl(filePath)
            
            const publicUrl = data?.publicUrl || ''

            // Registrar certificado en base de datos
            db.createCertificate({
              dni: item.dni,
              titular: item.titular,
              evento: selectedEventForCert,
              horas: 0,
              tipo: certType,
              pdfUrl: publicUrl
            })

            count++
          }

          // Actualizar barra de progreso
          setUploadProgress(Math.round(((i + 1) / total) * 100))
        }

        showAlert(`Carga masiva finalizada. Se procesaron y emitieron ${count} certificados con éxito.`, 'Carga Exitosa', 'success');
        setUploadQueue([])
        setIsUploading(false)
        setUploadProgress(0)
        refreshAllData()
      } catch (err) {
        console.error("Error en proceso de carga masiva Supabase:", err)
        showAlert('Hubo un error al procesar las cargas masivas.', 'Error de Carga', 'error')
        setIsUploading(false)
        setUploadProgress(0)
      }
    } else {
      // Fallback: Simulación local
      setUploadProgress(10)
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer)
            
            let count = 0
            uploadQueue.forEach(item => {
              if (item.dni !== 'No encontrado') {
                db.createCertificate({
                  dni: item.dni,
                  titular: item.titular,
                  evento: selectedEventForCert,
                  horas: 0,
                  tipo: certType,
                  pdfUrl: ''
                })
                count++
              }
            })
            
            showAlert(`Carga masiva finalizada (Simulado). Se procesaron y emitieron ${count} certificados con éxito.`, 'Carga Exitosa', 'success');
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
  }

  const handleDeleteCertificate = (id) => {
    showConfirm('¿Está seguro de revocar y eliminar permanentemente este certificado?', () => {
      db.deleteCertificate(id)
      refreshAllData()
    }, 'Revocar Certificado', 'error')
  }

  const handleTestValidate = (e) => {
    e.preventDefault()
    if (!testValidationCode.trim()) return
    const cleanCode = testValidationCode.trim().toUpperCase()
    const found = certificates.find(c => c.codigoValidacion.toUpperCase() === cleanCode || c.id.toUpperCase() === cleanCode)
    setTestValidationResult(found ? { valid: true, ...found } : { valid: false })
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
            { id: 'participantes', label: 'Usuarios Registrados', icon: Users },
            { id: 'asistencia-qr', label: 'Asistencia QR', icon: QrCode },
            { id: 'certificados', label: 'Certificados', icon: Award },
            { id: 'cms', label: 'Editar Páginas', icon: Edit2 },

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
            <h1 className="text-xl font-black text-gray-800 capitalize">
              {activeTab === 'cms' ? 'Editor de páginas desde panel de Administrador' : activeTab === 'participantes' ? 'Usuarios Registrados' : activeTab.replace('-', ' ')}
            </h1>
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
                  { label: 'Usuarios', value: statTotalUsers, icon: Users, color: 'border-l-[#800404] text-[#800404]' },
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
                    <option value="active">Publicado</option>
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
                                            (eventFilterStatus === 'active' && e.status !== 'post') ||
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
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <span className="bg-red-50 text-[#800404] text-[9px] font-bold px-1.5 py-0.5 uppercase border border-red-200/30 rounded-none">
                                  {ev.category}
                                </span>
                                {ev.tags && ev.tags.map(tag => (
                                  <span key={tag} className="bg-red-50 text-[#800404] text-[9px] font-bold px-1.5 py-0.5 uppercase border border-red-200/30 rounded-none">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{ev.organizer}</p>
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
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              }`}>
                                {ev.status === 'post' ? 'Post-Evento' : 'Publicado'}
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

          {/* TAB 5: USUARIOS REGISTRADOS */}
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
                      <th className="px-6 py-3.5 text-center">Rol</th>
                      <th className="px-6 py-3.5 text-left">Evento Inscrito</th>
                      <th className="px-6 py-3.5 text-center">Estado de Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                          No se encontraron usuarios con los criterios de búsqueda seleccionados.
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
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {p.role === 'STAFF' ? (
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-block text-[10px] font-black px-2.5 py-1 uppercase border bg-purple-50 border-purple-200 text-purple-700">Staff</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    db.updateUserRole(p.dni, 'USER')
                                    refreshAllData()
                                  }}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                                >
                                  Quitar
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  db.updateUserRole(p.dni, 'STAFF')
                                  refreshAllData()
                                }}
                                className="text-[10px] font-bold text-purple-600 hover:text-purple-800 border border-purple-200 hover:bg-purple-50 px-2.5 py-1 transition-all cursor-pointer uppercase"
                              >
                                Hacer Staff
                              </button>
                            )}
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
          {activeTab === 'asistencia-qr' && (() => {
            const currentSelectedEvent = events.find(e => String(e.id) === String(selectedEventIdForQr))
            const eventParticipants = selectedEventIdForQr
              ? usersList.filter(user => (user.tickets || []).some(t => String(t.eventId) === String(selectedEventIdForQr)))
              : []
            const getParticipantTicketStatus = (p) => {
              const ticket = (p.tickets || []).find(t => String(t.eventId) === String(selectedEventIdForQr))
              return ticket ? ticket.status : 'Pendiente'
            }
            const totalRegistered = eventParticipants.length
            const totalAttended = eventParticipants.filter(p => getParticipantTicketStatus(p) === 'Asistió').length
            const totalPending = totalRegistered - totalAttended

            return (
              <div className="space-y-6">
                
                {/* Event Selector Header */}
                <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-red-50 text-[#800404] font-black tracking-wider uppercase px-2 py-0.5 border border-red-200">
                      Módulo de Asistencia
                    </span>
                    <h2 className="text-lg font-black text-gray-900">
                      {selectedEventIdForQr ? currentSelectedEvent?.title : 'Gestión de Asistencia'}
                    </h2>
                    {selectedEventIdForQr && (
                      <p className="text-xs text-gray-400">
                        Ubicación: {currentSelectedEvent?.location} | Fecha: {currentSelectedEvent?.date}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Evento Activo:</label>
                    <select
                      value={selectedEventIdForQr}
                      onChange={e => {
                        setSelectedEventIdForQr(e.target.value)
                        setScanResult(null)
                      }}
                      className="border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:border-[#800404] bg-white text-gray-850 font-bold"
                    >
                      <option value="">-- Seleccionar Evento --</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {!selectedEventIdForQr ? (
                  <div className="bg-white border border-gray-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
                    <QrCode size={48} className="mx-auto text-gray-300 animate-pulse" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-gray-900">Control de Asistencia</h3>
                      <p className="text-sm text-gray-500">
                        Seleccione un evento de la lista desplegable en la esquina superior para registrar ingresos o ver los participantes inscritos.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Stats Counter Bar */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-200 p-4 shadow-sm text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase">Inscritos</p>
                        <p className="text-2xl font-black text-gray-800 mt-1">{totalRegistered}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-4 shadow-sm text-center">
                        <p className="text-xs font-bold text-emerald-600 uppercase">Presentes</p>
                        <p className="text-2xl font-black text-emerald-800 mt-1">{totalAttended}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-4 shadow-sm text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase">Pendientes</p>
                        <p className="text-2xl font-black text-gray-600 mt-1">{totalPending}</p>
                      </div>
                    </div>

                    {/* Registration controls */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      
                      {/* Form and Camera trigger */}
                      <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-black text-gray-900">Registrar Entrada</h3>
                            <p className="text-xs text-gray-400">Registra ingresos usando cámara o digitando el código/DNI.</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setShowCameraScanner(!showCameraScanner)
                              if (isCameraActive) {
                                stopCamera()
                              }
                            }}
                            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 transition-all cursor-pointer ${
                              showCameraScanner
                                ? 'bg-gray-800 text-white hover:bg-black'
                                : 'bg-[#800404] text-white hover:bg-[#5a0303]'
                            }`}
                          >
                            <QrCode size={14} />
                            {showCameraScanner ? 'Ocultar Cámara' : 'Escanear QR'}
                          </button>
                        </div>

                        {/* Camera container */}
                        {showCameraScanner && (
                          <div className="aspect-video bg-black relative flex items-center justify-center border border-gray-200 overflow-hidden">
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
                                <QrCode size={40} className="text-gray-700 mb-2" />
                                <p className="text-xs text-gray-500 font-bold mb-3">La cámara está desactivada.</p>
                                <button
                                  type="button"
                                  onClick={startCamera}
                                  className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-bold px-4 py-2 transition-all cursor-pointer"
                                >
                                  Activar Webcam
                                </button>
                              </div>
                            )}
                            
                            {isCameraActive && (
                              <button
                                type="button"
                                onClick={stopCamera}
                                className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 cursor-pointer"
                              >
                                Apagar
                              </button>
                            )}
                          </div>
                        )}

                        {/* Manual Form */}
                        <form onSubmit={handleManualQrSubmit} className="space-y-3">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Ingreso Manual (DNI o Código de Ticket)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Ingrese DNI o código completo..."
                              value={manualQrInput}
                              onChange={e => setManualQrInput(e.target.value)}
                              className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                            />
                            <button
                              type="submit"
                              className="bg-gray-800 hover:bg-black text-white font-black text-sm px-5 py-2 transition-colors cursor-pointer"
                            >
                              Registrar
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">
                            Ingresa el DNI del participante inscrito o su ticket de formato oficial 
                            (ej: <span className="font-mono bg-gray-150 p-0.5 rounded text-gray-700">UNI-150-TICKET-{selectedEventIdForQr}-12345678-854721</span>).
                          </p>
                        </form>
                      </div>

                      {/* Result panel */}
                      <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-gray-900 mb-4">Resultado del Registro</h3>
                          
                          {!scanResult ? (
                            <div className="border border-dashed border-gray-200 rounded-none py-12 text-center text-gray-455">
                              <QrCode size={40} className="mx-auto mb-2 opacity-20" />
                              <p className="text-sm font-bold">Esperando lectura...</p>
                              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                                Escanee el código con la cámara de su celular o ingrese el DNI del participante en el buscador manual.
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
                        
                        <div className="bg-red-50 border border-red-100 p-4 mt-6 text-xs text-red-800 leading-normal flex items-start gap-2">
                          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black">Simulación Rápida:</p>
                            <p className="text-[11px] text-red-700 mt-0.5">
                              Puedes simular un ingreso manual copiando y pegando el DNI de un participante inscrito o marcando la asistencia directamente en la tabla inferior.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Participant search and list */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                          <h3 className="text-base font-black text-gray-900">Listado de Asistencia del Evento</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Participantes oficialmente inscritos en este evento.</p>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:max-w-xs relative">
                          <input
                            type="text"
                            placeholder="Buscar por Nombre o DNI..."
                            value={qrParticipantSearch}
                            onChange={e => setQrParticipantSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 focus:outline-none focus:border-[#800404] bg-white text-gray-850"
                          />
                          <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>

                      {eventParticipants.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Ningún participante inscrito en este evento por el momento.</p>
                      ) : (
                        <div className="overflow-x-auto border border-gray-150">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 font-black text-gray-700 uppercase tracking-wider text-xs">
                              <tr>
                                <th className="px-6 py-3.5 text-left">Participante (DNI)</th>
                                <th className="px-6 py-3.5 text-left">Correo Electrónico</th>
                                <th className="px-6 py-3.5 text-left">Institución</th>
                                <th className="px-6 py-3.5 text-center">Estado</th>
                                <th className="px-6 py-3.5 text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {eventParticipants
                                .filter(p => {
                                  const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase()
                                  const dni = (p.dni || '').toLowerCase()
                                  const q = qrParticipantSearch.toLowerCase()
                                  return fullName.includes(q) || dni.includes(q)
                                })
                                .map(p => {
                                  const status = getParticipantTicketStatus(p)
                                  return (
                                    <tr key={p.dni} className="hover:bg-gray-50/50">
                                      <td className="px-6 py-3 text-gray-850 font-bold whitespace-nowrap">
                                        <div>{p.nombres} {p.apellidos}</div>
                                        <div className="text-[10px] text-gray-450 font-mono font-medium mt-0.5">DNI: {p.dni}</div>
                                      </td>
                                      <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                                        {p.email}
                                      </td>
                                      <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                                        {p.institucion}
                                      </td>
                                      <td className="px-6 py-3 text-center whitespace-nowrap">
                                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 uppercase border ${
                                          status === 'Asistió'
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}>
                                          {status === 'Asistió' ? 'Asistió' : 'Pendiente'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-3 text-center whitespace-nowrap">
                                        {status === 'Asistió' ? (
                                          <button
                                            type="button"
                                            onClick={() => handleToggleAttendance(p.dni, 'Inscrito')}
                                            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-1 transition-all rounded-none cursor-pointer border border-red-200"
                                          >
                                            Anular Asistencia
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => handleToggleAttendance(p.dni, 'Asistió')}
                                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 transition-all rounded-none cursor-pointer border border-emerald-200"
                                          >
                                            Marcar Asistencia
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>
            )
          })()}

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

                    <div className="mb-4">
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
                                  onClick={(e) => { e.preventDefault(); showAlert(`Simulación de descarga del PDF de certificado: ${cert.codigoValidacion}.pdf`, 'Descarga en Proceso', 'success') }}
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

          {/* TAB: EDITAR PAGINAS (CMS) */}
          {activeTab === 'cms' && (
            <div className="space-y-6 bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Editar Contenido de las Páginas</h3>
                  <p className="text-sm text-gray-400 mt-0.5">Modifica los textos de bienvenida, banners, expositores y secciones estáticas.</p>
                </div>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'inicio', label: 'Inicio' },
                  { id: 'eventos', label: 'Eventos' },
                  { id: 'encuentro', label: 'Encuentro Internacional' },
                  { id: 'certificados', label: 'Certificados' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setCmsActiveSubTab(sub.id)}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                      cmsActiveSubTab === sub.id
                        ? 'border-[#800404] text-[#800404]'
                        : 'border-transparent text-gray-500 hover:text-[#800404]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* SUB TAB: INICIO */}
              {cmsActiveSubTab === 'inicio' && (
                <form onSubmit={handleSaveCmsHome} className="space-y-6 max-w-4xl">
                  {/* Hero Banner Section */}
                  <div className="space-y-4">
                    <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider border-b border-gray-100 pb-2">Sección de Bienvenida (Hero Banner)</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título de Bienvenida</label>
                        <input
                          type="text"
                          value={cmsHomeForm.heroTitle}
                          onChange={e => setCmsHomeForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtítulo / Descripción</label>
                        <textarea
                          rows={3}
                          value={cmsHomeForm.heroSubtitle}
                          onChange={e => setCmsHomeForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="space-y-4">
                    <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider border-b border-gray-100 pb-2">Panel de Estadísticas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {cmsHomeForm.stats.map((stat, idx) => (
                        <div key={idx} className="border border-gray-200 p-4 space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase">Dato {idx + 1}</p>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Valor</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={e => {
                                const newStats = [...cmsHomeForm.stats]
                                newStats[idx].value = e.target.value
                                setCmsHomeForm(prev => ({ ...prev, stats: newStats }))
                              }}
                              className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800 font-bold"
                              placeholder="Ej: 150"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Etiqueta</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={e => {
                                const newStats = [...cmsHomeForm.stats]
                                newStats[idx].label = e.target.value
                                setCmsHomeForm(prev => ({ ...prev, stats: newStats }))
                              }}
                              className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800"
                              placeholder="Ej: Años de historia"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Programa General */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider font-bold">Programa General (Actividades Rápidas)</h4>
                      <button
                        type="button"
                        onClick={handleAddHomeActivity}
                        className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-3 py-1 flex items-center gap-1 transition-all rounded-none cursor-pointer"
                      >
                        <Plus size={12} /> Agregar Actividad
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-150 p-3 bg-gray-50">
                      {cmsHomeForm.programaGeneral.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">No hay actividades en el programa general.</p>
                      ) : (
                        cmsHomeForm.programaGeneral.map((act, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 p-4 space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => handleRemoveHomeActivity(idx)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                              title="Eliminar actividad"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Fecha</label>
                                <input
                                  type="text"
                                  value={act.date}
                                  onChange={e => handleEditHomeActivity(idx, 'date', e.target.value)}
                                  className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800 font-bold"
                                  placeholder="Ej: JUEVES 2 DE JULIO"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Hora</label>
                                <input
                                  type="text"
                                  value={act.time}
                                  onChange={e => handleEditHomeActivity(idx, 'time', e.target.value)}
                                  className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800"
                                  placeholder="Ej: 10:00 a.m."
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Lugar / Ubicación</label>
                                <input
                                  type="text"
                                  value={act.location}
                                  onChange={e => handleEditHomeActivity(idx, 'location', e.target.value)}
                                  className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800"
                                  placeholder="Ej: Auditorio FIIS"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Título / Descripción de la Actividad</label>
                              <input
                                type="text"
                                value={act.title}
                                onChange={e => handleEditHomeActivity(idx, 'title', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                                placeholder="Ej: Romería en homenaje a personajes ilustres..."
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#800404] hover:bg-[#5a0303] text-white font-black text-sm px-6 py-2.5 transition-colors rounded-none cursor-pointer"
                    >
                      Guardar Cambios (Inicio)
                    </button>
                  </div>
                </form>
              )}

              {/* SUB TAB: EVENTOS */}
              {cmsActiveSubTab === 'eventos' && (
                <form onSubmit={handleSaveCmsEvents} className="space-y-6 max-w-xl">
                  <div className="space-y-4">
                    <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider border-b border-gray-100 pb-2">Cabecera de la Página de Eventos</h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título de la Página</label>
                      <input
                        type="text"
                        value={cmsEventsForm.title}
                        onChange={e => setCmsEventsForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtítulo descriptivo</label>
                      <input
                        type="text"
                        value={cmsEventsForm.subtitle}
                        onChange={e => setCmsEventsForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
                      />
                    </div>
                  </div>

                  {/* Informational redirection */}
                  <div className="bg-red-50 border border-red-150 p-4 space-y-2">
                    <p className="text-xs font-bold text-[#800404] flex items-center gap-1.5 uppercase">
                      <ShieldAlert size={14} /> Nota Administrativa
                    </p>
                    <p className="text-xs text-red-800 leading-normal font-medium">
                      Recuerda que la lista de eventos en sí (títulos, fechas, imágenes y aforos del calendario) se gestiona de forma centralizada en el catálogo general.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('eventos')}
                      className="text-xs font-black text-[#800404] hover:underline flex items-center gap-1 cursor-pointer mt-1"
                    >
                      Ir a Gestionar Catálogo de Eventos <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#800404] hover:bg-[#5a0303] text-white font-black text-sm px-6 py-2.5 transition-colors rounded-none cursor-pointer"
                    >
                      Guardar Cambios (Eventos)
                    </button>
                  </div>
                </form>
              )}

              {/* SUB TAB: ENCUENTRO INTERNACIONAL */}
              {cmsActiveSubTab === 'encuentro' && (
                <form onSubmit={handleSaveCmsMeet} className="space-y-6 max-w-4xl">
                  {/* Editor de Fases */}
                  <div className="space-y-4">
                    <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider border-b border-gray-100 pb-2">Detalles de las Fases del Encuentro</h4>
                    <div className="space-y-6">
                      {cmsMeetForm.phases.map((phase, idx) => (
                        <div key={phase.id || idx} className="border border-gray-200 p-4 space-y-3 bg-gray-50/50">
                          <span className="bg-gray-800 text-white text-[10px] font-black px-2 py-0.5 tracking-wider uppercase inline-block">
                            {phase.label || `Fase ${idx + 1}`} - {phase.title}
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Título de Fase</label>
                              <input
                                type="text"
                                value={phase.title}
                                onChange={e => handleEditPhase(idx, 'title', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850 font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Fecha</label>
                              <input
                                type="text"
                                value={phase.date}
                                onChange={e => handleEditPhase(idx, 'date', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Ubicación</label>
                              <input
                                type="text"
                                value={phase.location}
                                onChange={e => handleEditPhase(idx, 'location', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Horario</label>
                              <input
                                type="text"
                                value={phase.time || ''}
                                onChange={e => handleEditPhase(idx, 'time', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                                placeholder="09:00 - 18:00"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Aforo (Cupos)</label>
                              <input
                                type="number"
                                value={phase.quota || 0}
                                onChange={e => handleEditPhase(idx, 'quota', parseInt(e.target.value, 10))}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">URL de Imagen</label>
                              <input
                                type="text"
                                value={phase.imageUrl || ''}
                                onChange={e => handleEditPhase(idx, 'imageUrl', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850 font-mono"
                                placeholder="https://..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Descripción de la Fase</label>
                            <textarea
                              rows={2}
                              value={phase.description}
                              onChange={e => handleEditPhase(idx, 'description', e.target.value)}
                              className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800"
                            />
                          </div>

                          {phase.isPaid && (
                            <div className="grid grid-cols-2 gap-3 max-w-md">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Precio</label>
                                <input
                                  type="text"
                                  value={phase.price || 'S/ 0'}
                                  onChange={e => handleEditPhase(idx, 'price', e.target.value)}
                                  className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850 font-bold"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Editor de Ponentes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider">Lista de Ponentes Invitados</h4>
                      <button
                        type="button"
                        onClick={handleAddSpeaker}
                        className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-3 py-1 flex items-center gap-1 transition-all rounded-none cursor-pointer"
                      >
                        <Plus size={12} /> Agregar Ponente
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cmsMeetForm.speakers.map((speaker, idx) => (
                        <div key={idx} className="border border-gray-200 p-4 space-y-3 bg-white relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveSpeaker(idx)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                            title="Eliminar ponente"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Nombre</label>
                              <input
                                type="text"
                                value={speaker.name}
                                onChange={e => handleEditSpeaker(idx, 'name', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850 font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">País (Bandera + Texto)</label>
                              <input
                                type="text"
                                value={speaker.country}
                                onChange={e => handleEditSpeaker(idx, 'country', e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-850"
                                placeholder="Ej: 🇯🇵 Japón"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Institución / Organización</label>
                            <input
                              type="text"
                              value={speaker.org}
                              onChange={e => handleEditSpeaker(idx, 'org', e.target.value)}
                              className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Tema / Especialidad</label>
                            <input
                              type="text"
                              value={speaker.topic}
                              onChange={e => handleEditSpeaker(idx, 'topic', e.target.value)}
                              className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-[#800404] text-gray-800"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#800404] hover:bg-[#5a0303] text-white font-black text-sm px-6 py-2.5 transition-colors rounded-none cursor-pointer"
                    >
                      Guardar Cambios (Encuentro)
                    </button>
                  </div>
                </form>
              )}

              {/* SUB TAB: CERTIFICADOS */}
              {cmsActiveSubTab === 'certificados' && (
                <form onSubmit={handleSaveCmsCerts} className="space-y-6 max-w-xl">
                  <div className="space-y-4">
                    <h4 className="font-black text-sm text-gray-850 uppercase tracking-wider border-b border-gray-100 pb-2">Cabecera de la Página de Certificados</h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título del Buscador</label>
                      <input
                        type="text"
                        value={cmsCertsForm.title}
                        onChange={e => setCmsCertsForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción instructiva</label>
                      <textarea
                        rows={2}
                        value={cmsCertsForm.subtitle}
                        onChange={e => setCmsCertsForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#800404] hover:bg-[#5a0303] text-white font-black text-sm px-6 py-2.5 transition-colors rounded-none cursor-pointer"
                    >
                      Guardar Cambios (Certificados)
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}


        </div>

      </main>

      {/* MODAL: CREAR O EDITAR EVENTO */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl shadow-2xl border border-gray-200 overflow-hidden font-sans flex flex-col max-h-[90vh]">
            
            <div className="bg-[#800404] text-white p-5 flex items-center justify-between shrink-0">
              <h4 className="font-black text-base">{editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}</h4>
              <button onClick={() => setIsEventModalOpen(false)} className="text-white/60 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Left Column */}
                  <div className="space-y-4">
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

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría del Evento *</label>
                      <select
                        value={eventForm.category}
                        onChange={e => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] bg-white text-gray-805"
                      >
                        <option value="Académico">Académico</option>
                        <option value="Egresados">Egresados</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Laboral">Laboral</option>
                      </select>
                    </div>

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
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL de la Portada</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={eventForm.imageUrl}
                          onChange={e => setEventForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-[#800404] text-gray-850"
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
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1 cursor-pointer transition-colors shrink-0"
                          title="Usar imagen de prueba aleatoria"
                        >
                          Azar
                        </button>
                      </div>
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
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
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

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Etiquetas / Badges (Separadas por comas)</label>
                    <input
                      type="text"
                      value={eventForm.tags || ''}
                      onChange={e => setEventForm(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404] text-gray-850 rounded-none"
                      placeholder="Ej: FIC, FIIS, FIM, Tecnología, Innovación"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Sugerencias:</span>
                      {[
                        'FC', 'FIC', 'FIIS', 'FIM', 'FIA', 'FIEE', 'FIGMM', 'FAUA', 
                        'Tecnología', 'Innovación', 'Investigación', 'Egresados', 'Cultural'
                      ].map(sug => {
                        const currentTags = eventForm.tags
                          ? eventForm.tags.split(',').map(t => t.trim()).filter(Boolean)
                          : [];
                        const isAlreadyAdded = currentTags.includes(sug);
                        return (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => {
                              if (!isAlreadyAdded) {
                                const newTags = [...currentTags, sug].join(', ');
                                setEventForm(prev => ({ ...prev, tags: newTags }));
                              }
                            }}
                            className={`text-[9px] font-bold px-1.5 py-0.5 uppercase border transition-all ${
                              isAlreadyAdded
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white hover:bg-red-50 text-[#800404] border-red-200 cursor-pointer active:scale-95'
                            }`}
                            disabled={isAlreadyAdded}
                          >
                            + {sug}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold px-4 py-2 transition-colors cursor-pointer"
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
          <div className="bg-white w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden font-sans flex flex-col max-h-[90vh]">
            
            <div className="bg-[#800404] text-white p-5 flex items-center justify-between shrink-0">
              <h4 className="font-black text-base">{editingConf ? 'Editar Ponencia' : 'Crear Nueva Ponencia'}</h4>
              <button onClick={() => setIsConfModalOpen(false)} className="text-white/60 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConf} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
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

              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsConfModalOpen(false)}
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold px-4 py-2 transition-colors cursor-pointer"
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
