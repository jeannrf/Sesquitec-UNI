// Módulo de servicio de Base de Datos para Sesquitec-UNI
// Maneja datos persistentes en localStorage para eventos, ponencias, certificados y logs de QR.
// Fase 4: Sincronización asíncrona bidireccional con Firebase Cloud Firestore.

import { firestore } from './firebase'
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore'

const EVENTS_KEY = 'uni_eventos_events'
const CONFERENCES_KEY = 'uni_eventos_conferences'
const CERTIFICATES_KEY = 'uni_eventos_certificates'
const QR_LOGS_KEY = 'uni_eventos_qr_logs'
const USERS_KEY = 'uni_eventos_users'
const CMS_KEY = 'uni_eventos_cms'


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
    tags: ['Investigación', 'Innovación', 'Tecnología'],
    instagramUrl: 'https://www.instagram.com/uni_oficial/',
    linkedinUrl: 'https://www.linkedin.com/school/uni-peru/',
    facebookUrl: 'https://www.facebook.com/UNI.pe'
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
    tags: ['Aniversario', 'UNI', 'Cultural'],
    instagramUrl: 'https://www.instagram.com/uni_oficial/',
    facebookUrl: 'https://www.facebook.com/UNI.pe'
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
    tags: ['FC', 'Ciencias', 'Física'],
    instagramUrl: 'https://www.instagram.com/fc_uni/',
    linkedinUrl: 'https://www.linkedin.com/school/uni-peru/'
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
    id: 'jul1',
    status: 'pre',
    date: '14 Jul 2026',
    instagramUrl: 'https://www.instagram.com/uni_oficial/',
    linkedinUrl: 'https://www.linkedin.com/school/uni-peru/',
    facebookUrl: 'https://www.facebook.com/UNI.pe',
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
    tags: ['FIC', 'FIM', 'FIIS', 'Internacional'],
    isSesquitec: true
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
    id: 'ago2',
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
    tags: ['Egresados', 'Gala', 'Social'],
    isSesquitec: true
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
    tags: ['Internacional', 'Conferencias', 'Septiembre'],
    isSesquitec: true
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
  // Inicializar toda la base de datos localmente
  initializeDb() {
    const existingEvents = localStorage.getItem(EVENTS_KEY)
    if (existingEvents) {
      try {
        const parsed = JSON.parse(existingEvents)
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

  // Sincronizar desde Firebase Cloud Firestore y actualizar el cache de localStorage
  async syncFromFirebase() {
    if (!firestore) {
      console.log("Firestore no configurado. Operando en modo local (localStorage).");
      return false;
    }
    try {
      console.log("Sincronizando datos desde Firestore...");

      // 1. Obtener Eventos
      const eventosSnap = await getDocs(collection(firestore, 'eventos'));
      const eventos = eventosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (eventos.length === 0) {
        console.log("Base de datos remota vacía. Sembrando datos iniciales en Firestore...");
        await this.seedFirestore();
        return this.syncFromFirebase(); // re-sincronizar después de sembrar
      }

      const mappedEvents = eventos.map(ev => {
        let descText = ev.description || '';
        let recapVideoId = '';
        let recapImages = [];
        let report = '';
        let instagramUrl = '';
        let linkedinUrl = '';
        let facebookUrl = '';
        let registrationUrl = '';
        let isSesquitec = false;

        if (descText.includes('---RECAP---')) {
          const parts = descText.split('---RECAP---');
          descText = parts[0].trim();
          try {
            const recap = JSON.parse(parts[1]);
            recapVideoId = recap.recapVideoId || '';
            recapImages = recap.recapImages || [];
            report = recap.report || '';
            instagramUrl = recap.instagramUrl || '';
            linkedinUrl = recap.linkedinUrl || '';
            facebookUrl = recap.facebookUrl || '';
            registrationUrl = recap.registrationUrl || '';
            isSesquitec = recap.isSesquitec || false;
          } catch (e) {}
        }

        return {
          id: ev.id,
          title: ev.title,
          organizer: ev.organizer,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          description: descText,
          quota: ev.quota,
          status: ev.status,
          isPaid: ev.is_paid || ev.isPaid || false,
          imageUrl: ev.image_url || ev.imageUrl || '',
          themeColor: ev.theme_color || ev.themeColor || '',
          category: ev.category,
          tags: ev.tags ? (typeof ev.tags === 'string' ? ev.tags.split(',') : ev.tags) : [],
          registrationOpen: ev.registration_open !== undefined ? ev.registration_open : (ev.registrationOpen !== undefined ? ev.registrationOpen : true),
          max_edit_date: ev.max_edit_date || ev.maxEditDate || null,
          recapVideoId,
          recapImages,
          report,
          instagramUrl,
          linkedinUrl,
          facebookUrl,
          registrationUrl,
          isSesquitec
        };
      });
      localStorage.setItem(EVENTS_KEY, JSON.stringify(mappedEvents));

      // 2. Obtener Ponencias
      const ponenciasSnap = await getDocs(collection(firestore, 'ponencias'));
      const mappedConfs = ponenciasSnap.docs.map(doc => {
        const p = doc.data();
        return {
          id: doc.id,
          eventId: p.event_id || p.eventId,
          title: p.title,
          speaker: p.speaker,
          room: p.room,
          time: p.time,
          duration: p.duration,
          quota: p.quota
        };
      });
      localStorage.setItem(CONFERENCES_KEY, JSON.stringify(mappedConfs));

      // 3. Obtener Certificados
      const certificadosSnap = await getDocs(collection(firestore, 'certificados'));
      const mappedCerts = certificadosSnap.docs.map(doc => {
        const c = doc.data();
        const matchedEv = mappedEvents.find(e => e.id === (c.event_id || c.eventId));
        return {
          id: doc.id,
          dni: c.dni,
          titular: c.titular,
          evento: matchedEv ? matchedEv.title : (c.evento || c.event_id || c.eventId || 'Evento Oficial'),
          fecha: c.fecha,
          horas: c.horas,
          emitido: c.emitido,
          tipo: c.tipo,
          codigoValidacion: c.codigo_validacion || c.codigoValidacion,
          pdfUrl: c.pdf_url || c.pdfUrl || ''
        };
      });
      localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(mappedCerts));

      // 4. Obtener Usuarios e Inscripciones
      const usuariosSnap = await getDocs(collection(firestore, 'usuarios'));
      const inscripcionesSnap = await getDocs(collection(firestore, 'inscripciones'));
      const inscripciones = inscripcionesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const mappedUsers = usuariosSnap.docs.map(docDoc => {
        const u = docDoc.data();
        const userTickets = inscripciones
          .filter(ins => ins.user_dni === u.dni || ins.userDni === u.dni)
          .map(ins => {
            const ev = mappedEvents.find(e => e.id === (ins.event_id || ins.eventId));
            return {
              id: `tkt-${ins.id}`,
              eventId: ins.event_id || ins.eventId,
              eventTitle: ev ? ev.title : (ins.eventTitle || ins.event_id || ins.eventId),
              qrCode: ins.qr_code || ins.qrCode,
              status: ins.status === 'Registrado' ? 'Por asistir' : (ins.status === 'Asistió' ? 'Asistió' : 'Cancelado'),
              date: ev ? ev.date : '',
              location: ev ? ev.location : '',
              conferences: ins.ponencias || ins.conferences || [],
              acompanantes: ins.acompanantes || ins.companions || []
            };
          });

        const userCerts = mappedCerts.filter(c => c.dni === u.dni);

        const userRegEvents = userTickets.map(t => ({
          id: t.eventId,
          title: t.eventTitle,
          date: t.date,
          location: t.location,
          status: t.status === 'Por asistir' ? 'Confirmado' : t.status,
          conferences: t.conferences || []
        }));

        return {
          nombres: u.nombres,
          apellidos: u.apellidos,
          email: u.email,
          dni: u.dni,
          telefono: u.telefono || '',
          institucion: u.institucion || '',
          password: u.password || '',
          verified: u.verified || false,
          role: u.role || 'USER',
          profilePic: u.profile_pic || u.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.nombres + ' ' + u.apellidos)}`,
          registeredEvents: userRegEvents,
          tickets: userTickets,
          certificates: userCerts
        };
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(mappedUsers));

      // 5. Obtener QR Logs
      const qrLogsSnap = await getDocs(collection(firestore, 'qr_logs'));
      const mappedLogs = qrLogsSnap.docs.map(doc => {
        const l = doc.data();
        return {
          id: doc.id,
          timestamp: l.timestamp,
          ticketId: l.ticket_id || l.ticketId || '',
          eventTitle: l.event_title || l.eventTitle || '',
          userDni: l.user_dni || l.userDni || '',
          userName: l.user_name || l.userName || '',
          status: l.status || '',
          scannedBy: l.scanned_by || l.scannedBy || '',
          tipo: l.tipo || ''
        };
      });
      localStorage.setItem(QR_LOGS_KEY, JSON.stringify(mappedLogs));

      // 6. Obtener Páginas CMS
      const cmsSnap = await getDocs(collection(firestore, 'cms_paginas'));
      cmsSnap.docs.forEach(doc => {
        const row = doc.data();
        localStorage.setItem(`${CMS_KEY}_${doc.id}`, JSON.stringify(row.value));
      });

      console.log("Sincronización de Firestore exitosa.");
      return true;
    } catch (e) {
      console.error("Error al sincronizar datos de Firestore:", e);
      return false;
    }
  },

  // Sembrar datos de prueba iniciales en Firestore
  async seedFirestore() {
    if (!firestore) return;
    try {
      const batch = writeBatch(firestore);

      // 1. Insertar Eventos
      initialEvents.forEach(ev => {
        const ref = doc(firestore, 'eventos', ev.id);
        batch.set(ref, {
          title: ev.title,
          organizer: ev.organizer,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          description: ev.description,
          quota: ev.quota,
          status: ev.status,
          is_paid: ev.isPaid || false,
          image_url: ev.imageUrl || '',
          category: ev.category,
          tags: ev.tags ? ev.tags.join(',') : '',
          registration_open: ev.registrationOpen !== false,
          max_edit_date: ev.max_edit_date || null
        });
      });

      // 2. Insertar Ponencias
      initialConferences.forEach(c => {
        const ref = doc(firestore, 'ponencias', c.id);
        batch.set(ref, {
          event_id: c.eventId,
          title: c.title,
          speaker: c.speaker,
          room: c.room,
          time: c.time,
          duration: c.duration,
          quota: c.quota
        });
      });

      // 3. Insertar Certificados
      initialCertificates.forEach(c => {
        const ref = doc(firestore, 'certificados', c.id);
        batch.set(ref, {
          dni: c.dni,
          titular: c.titular,
          event_id: c.evento.includes('Simposio') ? 'jun1' : (c.evento.includes('Foro') ? 'jun2' : null),
          fecha: c.fecha,
          horas: c.horas,
          emitido: c.emitido,
          tipo: c.tipo,
          codigo_validacion: c.codigoValidacion,
          pdf_url: ''
        });
      });

      await batch.commit();
      console.log("Semilla sembrada con éxito en Firestore.");
    } catch (e) {
      console.error("Error al sembrar semillas en Firestore:", e);
    }
  },

  // Sincronizar un usuario específico a Firestore
  async syncUserToFirebase(user) {
    if (!firestore) return;
    try {
      const dbUser = {
        nombres: user.nombres,
        apellidos: user.apellidos,
        dni: user.dni,
        email: user.email,
        telefono: user.telefono || '',
        institucion: user.institucion || '',
        password: user.password || '',
        role: user.role || 'USER',
        verified: user.verified || false,
        profile_pic: user.profilePic || ''
      };
      await setDoc(doc(firestore, 'usuarios', user.email.toLowerCase()), dbUser);
    } catch (e) {
      console.error("Error al sincronizar usuario a Firestore:", e);
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

    if (firestore) {
      let finalDesc = newEvent.description || '';
      const recapObj = {
        recapVideoId: newEvent.recapVideoId || '',
        recapImages: newEvent.recapImages || [],
        report: newEvent.report || '',
        instagramUrl: newEvent.instagramUrl || '',
        linkedinUrl: newEvent.linkedinUrl || '',
        facebookUrl: newEvent.facebookUrl || '',
        registrationUrl: newEvent.registrationUrl || '',
        isSesquitec: newEvent.isSesquitec || false
      };
      finalDesc = `${newEvent.description || ''} ---RECAP--- ${JSON.stringify(recapObj)}`;

      setDoc(doc(firestore, 'eventos', newEvent.id), {
        title: newEvent.title,
        organizer: newEvent.organizer,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        description: finalDesc,
        quota: newEvent.quota,
        status: newEvent.status,
        is_paid: newEvent.isPaid || false,
        image_url: newEvent.imageUrl || '',
        category: newEvent.category || '',
        tags: Array.isArray(newEvent.tags) ? newEvent.tags.join(',') : (newEvent.tags || ''),
        registration_open: newEvent.registrationOpen !== false,
        max_edit_date: newEvent.max_edit_date || null
      }).catch(err => console.error("Error al crear evento en Firestore:", err))
    }

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

      if (firestore) {
        let finalDesc = updatedEvent.description || '';
        const recapObj = {
          recapVideoId: updatedEvent.recapVideoId || '',
          recapImages: updatedEvent.recapImages || [],
          report: updatedEvent.report || '',
          instagramUrl: updatedEvent.instagramUrl || '',
          linkedinUrl: updatedEvent.linkedinUrl || '',
          facebookUrl: updatedEvent.facebookUrl || '',
          registrationUrl: updatedEvent.registrationUrl || '',
          isSesquitec: updatedEvent.isSesquitec || false
        };
        finalDesc = `${updatedEvent.description || ''} ---RECAP--- ${JSON.stringify(recapObj)}`;

        updateDoc(doc(firestore, 'eventos', updatedEvent.id), {
          title: updatedEvent.title,
          organizer: updatedEvent.organizer,
          date: updatedEvent.date,
          time: updatedEvent.time,
          location: updatedEvent.location,
          description: finalDesc,
          quota: parseInt(updatedEvent.quota) || 0,
          status: updatedEvent.status,
          is_paid: updatedEvent.isPaid || false,
          image_url: updatedEvent.imageUrl || '',
          category: updatedEvent.category || '',
          tags: Array.isArray(updatedEvent.tags) ? updatedEvent.tags.join(',') : (updatedEvent.tags || ''),
          registration_open: updatedEvent.registrationOpen !== false,
          max_edit_date: updatedEvent.max_edit_date || null
        }).catch(err => console.error("Error al actualizar evento en Firestore:", err))
      }

      return true
    }
    return false
  },
  deleteEvent(eventId) {
    const events = this.getEvents()
    const filtered = events.filter(e => e.id !== eventId)
    this.saveEvents(filtered)
    
    const conferences = this.getConferences()
    const filteredConfs = conferences.filter(c => c.eventId !== eventId)
    this.saveConferences(filteredConfs)

    if (firestore) {
      deleteDoc(doc(firestore, 'eventos', eventId))
        .catch(err => console.error("Error al eliminar evento en Firestore:", err))
    }

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

    if (firestore) {
      setDoc(doc(firestore, 'ponencias', newConf.id), {
        event_id: newConf.eventId,
        title: newConf.title,
        speaker: newConf.speaker,
        room: newConf.room,
        time: newConf.time,
        duration: newConf.duration,
        quota: newConf.quota
      }).catch(err => console.error("Error al crear ponencia en Firestore:", err))
    }

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

      if (firestore) {
        updateDoc(doc(firestore, 'ponencias', updatedConf.id), {
          event_id: updatedConf.eventId,
          title: updatedConf.title,
          speaker: updatedConf.speaker,
          room: updatedConf.room,
          time: updatedConf.time,
          duration: parseInt(updatedConf.duration) || 60,
          quota: parseInt(updatedConf.quota) || 100
        }).catch(err => console.error("Error al actualizar ponencia en Firestore:", err))
      }

      return true
    }
    return false
  },
  deleteConference(confId) {
    const conferences = this.getConferences()
    const filtered = conferences.filter(c => c.id !== confId)
    this.saveConferences(filtered)

    if (firestore) {
      deleteDoc(doc(firestore, 'ponencias', confId))
        .catch(err => console.error("Error al eliminar ponencia en Firestore:", err))
    }

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
      rector: cert.rector || 'Dr. Alfonso Fujimori Morel',
      pdfUrl: cert.pdfUrl || ''
    }
    certs.push(newCert)
    this.saveCertificates(certs)

    // Sincronizar en caché individual del usuario
    const users = this.getUsers()
    const index = users.findIndex(u => u.dni === cert.dni)
    if (index !== -1) {
      if (!users[index].certificates) {
        users[index].certificates = []
      }
      if (!users[index].certificates.some(c => c.id === newCert.id)) {
        users[index].certificates.push({
          id: newCert.id,
          evento: newCert.evento,
          fecha: newCert.fecha,
          horas: newCert.horas,
          emitido: newCert.emitido,
          tipo: newCert.tipo,
          codigoValidacion: newCert.codigoValidacion,
          pdfUrl: newCert.pdfUrl
        })
        this.saveUsers(users)
      }
    }

    if (firestore) {
      const events = this.getEvents()
      const matchedEvent = events.find(e => e.title === cert.evento)
      const eventId = matchedEvent ? matchedEvent.id : null

      setDoc(doc(firestore, 'certificados', newCert.id), {
        dni: newCert.dni,
        titular: newCert.titular,
        event_id: eventId,
        fecha: newCert.fecha,
        horas: newCert.horas,
        emitido: newCert.emitido,
        tipo: newCert.tipo,
        codigo_validacion: newCert.codigoValidacion,
        pdf_url: newCert.pdfUrl || ''
      }).catch(err => console.error("Error al crear certificado en Firestore:", err))
    }

    return newCert
  },
  deleteCertificate(certId) {
    const certs = this.getCertificates()
    const filtered = certs.filter(c => c.id !== certId)
    this.saveCertificates(filtered)

    if (firestore) {
      deleteDoc(doc(firestore, 'certificados', certId))
        .catch(err => console.error("Error al eliminar certificado en Firestore:", err))
    }

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
    logs.unshift(newLog)
    this.saveQrLogs(logs)

    if (firestore) {
      setDoc(doc(firestore, 'qr_logs', newLog.id), {
        timestamp: newLog.timestamp,
        ticket_id: newLog.ticketId || '',
        event_title: newLog.eventTitle || '',
        user_dni: newLog.userDni || '',
        user_name: newLog.userName || '',
        status: newLog.status || '',
        scanned_by: newLog.scannedBy || '',
        tipo: newLog.tipo || ''
      }).catch(err => console.error("Error al registrar log QR en Firestore:", err))
    }

    return newLog
  },

  // --- PARTICIPANTES / USUARIOS ---
  getUsers() {
    const storedUsers = localStorage.getItem(USERS_KEY)
    if (!storedUsers) return []
    
    let users = JSON.parse(storedUsers)
    let needsMigration = false
    
    const generateUniqueCodeForMigration = (allUsers) => {
      let code = ''
      let isUnique = false
      while (!isUnique) {
        const num = Math.floor(10000 + Math.random() * 90000)
        code = `UNI150-${num}`
        
        let found = false
        for (const u of allUsers) {
          if (u.tickets && u.tickets.some(t => t.qrCode === code)) {
            found = true
            break
          }
        }
        if (!found) {
          isUnique = true
        }
      }
      return code
    }

    users = users.map(u => {
      if (u.tickets) {
        const updatedTickets = u.tickets.map(t => {
          if (t.qrCode && (t.qrCode.startsWith('UNI-150-TICKET-') || !t.qrCode.startsWith('UNI150-'))) {
            needsMigration = true
            const newCode = generateUniqueCodeForMigration(users)
            
            if (firestore) {
              updateDoc(doc(firestore, 'inscripciones', `${u.dni}_${t.eventId}`), { qr_code: newCode })
                .catch(err => console.error("Error migrating ticket in Firestore:", err))
            }
            
            return { ...t, qrCode: newCode }
          }
          return t
        })
        return { ...u, tickets: updatedTickets }
      }
      return u
    })

    if (needsMigration) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
    
    return users
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

      if (firestore) {
        const dbStatus = newStatus === 'Por asistir' ? 'Registrado' : (newStatus === 'Asistió' ? 'Asistió' : 'Cancelado')
        updateDoc(doc(firestore, 'inscripciones', `${dni}_${eventId}`), { status: dbStatus })
          .catch(err => console.error("Error al actualizar estado del ticket en Firestore:", err))
      }

      return true
    }
    return false;
  },

  updateUserRole(dni, newRole) {
    const users = this.getUsers()
    let updated = false
    let userEmail = ''
    const updatedUsers = users.map(u => {
      if (u.dni === dni) {
        updated = true
        userEmail = u.email
        return { ...u, role: newRole }
      }
      return u
    })
    if (updated) {
      this.saveUsers(updatedUsers)
      if (firestore && userEmail) {
        updateDoc(doc(firestore, 'usuarios', userEmail.toLowerCase()), { role: newRole })
          .catch(err => console.error("Error al actualizar rol del usuario en Firestore:", err))
      }
      return true
    }
    return false
  },

  // --- INSCRIPCIÓN A EVENTOS ---
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
  isUserRegistered(userEmail, eventId) {
    const users = this.getUsers()
    const user = users.find(u => u.email === userEmail)
    if (!user) return false
    return (user.tickets || []).some(t => String(t.eventId) === String(eventId))
  },
  generateUniqueTicketCode() {
    const users = this.getUsers()
    let code = ''
    let isUnique = false
    while (!isUnique) {
      const num = Math.floor(10000 + Math.random() * 90000)
      code = `UNI150-${num}`
      
      let found = false
      for (const u of users) {
        if (u.tickets && u.tickets.some(t => t.qrCode === code)) {
          found = true
          break
        }
      }
      if (!found) {
        isUnique = true
      }
    }
    return code
  },
  registerUserToEvent(userEmail, eventId, conferencesSelected = [], companionsSelected = []) {
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

    const user = users[userIdx]
    const alreadyRegistered = (user.tickets || []).some(t => String(t.eventId) === String(eventId))
    
    if (alreadyRegistered && conferencesSelected.length === 0) {
      return { success: false, message: 'Ya estás inscrito a este evento.' }
    }

    if (!alreadyRegistered && !event.registrationOpen) {
      return { success: false, message: 'Las inscripciones para este evento están cerradas.' }
    }

    if (!alreadyRegistered && event.quota > 0) {
      const currentCount = this.getEventRegistrationCount(eventId)
      if (currentCount >= event.quota) {
        return { success: false, message: 'El aforo de este evento está completo.' }
      }
    }

    const cleanTickets = (user.tickets || []).filter(t => String(t.eventId) !== String(eventId))
    const cleanEvents = (user.registeredEvents || []).filter(e => String(e.id) !== String(eventId))

    const newTicketId = `t-${Date.now()}`
    const qrCodeContent = this.generateUniqueTicketCode()

    const ticket = {
      id: newTicketId,
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      time: event.time || '08:00 – 18:00',
      location: event.location,
      status: 'Por asistir',
      qrCode: qrCodeContent,
      conferences: conferencesSelected,
      acompanantes: companionsSelected,
      registeredAt: new Date().toISOString()
    }

    const updatedEvent = {
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time || '08:00 – 18:00',
      location: event.location,
      status: 'Confirmado',
      conferences: conferencesSelected
    }

    user.tickets = [...cleanTickets, ticket]
    user.registeredEvents = [...cleanEvents, updatedEvent]
    users[userIdx] = user
    this.saveUsers(users)

    if (firestore) {
      setDoc(doc(firestore, 'inscripciones', `${user.dni}_${eventId}`), {
        user_dni: user.dni,
        event_id: eventId,
        status: 'Registrado',
        qr_code: ticket.qrCode,
        ponencias: conferencesSelected,
        acompanantes: companionsSelected
      }).catch(err => console.error("Error al registrar/actualizar inscripción en Firestore:", err))
    }

    return { success: true, message: '¡Inscripción exitosa!', ticket }
  },
  unregisterUserFromEvent(userEmail, eventId) {
    const users = this.getUsers()
    const userIdx = users.findIndex(u => u.email === userEmail)
    if (userIdx === -1) return { success: false, message: 'Usuario no encontrado.' }

    const user = users[userIdx]
    const ticketIdx = (user.tickets || []).findIndex(t => String(t.eventId) === String(eventId))
    if (ticketIdx === -1) return { success: false, message: 'No estás inscrito a este evento.' }

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

    if (firestore) {
      deleteDoc(doc(firestore, 'inscripciones', `${user.dni}_${eventId}`))
        .catch(err => console.error("Error al eliminar inscripción en Firestore:", err))
    }

    return { success: true, message: 'Inscripción cancelada correctamente.' }
  },

  // --- CMS ---
  getCmsValue(key, defaultValue) {
    const stored = localStorage.getItem(`${CMS_KEY}_${key}`)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (err) {
        return defaultValue
      }
    }
    return defaultValue
  },

  updateCmsValue(key, value) {
    localStorage.setItem(`${CMS_KEY}_${key}`, JSON.stringify(value))
    if (firestore) {
      setDoc(doc(firestore, 'cms_paginas', key), { value })
        .catch(err => console.error(`Error al actualizar CMS para ${key} en Firestore:`, err))
    }
    return true
  }
}

// IndexedDB storage for local PDF files to prevent localStorage quota issues
const DB_NAME = 'SesquitecDB';
const DB_VERSION = 1;
const STORE_NAME = 'certificate_files';

function getIDBDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const dbInstance = e.target.result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export const idbStorage = {
  async saveFile(certId, fileBlob) {
    try {
      const dbInstance = await getIDBDatabase();
      return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(fileBlob, certId);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('IndexedDB saveFile error:', err);
      return false;
    }
  },
  async getFile(certId) {
    try {
      const dbInstance = await getIDBDatabase();
      return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(certId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('IndexedDB getFile error:', err);
      return null;
    }
  },
  async deleteFile(certId) {
    try {
      const dbInstance = await getIDBDatabase();
      return new Promise((resolve, reject) => {
        const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(certId);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('IndexedDB deleteFile error:', err);
      return false;
    }
  }
};

