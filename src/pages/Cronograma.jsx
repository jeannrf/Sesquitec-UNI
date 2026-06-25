import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, MapPin, Clock, Calendar, ExternalLink, Play, Filter } from 'lucide-react'
import { db } from '../services/db'

const months = ['Todos', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function EventCard({ event }) {
  const [open, setOpen] = useState(false)
  const isPost = event.status === 'post'

  return (
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
          <p className="text-sm text-gray-400 mt-0.5">{event.organizer}</p>
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
                      onClick={() => alert(`Detalles del Evento:\n\nEvento: ${event.title}\nOrganizador: ${event.organizer}\nLugar: ${event.location}\nFecha: ${event.date}\nHora: ${event.time}\n\nDescripción:\n${event.description}`)}
                      className="flex-1 text-center border border-[#800404] text-[#800404] font-black py-3 hover:bg-red-50 transition-colors text-sm bg-white cursor-pointer"
                    >
                      Ver Evento
                    </button>
                    {event.registrationOpen ? (
                      event.isPaid ? (
                        <Link
                          to="/cena-gala"
                          className="flex-1 text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                        >
                          Comprar entradas
                        </Link>
                      ) : (
                        <Link
                          to="/inscripcion"
                          className="flex-1 text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                        >
                          Inscribirme
                        </Link>
                      )
                    ) : (
                      <button disabled className="flex-1 text-center bg-gray-200 text-gray-400 font-bold py-3 text-sm cursor-not-allowed">
                        Cerrado
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-black text-gray-700 mb-1 uppercase tracking-wider">El evento ha finalizado</p>
                  <button
                    onClick={() => {
                      alert(`RESUMEN (RECAP) DEL EVENTO:\n"${event.title}"\n\nEl evento finalizó exitosamente. Se ha registrado una asistencia masiva y los certificados de participación ya están disponibles para su descarga ingresando tu DNI en el buscador de certificados.`);
                    }}
                    className="w-full bg-[#800404] hover:bg-[#5a0303] text-white font-black py-3 text-sm transition-colors mb-3 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={15} /> Ver Recap del Evento
                  </button>

                  <div className="bg-white border border-gray-200 p-4 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Recursos del evento</p>
                    <a href={event.report || '#'} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                      <ExternalLink size={14} />Ver informe final
                    </a>
                    <a href={event.photos || '#'} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                      <ExternalLink size={14} />Galería de fotos
                    </a>
                    {event.video && (
                      <a href={event.video || '#'} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                        <Play size={14} />Ver video en YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
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
