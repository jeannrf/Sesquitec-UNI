import { Link } from 'react-router-dom'
import { Calendar, Award, CreditCard, ChevronRight, MapPin, Clock, Users } from 'lucide-react'
import banner from '../assets/banner.jpg'
import logo from '../assets/logo.png'

const featuredEvents = [
  {
    id: 1,
    status: 'PRÓXIMO',
    date: '14 JUL 2026',
    title: 'Encuentro Internacional de Ingeniería UNI',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Teatro UNI, Lima',
    time: '08:00 – 18:00',
    category: 'Académico',
    bg: 'bg-gradient-to-br from-[#800404] to-[#5a0303]',
  },
  {
    id: 2,
    status: 'PRÓXIMO',
    date: '22 AGO 2026',
    title: 'Cena de Gala de Egresados',
    organizer: 'Comisión del Sesquicentenario',
    location: 'Gran Hotel Bolívar, Lima',
    time: '19:00 – 23:00',
    category: 'Egresados',
    bg: 'bg-gradient-to-br from-gray-800 to-gray-600',
  },
  {
    id: 3,
    status: 'ACTUAL',
    date: '01 JUN – 30 NOV 2026',
    title: 'Exposición Histórica: 150 Años de Ingeniería',
    organizer: 'Facultad de Ciencias',
    location: 'Campus UNI, Lima',
    time: 'Todo el año',
    category: 'Cultural',
    bg: 'bg-gradient-to-br from-[#3a0202] to-[#800404]',
  },
  {
    id: 4,
    status: 'PRÓXIMO',
    date: '15 SEP 2026',
    title: 'Feria de Empleo UNI 2026',
    organizer: 'Bienestar Universitario',
    location: 'Pabellón Central, UNI',
    time: '09:00 – 14:00',
    category: 'Laboral',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-700',
  },
]

