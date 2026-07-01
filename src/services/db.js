// Módulo de servicio de Base de Datos para Sesquitec-UNI
// Maneja datos persistentes en localStorage para eventos, ponencias, certificados y logs de QR.

const EVENTS_KEY = 'uni_eventos_events'
const CONFERENCES_KEY = 'uni_eventos_conferences'
const CERTIFICATES_KEY = 'uni_eventos_certificates'
const QR_LOGS_KEY = 'uni_eventos_qr_logs'
const USERS_KEY = 'uni_eventos_users'

// Semilla de Eventos Iniciales (extraídos de Cronograma y Dashboard)
const initialEvents = [
  {
    id: 'may1',
    status: 'post',
    date: '15 May 2026',
    time: '10:00 – 17:00',
    title: 'Exposición de Proyectos de Innovación',
    organizer: 'Vicerrectorado de Investigación',
    location: 'Cúpula UNI, Lima',
    description: 'Muestra tecnológica de prototipos y patentes desarrolladas por investigadores de la UNI en el marco del pre-sesquicentenario.',
    quota: 0,
    registrationOpen: false,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['Investigación', 'Innovación', 'Tecnología']
  },
  {
    id: 'may2',
    status: 'post',
    date: '05 May 2026',
    time: '18:00 – 20:00',
    title: 'Lanzamiento del Sesquicentenario UNI',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Teatro UNI, Lima',
    description: 'Ceremonia oficial del lanzamiento del programa oficial de los 150 años de la Universidad Nacional de Ingeniería.',
    quota: 0,
    registrationOpen: false,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    category: 'Cultural',
    tags: ['Aniversario', 'UNI', 'Cultural']
  },
  {
    id: 'may3',
    status: 'post',
    date: '26 May 2026',
    time: '14:30 – 17:30',
    title: 'Taller: Metodologías de Investigación Científica',
    organizer: 'Vicerrectorado Académico',
    location: 'Auditorio del Pabellón Central, Lima',
    description: 'Seminario práctico de metodologías de investigación avanzada y redacción de artículos científicos para ingeniería.',
    quota: 0,
    registrationOpen: false,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['Taller', 'Investigación', 'Académico']
  },
  {
    id: 'jun1',
    status: 'post',
    date: '10 Jun 2026',
    time: '09:00 – 13:00',
    title: 'Simposio de Ciencias Básicas',
    organizer: 'Facultad de Ciencias',
    location: 'Auditorium A, UNI, Lima',
    description: 'Simposio académico con presentaciones sobre matemáticas, física y química aplicadas a la ingeniería.',
    quota: 0,
    registrationOpen: false,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['FC', 'Ciencias', 'Física']
  },
  {
    id: 'jun2',
    status: 'post',
    date: '18 Jun 2026',
    time: '14:00 – 18:00',
    title: 'Foro de Innovación Tecnológica',
    organizer: 'UNICODE',
    location: 'Aula Magna, UNI, Lima',
    description: 'Exposición de proyectos estudiantiles y ponencias sobre innovación y emprendimiento.',
    quota: 0,
    registrationOpen: false,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['FIIS', 'Tecnología', 'Programación']
  },
  {
    id: 'jun3',
    status: 'post',
    date: '25 Jun 2026',
    time: '15:00 – 19:00',
    title: 'Taller de Robótica y Automatización Aplicada',
    organizer: 'CTIC UNI',
    location: 'Laboratorios del CTIC, Lima',
    description: 'Taller práctico sobre microcontroladores y programación aplicados a sistemas de robótica e inteligencia artificial.',
    quota: 0,
    registrationOpen: false,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['Robótica', 'Automatización', 'Taller']
  },
  {
    id: 'jul1', // También conocido como ID 1
    status: 'pre',
    date: '14 Jul 2026',
    time: '08:00 – 18:00',
    max_edit_date: '2026-07-10T23:59:59Z',
    title: 'Encuentro Internacional de Ingeniería UNI - Fase I',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Teatro UNI, Lima',
    description: 'Evento central del Sesquicentenario. Incluye 10 conferencias magistrales con ponentes nacionales e internacionales en áreas de Ingeniería Civil, Sistemas, Mecánica, Eléctrica y más.',
    registrationOpen: true,
    quota: 850,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['FIC', 'FIM', 'FIIS', 'Internacional']
  },
  {
    id: 'jul2',
    status: 'pre',
    date: '25 Jul 2026',
    time: '10:00 – 12:00',
    title: 'Ceremonia de Aniversario Oficial',
    organizer: 'Rectorado UNI',
    location: 'Teatro UNI, Lima',
    description: 'Ceremonia oficial de celebración de los 150 años de la UNI con presencia de autoridades nacionales.',
    registrationOpen: false,
    quota: 0,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    category: 'Cultural',
    tags: ['UNI', 'Aniversario', 'Cultural']
  },
  {
    id: 'jul3',
    status: 'pre',
    date: '28 Jul 2026',
    time: '18:00 – 21:00',
    title: 'Presentación del Libro de Oro del Sesquicentenario',
    organizer: 'Rectorado y Centro Cultural UNI',
    location: 'Cúpula UNI, Lima',
    description: 'Ceremonia de presentación y entrega de la edición de gala del Libro de Oro de la Universidad Nacional de Ingeniería.',
    registrationOpen: false,
    quota: 0,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    category: 'Cultural',
    tags: ['Libro de Oro', 'Historia', 'Cultura']
  },
  {
    id: 'ago1',
    status: 'pre',
    date: '08 Ago 2026',
    time: '09:00 – 17:00',
    title: 'Congreso de Ingeniería Ambiental',
    organizer: 'Facultad de Ingeniería Ambiental',
    location: 'Auditorium C, UNI, Lima',
    description: 'Congreso sobre energías renovables, gestión ambiental y tecnologías verdes para el desarrollo sostenible del Perú.',
    registrationOpen: true,
    quota: 300,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['FIA', 'Ambiental', 'Sostenibilidad']
  },
  {
    id: 'ago2', // También conocido como ID 2
    status: 'pre',
    date: '22 Ago 2026',
    time: '19:00 – 23:00',
    max_edit_date: '2026-08-15T23:59:59Z',
    title: 'Cena de Gala de Egresados',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Gran Hotel Bolívar, Lima',
    description: 'Evento social exclusivo para egresados de la UNI. Cena, música en vivo y reconocimientos especiales.',
    registrationOpen: true,
    quota: 500,
    isPaid: true,
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
    category: 'Egresados',
    tags: ['Egresados', 'Gala', 'Social']
  },
  {
    id: 'sep1',
    status: 'pre',
    date: '08 Sep 2026',
    time: '09:00 – 18:00',
    max_edit_date: '2026-09-01T23:59:59Z',
    title: 'Encuentro Internacional de Ingeniería - Fase II',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Teatro UNI, Lima',
    description: 'Segunda fase de conferencias magistrales e integradoras de investigadores y líderes globales de la ingeniería.',
    registrationOpen: true,
    quota: 960,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    category: 'Académico',
    tags: ['Internacional', 'Conferencias', 'Septiembre']
  },
  {
    id: 'sep2',
    status: 'pre',
    date: '10 Sep 2026',
    time: '10:00 – 20:00',
    max_edit_date: '2026-09-01T23:59:59Z',
    title: 'Feria Tecnológica Internacional UNI',
    organizer: 'Sesquitec / OTI',
    location: 'Explanada de la UNI, Lima',
    description: 'La feria tecnológica internacional más grande del Sesquicentenario con exhibición de prototipos, stands empresariales y ponencias de innovación.',
    registrationOpen: true,
    quota: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    category: 'Tecnología',
    tags: ['Feria', 'Tecnología', 'Innovación']
  },
  {
    id: 'sep3',
    status: 'pre',
    date: '12 Sep 2026',
    time: '20:00 – 23:59',
    max_edit_date: '2026-09-05T23:59:59Z',
    title: 'Cena de Reconocimiento del Sesquicentenario',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Gran Hotel Bolívar, Lima',
    description: 'Homenaje central y cena de honor del Sesquicentenario de la UNI para egresados, personalidades destacadas y autoridades nacionales.',
    registrationOpen: true,
    quota: 500,
    isPaid: true,
    imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800',
    category: 'Egresados',
    tags: ['Cena', 'Reconocimiento', 'Gala', 'Social']
  },
  {
    id: 'oct1',
    status: 'pre',
    date: '10 Oct 2026',
    time: '10:00 – 14:00',
    title: 'Hackathon Sesquicentenario',
    organizer: 'UNICODE',
    location: 'Laboratorios de Cómputo, UNI, Lima',
    description: 'Competencia de 48 horas para resolver problemas reales de ingeniería con tecnología.',
    registrationOpen: false,
    quota: 200,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    category: 'Laboral',
    tags: ['FIIS', 'Hackathon', 'Tecnología']
  },
  {
    id: 'nov1',
    status: 'pre',
    date: '28 Nov 2026',
    time: '16:00 – 20:00',
    title: 'Clausura del Sesquicentenario',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Teatro UNI, Lima',
    description: 'Ceremonia de clausura y presentación del libro histórico de los 150 años de la UNI.',
    registrationOpen: false,
    quota: 0,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    category: 'Cultural',
    tags: ['Clausura', 'Cultura', 'Historia']
  },
  {
    id: 'dec1',
    status: 'pre',
    date: '18 Dic 2026',
    time: '19:30 – 22:30',
    title: 'Concierto de Gala de Fin de Año UNI',
    organizer: 'Centro Cultural UNI',
    location: 'Gran Teatro Nacional, Lima',
    description: 'Magno concierto de cierre del Sesquicentenario con la Orquesta Sinfónica Nacional y el Coro UNI.',
    quota: 1200,
    registrationOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
    category: 'Cultural',
    tags: ['Música', 'Cultura', 'Sinfónica']
  }
]

