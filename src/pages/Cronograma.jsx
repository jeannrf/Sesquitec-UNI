import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, MapPin, Clock, Calendar, ExternalLink, Play, Filter, X, Users, Image, ThumbsUp, MessageSquare, Share2, FileText, Award } from 'lucide-react'
import { db } from '../services/db'
import { useAlert } from '../context/AlertContext'

const months = ['Todos', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function EventCard({ event }) {
  const [open, setOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRecapOpen, setIsRecapOpen] = useState(false)
  const { showAlert } = useAlert()
  const isPost = event.status === 'post'
  useEffect(() => {
    if (isDetailsOpen || isRecapOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDetailsOpen, isRecapOpen])

  return (
    <>
      <div className={`border-l-4 ${isPost ? 'border-l-gray-300 bg-white border border-gray-200' : 'border-l-[#800404] bg-white border border-gray-200'}`}>
      <div
        className="flex items-start gap-4 p-5 cursor-pointer hover:bg-red-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="shrink-0 pt-0.5">
          <span
            className={`inline-block text-xs font-black px-2.5 py-1 uppercase tracking-wide ${
              isPost
                ? 'bg-gray-100 text-gray-500'
                : 'bg-[#800404] text-white'
            }`}
          >
            {isPost ? 'PASADO' : 'PRÓXIMO'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-1.5">
            <span className="flex items-center gap-1"><Calendar size={12} />{event.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{event.time}</span>
            {event.isPaid && (
              <span className="bg-[#800404] text-white text-xs font-bold px-2 py-0.5">PAGO · S/ 180</span>
            )}
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight">{event.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="bg-red-50 text-[#800404] text-[10px] font-bold px-2 py-0.5 uppercase border border-red-200/30 rounded-none">
              {event.category}
            </span>
            {event.tags && event.tags.map(tag => (
              <span key={tag} className="bg-red-50 text-[#800404] text-[10px] font-bold px-2 py-0.5 uppercase border border-red-200/30 rounded-none">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-450 mt-1.5">{event.organizer}</p>
        </div>
        <div className="shrink-0 text-gray-300">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-5 bg-gray-50">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 text-[#800404] shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#800404] shrink-0" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
            <div>
              {!isPost ? (
                <div className="space-y-3">
                  {event.quota > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-black text-[#800404]">{event.quota}</span> cupos disponibles
                    </p>
                  )}
                  {event.mapsUrl && (
                    <a href={event.mapsUrl} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                      <MapPin size={14} />Ver en Google Maps
                    </a>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsDetailsOpen(true)}
                      className="flex-1 text-center border border-[#800404] text-[#800404] font-black py-3 hover:bg-red-50 transition-colors text-sm bg-white cursor-pointer"
                    >
                      Ver Evento
                    </button>
                    {event.isPaid && (
                      event.registrationOpen ? (
                        <Link
                          to="/cena-gala"
                          className="flex-1 text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                        >
                          Comprar entradas
                        </Link>
                      ) : (
                        <button disabled className="flex-1 text-center bg-gray-200 text-gray-400 font-bold py-3 text-sm cursor-not-allowed">
                          Cerrado
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col justify-between h-full min-h-[110px]">
                  <div>
                    <p className="text-sm font-black text-gray-700 mb-1 uppercase tracking-wider">El evento ha finalizado</p>
                  </div>
                  
                  <div className="flex justify-end items-end mt-auto w-full">
                    <button
                      onClick={() => setIsRecapOpen(true)}
                      className="bg-[#800404] hover:bg-[#5a0303] text-white font-bold px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer rounded-none shadow-sm w-auto whitespace-nowrap self-end hover:shadow-md active:scale-95"
                    >
                      <Play size={10} className="fill-white" /> Ver Recap
                    </button>

                    {event.video && (
                      <div className="bg-white border border-gray-200 p-3 space-y-1.5 w-full text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Recursos del evento</p>
                        <a href={event.video || '#'} className="inline-flex items-center gap-1.5 text-xs text-[#800404] hover:underline font-medium">
                          <Play size={12} />Ver video en YouTube
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    {isDetailsOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white max-w-2xl w-full border border-gray-200 shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-none animate-scale-up max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible">
          {/* Left Photo Banner */}
          <div 
            className="w-full md:w-2/5 h-48 md:h-auto min-h-[200px] md:min-h-0 bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'})` }}
          />

          {/* Right Content */}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              {/* Header Badge & Close Button */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-[9px] font-black text-white bg-[#800404] px-2.5 py-0.5 tracking-wider uppercase">
                  {event.category || 'EVENTO'}
                </span>
                <button onClick={() => setIsDetailsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Event Name */}
              <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2 uppercase tracking-wide">
                {event.title}
              </h3>

              {/* Badges row */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.tags && event.tags.map(tag => (
                  <span key={tag} className="bg-red-50 text-[#800404] text-[10px] font-bold px-2 py-0.5 uppercase border border-red-200/30 rounded-none">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metadata details */}
              <div className="space-y-2 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#800404] shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#800404] shrink-0" />
                  <span>{event.time || '08:00 – 18:00'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#800404] shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#800404] shrink-0" />
                  <span>Organiza: <strong className="font-bold">{event.organizer}</strong></span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-gray-100 my-4" />

              {/* Description */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Descripción</p>
                <p className="text-sm text-gray-500 leading-relaxed text-justify">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Footer Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {isRecapOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white max-w-2xl w-full border border-gray-200 shadow-2xl flex flex-col overflow-hidden rounded-none animate-scale-up max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-[#f8f9fa] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black text-white bg-[#800404] px-2.5 py-0.5 tracking-wider uppercase mb-1 inline-block">
                RESUMEN DE EVENTO
              </span>
              <h3 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-wider mb-2">{event.title}</h3>
              
              {/* Badges row */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.tags && event.tags.map(tag => (
                  <span key={tag} className="bg-red-50 text-[#800404] text-[10px] font-bold px-2 py-0.5 uppercase border border-red-200/30 rounded-none">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => setIsRecapOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Intro text */}
            <div>
              <p className="text-sm text-gray-650 leading-relaxed text-justify">
                El evento finalizó exitosamente. En el marco de la conmemoración del Sesquicentenario de la UNI, agradecemos a toda la comunidad universitaria por su grata presencia. Los certificados oficiales firmados ya se encuentran disponibles.
              </p>
            </div>

            {/* Video Player Section */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Play size={12} className="text-[#800404]" /> Grabación del Evento (YouTube)
              </p>
              <div className="aspect-video w-full bg-gray-100 border border-gray-200 overflow-hidden relative">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${event.id === 'may1' ? 'WJzWnO4qZc0' : 'dQw4w9WgXcQ'}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Image Gallery */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Image size={12} className="text-[#800404]" /> Galería de Fotos
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=300',
                  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=300',
                  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=300'
                ].map((imgUrl, i) => (
                  <a key={i} href={imgUrl} target="_blank" rel="noopener noreferrer" className="group overflow-hidden border border-gray-200 block aspect-[4/3] relative">
                    <img src={imgUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={`Foto ${i + 1}`} />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      Ampliar
                    </div>
                  </a>
                ))}
              </div>
            </div>


            {/* Event Resources */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <a href={event.report || '#'} target="_blank" rel="noopener noreferrer" className="border border-gray-300 hover:border-[#800404] hover:bg-red-50/30 text-gray-700 flex items-center justify-center gap-2 py-3 text-xs font-black transition-colors uppercase tracking-wider rounded-none">
                <FileText size={14} className="text-[#800404]" /> Informe Final (PDF)
              </a>
              <Link to="/certificados" className="bg-[#800404] hover:bg-[#5a0303] text-white flex items-center justify-center gap-2 py-3 text-xs font-black transition-colors uppercase tracking-wider rounded-none text-center">
                <Award size={14} /> Buscar Certificados
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setIsRecapOpen(false)}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-black px-6 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default function Cronograma() {
  const [activeMonth, setActiveMonth] = useState('Todos')
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const filterDropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setFilterDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cargar eventos desde localStorage
  const dbEvents = db.getEvents()

  // Helper para extraer el mes en español a partir del string de fecha del evento
  const getEventMonth = (dateStr) => {
    if (!dateStr) return 'Otros'
    const lower = dateStr.toLowerCase()
    if (lower.includes('jun')) return 'Junio'
    if (lower.includes('jul')) return 'Julio'
    if (lower.includes('ago')) return 'Agosto'
    if (lower.includes('sep')) return 'Septiembre'
    if (lower.includes('oct')) return 'Octubre'
    if (lower.includes('nov')) return 'Noviembre'
    if (lower.includes('dic')) return 'Diciembre'
    if (lower.includes('ene')) return 'Enero'
    if (lower.includes('feb')) return 'Febrero'
    if (lower.includes('mar')) return 'Marzo'
    if (lower.includes('abr')) return 'Abril'
    if (lower.includes('may')) return 'Mayo'
    return 'Otros'
  }

  // Agrupar los eventos planos en un objeto por mes
  const eventsByMonth = {}
  dbEvents.forEach(ev => {
    const month = getEventMonth(ev.date)
    if (!eventsByMonth[month]) {
      eventsByMonth[month] = []
    }
    eventsByMonth[month].push(ev)
  })

  const currentEvents = activeMonth === 'Todos'
    ? dbEvents
    : (eventsByMonth[activeMonth] || [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">Eventos</h1>
          <p className="text-white/70 text-lg">Todos los eventos del Sesquicentenario UNI 2026</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-500">
            Filtrar y explorar cronograma
          </span>
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer font-bold text-sm text-gray-700 bg-white rounded-none shadow-sm"
            >
              <Filter size={15} className="text-[#800404]" />
              <span>Mes: {activeMonth}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {filterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl z-50 py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                {months.map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setActiveMonth(m)
                      setFilterDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#800404] transition-colors ${
                      activeMonth === m ? 'font-bold text-[#800404] bg-red-50/50' : 'text-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">
            {activeMonth === 'Todos' ? 'Todos los Eventos' : `${activeMonth} 2026`}
          </h2>
          <span className="text-sm text-gray-400">
            {currentEvents.length} evento(s)
          </span>
        </div>

        {currentEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg text-gray-400">
              {activeMonth === 'Todos' ? 'No hay eventos programados' : `No hay eventos programados para ${activeMonth}`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentEvents.map(ev => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
