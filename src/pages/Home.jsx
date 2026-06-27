import { useState, useEffect } from 'react'
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

const upcomingConferences = [
  { id: 'c1', time: '09:00', title: 'Inteligencia Artificial en la Ingeniería Peruana', speaker: 'Dr. Roberto Vargas', room: 'Auditorium A' },
  { id: 'c3', time: '11:00', title: 'Infraestructura Sostenible para el Siglo XXI', speaker: 'Mg. Carmen Flores', room: 'Auditorium B' },
  { id: 'c8', time: '14:00', title: 'Innovación y Emprendimiento Tecnológico', speaker: 'Ing. Luis Mendoza', room: 'Aula Magna' },
  { id: 'c7', time: '16:30', title: 'Energías Renovables en el Perú', speaker: 'Dr. Ana Torres', room: 'Auditorium C' },
]

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
  const banners = [brochure1, brochure2, brochure3]

  useEffect(() => {
    const timer = setInterval(() => setCarouselIndex(i => (i + 1) % banners.length), 9000)
    return () => clearInterval(timer)
  }, [])

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
            <img src={banners[carouselIndex]} alt="" className="w-full block opacity-0 pointer-events-none" aria-hidden="true" />
            {banners.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Banner ${i + 1}`}
                className={`absolute top-0 left-0 w-full scale-[1.02] transition-opacity duration-1000 ease-in-out ${i === carouselIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}

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

          {/* Cena de Gala panel */}
          <Link to="/cena-gala" className="block overflow-hidden">
            <img src={galaGif} alt="Cena de Gala" className="w-full h-full object-cover" />
          </Link>
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

      {/* Upcoming conferences */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Próximas Conferencias</h2>
              <p className="text-gray-500 mt-1">Encuentro Internacional · 14 Jul 2026</p>
            </div>
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
              </div>
            ))}
          </div>
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
