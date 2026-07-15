import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, Award, ChevronRight, Star, Globe, Cpu, Utensils, ExternalLink, CheckCircle, UserPlus } from 'lucide-react'
import { db } from '../services/db'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

const speakers = [
  { name: 'Dr. Kenji Tanaka', org: 'University of Tokyo', topic: 'Inteligencia Artificial y Ciudades Inteligentes', country: 'Japón', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  { name: 'Dra. Elena Rodríguez', org: 'MIT - Massachusetts Institute of Technology', topic: 'Infraestructura Resiliente ante el Cambio Climático', country: 'EE.UU.', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
  { name: 'Dr. Hans Weber', org: 'ETH Zurich', topic: 'Ingeniería de Materiales Avanzados', country: 'Suiza', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
  { name: 'Ing. Priya Sharma', org: 'Indian Institute of Technology Delhi', topic: 'Energía Solar a Gran Escala', country: 'India', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
  { name: 'Dr. Roberto Vargas', org: 'Universidad Nacional de Ingeniería', topic: 'IA en la Ingeniería Peruana', country: 'Perú', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300' },
  { name: 'Dra. Ana Müller', org: 'Technische Universität München', topic: 'Robótica Industrial y Manufactura', country: 'Alemania', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300' },
]

const phases = [
  {
    id: 'sep1',
    icon: <Globe size={24} />,
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
    icon: <Cpu size={24} />,
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
    icon: <Utensils size={24} />,
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

function PhaseActionSection({ phase }) {
  const { user, openAuth } = useAuth()
  const { showAlert } = useAlert()
  const [isRegistering, setIsRegistering] = useState(false)
  const navigate = useNavigate()

  const registrationCount = db.getEventRegistrationCount(phase.id)
  const isRegistered = user ? db.isUserRegistered(user.email, phase.id) : false
  const isFull = phase.quota > 0 && registrationCount >= phase.quota

  const handleRegister = () => {
    if (!user) {
      navigate('/iniciar-sesion?redirect=/encuentro-internacional')
      return
    }
    setIsRegistering(true)
    setTimeout(() => {
      const result = db.registerUserToEvent(user.email, phase.id)
      setIsRegistering(false)
      if (result.success) {
        showAlert(result.message, 'Inscripción Exitosa', 'success')
      } else {
        showAlert(result.message, 'Error', 'warning')
      }
    }, 400)
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
      {/* Aforo bar */}
      {phase.quota > 0 && (
        <div className="flex-grow max-w-md">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Aforo</span>
            <span className="text-[10px] font-black text-gray-600">{registrationCount} / {phase.quota}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFull ? 'bg-red-500' : registrationCount / phase.quota > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min((registrationCount / phase.quota) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Button */}
      <div className="shrink-0 min-w-[220px]">
        {isRegistered ? (
          <button disabled className="w-full bg-emerald-50 text-emerald-700 font-black py-3 px-6 text-sm border border-emerald-200 flex items-center justify-center gap-2 cursor-default rounded-none">
            <CheckCircle size={16} /> Ya estás inscrito
          </button>
        ) : isFull ? (
          <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-3 px-6 text-sm border border-gray-200 cursor-not-allowed rounded-none">
            Aforo Completo
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className={`w-full font-black py-3 px-6 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 rounded-none ${
              phase.isPaid
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white'
                : 'bg-[#800404] hover:bg-[#5a0303] text-white'
            }`}
          >
            {isRegistering ? (
              <span className="animate-pulse">Procesando...</span>
            ) : phase.isPaid ? (
              <>Reservar Entrada · {phase.price}</>
            ) : (
              <><UserPlus size={14} /> Inscribirse Gratis</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

const getPhaseIcon = (id) => {
  switch (id) {
    case 'sep1': return <Globe size={24} />;
    case 'sep2': return <Cpu size={24} />;
    case 'sep3': return <Utensils size={24} />;
    default: return <Globe size={24} />;
  }
}

export default function EncuentroInternacional() {
  const [activePhaseId, setActivePhaseId] = useState('sep1')
  const [dynamicSpeakers, setDynamicSpeakers] = useState(() => {
    const val = db.getCmsValue('meet_speakers', speakers)
    const list = Array.isArray(val) ? val : speakers
    return list.map(s => ({
      ...s,
      country: s.country ? s.country.replace(/[\uD83C-\uD83E][\uDC00-\uDFFF]/g, '').trim().slice(0, 20) : ''
    }))
  })
  const [dynamicPhases, setDynamicPhases] = useState(() => {
    const val = db.getCmsValue('meet_phases', phases)
    return Array.isArray(val) ? val : phases
  })

  useEffect(() => {
    const sp = db.getCmsValue('meet_speakers', speakers)
    const list = Array.isArray(sp) ? sp : speakers
    setDynamicSpeakers(list.map(s => ({
      ...s,
      country: s.country ? s.country.replace(/[\uD83C-\uD83E][\uDC00-\uDFFF]/g, '').trim().slice(0, 20) : ''
    })))
    const ph = db.getCmsValue('meet_phases', phases)
    setDynamicPhases(Array.isArray(ph) ? ph : phases)
  }, [])

  const activePhase = (Array.isArray(dynamicPhases) ? dynamicPhases : phases).find(p => p.id === activePhaseId) || phases[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-[#800404] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/encuentro-internacional/sesquitec-imagen.png')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#800404]/80 to-[#3a0202]" />

        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              Encuentro Internacional
              <br />
              <span className="text-white/70">del Sesquicentenario</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
              Tres días de conferencias magistrales, tecnología de vanguardia y celebración. El evento académico más importante del Sesquicentenario de la Universidad Nacional de Ingeniería.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar size={16} className="text-white/50" />
                <span className="text-sm font-bold">08 – 12 Sep 2026</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={16} className="text-white/50" />
                <span className="text-sm font-bold">Campus UNI, Lima</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-0 overflow-x-auto scrollbar-hide">
          {dynamicPhases.map((p, i) => {
            const isActive = p.id === activePhaseId
            const isLast = i === dynamicPhases.length - 1
            return (
              <button
                key={p.id}
                onClick={() => setActivePhaseId(p.id)}
                className={`py-3 sm:py-4 px-2 md:px-4 flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer focus:outline-none w-full shrink-0 ${
                  isActive
                    ? 'text-[#800404] border-[#800404] bg-gray-100'
                    : 'text-gray-500 border-transparent hover:text-[#800404] hover:bg-gray-50/70'
                }`}
              >
                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black transition-colors rounded-full shrink-0 ${
                  isActive ? 'bg-[#800404] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <span>
                  <span className="inline md:hidden">{p.title.split(' ')[0]}</span>
                  <span className="hidden md:inline">{p.title}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Single Large Card */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Large Card Container */}
        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden md:grid md:grid-cols-12 rounded-xl transition-all duration-300">
          {/* Left Column: Image */}
          <div className="md:col-span-5 relative min-h-[200px] sm:min-h-[260px] md:min-h-[400px]">
            <img 
              src={activePhase.imageUrl} 
              alt={activePhase.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Top color bar indicating status/phase color */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#800404] to-[#b91c1c]" />
          </div>

          {/* Right Column: Content */}
          <div className="md:col-span-7 p-5 sm:p-6 md:p-10 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activePhase.label}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 leading-tight">{activePhase.title}</h3>
                </div>
                <div className={`p-3 bg-gradient-to-br ${activePhase.color} text-white rounded-md shrink-0`}>
                  {getPhaseIcon(activePhase.id)}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[10px] font-bold text-[#800404] bg-red-50 border border-red-200/30 px-2.5 py-0.5 uppercase">
                  {activePhase.badge}
                </span>
                {activePhase.isPaid && (
                  <span className="text-[10px] font-bold text-white bg-[#800404] px-2.5 py-0.5 uppercase">
                    PAGO · {activePhase.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{activePhase.description}</p>

              {/* Metadata details */}
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 font-medium mb-8">
                <div className="flex items-center gap-2.5">
                  <Calendar size={15} className="text-[#800404] shrink-0" />
                  <span>{activePhase.date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-[#800404] shrink-0" />
                  <span>{activePhase.time}</span>
                </div>
                <div className="flex items-center gap-2.5 sm:col-span-2">
                  <MapPin size={15} className="text-[#800404] shrink-0" />
                  <span>{activePhase.location}</span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="border-t border-gray-100 pt-6">
              <PhaseActionSection phase={activePhase} />
            </div>
          </div>
        </div>
      </div>

      {/* Speakers Section */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-[#800404] uppercase tracking-widest">Ponentes Confirmados</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-2">Líderes Globales en Ingeniería</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              Investigadores y expertos de las mejores universidades del mundo se dan cita en la UNI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dynamicSpeakers.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 overflow-hidden hover:border-[#800404]/30 hover:shadow-md transition-all group flex flex-col rounded-none">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#800404] to-[#5a0303] flex items-center justify-center text-white font-black text-2xl">
                      {s.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                    {s.country}
                  </div>
                </div>
                
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-gray-900 text-xs sm:text-sm leading-tight group-hover:text-[#800404] transition-colors">{s.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">{s.org}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="text-[10px] sm:text-xs text-gray-600 font-semibold italic flex items-start gap-1 leading-tight">
                      <Star size={11} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" />
                      <span>{s.topic}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-14">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <span className="text-[10px] font-black text-[#800404] uppercase tracking-widest">Información General</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 mb-4">¿Cómo participar?</h2>
            <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-[#800404] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</div>
                <p><strong className="text-gray-800">Regístrate</strong> en la plataforma creando una cuenta con tu DNI y correo institucional o personal.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-[#800404] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</div>
                <p><strong className="text-gray-800">Inscríbete</strong> a las fases que desees. Las conferencias y la feria son gratuitas. La Cena de Reconocimiento tiene un costo de S/ 180.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-[#800404] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</div>
                <p><strong className="text-gray-800">Recibe tu QR</strong> de entrada digital al inscribirte. Preséntalo al ingreso de cada evento para el control de asistencia.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-[#800404] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">4</div>
                <p><strong className="text-gray-800">Obtén tu certificado</strong> digital firmado tras tu participación. Disponible para descarga por DNI en nuestra sección de Certificados.</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4">Datos del Evento</h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-0 py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Organizador</span>
                <span className="text-gray-800 font-bold lg:text-right">Comisión del Sesquicentenario UNI</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-0 py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Periodo</span>
                <span className="text-gray-800 font-bold lg:text-right">08 – 12 Septiembre 2026</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-0 py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Sede principal</span>
                <span className="text-gray-800 font-bold lg:text-right">Campus UNI, Rímac, Lima</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-0 py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Certificación</span>
                <span className="text-gray-800 font-bold lg:text-right">Certificados digitales con QR</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-0 py-2">
                <span className="text-gray-400 font-medium">Contacto</span>
                <span className="text-gray-800 font-bold lg:text-right">sesquicentenario@uni.edu.pe</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Link
                to="/cronograma"
                className="flex-1 text-center border border-[#800404] text-[#800404] font-black py-3 text-xs hover:bg-red-50 transition-colors uppercase tracking-wider"
              >
                Ver Cronograma
              </Link>
              <Link
                to="/certificados"
                className="flex-1 text-center bg-[#800404] text-white font-black py-3 text-xs hover:bg-[#5a0303] transition-colors uppercase tracking-wider flex items-center justify-center gap-1"
              >
                <Award size={14} /> Certificados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