// Semilla de Ponencias (de Inscripcion y Dashboard)
const initialConferences = [
  { id: 'c1', eventId: 'jul1', time: '09:00', duration: 120, title: 'Inteligencia Artificial en la Ingeniería Peruana', speaker: 'Dr. Roberto Vargas', room: 'Auditorium A', quota: 200 },
  { id: 'c2', eventId: 'jul1', time: '09:00', duration: 120, title: 'Gestión de Proyectos con Metodologías Ágiles', speaker: 'Mg. Sofia Herrera', room: 'Auditorium B', quota: 150 },
  { id: 'c3', eventId: 'jul1', time: '11:00', duration: 120, title: 'Infraestructura Sostenible para el Siglo XXI', speaker: 'Mg. Carmen Flores', room: 'Auditorium C', quota: 180 },
  { id: 'c4', eventId: 'jul1', time: '11:00', duration: 120, title: 'Ciberseguridad en Sistemas Críticos', speaker: 'Dr. Andrés Gutiérrez', room: 'Aula Magna', quota: 300 },
  { id: 'c5', eventId: 'jul1', time: '13:00', duration: 120, title: 'Robótica e Industria 4.0 en el Perú', speaker: 'Ing. María Quispe', room: 'Auditorium A', quota: 200 },
  { id: 'c6', eventId: 'jul1', time: '13:00', duration: 120, title: 'Modelado BIM para Construcción Moderna', speaker: 'Arq. Javier Romero', room: 'Auditorium B', quota: 150 },
  { id: 'c7', eventId: 'jul1', time: '15:00', duration: 120, title: 'Energías Renovables y Transición Energética', speaker: 'Dr. Ana Torres', room: 'Auditorium C', quota: 180 },
  { id: 'c8', eventId: 'jul1', time: '15:00', duration: 120, title: 'Emprendimiento Tecnológico Universitario', speaker: 'Ing. Luis Mendoza', room: 'Aula Magna', quota: 300 },
  { id: 'c9', eventId: 'jul1', time: '17:00', duration: 120, title: 'Minería Sostenible y Tecnología Verde', speaker: 'Dr. Pablo Díaz', room: 'Auditorium A', quota: 200 },
  { id: 'c10', eventId: 'jul1', time: '17:00', duration: 120, title: 'Algoritmos para Optimización Industrial', speaker: 'Mg. Rosa Salinas', room: 'Auditorium B', quota: 150 }
]

