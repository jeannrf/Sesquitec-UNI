import { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Award, CreditCard, ChevronRight, ChevronLeft, MapPin, Clock, Users, CheckCircle, Ticket, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { db } from '../services/db'
import { useAlert } from '../context/AlertContext'
import galaGif from '../assets/Dark Gray and White Luxury Gala Invitation (1).gif'
import brochure1 from '../assets/Copia de BROCHURE SOFTWARE WEEK 2026.png'
import brochure2 from '../assets/Copia de BROCHURE SOFTWARE WEEK 2026 (1).png'
import brochure3 from '../assets/Copia de BROCHURE SOFTWARE WEEK 2026 (2).png'

// Los eventos destacados se cargan dinámicamente desde la base de datos en el componente Home.

const stats = [
  { value: '150', label: 'Años de historia' },
  { value: '+50', label: 'Eventos programados' },
  { value: '+30', label: 'Agrupaciones participantes' },
  { value: '+10', label: 'Facultades involucradas' },
]

const modules = [
  {
    icon: <Calendar size={30} className="text-[#800404]" />,
    title: 'Cronograma de Eventos',
    desc: 'Consulta todos los eventos del año del Sesquicentenario, organizados mes a mes.',
    link: '/cronograma',
    cta: 'Ver cronograma',
  },
  {
    icon: <Users size={30} className="text-[#800404]" />,
    title: 'Inscripción y QR',
    desc: 'Regístrate a conferencias y ponencias. Recibe tu código QR de acceso al instante.',
    link: '/inscripcion',
    cta: 'Inscribirme',
  },
  {
    icon: <Award size={30} className="text-[#800404]" />,
    title: 'Mis Certificados',
    desc: 'Busca y descarga tus certificados de participación ingresando tu número de DNI.',
    link: '/certificados',
    cta: 'Buscar certificado',
  },
  {
    icon: <CreditCard size={30} className="text-[#800404]" />,
    title: 'Cena de Gala',
    desc: 'Adquiere tus entradas para la Cena de Gala de Egresados. Pago con Yape, Plin y tarjetas.',
    link: '/cena-gala',
    cta: 'Comprar entradas',
  },
]

const programaGeneral = [
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
]

const defaultPhases = [
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
]

const parseEventDate = (dateStr) => {
  const months = {
    'JULIO': 6,
    'AGOSTO': 7
  };
  const upper = dateStr.toUpperCase();
  const match = upper.match(/\b(\d+)\s+DE\s+(\w+)\b/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const monthStr = match[2];
  const month = months[monthStr];
  if (month === undefined) return null;
  return new Date(2026, month, day);
};

const getCleanDate = (dateStr) => {
  const parts = dateStr.split(/\s+/);
  if (parts.length > 1) {
    return parts.slice(1).join(' ').toLowerCase();
  }
  return dateStr.toLowerCase();
};

function EventCard({ ev, onInscribe }) {
  const bgImg = ev.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
  const isPost = ev.status === 'post' || ev.status === 'PASADO' || ev.status === 'FINALIZADO'

  return (
    <div className="event-card relative overflow-hidden cursor-pointer group h-72">
      {/* Background Cover Photo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45 z-[1] transition-opacity duration-300 group-hover:opacity-10" />

      {/* Static: status + date (visible by default) */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className={`text-[10px] font-black px-2.5 py-1 uppercase tracking-wider ${isPost ? 'bg-gray-200 text-gray-700' : 'bg-[#800404] text-white'
            }`}>
            {isPost ? 'FINALIZADO' : 'PRÓXIMO'}
          </span>
          <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 border border-white/20 font-bold uppercase tracking-wider">
            {ev.category || 'EVENTO'}
          </span>
        </div>

        {/* Title visible by default, fades on hover */}
        <div className="event-card-title">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{ev.date}</p>
          <h3 className="text-white font-black text-lg leading-tight drop-shadow-md">{ev.title}</h3>
          {ev.tags && ev.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {ev.tags.map(tag => (
                <span key={tag} className="bg-red-50 text-[#800404] text-[9px] font-bold px-1.5 py-0.5 uppercase border border-red-200/30 rounded-none tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover overlay – slides up from bottom, covering the background photo */}
      <div className="event-card-overlay absolute inset-0 z-20 bg-[#800404] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <span className="bg-white text-[#800404] text-xs font-black px-2.5 py-1 uppercase tracking-wider inline-block">
              {isPost ? 'FINALIZADO' : 'PRÓXIMO'}
            </span>
            <span className="bg-white/15 text-white text-[9px] font-bold px-2 py-0.5 border border-white/20 uppercase tracking-wider">
              {ev.category || 'EVENTO'}
            </span>
          </div>
          <h3 className="text-white font-black text-base leading-tight mb-2">{ev.title}</h3>
          {ev.tags && ev.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {ev.tags.map(tag => (
                <span key={tag} className="bg-red-50 text-[#800404] text-[9px] font-bold px-1.5 py-0.5 uppercase border border-red-200/30 rounded-none tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-white/80">
              <Calendar size={12} className="shrink-0 text-white/60" />
              <span>{ev.date}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock size={12} className="shrink-0 text-white/60" />
              <span>{ev.time || 'Ver cronograma'}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={12} className="shrink-0 text-white/60" />
              <span className="truncate">{ev.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Users size={12} className="shrink-0 text-white/60" />
              <span className="truncate">{ev.organizer}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <Link
            to="/cronograma"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-bold py-2 text-xs transition-colors border border-white/20"
          >
            Ver Evento
          </Link>
          {isPost && (
            <Link
              to="/cronograma"
              className="flex-1 text-center bg-white text-[#800404] font-black py-2 text-xs hover:bg-gray-100 transition-colors"
            >
              Ver Recap
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { user, registerForEvent, openAuth } = useAuth()
  const { showAlert } = useAlert()
  const [successModal, setSuccessModal] = useState(null)
  const navigate = useNavigate()
  const [carouselIndex, setCarouselIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [carouselBanners, setCarouselBanners] = useState(() => {
    const val = db.getCmsValue('home_slider_banners', ['', '', ''])
    const bannerList = Array.isArray(val) ? val : ['', '', '']
    return [
      bannerList[0] || brochure1,
      bannerList[1] || brochure2,
      bannerList[2] || brochure3
    ]
  })
  const slides = [carouselBanners[carouselBanners.length - 1], ...carouselBanners, carouselBanners[0]]

  const [heroPhases, setHeroPhases] = useState(() => {
    return db.getCmsValue('meet_phases', defaultPhases)
  })

  const [heroTitle, setHeroTitle] = useState(() => db.getCmsValue('home_hero_title', 'Sesquicentenario UNI 150 Años'))
  const [heroSubtitle, setHeroSubtitle] = useState(() => db.getCmsValue('home_hero_subtitle', 'Celebrando un siglo y medio de excelencia académica, científica, tecnológica y de contribución al desarrollo del Perú.'))
  
  const [dynamicStats, setDynamicStats] = useState(() => {
    const val = db.getCmsValue('home_stats', stats)
    return Array.isArray(val) ? val : stats
  })
  const [dynamicPrograma, setDynamicPrograma] = useState(() => {
    const val = db.getCmsValue('home_programa_general', programaGeneral)
    return Array.isArray(val) ? val : programaGeneral
  })

  // "¿Qué significa 150 años de la UNI?"
  const [meaningTitle, setMeaningTitle] = useState(() => db.getCmsValue('home_meaning_title', '¿Qué significa 150 años de la UNI?'))
  const [meaningP1, setMeaningP1] = useState(() => db.getCmsValue('home_meaning_p1', 'Desde 1876, la Universidad Nacional de Ingeniería (UNI) ha sido un referente en la formación de profesionales, la Investigación y la Innovación, contribuyendo de manera decisiva al progreso del país. Durante estos 150 años, la ciencia ha impulsado la generación de conocimiento, la ingeniería ha transformado desafíos en soluciones para la industria, la infraestructura y la tecnología, y la arquitectura ha promovido el diseño de espacios sostenibles que mejoran la calidad de vida.'))
  const [meaningP2, setMeaningP2] = useState(() => db.getCmsValue('home_meaning_p2', 'El legado de la UNI se refleja en miles de egresados que, con talento, ética y compromiso, lideran proyectos de alto impacto en los sectores público y privado, impulsan el desarrollo científico y tecnológico, y contribuyen a construir un Perú más competitivo y un mundo más innovador y sostenible.'))
  const [meaningInfo, setMeaningInfo] = useState(() => db.getCmsValue('home_meaning_info', 'El Sesquicentenario de la UNI conmemora 150 años de liderazgo académico, desde su fundación en 1876 por el Ing. Eduardo de Habich.'))

  // "Propuesta de la UNI para el Futuro del Perú 2026-2050"
  const [proposalTitle, setProposalTitle] = useState(() => db.getCmsValue('home_proposal_title', 'Propuesta de la UNI para el Futuro del Perú 2026-2050 –'))
  const [proposalSubtitle, setProposalSubtitle] = useState(() => db.getCmsValue('home_proposal_subtitle', 'Libro de Oro del Sesquicentenario'))
  const [proposalDescription, setProposalDescription] = useState(() => db.getCmsValue('home_proposal_description', 'El objetivo de la propuesta de libro de oro de la UNI es generar aportes académicos y técnicos sobre las perspectivas de desarrollo del país hacia el año 2050.'))

  const [proposalB1Title, setProposalB1Title] = useState(() => db.getCmsValue('home_proposal_b1_title', 'Primera Versión'))
  const [proposalB1Desc, setProposalB1Desc] = useState(() => db.getCmsValue('home_proposal_b1_desc', 'Etapa de Análisis y Diagnóstico de los 150 años de la UNI'))
  const [proposalB1Detail, setProposalB1Detail] = useState(() => db.getCmsValue('home_proposal_b1_detail', 'La Primera Versión comprende la etapa de Análisis y Diagnóstico integral de los 150 años de trayectoria de la UNI y su impacto nacional.'))

  const [proposalB2Title, setProposalB2Title] = useState(() => db.getCmsValue('home_proposal_b2_title', 'Segunda Versión'))
  const [proposalB2Desc, setProposalB2Desc] = useState(() => db.getCmsValue('home_proposal_b2_desc', 'Elaboración de propuestas de las 11 facultades UNI'))
  const [proposalB2Detail, setProposalB2Detail] = useState(() => db.getCmsValue('home_proposal_b2_detail', 'La Segunda Versión documenta la elaboración de propuestas técnicas y académicas específicas de las 11 facultades de la UNI.'))

  const [proposalB3Title, setProposalB3Title] = useState(() => db.getCmsValue('home_proposal_b3_title', 'Presentación Final'))
  const [proposalB3Desc, setProposalB3Desc] = useState(() => db.getCmsValue('home_proposal_b3_desc', 'Presentación de la Propuesta de la UNI para el desarrollo del Perú.'))
  const [proposalB3Detail, setProposalB3Detail] = useState(() => db.getCmsValue('home_proposal_b3_detail', 'La Presentación Final recopila e integra la propuesta final oficial de la UNI para el desarrollo nacional proyectado hacia el 2050.'))

  useEffect(() => {
    setHeroTitle(db.getCmsValue('home_hero_title', 'Sesquicentenario UNI 150 Años'))
    setHeroSubtitle(db.getCmsValue('home_hero_subtitle', 'Celebrando un siglo y medio de excelencia académica, científica, tecnológica y de contribución al desarrollo del Perú.'))
    setDynamicStats(db.getCmsValue('home_stats', stats))
    setDynamicPrograma(db.getCmsValue('home_programa_general', programaGeneral))

    const val = db.getCmsValue('home_slider_banners', ['', '', ''])
    const bannerList = Array.isArray(val) ? val : ['', '', '']
    setCarouselBanners([
      bannerList[0] || brochure1,
      bannerList[1] || brochure2,
      bannerList[2] || brochure3
    ])
    setHeroPhases(db.getCmsValue('meet_phases', defaultPhases))

    setMeaningTitle(db.getCmsValue('home_meaning_title', '¿Qué significa 150 años de la UNI?'))
    setMeaningP1(db.getCmsValue('home_meaning_p1', 'Desde 1876, la Universidad Nacional de Ingeniería (UNI) ha sido un referente en la formación de profesionales, la Investigación y la Innovación, contribuyendo de manera decisiva al progreso del país. Durante estos 150 años, la ciencia ha impulsado la generación de conocimiento, la ingeniería ha transformado desafíos en soluciones para la industria, la infraestructura y la tecnología, y la arquitectura ha promovido el diseño de espacios sostenibles que mejoran la calidad de vida.'))
    setMeaningP2(db.getCmsValue('home_meaning_p2', 'El legado de la UNI se refleja en miles de egresados que, con talento, ética y compromiso, lideran proyectos de alto impacto en los sectores público y privado, impulsan el desarrollo científico y tecnológico, y contribuyen a construir un Perú más competitivo y un mundo más innovador y sostenible.'))
    setMeaningInfo(db.getCmsValue('home_meaning_info', 'El Sesquicentenario de la UNI conmemora 150 años de liderazgo académico, desde su fundación en 1876 por el Ing. Eduardo de Habich.'))

    setProposalTitle(db.getCmsValue('home_proposal_title', 'Propuesta de la UNI para el Futuro del Perú 2026-2050 –'))
    setProposalSubtitle(db.getCmsValue('home_proposal_subtitle', 'Libro de Oro del Sesquicentenario'))
    setProposalDescription(db.getCmsValue('home_proposal_description', 'El objetivo de la propuesta de libro de oro de la UNI es generar aportes académicos y técnicos sobre las perspectivas de desarrollo del país hacia el año 2050.'))

    setProposalB1Title(db.getCmsValue('home_proposal_b1_title', 'Primera Versión'))
    setProposalB1Desc(db.getCmsValue('home_proposal_b1_desc', 'Etapa de Análisis y Diagnóstico de los 150 años de la UNI'))
    setProposalB1Detail(db.getCmsValue('home_proposal_b1_detail', 'La Primera Versión comprende la etapa de Análisis y Diagnóstico integral de los 150 años de trayectoria de la UNI y su impacto nacional.'))

    setProposalB2Title(db.getCmsValue('home_proposal_b2_title', 'Segunda Versión'))
    setProposalB2Desc(db.getCmsValue('home_proposal_b2_desc', 'Elaboración de propuestas de las 11 facultades UNI'))
    setProposalB2Detail(db.getCmsValue('home_proposal_b2_detail', 'La Segunda Versión documenta la elaboración de propuestas técnicas y académicas específicas de las 11 facultades de la UNI.'))

    setProposalB3Title(db.getCmsValue('home_proposal_b3_title', 'Presentación Final'))
    setProposalB3Desc(db.getCmsValue('home_proposal_b3_desc', 'Presentación de la Propuesta de la UNI para el desarrollo del Perú.'))
    setProposalB3Detail(db.getCmsValue('home_proposal_b3_detail', 'La Presentación Final recopila e integra la propuesta final oficial de la UNI para el desarrollo nacional proyectado hacia el 2050.'))
  }, [])

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCarouselIndex(prev => prev + 1)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCarouselIndex(prev => prev - 1)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (carouselIndex === 0) {
      setCarouselIndex(carouselBanners.length)
    } else if (carouselIndex === carouselBanners.length + 1) {
      setCarouselIndex(1)
    }
  }

  const handleDotClick = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCarouselIndex(index + 1)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 9000)
    return () => clearInterval(timer)
  }, [carouselIndex, isTransitioning])

  // Filtrar y ordenar actividades generales según la fecha actual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingActivities = [];
  const pastActivities = [];

  dynamicPrograma.forEach(act => {
    const eventDate = parseEventDate(act.date);
    if (!eventDate || eventDate >= today) {
      upcomingActivities.push(act);
    } else {
      pastActivities.push(act);
    }
  });

  const showDynamicTimeline = upcomingActivities.length > 0;
  const orderedActivities = showDynamicTimeline
    ? [...upcomingActivities, ...pastActivities]
    : dynamicPrograma;

  // Cargar eventos destacados desde localStorage de forma dinámica (los más próximos)
  const dbEvents = db.getEvents()
  const featuredEvents = dbEvents
    .filter(e => e.status !== 'post')
    .slice(0, 4)

  if (featuredEvents.length < 4) {
    const postEvents = dbEvents.filter(e => e.status === 'post')
    featuredEvents.push(...postEvents.slice(0, 4 - featuredEvents.length))
  }

  // Main Encuentro event object
  const mainEvent = {
    id: 1,
    title: 'Encuentro Internacional de Ingeniería UNI',
    date: '14 JUL 2026',
    location: 'Teatro UNI, Lima',
    time: '08:00 – 18:00'
  }

  const handleInscribe = (eventItem) => {
    if (!user) {
      navigate('/iniciar-sesion')
      return
    }

    const targetEvent = {
      id: eventItem.id,
      title: eventItem.title,
      date: eventItem.date,
      location: eventItem.location,
      time: eventItem.time || '08:00 – 18:00'
    }

    const res = registerForEvent(targetEvent)
    if (res.success) {
      setSuccessModal({
        title: targetEvent.title,
        ticketId: res.ticket.id
      })
    } else {
      showAlert(res.error, 'Error de Inscripción', 'error')
    }
  }

  return (
    <>
      {/* Hero + Cena de Gala */}
      <section className="bg-white px-4 py-4">
        <div className="grid lg:grid-cols-[1fr_420px] gap-3 items-stretch">
          {/* Carrusel */}
          <div className="relative overflow-hidden bg-black">
            {/* Espaciador invisible para mantener la altura natural */}
            <img src={carouselBanners[0]} alt="" className="w-full block opacity-0 pointer-events-none" aria-hidden="true" />
            
            {/* Contenedor deslizante */}
            <div 
              className={`absolute inset-0 flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : 'transition-none'}`}
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((img, i) => (
                <div key={i} className="w-full h-full shrink-0 overflow-hidden">
                  <img
                    src={img}
                    alt={`Banner ${i}`}
                    className="w-full h-full object-cover scale-[1.02]"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white p-2 transition-colors cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white p-2 transition-colors cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {carouselBanners.map((_, i) => {
                const activeDotIndex = (carouselIndex - 1 + carouselBanners.length) % carouselBanners.length
                return (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className={`w-2.5 h-2.5 min-h-0 rounded-full transition-colors cursor-pointer border-0 ${i === activeDotIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Actividades de Septiembre (Columna Derecha) */}
          <div className="flex flex-col gap-2.5 justify-between h-full min-w-0">
            {/* Card 1: Encuentro Internacional */}
            <Link 
              to="/cronograma?filtro=conferencias" 
              className="relative overflow-hidden group flex-1 h-[120px] lg:h-auto min-h-[110px] border border-gray-150 flex flex-col justify-end p-4 text-white shadow-sm"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-115"
                style={{ backgroundImage: `url('${heroPhases[0]?.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[9px] bg-[#800404] text-white font-black px-2 py-0.5 uppercase tracking-wider inline-block">
                  {heroPhases[0]?.date || '7 - 11 Sep'}
                </span>
                <h4 className="font-black text-sm mt-1 leading-tight group-hover:text-red-200 transition-colors uppercase tracking-wide">
                  {heroPhases[0]?.title || 'Encuentro Internacional'}
                </h4>
                <p className="text-[10px] text-gray-305">{heroPhases[0]?.badge || 'Conferencias Magistrales'}</p>
              </div>
            </Link>

            {/* Card 2: Feria Tecnológica */}
            <Link 
              to="/cronograma?filtro=feria" 
              className="relative overflow-hidden group flex-1 h-[120px] lg:h-auto min-h-[110px] border border-gray-150 flex flex-col justify-end p-4 text-white shadow-sm"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-115"
                style={{ backgroundImage: `url('${heroPhases[1]?.imageUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[9px] bg-[#800404] text-white font-black px-2 py-0.5 uppercase tracking-wider inline-block">
                  {heroPhases[1]?.date || '7 - 11 Sep'}
                </span>
                <h4 className="font-black text-sm mt-1 leading-tight group-hover:text-red-200 transition-colors uppercase tracking-wide">
                  {heroPhases[1]?.title || 'Feria Tecnológica'}
                </h4>
                <p className="text-[10px] text-gray-305">{heroPhases[1]?.badge || 'Exposición Internacional'}</p>
              </div>
            </Link>

            {/* Card 3: Cena de Reconocimiento */}
            <Link 
              to="/cena-gala" 
              className="relative overflow-hidden group flex-1 h-[120px] lg:h-auto min-h-[110px] border border-[#d4af37]/35 flex flex-col justify-end p-4 text-white shadow-sm"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-115"
                style={{ backgroundImage: `url('${heroPhases[2]?.imageUrl || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[9px] bg-[#d4af37] text-black font-black px-2 py-0.5 uppercase tracking-wider inline-block">
                  {heroPhases[2]?.date || '12 Sep'}
                </span>
                <h4 className="font-black text-sm mt-1 leading-tight text-[#d4af37] group-hover:text-white transition-colors uppercase tracking-wide">
                  {heroPhases[2]?.title || 'Cena de Reconocimiento'}
                </h4>
                <p className="text-[10px] text-gray-305">{heroPhases[2]?.badge || 'Homenaje del Sesquicentenario'}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dynamicStats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-[#800404]">{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured events */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Eventos Destacados</h2>
            <Link to="/cronograma" className="text-[#800404] text-sm font-bold flex items-center gap-1 hover:underline bg-white px-3 py-1.5 shrink-0">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {featuredEvents.map(ev => (
              <EventCard key={ev.id} ev={ev} onInscribe={handleInscribe} />
            ))}
          </div>
        </div>
      </section>

      {/* Qué significa 150 años de la UNI */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
              {meaningTitle}
            </h2>
            <div className="text-sm text-gray-605 space-y-4 leading-relaxed font-sans font-medium">
              <p>
                {meaningP1}
              </p>
              <p>
                {meaningP2}
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => showAlert(meaningInfo, 'Significado de los 150 Años', 'info')}
                className="text-[#800404] hover:text-[#5a0303] text-xs font-black tracking-wide uppercase flex items-center gap-1 group hover:underline cursor-pointer"
              >
                + Información <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 relative group">
            <div className="absolute inset-0 bg-[#800404] translate-x-3 translate-y-3 z-0" />
            <div className="relative z-10 overflow-hidden border border-gray-250 bg-white">
              <img 
                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=800" 
                alt="150 Años de la UNI" 
                className="w-full h-80 object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Propuesta de la UNI para el Futuro del Perú 2026-2050 */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header area of Propuesta */}
          <div className="grid md:grid-cols-12 gap-8 items-start mb-16">
            <div className="md:col-span-6">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {proposalTitle}
              </h2>
              <h3 className="text-lg font-black text-[#800404] uppercase tracking-wider mt-2">
                {proposalSubtitle}
              </h3>
            </div>
            <div className="md:col-span-6 md:border-l-2 md:border-gray-250 md:pl-8 pt-2">
              <p className="text-sm text-gray-550 leading-relaxed font-sans font-medium">
                {proposalDescription}
              </p>
            </div>
          </div>

          {/* Grid of Books */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            {/* Book 1: Primera Versión */}
            <div className="flex flex-col items-center group">
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-5 max-w-[280px]">
                <img 
                  src="/home/propuestaUNI/libro-primera-version.png" 
                  alt="Primera Versión" 
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-center space-y-2 max-w-[280px] flex flex-col items-center">
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{proposalB1Title}</h4>
                <p className="text-sm text-gray-600 leading-snug">{proposalB1Desc}</p>
                <button 
                  onClick={() => showAlert(proposalB1Detail, `${proposalB1Title} - Libro de Oro`, 'info')}
                  className="w-full max-w-[200px] py-2.5 border border-[#800404] text-[#800404] hover:bg-[#800404] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors duration-300 mt-3 cursor-pointer text-center"
                >
                  Más información
                </button>
              </div>
            </div>

            {/* Book 2: Segunda Versión */}
            <div className="flex flex-col items-center group">
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-5 max-w-[280px]">
                <img 
                  src="/home/propuestaUNI/libro-segunda-version.png" 
                  alt="Segunda Versión" 
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-center space-y-2 max-w-[280px] flex flex-col items-center">
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{proposalB2Title}</h4>
                <p className="text-sm text-gray-600 leading-snug">{proposalB2Desc}</p>
                <button 
                  onClick={() => showAlert(proposalB2Detail, `${proposalB2Title} - Libro de Oro`, 'info')}
                  className="w-full max-w-[200px] py-2.5 border border-[#800404] text-[#800404] hover:bg-[#800404] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors duration-300 mt-3 cursor-pointer text-center"
                >
                  Más información
                </button>
              </div>
            </div>

            {/* Book 3: Presentación Final */}
            <div className="flex flex-col items-center group">
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-5 max-w-[280px]">
                <img 
                  src="/home/propuestaUNI/libro-presentacion-final.png" 
                  alt="Presentación Final" 
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-center space-y-2 max-w-[280px] flex flex-col items-center">
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{proposalB3Title}</h4>
                <p className="text-sm text-gray-600 leading-snug">{proposalB3Desc}</p>
                <button 
                  onClick={() => showAlert(proposalB3Detail, `${proposalB3Title} - Libro de Oro`, 'info')}
                  className="w-full max-w-[200px] py-2.5 border border-[#800404] text-[#800404] hover:bg-[#800404] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors duration-300 mt-3 cursor-pointer text-center"
                >
                  Más información
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programa General de Actividades (Timeline) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Programa General de Actividades</h2>
            <p className="text-sm text-[#800404] uppercase font-black tracking-widest mt-2">
              {showDynamicTimeline && upcomingActivities.length > 0 ? (
                `Del ${getCleanDate(upcomingActivities[0].date)} al ${getCleanDate(upcomingActivities[upcomingActivities.length - 1].date)}`
              ) : (
                'Del 2 de Julio al 3 de Agosto'
              )}
            </p>
          </div>

          <div className="relative border-l border-red-250 ml-4 md:ml-32 space-y-8">
            {(showAllActivities ? orderedActivities : orderedActivities.slice(0, 6)).map((act, i) => {
              // Extract date items
              const dateParts = act.date.split(' DE ');
              const dayStr = dateParts[0]; // e.g. "JUEVES 2" or "VIERNES 3"
              const monthStr = dateParts[1]; // e.g. "JULIO" or "AGOSTO"
              const dayNum = dayStr.match(/\d+/)?.[0] || '';
              const weekDay = dayStr.replace(dayNum, '').trim();

              const eventDate = parseEventDate(act.date);
              const isPast = showDynamicTimeline && eventDate && eventDate < today;
              const isFirstPast = showDynamicTimeline && pastActivities.length > 0 && act === pastActivities[0];

              return (
                <Fragment key={i}>
                  {isFirstPast && (
                    <div className="relative pl-6 py-2">
                      {/* Gray node for separator */}
                      <div className="absolute -left-[6.5px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-300 border-2 border-white z-10" />
                      <div className="flex items-center gap-4">
                        <span className="shrink-0 text-xs font-black text-gray-400 uppercase tracking-widest">
                          Actividades Realizadas
                        </span>
                        <div className="flex-1 border-t border-dashed border-gray-300" />
                      </div>
                    </div>
                  )}

                  <div className={`relative pl-6 group ${isPast ? 'opacity-65 hover:opacity-100 transition-opacity duration-200' : ''}`}>
                    {/* Timeline node */}
                    <div className={`absolute -left-[6.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white group-hover:scale-125 transition-transform duration-200 z-10 ${
                      isPast ? 'bg-gray-300' : 'bg-[#800404]'
                    }`} />

                    {/* Left Date indicator for large screens */}
                    <div className="md:absolute md:-left-32 md:top-0 md:w-24 md:text-right hidden md:block">
                      <p className={`text-xl font-black leading-none ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>{dayNum}</p>
                      <p className={`text-[10px] uppercase font-black mt-0.5 ${isPast ? 'text-gray-400' : 'text-[#800404]'}`}>{monthStr?.slice(0, 3)}</p>
                      <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">{weekDay}</p>
                    </div>

                    {/* Main Card */}
                    <div className={`bg-white border p-5 shadow-sm transition-all hover:shadow-md rounded-none ${
                      isPast ? 'border-gray-200 hover:border-gray-300' : 'border-gray-200 hover:border-[#800404]'
                    }`}>
                      {/* Mobile Date Header */}
                      <div className={`md:hidden block mb-2 text-xs font-black uppercase tracking-wider ${isPast ? 'text-gray-400' : 'text-[#800404]'}`}>
                        {act.date}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Clock size={11} className={isPast ? 'text-gray-400' : 'text-[#800404]'} /> {act.time}</span>
                        <span className="flex items-start gap-1.5 max-w-full sm:max-w-sm" title={act.location}><MapPin size={11} className={`shrink-0 mt-0.5 ${isPast ? 'text-gray-400' : 'text-[#800404]'}`} /> <span className="break-words">{act.location}</span></span>
                      </div>

                      <h4 className={`font-bold text-sm leading-relaxed transition-colors ${
                        isPast ? 'text-gray-500 group-hover:text-gray-700' : 'text-gray-800 group-hover:text-[#800404]'
                      }`}>
                        {act.title}
                      </h4>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>

          {/* Toggle Button */}
          {orderedActivities.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="bg-[#800404] hover:bg-[#5a0303] text-white font-black text-xs px-6 py-3.5 transition-colors uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 shadow-sm active:scale-95 rounded-none"
              >
                {showAllActivities ? 'Ver Menos Actividades' : 'Ver Todas las Actividades'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SUCCESS CONFIRMATION MODAL OVERLAY */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md border border-gray-200 shadow-2xl rounded-none text-center overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 bg-[#800404]" />
            <div className="p-8">
              <div className="flex justify-end">
                <button
                  onClick={() => setSuccessModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="w-16 h-16 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-5 text-green-600">
                <CheckCircle size={32} />
              </div>

              <h2 className="text-xl font-black text-gray-900 mb-1">¡Inscripción Exitosa!</h2>
              <p className="text-xs text-gray-400 mb-4">Se ha completado tu registro en el sistema de la UNI</p>

              <div className="bg-gray-50 border border-gray-200 p-4 text-left text-xs mb-6">
                <p className="font-bold text-gray-700 mb-1.5">Detalles del pase:</p>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Evento:</strong> {successModal.title}</p>
                  <p><strong>Código Ticket:</strong> {successModal.ticketId}</p>
                  <p className="text-[#800404] font-semibold mt-1">✓ Tu código QR ha sido vinculado a tu DNI: {user.dni}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSuccessModal(null); navigate('/dashboard?tab=entradas') }}
                  className="flex-1 bg-[#800404] hover:bg-[#5a0303] text-white py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Ticket size={13} />
                  Ver mi entrada QR
                </button>
                <button
                  onClick={() => setSuccessModal(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 text-xs font-bold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
