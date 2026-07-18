import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, Award, ChevronRight, Star, Globe, Cpu, Utensils, ExternalLink, CheckCircle, UserPlus, Minus, Plus, X, CreditCard, Shield } from 'lucide-react'
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

function PhaseActionSection({ phase, onOpenPayment }) {
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
    if (phase.isPaid) {
      onOpenPayment()
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
    <div className="w-full flex justify-end">
      {/* Button */}
      <div className="w-full md:w-auto shrink-0 md:min-w-[240px]">
        {isRegistered ? (
          <button disabled className="w-full bg-emerald-50 text-emerald-700 font-black py-3 px-6 text-sm border border-emerald-200 flex items-center justify-center gap-2 cursor-default rounded-none">
            <CheckCircle size={16} /> Ya estás inscrito
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
  const [searchParams] = useSearchParams()
  const initialFase = searchParams.get('fase')
  const [activePhaseId, setActivePhaseId] = useState(() => {
    return (initialFase && ['sep1', 'sep2', 'sep3'].includes(initialFase)) ? initialFase : 'sep1'
  })

  const { user } = useAuth()
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState(0) // 0: Ticket select & Companions, 1: Checkout choice, 2: Simulated OTP/Payment form, 3: Processing, 4: Success
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [companions, setCompanions] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('') // 'card' | 'yape' | 'plin'
  
  // Yape Form
  const [yapePhone, setYapePhone] = useState('')
  const [yapeCode, setYapeCode] = useState('')
  
  // Card Form
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  
  // Errors and loader
  const [paymentErrors, setPaymentErrors] = useState({})
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false)
  const [confirmedTicket, setConfirmedTicket] = useState(null)

  const handleOpenPaymentModal = () => {
    if (!user) {
      navigate('/iniciar-sesion?redirect=/encuentro-internacional?fase=sep3')
      return
    }
    setTicketQuantity(1)
    setCompanions([])
    setPaymentStep(0)
    setPaymentMethod('')
    setYapePhone('')
    setYapeCode('')
    setCardNumber('')
    setCardExpiry('')
    setCardCvv('')
    setCardName(user.nombres + ' ' + user.apellidos)
    setPaymentErrors({})
    setIsPaymentModalOpen(true)
  }

  const handleQuantityChange = (val) => {
    const n = Math.max(1, Math.min(10, ticketQuantity + val))
    setTicketQuantity(n)
    const comps = [...companions]
    while (comps.length < n - 1) {
      comps.push({ nombre: '', apellido: '', dni: '' })
    }
    setCompanions(comps.slice(0, n - 1))
  }

  const updateCompanion = (index, field, val) => {
    setCompanions(prev => {
      const u = [...prev]
      u[index] = { ...u[index], [field]: val }
      return u
    })
  }

  const validateStep0 = () => {
    const errs = {}
    companions.forEach((comp, idx) => {
      if (!comp.nombre || !comp.nombre.trim()) {
        errs[`comp_${idx}_nombre`] = 'Requerido'
      }
      if (!comp.apellido || !comp.apellido.trim()) {
        errs[`comp_${idx}_apellido`] = 'Requerido'
      }
      if (!comp.dni || !/^\d{8}$/.test(comp.dni)) {
        errs[`comp_${idx}_dni`] = 'DNI de 8 dígitos'
      }
    })
    setPaymentErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleStep0Submit = () => {
    if (validateStep0()) {
      setPaymentStep(1)
    }
  }

  const validatePaymentForm = () => {
    const errs = {}
    if (paymentMethod === 'yape') {
      if (!/^\d{9}$/.test(yapePhone)) errs.yapePhone = 'Celular inválido (9 dígitos)'
      if (!/^\d{6}$/.test(yapeCode)) errs.yapeCode = 'Código de aprobación de 6 dígitos'
    } else if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '')
      if (!/^\d{16}$/.test(cleanNum)) errs.cardNumber = 'Tarjeta inválida (16 dígitos)'
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) errs.cardExpiry = 'Vencimiento inválido (MM/AA)'
      if (!/^\d{3}$/.test(cardCvv)) errs.cardCvv = 'CVV inválido'
      if (!cardName.trim()) errs.cardName = 'Requerido'
    }
    setPaymentErrors(errs)
    return Object.keys(errs).length === 0
  }

  const startPaymentSimulation = () => {
    if (paymentMethod === 'card' || paymentMethod === 'yape') {
      if (!validatePaymentForm()) return
    }
    
    setPaymentStep(3) // Loading / Webhook simulation step
    setIsSimulatingWebhook(true)

    setTimeout(() => {
      const matchedCompanions = companions.map(c => ({
        nombre: c.nombre.trim(),
        apellido: c.apellido.trim(),
        dni: c.dni.trim()
      }))

      const result = db.registerUserToEvent(user.email, 'sep3', [], matchedCompanions)
      
      if (result.success) {
        setConfirmedTicket(result.ticket)
        setPaymentStep(4) // Success step
      } else {
        showAlert(result.message || 'El aforo se completó o hubo un error al registrar tu entrada.', 'Error de Compra', 'warning')
        setIsPaymentModalOpen(false)
      }
      setIsSimulatingWebhook(false)
    }, 2500)
  }

  useEffect(() => {
    const faseParam = searchParams.get('fase')
    if (faseParam && ['sep1', 'sep2', 'sep3'].includes(faseParam)) {
      setActivePhaseId(faseParam)
    }
  }, [searchParams])
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
              <PhaseActionSection phase={activePhase} onOpenPayment={handleOpenPaymentModal} />
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
      {/* CENA DE RECONOCIMIENTO SIMULATED MERCADO PAGO MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl shadow-2xl relative border-t-8 border-t-[#800404] flex flex-col rounded-none max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 shrink-0">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Reserva de Entradas - Cena de Reconocimiento
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Sesquicentenario UNI 150 Años
                </p>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* STEP 0: TICKET QUANTITY & COMPANIONS */}
              {paymentStep === 0 && (
                <div className="space-y-6">
                  {/* Select Tickets */}
                  <div className="bg-gray-50 border border-gray-200 p-5">
                    <h4 className="font-black text-gray-800 mb-1 text-sm">Cantidad de Entradas</h4>
                    <p className="text-xs text-gray-400 mb-4">Adquiere hasta 10 entradas para ti y tus invitados.</p>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleQuantityChange(-1)} 
                          disabled={ticketQuantity <= 1}
                          className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-[#800404] hover:text-[#800404] transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-3xl font-black text-[#800404] w-10 text-center">{ticketQuantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(1)} 
                          disabled={ticketQuantity >= 10}
                          className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-[#800404] hover:text-[#800404] transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="h-10 w-px bg-gray-200" />

                      <div>
                        <p className="text-2xl font-black text-gray-900">S/ {(ticketQuantity * 180).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total a Pagar</p>
                      </div>
                    </div>
                  </div>

                  {/* Companions form */}
                  {companions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-black text-gray-800 text-xs uppercase tracking-wider text-[#800404]">Datos de tus Invitados / Acompañantes</h4>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {companions.map((comp, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 p-4 space-y-3 relative">
                            <span className="absolute top-2 right-3 text-[10px] font-bold text-gray-350 uppercase tracking-widest">
                              Invitado #{idx + 1}
                            </span>
                            <div className="grid sm:grid-cols-3 gap-3 pt-2">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Nombre *</label>
                                <input 
                                  type="text" 
                                  value={comp.nombre}
                                  onChange={e => updateCompanion(idx, 'nombre', e.target.value)}
                                  className={`w-full border px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#800404] ${
                                    paymentErrors[`comp_${idx}_nombre`] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Apellido *</label>
                                  <input 
                                  type="text" 
                                  value={comp.apellido}
                                  onChange={e => updateCompanion(idx, 'apellido', e.target.value)}
                                  className={`w-full border px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#800404] ${
                                    paymentErrors[`comp_${idx}_apellido`] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">DNI *</label>
                                <input 
                                  type="text" 
                                  maxLength={8}
                                  value={comp.dni}
                                  onChange={e => updateCompanion(idx, 'dni', e.target.value.replace(/\D/g, ''))}
                                  className={`w-full border px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#800404] ${
                                    paymentErrors[`comp_${idx}_dni`] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: MERCADO PAGO SIMULATED CHECKOUT */}
              {paymentStep === 1 && (
                <div className="space-y-6">
                  {/* Mercado Pago Header */}
                  <div className="bg-[#009EE3] text-white p-5 -mx-6 -mt-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-white text-[#009EE3] font-black text-xs px-2 py-0.5 rounded-sm tracking-tighter">
                        mercado pago
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 border-l border-white/20 pl-2">
                        Checkout Sandbox
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] opacity-75 uppercase tracking-wider">Total a pagar</p>
                      <p className="text-xl font-black">S/ {(ticketQuantity * 180).toLocaleString()}</p>
                    </div>
                  </div>

                  <h4 className="font-black text-gray-800 text-sm">Selecciona tu método de pago</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'yape', label: 'Yape', icon: '💜', desc: 'Con código de Yape' },
                      { id: 'plin', label: 'Plin', icon: '💚', desc: 'Código QR Plin' },
                      { id: 'card', label: 'Tarjeta de Débito/Crédito', icon: '💳', desc: 'Visa, Mastercard, AMEX' },
                    ].map(m => (
                      <button 
                        key={m.id}
                        onClick={() => {
                          setPaymentMethod(m.id)
                          setPaymentErrors({})
                        }}
                        className={`border-2 p-4 text-left flex flex-col justify-between transition-all cursor-pointer rounded-none min-h-[110px] ${
                          paymentMethod === m.id 
                            ? 'border-[#009EE3] bg-sky-50/40 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-350 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-2xl">{m.icon}</span>
                          <input 
                            type="radio" 
                            checked={paymentMethod === m.id} 
                            readOnly
                            className="text-[#009EE3]" 
                          />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-xs mt-2">{m.label}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic sub-forms based on payment method choice */}
                  {paymentMethod === 'yape' && (
                    <div className="border border-purple-250 bg-purple-50/20 p-5 space-y-4 rounded-none">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💜</span>
                        <h5 className="font-black text-purple-950 text-xs uppercase tracking-wider">Simulación de Pago con Yape</h5>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-purple-900 uppercase mb-1">Número de Celular Yape *</label>
                          <input 
                            type="text" 
                            maxLength={9}
                            placeholder="Ej: 987654321"
                            value={yapePhone}
                            onChange={e => setYapePhone(e.target.value.replace(/\D/g, ''))}
                            className={`w-full border px-3 py-2 text-xs focus:outline-none focus:border-purple-600 bg-white ${
                              paymentErrors.yapePhone ? 'border-red-400' : 'border-gray-300'
                            }`}
                          />
                          {paymentErrors.yapePhone && <p className="text-red-500 text-[10px] mt-0.5">{paymentErrors.yapePhone}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-purple-900 uppercase mb-1">Código de Aprobación Yape *</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="6 dígitos de la app Yape"
                            value={yapeCode}
                            onChange={e => setYapeCode(e.target.value.replace(/\D/g, ''))}
                            className={`w-full border px-3 py-2 text-xs focus:outline-none focus:border-purple-600 bg-white ${
                              paymentErrors.yapeCode ? 'border-red-400' : 'border-gray-300'
                            }`}
                          />
                          {paymentErrors.yapeCode && <p className="text-red-500 text-[10px] mt-0.5">{paymentErrors.yapeCode}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="border border-[#009EE3]/20 bg-sky-50/10 p-5 space-y-4 rounded-none">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💳</span>
                        <h5 className="font-black text-[#009EE3] text-xs uppercase tracking-wider">Simulación de Pago con Tarjeta (Sandbox)</h5>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Número de Tarjeta *</label>
                          <input 
                            type="text" 
                            maxLength={19}
                            placeholder="4557 8812 3456 7890 (Sandbox test)"
                            value={cardNumber}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(v);
                            }}
                            className={`w-full border px-3 py-2 text-xs focus:outline-none focus:border-[#009EE3] bg-white ${
                              paymentErrors.cardNumber ? 'border-red-400' : 'border-gray-300'
                            }`}
                          />
                          {paymentErrors.cardNumber && <p className="text-red-500 text-[10px] mt-0.5">{paymentErrors.cardNumber}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Vencimiento *</label>
                            <input 
                              type="text" 
                              maxLength={5}
                              placeholder="MM/AA"
                              value={cardExpiry}
                              onChange={e => {
                                let v = e.target.value.replace(/\D/g, '');
                                if (v.length > 2) {
                                  v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                }
                                setCardExpiry(v);
                              }}
                              className={`w-full border px-3 py-2 text-xs focus:outline-none focus:border-[#009EE3] bg-white ${
                                paymentErrors.cardExpiry ? 'border-red-400' : 'border-gray-300'
                              }`}
                            />
                            {paymentErrors.cardExpiry && <p className="text-red-500 text-[10px] mt-0.5">{paymentErrors.cardExpiry}</p>}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">CVV *</label>
                            <input 
                              type="text" 
                              maxLength={3}
                              placeholder="123"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              className={`w-full border px-3 py-2 text-xs focus:outline-none focus:border-[#009EE3] bg-white ${
                                paymentErrors.cardCvv ? 'border-red-400' : 'border-gray-300'
                              }`}
                            />
                            {paymentErrors.cardCvv && <p className="text-red-500 text-[10px] mt-0.5">{paymentErrors.cardCvv}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Nombre en Tarjeta *</label>
                          <input 
                            type="text" 
                            placeholder="Nombre del Titular"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#009EE3] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'plin' && (
                    <div className="border border-green-200 bg-green-50/20 p-6 text-center space-y-4 rounded-none">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-lg">💚</span>
                        <h5 className="font-black text-green-950 text-xs uppercase tracking-wider">Simulación de Pago con Código QR Plin</h5>
                      </div>
                      <p className="text-xs text-gray-550 max-w-sm mx-auto leading-relaxed">
                        Escanea el código QR de prueba con tu aplicación bancaria para simular la confirmación.
                      </p>
                      <div className="w-40 h-40 bg-white border border-gray-200 p-2 mx-auto flex flex-col items-center justify-center shadow-inner relative">
                        <div className="grid grid-cols-8 gap-0.5 w-full h-full opacity-90">
                          {Array.from({ length: 64 }).map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`w-full h-full ${
                                (idx % 2 === 0 && idx % 5 === 0) || idx < 8 || idx > 56 || idx % 9 === 0 ? 'bg-green-700' : 'bg-transparent'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="absolute bg-white px-2 py-0.5 border border-green-200 text-[9px] font-black text-green-700 uppercase tracking-widest shadow-sm">
                          PLIN QR TEST
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: WEBHOOK SIMULATOR / LOADER */}
              {paymentStep === 3 && (
                <div className="py-12 flex flex-col items-center text-center space-y-6">
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-amber-200 border-t-[#800404] animate-spin" />
                    <span className="absolute text-xl font-bold text-[#800404]">150</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-900 text-base">Procesando pago con Mercado Pago...</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Estamos validando el token de pago y recibiendo la confirmación del webhook seguro del banco. No cierres esta ventana.
                    </p>
                  </div>

                  <div className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-4 py-2 border border-amber-200/50 max-w-md">
                    Nota: Se está simulando el flujo asíncrono seguro que valida el estado del pago directamente contra el API de Mercado Pago.
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS DISPLAY */}
              {paymentStep === 4 && confirmedTicket && (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-650 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm animate-bounce">
                      <CheckCircle size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 leading-tight">¡Pago Aprobado con Éxito!</h4>
                    <p className="text-xs text-gray-400 mt-1">El webhook de Mercado Pago ha sido confirmado oficialmente.</p>
                  </div>

                  {/* Virtual Ticket Cards container */}
                  <div className="border border-gray-200 divide-y divide-gray-150">
                    
                    {/* Primary Ticket */}
                    <div className="p-5 bg-stone-50/50 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-[#800404] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                            Entrada Titular
                          </span>
                          <h5 className="font-black text-gray-900 text-sm mt-1">{confirmedTicket.eventTitle}</h5>
                        </div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase">CÓDIGO: {confirmedTicket.qrCode}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div>
                          <span className="text-gray-400 block font-medium">Asistente</span>
                          <span className="font-bold text-gray-800">{user.nombres} {user.apellidos}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">DNI</span>
                          <span className="font-bold text-gray-800">{user.dni}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">Ubicación</span>
                          <span className="font-bold text-gray-800">{confirmedTicket.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">Fecha y Hora</span>
                          <span className="font-bold text-gray-800">{confirmedTicket.date} · {confirmedTicket.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Companion Tickets if any */}
                    {confirmedTicket.acompanantes && confirmedTicket.acompanantes.length > 0 && (
                      <div className="p-5 space-y-4 bg-white">
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">
                          Entradas de Invitados ({confirmedTicket.acompanantes.length})
                        </span>
                        
                        <div className="space-y-3">
                          {confirmedTicket.acompanantes.map((c, i) => (
                            <div key={i} className="border border-gray-100 p-3 bg-gray-50 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-bold text-gray-800">{c.nombre} {c.apellido}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">DNI: {c.dni}</p>
                              </div>
                              <span className="text-[9px] font-mono text-gray-400 bg-white px-2 py-0.5 border border-gray-200">
                                QR-{confirmedTicket.qrCode.slice(0, 6)}-INV{i+1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-3 flex items-start gap-2 border border-emerald-200/50">
                    <Shield size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                    <p className="leading-tight">
                      <strong>Listo.</strong> Tus entradas ya están cargadas de forma oficial en tu cuenta. Puedes descargarlas o ver sus códigos QR accediendo a tu **Panel Universitario (Mis Eventos)**.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between shrink-0 font-sans">
              
              {/* Back actions */}
              {paymentStep > 0 && paymentStep < 3 ? (
                <button
                  onClick={() => setPaymentStep(s => s - 1)}
                  className="px-5 py-2 border border-gray-300 text-xs font-black text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer rounded-none"
                >
                  Atrás
                </button>
              ) : (
                <div />
              )}

              {/* Action buttons based on steps */}
              {paymentStep === 0 && (
                <button 
                  onClick={handleStep0Submit}
                  className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors cursor-pointer rounded-none uppercase tracking-wider"
                >
                  Continuar al Pago · S/ {(ticketQuantity * 180).toLocaleString()}
                </button>
              )}

              {paymentStep === 1 && (
                <button 
                  onClick={startPaymentSimulation}
                  disabled={!paymentMethod}
                  className="bg-[#009EE3] hover:bg-[#007ebb] text-white text-xs font-black px-6 py-2.5 transition-colors cursor-pointer rounded-none uppercase tracking-wider disabled:opacity-40"
                >
                  Pagar S/ {(ticketQuantity * 180).toLocaleString()} (Sandbox)
                </button>
              )}

              {paymentStep === 4 && (
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors cursor-pointer rounded-none uppercase tracking-wider"
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