const stats = [
  { value: '150', label: 'Años de historia' },
  { value: '47', label: 'Eventos programados' },
  { value: '9,000+', label: 'Participantes esperados' },
  { value: '10', label: 'Facultades participantes' },
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

const upcomingConferences = [
  { time: '09:00', title: 'Inteligencia Artificial en la Ingeniería Peruana', speaker: 'Dr. Roberto Vargas', room: 'Auditorium A' },
  { time: '11:00', title: 'Infraestructura Sostenible para el Siglo XXI', speaker: 'Mg. Carmen Flores', room: 'Auditorium B' },
  { time: '14:00', title: 'Innovación y Emprendimiento Tecnológico', speaker: 'Ing. Luis Mendoza', room: 'Aula Magna' },
  { time: '16:30', title: 'Energías Renovables en el Perú', speaker: 'Dr. Ana Torres', room: 'Auditorium C' },
]

function EventCard({ ev }) {
  return (
    <div className="event-card relative overflow-hidden cursor-pointer group h-72">
      {/* Background */}
      <div className={`absolute inset-0 ${ev.bg}`} />

      {/* Static: status + date (visible by default) */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="bg-white text-[#800404] text-xs font-black px-2.5 py-1 uppercase tracking-wider">
            {ev.status}
          </span>
          <span className="text-xs text-white/70 font-bold uppercase tracking-wider">{ev.category}</span>
        </div>

        {/* Title visible by default, fades on hover */}
        <div className="event-card-title">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{ev.date}</p>
          <h3 className="text-white font-black text-xl leading-tight">{ev.title}</h3>
        </div>
      </div>

      {/* Hover overlay – slides up from bottom */}
      <div className="event-card-overlay absolute inset-0 z-20 bg-[#800404] p-5 flex flex-col justify-between">
        <div>
          <span className="bg-white text-[#800404] text-xs font-black px-2.5 py-1 uppercase tracking-wider inline-block mb-4">
            {ev.status}
          </span>
          <h3 className="text-white font-black text-lg leading-tight mb-4">{ev.title}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={14} className="shrink-0 text-white/60" />
              <span>{ev.date}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} className="shrink-0 text-white/60" />
              <span>{ev.time}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin size={14} className="shrink-0 text-white/60" />
              <span>{ev.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users size={14} className="shrink-0 text-white/60" />
              <span>{ev.organizer}</span>
            </div>
          </div>
        </div>
        <Link
          to="/cronograma"
          className="block w-full text-center bg-white text-[#800404] font-black py-2.5 text-sm hover:bg-gray-100 transition-colors mt-4"
        >
          Ver detalles →
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative text-white overflow-hidden min-h-[560px] flex items-center">
        {/* Banner como fondo real */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* Overlay degradado: oscuro en la mitad derecha para leer el texto del card */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            {/* Logo del Sesquicentenario sobre el hero */}
            <img
              src={logo}
              alt="150 Años UNI"
              className="h-24 w-auto object-contain mb-6"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Participa en los eventos académicos, culturales y sociales de este hito histórico en la Universidad Nacional de Ingeniería.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/cronograma"
                className="bg-white text-[#800404] font-black px-6 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
              >
                Ver todos los eventos <ChevronRight size={16} />
              </Link>
              <Link
                to="/inscripcion"
                className="bg-[#800404] border-2 border-[#800404] text-white font-black px-6 py-3 hover:bg-[#5a0303] transition-colors text-sm"
              >
                Inscribirme
              </Link>
            </div>
          </div>

          {/* Featured card */}
          <div className="hidden lg:block">
            <div className="bg-black/50 backdrop-blur-sm border border-white/20 p-6">
              <p className="text-white/50 text-xs font-black uppercase tracking-widest mb-4">Próximo evento destacado</p>
              <h3 className="text-white text-xl font-black mb-4 leading-tight">Encuentro Internacional de Ingeniería</h3>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Calendar size={14} />
                  <span>14 de Julio, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin size={14} />
                  <span>Teatro UNI, Lima</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock size={14} />
                  <span>08:00 – 18:00 hrs</span>
                </div>
              </div>
              <div className="border-t border-white/20 pt-5">
                <p className="text-sm text-white/50 mb-3">10 conferencias disponibles</p>
                <Link
                  to="/inscripcion"
                  className="block w-full text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                >
                  Inscribirme ahora
                </Link>
              </div>
            </div>
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

      {/* Featured events – Olympics style cards with hover */}
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
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      </section>

      {/* Main modules */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">¿Qué puedes hacer aquí?</h2>
            <p className="text-gray-500">Todo lo que necesitas para participar en el Sesquicentenario</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map(m => (
              <div key={m.title} className="bg-white border border-gray-200 p-6 hover:border-[#800404] hover:shadow-lg transition-all group">
                <div className="mb-4">{m.icon}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{m.title}</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{m.desc}</p>
                <Link
                  to={m.link}
                  className="text-sm font-bold text-[#800404] flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {m.cta} <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming conferences */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Próximas Conferencias</h2>
              <p className="text-gray-500 mt-1">Encuentro Internacional · 14 Jul 2026</p>
            </div>
            <Link
              to="/inscripcion"
              className="bg-[#800404] text-white font-bold px-5 py-2 text-sm hover:bg-[#5a0303] transition-colors"
            >
              Inscribirme
            </Link>
          </div>
          <div className="divide-y divide-gray-200 bg-white border border-gray-200">
            {upcomingConferences.map((c, i) => (
              <div key={i} className="flex items-center gap-6 py-4 px-5 hover:bg-red-50 transition-colors group">
                <div className="w-16 shrink-0 text-center">
                  <span className="text-lg font-black text-[#800404]">{c.time}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-[#800404] transition-colors">{c.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{c.speaker}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-sm shrink-0">
                  <MapPin size={14} />
                  {c.room}
                </div>
                <Link
                  to="/inscripcion"
                  className="shrink-0 border border-[#800404] text-[#800404] text-xs font-bold px-3 py-1.5 hover:bg-[#800404] hover:text-white transition-colors"
                >
                  Asistir
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Gala */}
      <section className="py-16 bg-[#800404]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-white/60 font-bold text-sm uppercase tracking-widest mb-2">Evento exclusivo para egresados</p>
            <h2 className="text-4xl font-black text-white mb-3">Cena de Gala · 22 AGO 2026</h2>
            <p className="text-white/80 max-w-xl">
              Celebra el Sesquicentenario en una velada especial junto a egresados y autoridades de la UNI. Cupos limitados.
            </p>
          </div>
          <Link
            to="/cena-gala"
            className="shrink-0 bg-white text-[#800404] font-black px-8 py-4 hover:bg-gray-100 transition-colors text-lg"
          >
            Adquirir entradas
          </Link>
        </div>
      </section>
    </>
  )
}
