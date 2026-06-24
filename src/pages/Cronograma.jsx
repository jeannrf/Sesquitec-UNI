import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, MapPin, Clock, Calendar, ExternalLink, Play } from 'lucide-react'

const months = ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre']

const events = {
  Junio: [
    {
      id: 'jun1',
      status: 'post',
      date: '10 Jun 2026',
      time: '09:00 – 13:00',
      title: 'Simposio de Ciencias Básicas',
      organizer: 'Facultad de Ciencias',
      location: 'Auditorium A, UNI',
      description: 'Simposio académico con presentaciones sobre matemáticas, física y química aplicadas a la ingeniería.',
      photos: '#',
      report: '#',
      video: '#',
    },
    {
      id: 'jun2',
      status: 'post',
      date: '18 Jun 2026',
      time: '14:00 – 18:00',
      title: 'Foro de Innovación Tecnológica',
      organizer: 'UNICODE',
      location: 'Aula Magna, UNI',
      description: 'Exposición de proyectos estudiantiles y ponencias sobre innovación y emprendimiento.',
      photos: '#',
      report: '#',
      video: '#',
    },
  ],
  Julio: [
    {
      id: 'jul1',
      status: 'pre',
      date: '14 Jul 2026',
      time: '08:00 – 18:00',
      title: 'Encuentro Internacional de Ingeniería UNI',
      organizer: 'Comisión del Sesquicentenario',
      location: 'Teatro UNI, Lima',
      description:
        'Evento central del Sesquicentenario. Incluye 10 conferencias magistrales con ponentes nacionales e internacionales en áreas de Ingeniería Civil, Sistemas, Mecánica, Eléctrica y más.',
      registrationOpen: true,
      quota: 850,
      mapsUrl: '#',
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
    },
  ],
  Agosto: [
    {
      id: 'ago1',
      status: 'pre',
      date: '08 Ago 2026',
      time: '09:00 – 17:00',
      title: 'Congreso de Ingeniería Ambiental',
      organizer: 'Facultad de Ingeniería Ambiental',
      location: 'Auditorium C, UNI',
      description: 'Congreso sobre energías renovables, gestión ambiental y tecnologías verdes para el desarrollo sostenible del Perú.',
      registrationOpen: true,
      quota: 300,
    },
    {
      id: 'ago2',
      status: 'pre',
      date: '22 Ago 2026',
      time: '19:00 – 23:00',
      title: 'Cena de Gala de Egresados',
      organizer: 'Comisión del Sesquicentenario',
      location: 'Gran Hotel Bolívar, Lima',
      description: 'Evento social exclusivo para egresados de la UNI. Cena, música en vivo y reconocimientos especiales.',
      registrationOpen: true,
      quota: 500,
      isPaid: true,
    },
  ],
  Septiembre: [
    {
      id: 'sep1',
      status: 'pre',
      date: '15 Sep 2026',
      time: '09:00 – 13:00',
      title: 'Feria de Empleo UNI 2026',
      organizer: 'Oficina de Bienestar Universitario',
      location: 'Pabellón Central, UNI',
      description: 'Conecta con más de 50 empresas líderes en ingeniería y tecnología. Trae tu CV actualizado.',
      registrationOpen: true,
      quota: 1200,
    },
  ],
  Octubre: [
    {
      id: 'oct1',
      status: 'pre',
      date: '10 Oct 2026',
      time: '10:00 – 14:00',
      title: 'Hackathon Sesquicentenario',
      organizer: 'UNICODE',
      location: 'Laboratorios de Cómputo, UNI',
      description: 'Competencia de 48 horas para resolver problemas reales de ingeniería con tecnología.',
      registrationOpen: false,
      quota: 200,
    },
  ],
  Noviembre: [
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
    },
  ],
}

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
                  {event.registrationOpen ? (
                    event.isPaid ? (
                      <Link
                        to="/cena-gala"
                        className="block w-full text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                      >
                        Comprar entradas
                      </Link>
                    ) : (
                      <Link
                        to="/inscripcion"
                        className="block w-full text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                      >
                        Inscribirme a este evento
                      </Link>
                    )
                  ) : (
                    <button disabled className="block w-full text-center bg-gray-200 text-gray-400 font-bold py-3 text-sm cursor-not-allowed">
                      Inscripciones no disponibles
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">Recursos del evento</p>
                  <a href={event.report} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                    <ExternalLink size={14} />Ver informe final
                  </a>
                  <a href={event.photos} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                    <ExternalLink size={14} />Galería de fotos
                  </a>
                  {event.video && (
                    <a href={event.video} className="flex items-center gap-2 text-sm text-[#800404] hover:underline font-medium">
                      <Play size={14} />Ver video en YouTube
                    </a>
                  )}
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
  const [activeMonth, setActiveMonth] = useState('Julio')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">Cronograma de Eventos</h1>
          <p className="text-white/70 text-lg">Todos los eventos del Sesquicentenario UNI 2026</p>
        </div>
      </div>

      {/* Month tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {months.map(m => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`shrink-0 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeMonth === m
                  ? 'border-[#800404] text-[#800404]'
                  : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">{activeMonth} 2026</h2>
          <span className="text-sm text-gray-400">
            {(events[activeMonth] || []).length} evento(s)
          </span>
        </div>

        {(events[activeMonth] || []).length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg text-gray-400">No hay eventos programados para {activeMonth}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(events[activeMonth] || []).map(ev => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