// Semilla de Certificados (de Certificados y Validar)
const initialCertificates = [
  {
    id: 'cert-001',
    dni: '72341567',
    titular: 'Juan Carlos Pérez López',
    evento: 'Simposio de Ciencias Básicas',
    fecha: '10 Jun 2026',
    horas: 4,
    emitido: '15 Jun 2026',
    tipo: 'Participación',
    codigoValidacion: 'CERT-UNI-2026-72341567-001',
    rector: 'Dr. Alfonso Fujimori Morel'
  },
  {
    id: 'cert-002',
    dni: '72341567',
    titular: 'Juan Carlos Pérez López',
    evento: 'Foro de Innovación Tecnológica',
    fecha: '18 Jun 2026',
    horas: 3,
    emitido: '22 Jun 2026',
    tipo: 'Ponencia',
    codigoValidacion: 'CERT-UNI-2026-72341567-002',
    rector: 'Dr. Alfonso Fujimori Morel'
  },
  {
    id: 'cert-003',
    dni: '45678901',
    titular: 'María Fernanda González Soto',
    evento: 'Simposio de Ciencias Básicas',
    fecha: '10 Jun 2026',
    horas: 4,
    emitido: '15 Jun 2026',
    tipo: 'Participación',
    codigoValidacion: 'CERT-UNI-2026-45678901-001',
    rector: 'Dr. Alfonso Fujimori Morel'
  },
  {
    id: 'cert-004',
    dni: '45678901',
    titular: 'María Fernanda González Soto',
    evento: 'Foro de Innovación Tecnológica',
    fecha: '18 de Junio, 2026',
    horas: 3,
    emitido: '22 de Junio, 2026',
    tipo: 'Ponente',
    codigoValidacion: 'CERT-UNI-2026-45678901-002',
    rector: 'Dr. Alfonso Fujimori Morel'
  }
]

