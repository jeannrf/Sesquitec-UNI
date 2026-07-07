import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, Award, ChevronRight, Star, Globe, Cpu, Utensils, ExternalLink, CheckCircle, UserPlus } from 'lucide-react'
import { db } from '../services/db'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

const speakers = [
  { name: 'Dr. Kenji Tanaka', org: 'University of Tokyo', topic: 'Inteligencia Artificial y Ciudades Inteligentes', country: '🇯🇵 Japón' },
  { name: 'Dra. Elena Rodríguez', org: 'MIT - Massachusetts Institute of Technology', topic: 'Infraestructura Resiliente ante el Cambio Climático', country: '🇺🇸 EE.UU.' },
  { name: 'Dr. Hans Weber', org: 'ETH Zurich', topic: 'Ingeniería de Materiales Avanzados', country: '🇨🇭 Suiza' },
  { name: 'Ing. Priya Sharma', org: 'Indian Institute of Technology Delhi', topic: 'Energía Solar a Gran Escala', country: '🇮🇳 India' },
  { name: 'Dr. Roberto Vargas', org: 'Universidad Nacional de Ingeniería', topic: 'IA en la Ingeniería Peruana', country: '🇵🇪 Perú' },
  { name: 'Dra. Ana Müller', org: 'Technische Universität München', topic: 'Robótica Industrial y Manufactura', country: '🇩🇪 Alemania' },
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
  }
]

function PhaseCard({ phase }) {
  const { user, openAuth } = useAuth()
  const { showAlert } = useAlert()
  const [isRegistering, setIsRegistering] = useState(false)

  const registrationCount = db.getEventRegistrationCount(phase.id)
  const isRegistered = user ? db.isUserRegistered(user.email, phase.id) : false
  const isFull = phase.quota > 0 && registrationCount >= phase.quota

  const handleRegister = () => {
    if (!user) {
      openAuth('login')
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
    <div className="bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Top gradient bar */}
      <div className={`h-1.5 shrink-0 bg-gradient-to-r ${phase.color}`} />

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{phase.label}</span>
            <h3 className="text-xl font-black text-gray-900 mt-1 leading-tight">{phase.title}</h3>
          </div>
          <div className={`p-3 bg-gradient-to-br ${phase.color} text-white rounded-sm`}>
            {phase.icon}
          </div>
        </div>

        {/* Badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] font-bold text-[#800404] bg-red-50 border border-red-200/30 px-2 py-0.5 uppercase">
            {phase.badge}
          </span>
          {phase.isPaid && (
            <span className="text-[10px] font-bold text-white bg-[#800404] px-2 py-0.5 uppercase">
              PAGO · {phase.price}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-5">{phase.description}</p>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-600 font-medium mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#800404] shrink-0" />
            <span>{phase.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#800404] shrink-0" />
            <span>{phase.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#800404] shrink-0" />
            <span>{phase.location}</span>
          </div>
        </div>

        <div className="mt-auto w-full">
          {/* Aforo bar */}
          {phase.quota > 0 && (
          <div className="mb-5">
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

        {/* Action button */}
        {isRegistered ? (
          <button disabled className="w-full bg-emerald-50 text-emerald-700 font-black py-3 text-sm border border-emerald-200 flex items-center justify-center gap-2 cursor-default">
            <CheckCircle size={16} /> Ya estás inscrito
          </button>
        ) : isFull ? (
          <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-3 text-sm border border-gray-200 cursor-not-allowed">
            Aforo Completo
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className={`w-full font-black py-3 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 ${
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
    </div>
  )
}

export default function EncuentroInternacional() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-[#800404] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#800404]/80 to-[#3a0202]" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 px-3 py-1 mb-4 backdrop-blur-sm">
              Septiembre 2026 · Evento Central
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Encuentro Internacional
              <br />
              <span className="text-white/70">del Sesquicentenario</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
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
              <div className="flex items-center gap-2 text-white/80">
                <Users size={16} className="text-white/50" />
                <span className="text-sm font-bold">+2,900 participantes</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Globe size={16} className="text-white/50" />
                <span className="text-sm font-bold">6+ países invitados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline strip */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between overflow-x-auto gap-4">
          {phases.map((p, i) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#800404] transition-colors whitespace-nowrap group"
            >
              <span className="w-7 h-7 flex items-center justify-center bg-gray-100 group-hover:bg-red-50 text-xs font-black text-gray-500 group-hover:text-[#800404] transition-colors rounded-full">
                {i + 1}
              </span>
              <span className="font-bold">{p.title}</span>
              {i < phases.length - 1 && <ChevronRight size={14} className="text-gray-300 ml-2" />}
            </a>
          ))}
        </div>
      </div>

      {/* Phases grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Tres Fases, Un Gran Evento</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Selecciona la fase a la que deseas asistir. La inscripción es gratuita para conferencias y feria; la Cena de Reconocimiento requiere entrada.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6" id="phases">
          {phases.map(phase => (
            <div key={phase.id} id={phase.id}>
              <PhaseCard phase={phase} />
            </div>
          ))}
        </div>
      </div>

      {/* Speakers Section */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-[#800404] uppercase tracking-widest">Ponentes Confirmados</span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-2">Líderes Globales en Ingeniería</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              Investigadores y expertos de las mejores universidades del mundo se dan cita en la UNI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {speakers.map((s, i) => (
              <div key={i} className="border border-gray-200 p-5 hover:border-[#800404]/20 hover:shadow-sm transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#800404] to-[#b91c1c] text-white flex items-center justify-center font-black text-sm shrink-0">
                    {s.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-gray-900 text-sm leading-tight">{s.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.org}</p>
                    <p className="text-[10px] text-gray-400">{s.country}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 font-medium leading-normal">
                    <Star size={10} className="inline text-amber-500 mr-1" />
                    {s.topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[10px] font-black text-[#800404] uppercase tracking-widest">Información General</span>
            <h2 className="text-2xl font-black text-gray-900 mt-2 mb-4">¿Cómo participar?</h2>
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
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Organizador</span>
                <span className="text-gray-800 font-bold">Comisión del Sesquicentenario UNI</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Periodo</span>
                <span className="text-gray-800 font-bold">08 – 12 Septiembre 2026</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Sede principal</span>
                <span className="text-gray-800 font-bold">Campus UNI, Rímac, Lima</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Certificación</span>
                <span className="text-gray-800 font-bold">Certificados digitales con QR</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400 font-medium">Contacto</span>
                <span className="text-gray-800 font-bold">sesquicentenario@uni.edu.pe</span>
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
