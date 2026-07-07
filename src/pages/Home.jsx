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
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [showAllActivities, setShowAllActivities] = useState(false)
  const banners = [brochure1, brochure2, brochure3]

  useEffect(() => {
    const timer = setInterval(() => setCarouselIndex(i => (i + 1) % banners.length), 9000)
    return () => clearInterval(timer)
  }, [])

  // Filtrar y ordenar actividades generales según la fecha actual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingActivities = [];
  const pastActivities = [];

  programaGeneral.forEach(act => {
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
    : programaGeneral;

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
            <img src={banners[0]} alt="" className="w-full block opacity-0 pointer-events-none" aria-hidden="true" />
            
            {/* Contenedor deslizante */}
            <div 
              className="absolute inset-0 flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {banners.map((img, i) => (
                <div key={i} className="w-full h-full shrink-0 overflow-hidden">
                  <img
                    src={img}
                    alt={`Banner ${i + 1}`}
                    className="w-full h-full object-cover scale-[1.02]"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setCarouselIndex(i => (i - 1 + banners.length) % banners.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white p-2 transition-colors cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => setCarouselIndex(i => (i + 1) % banners.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white p-2 transition-colors cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer border-0 ${i === carouselIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
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
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[9px] bg-[#800404] text-white font-black px-2 py-0.5 uppercase tracking-wider inline-block">
                  7 - 11 Sep
                </span>
                <h4 className="font-black text-sm mt-1 leading-tight group-hover:text-red-200 transition-colors uppercase tracking-wide">
                  Encuentro Internacional
                </h4>
                <p className="text-[10px] text-gray-305">Conferencias Magistrales UNI</p>
              </div>
            </Link>

            {/* Card 2: Feria Tecnológica */}
            <Link 
              to="/cronograma?filtro=feria" 
              className="relative overflow-hidden group flex-1 h-[120px] lg:h-auto min-h-[110px] border border-gray-150 flex flex-col justify-end p-4 text-white shadow-sm"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-115"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[9px] bg-[#800404] text-white font-black px-2 py-0.5 uppercase tracking-wider inline-block">
                  7 - 11 Sep
                </span>
                <h4 className="font-black text-sm mt-1 leading-tight group-hover:text-red-200 transition-colors uppercase tracking-wide">
                  Feria Tecnológica
                </h4>
                <p className="text-[10px] text-gray-305">Innovación y Exposición Internacional</p>
              </div>
            </Link>

            {/* Card 3: Cena de Reconocimiento */}
            <Link 
              to="/cena-gala" 
              className="relative overflow-hidden group flex-1 h-[120px] lg:h-auto min-h-[110px] border border-[#d4af37]/35 flex flex-col justify-end p-4 text-white shadow-sm"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-115"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[9px] bg-[#d4af37] text-black font-black px-2 py-0.5 uppercase tracking-wider inline-block">
                  12 Sep
                </span>
                <h4 className="font-black text-sm mt-1 leading-tight text-[#d4af37] group-hover:text-white transition-colors uppercase tracking-wide">
                  Cena de Reconocimiento
                </h4>
                <p className="text-[10px] text-gray-305">Homenaje del Sesquicentenario</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-[#800404]">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured events */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white">Eventos Destacados</h2>
            <Link to="/cronograma" className="text-[#800404] text-sm font-bold flex items-center gap-1 hover:underline bg-white px-3 py-1.5">
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
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
              ¿Qué significa 150 años de la UNI?
            </h2>
            <div className="text-sm text-gray-605 space-y-4 leading-relaxed font-sans font-medium">
              <p>
                Un siglo y medio de excelencia al servicio de la ciencia, la ingeniería, la arquitectura y el desarrollo del Perú.
              </p>
              <p>
                <strong>Desde 1876, la Universidad Nacional de Ingeniería (UNI)</strong> ha sido un referente en la formación de profesionales, la Investigación y la Innovación, contribuyendo de manera decisiva al progreso del país. Durante estos 150 años, la ciencia ha impulsado la generación de conocimiento, la ingeniería ha transformado desafíos en soluciones para la industria, la infraestructura y la tecnología, y la arquitectura ha promovido el diseño de espacios sostenibles que mejoran la calidad de vida.
              </p>
              <p>
                El legado de la UNI se refleja en miles de egresados que, con talento, ética y compromiso, lideran proyectos de alto impacto en los sectores público y privado, impulsan el desarrollo científico y tecnológico, y contribuyen a construir un Perú más competitivo y un mundo más innovador y sostenible.
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => showAlert('El Sesquicentenario de la UNI conmemora 150 años de liderazgo académico, desde su fundación en 1876 por el Ing. Eduardo de Habich.', 'Significado de los 150 Años', 'info')}
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
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                Propuesta de la UNI para el Futuro del Perú 2026-2050 –
              </h2>
              <h3 className="text-lg font-black text-[#800404] uppercase tracking-wider mt-2">
                Libro de Oro del Sesquicentenario
              </h3>
            </div>
            <div className="md:col-span-6 md:border-l-2 md:border-gray-250 md:pl-8 pt-2">
              <p className="text-sm text-gray-505 leading-relaxed font-sans font-medium">
                El objetivo de la propuesta de libro de oro de la UNI es generar aportes académicos y técnicos sobre las perspectivas de desarrollo del país hacia el año 2050.
              </p>
            </div>
          </div>

          {/* Grid of Books */}
          <div className="grid sm:grid-cols-3 gap-12 max-w-5xl mx-auto">
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
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">Primera Versión</h4>
                <p className="text-sm text-gray-600 leading-snug">Etapa de Análisis y Diagnóstico de los 150 años de la UNI</p>
                <button 
                  onClick={() => showAlert('La Primera Versión comprende la etapa de Análisis y Diagnóstico integral de los 150 años de trayectoria de la UNI y su impacto nacional.', 'Primera Versión - Libro de Oro', 'info')}
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
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">Segunda Versión</h4>
                <p className="text-sm text-gray-600 leading-snug">Elaboración de propuestas de las 11 facultades UNI</p>
                <button 
                  onClick={() => showAlert('La Segunda Versión documenta la elaboración de propuestas técnicas y académicas específicas de las 11 facultades de la UNI.', 'Segunda Versión - Libro de Oro', 'info')}
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
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">Presentación Final</h4>
                <p className="text-sm text-gray-600 leading-snug">Presentación de la Propuesta de la UNI para el desarrollo del Perú.</p>
                <button 
                  onClick={() => showAlert('La Presentación Final recopila e integra la propuesta final oficial de la UNI para el desarrollo nacional proyectado hacia el 2050.', 'Presentación Final - Libro de Oro', 'info')}
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
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Programa General de Actividades</h2>
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
                        <span className="flex items-center gap-1.5 max-w-sm truncate" title={act.location}><MapPin size={11} className={isPast ? 'text-gray-400' : 'text-[#800404]'} /> {act.location}</span>
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