export const db = {
  // Inicializar toda la base de datos
  initializeDb() {
    const existingEvents = localStorage.getItem(EVENTS_KEY)
    if (existingEvents) {
      try {
        const parsed = JSON.parse(existingEvents)
        // Limpiar si es la base de datos antigua (sin imágenes o con menos eventos)
        if (parsed.length > 0 && (!parsed[0].imageUrl || parsed.length < 15)) {
          localStorage.removeItem(EVENTS_KEY)
          localStorage.removeItem(CONFERENCES_KEY)
          localStorage.removeItem(CERTIFICATES_KEY)
        }
      } catch (err) {
        localStorage.removeItem(EVENTS_KEY)
      }
    }

    if (!localStorage.getItem(EVENTS_KEY)) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents))
    } else {
      // Auto-actualizar eventos existentes en localStorage para asegurar que tengan tags si faltan
      try {
        const currentEvents = JSON.parse(localStorage.getItem(EVENTS_KEY))
        let updated = false
        const updatedEvents = currentEvents.map(ev => {
          if (!ev.tags) {
            const seedEv = initialEvents.find(ie => ie.id === ev.id)
            ev.tags = seedEv ? (seedEv.tags || []) : []
            updated = true
          }
          return ev
        })
        if (updated) {
          localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents))
        }
      } catch (e) {
        console.error("Error auto-updating event tags in DB:", e)
      }
    }
    if (!localStorage.getItem(CONFERENCES_KEY)) {
      localStorage.setItem(CONFERENCES_KEY, JSON.stringify(initialConferences))
    }
    if (!localStorage.getItem(CERTIFICATES_KEY)) {
      localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(initialCertificates))
    }
    if (!localStorage.getItem(QR_LOGS_KEY)) {
      localStorage.setItem(QR_LOGS_KEY, JSON.stringify([]))
    }
  },

  // --- EVENTOS ---
  getEvents() {
    this.initializeDb()
    return JSON.parse(localStorage.getItem(EVENTS_KEY))
  },
  saveEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  },
  createEvent(event) {
    const events = this.getEvents()
    const newEvent = {
      ...event,
      id: event.id || `evt-${Date.now()}`,
      quota: parseInt(event.quota) || 0,
      registrationOpen: event.registrationOpen !== undefined ? event.registrationOpen : true
    }
    events.push(newEvent)
    this.saveEvents(events)
    return newEvent
  },
  updateEvent(updatedEvent) {
    const events = this.getEvents()
    const index = events.findIndex(e => e.id === updatedEvent.id)
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...updatedEvent,
        quota: parseInt(updatedEvent.quota) || 0
      }
      this.saveEvents(events)
      return true
    }
    return false
  },
  deleteEvent(eventId) {
    const events = this.getEvents()
    const filtered = events.filter(e => e.id !== eventId)
    this.saveEvents(filtered)
    // También borrar ponencias asociadas a este evento
    const conferences = this.getConferences()
    const filteredConfs = conferences.filter(c => c.eventId !== eventId)
    this.saveConferences(filteredConfs)
    return true
  },

  // --- PONENCIAS (CONFERENCIAS) ---
  getConferences() {
    this.initializeDb()
    return JSON.parse(localStorage.getItem(CONFERENCES_KEY))
  },
  saveConferences(conferences) {
    localStorage.setItem(CONFERENCES_KEY, JSON.stringify(conferences))
  },
  createConference(conf) {
    const conferences = this.getConferences()
    const newConf = {
      ...conf,
      id: conf.id || `conf-${Date.now()}`,
      duration: parseInt(conf.duration) || 60,
      quota: parseInt(conf.quota) || 100
    }
    conferences.push(newConf)
    this.saveConferences(conferences)
    return newConf
  },
  updateConference(updatedConf) {
    const conferences = this.getConferences()
    const index = conferences.findIndex(c => c.id === updatedConf.id)
    if (index !== -1) {
      conferences[index] = {
        ...conferences[index],
        ...updatedConf,
        duration: parseInt(updatedConf.duration) || 60,
        quota: parseInt(updatedConf.quota) || 100
      }
      this.saveConferences(conferences)
      return true
    }
    return false
  },
  deleteConference(confId) {
    const conferences = this.getConferences()
    const filtered = conferences.filter(c => c.id !== confId)
    this.saveConferences(filtered)
    return true
  },

  // --- CERTIFICADOS ---
  getCertificates() {
    this.initializeDb()
    return JSON.parse(localStorage.getItem(CERTIFICATES_KEY))
  },
  saveCertificates(certs) {
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certs))
  },
  createCertificate(cert) {
    const certs = this.getCertificates()
    const newCert = {
      id: cert.id || `cert-${Date.now()}`,
      dni: cert.dni,
      titular: cert.titular,
      evento: cert.evento,
      fecha: cert.fecha || new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      horas: (typeof cert.horas !== 'undefined' && cert.horas !== null) ? parseInt(cert.horas) : 4,
      emitido: cert.emitido || new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      tipo: cert.tipo || 'Participación',
      codigoValidacion: cert.codigoValidacion || `CERT-UNI-2026-${cert.dni}-${Math.floor(100 + Math.random() * 900)}`,
      rector: cert.rector || 'Dr. Alfonso Fujimori Morel'
    }
    certs.push(newCert)
    this.saveCertificates(certs)

    // Sincronizar el certificado en el registro individual del usuario
    const users = this.getUsers()
    const index = users.findIndex(u => u.dni === cert.dni)
    if (index !== -1) {
      if (!users[index].certificates) {
        users[index].certificates = []
      }
      // Evitar duplicados en el registro del usuario
      if (!users[index].certificates.some(c => c.id === newCert.id)) {
        users[index].certificates.push({
          id: newCert.id,
          evento: newCert.evento,
          fecha: newCert.fecha,
          horas: newCert.horas,
          emitido: newCert.emitido,
          tipo: newCert.tipo,
          codigoValidacion: newCert.codigoValidacion
        })
        this.saveUsers(users)
      }
    }
    return newCert
  },
  deleteCertificate(certId) {
    const certs = this.getCertificates()
    const filtered = certs.filter(c => c.id !== certId)
    this.saveCertificates(filtered)
    return true
  },

  // --- LOGS DE ASISTENCIA QR ---
  getQrLogs() {
    this.initializeDb()
    return JSON.parse(localStorage.getItem(QR_LOGS_KEY))
  },
  saveQrLogs(logs) {
    localStorage.setItem(QR_LOGS_KEY, JSON.stringify(logs))
  },
  addQrLog(log) {
    const logs = this.getQrLogs()
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('es-PE'),
      ...log
    }
    logs.unshift(newLog) // Agregar al inicio para mostrar el más reciente primero
    this.saveQrLogs(logs)
    return newLog
  },

  // --- PARTICIPANTES / USUARIOS ---
  getUsers() {
    const storedUsers = localStorage.getItem(USERS_KEY)
    return storedUsers ? JSON.parse(storedUsers) : []
  },
  saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },
  updateUserTicketStatus(dni, eventId, newStatus) {
    const users = this.getUsers()
    let updated = false
    const updatedUsers = users.map(u => {
      if (u.dni === dni) {
        const updatedTickets = (u.tickets || []).map(t => {
          // Compare loosely because eventId could be string or numeric
          if (String(t.eventId) === String(eventId)) {
            updated = true
            return { ...t, status: newStatus }
          }
          return t
        })
        return { ...u, tickets: updatedTickets }
      }
      return u
    })
    if (updated) {
      this.saveUsers(updatedUsers)
      return true
    }
    return false
  },

  // --- INSCRIPCIÓN A EVENTOS ---

  /** Cuenta cuántos usuarios tienen un ticket para el eventId dado */
  getEventRegistrationCount(eventId) {
    const users = this.getUsers()
    let count = 0
    users.forEach(u => {
      if ((u.tickets || []).some(t => String(t.eventId) === String(eventId))) {
        count++
      }
    })
    return count
  },

  /** Verifica si un usuario (por email) ya está inscrito a un evento */
  isUserRegistered(userEmail, eventId) {
    const users = this.getUsers()
    const user = users.find(u => u.email === userEmail)
    if (!user) return false
    return (user.tickets || []).some(t => String(t.eventId) === String(eventId))
  },

  /** Registra a un usuario en un evento, generando su ticket QR.
   *  Retorna: { success: boolean, message: string, ticket?: object } */
  registerUserToEvent(userEmail, eventId) {
    const users = this.getUsers()
    const userIdx = users.findIndex(u => u.email === userEmail)
    if (userIdx === -1) {
      return { success: false, message: 'Usuario no encontrado. Inicia sesión primero.' }
    }

    const events = this.getEvents()
    const event = events.find(e => String(e.id) === String(eventId))
    if (!event) {
      return { success: false, message: 'Evento no encontrado.' }
    }
    if (!event.registrationOpen) {
      return { success: false, message: 'Las inscripciones para este evento están cerradas.' }
    }

    // Verificar inscripción duplicada
    const user = users[userIdx]
    if ((user.tickets || []).some(t => String(t.eventId) === String(eventId))) {
      return { success: false, message: 'Ya estás inscrito a este evento.' }
    }

    // Verificar aforo
    if (event.quota > 0) {
      const currentCount = this.getEventRegistrationCount(eventId)
      if (currentCount >= event.quota) {
        return { success: false, message: 'El aforo de este evento está completo.' }
      }
    }

    // Generar ticket
    const ticket = {
      id: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      status: 'Vigente',
      qrCode: `QR-${event.id}-${user.dni}-${Date.now()}`,
      registeredAt: new Date().toISOString()
    }

    if (!user.tickets) user.tickets = []
    user.tickets.push(ticket)
    users[userIdx] = user
    this.saveUsers(users)

    return { success: true, message: '¡Inscripción exitosa!', ticket }
  },

  /** Cancela la inscripción de un usuario a un evento (elimina el ticket) */
  unregisterUserFromEvent(userEmail, eventId) {
    const users = this.getUsers()
    const userIdx = users.findIndex(u => u.email === userEmail)
    if (userIdx === -1) return { success: false, message: 'Usuario no encontrado.' }

    const user = users[userIdx]
    const ticketIdx = (user.tickets || []).findIndex(t => String(t.eventId) === String(eventId))
    if (ticketIdx === -1) return { success: false, message: 'No estás inscrito a este evento.' }

    // Verificar max_edit_date del evento
    const events = this.getEvents()
    const event = events.find(e => String(e.id) === String(eventId))
    if (event && event.max_edit_date) {
      if (new Date() > new Date(event.max_edit_date)) {
        return { success: false, message: 'El plazo para cancelar la inscripción ha vencido.' }
      }
    }

    user.tickets.splice(ticketIdx, 1)
    users[userIdx] = user
    this.saveUsers(users)
    return { success: true, message: 'Inscripción cancelada correctamente.' }
  }
}

