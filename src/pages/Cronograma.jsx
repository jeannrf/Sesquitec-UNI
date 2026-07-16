import { useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, MapPin, Clock, Calendar, ExternalLink, Play, Filter, X, Users, Image, ThumbsUp, MessageSquare, Share2, FileText, Award, CheckCircle, UserPlus } from 'lucide-react'
import { db } from '../services/db'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'

const months = ['Todos', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function EventCard({ event }) {
  const [open, setOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRecapOpen, setIsRecapOpen] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { showAlert } = useAlert()
  const { user, openAuth } = useAuth()
  const isPost = event.status === 'post'

  const registrationCount = event.registrationOpen && event.quota > 0
    ? db.getEventRegistrationCount(event.id)
    : 0
  const isUserAlreadyRegistered = user ? db.isUserRegistered(user.email, event.id) : false
  const isFull = event.quota > 0 && registrationCount >= event.quota

  const handleQuickRegister = () => {
    if (!user) {
      openAuth('login')
      return
    }
    setIsRegistering(true)
    // Small delay for UX feedback
    setTimeout(() => {
      const result = db.registerUserToEvent(user.email, event.id)
      setIsRegistering(false)
      if (result.success) {
        showAlert(result.message, 'Inscripción Exitosa', 'success')
      } else {
        showAlert(result.message, 'Error de Inscripción', 'warning')
      }
    }, 400)
  }
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
        className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer hover:bg-red-50 transition-colors"
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
          <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight">{event.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="bg-red-50 text-[#800404] text-[10px] font-bold px-2 py-0.5 uppercase border border-red-200/30 rounded-none">
              {event.category}
            </span>
            {Array.isArray(event.tags) && event.tags.map(tag => (
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
                    {event.isPaid ? (
                      event.registrationOpen ? (
                        <Link
                          to="/encuentro-internacional"
                          className="flex-1 text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm"
                        >
                          Comprar entradas
                        </Link>
                      ) : (
                        <button disabled className="flex-1 text-center bg-gray-200 text-gray-400 font-bold py-3 text-sm cursor-not-allowed">
                          Cerrado
                        </button>
                      )
                    ) : event.registrationOpen ? (
                      isUserAlreadyRegistered ? (
                        <Link
                          to="/dashboard?tab=eventos"
                          className="flex-1 text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black py-3 text-sm border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Ver mi inscripción
                        </Link>
                      ) : (
                        <button
                          onClick={handleQuickRegister}
                          disabled={isRegistering}
                          className="flex-1 text-center bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors text-sm cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                        >
                          {isRegistering ? (
                            <span className="animate-pulse">Procesando...</span>
                          ) : (
                            <><UserPlus size={14} /> Inscribirse</>
                          )}
                        </button>
                      )
                    ) : null}
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
        <div className="bg-white max-w-5xl w-full border border-gray-200 shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-none animate-scale-up max-h-[95vh] overflow-y-auto relative">
          {/* Absolute Close button */}
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm z-50 border border-gray-150"
            title="Cerrar"
          >
            <X size={20} className="stroke-[3]" />
          </button>

          {/* Left Photo Banner */}
          <div 
            className="w-full md:w-5/12 h-64 md:h-auto min-h-[280px] md:min-h-[400px] bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'})` }}
          />

          {/* Right Content */}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              {/* Header Badge */}
              <div className="flex items-start mb-4">
                <span className="text-[9px] font-black text-white bg-[#800404] px-2.5 py-0.5 tracking-wider uppercase">
                  {event.category || 'EVENTO'}
                </span>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[#800404] shrink-0" />
                    <span>Organiza: <strong className="font-bold">{event.organizer}</strong></span>
                  </div>
                  {/* Social media profile links */}
                  {(event.instagramUrl || event.linkedinUrl || event.facebookUrl) && (
                    <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-1">
                      {event.instagramUrl && (
                        <a
                          href={event.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-pink-600 transition-colors p-1"
                          title="Visitar Instagram"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                          </svg>
                        </a>
                      )}
                      {event.linkedinUrl && (
                        <a
                          href={event.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                          title="Visitar LinkedIn"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect width="4" height="12" x="2" y="9"/>
                            <circle cx="4" cy="4" r="2"/>
                          </svg>
                        </a>
                      )}
                      {event.facebookUrl && (
                        <a
                          href={event.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                          title="Visitar Facebook"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
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

            {/* Footer Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              {!isPost && event.registrationOpen && (
                isUserAlreadyRegistered ? (
                  <Link
                    to="/dashboard?tab=eventos"
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black px-6 py-2.5 uppercase tracking-wider cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle size={14} /> Ver mi inscripción
                  </Link>
                ) : (
                  <button
                    onClick={handleQuickRegister}
                    disabled={isRegistering}
                    className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none flex items-center gap-2 disabled:opacity-60"
                  >
                    {isRegistering ? 'Procesando...' : (
                      <>
                        <UserPlus size={14} />
                        {event.isPaid ? 'Reservar' : 'Inscribirse'}
                      </>
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {isRecapOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white max-w-5xl w-full border border-gray-200 shadow-2xl flex flex-col overflow-hidden rounded-none animate-scale-up max-h-[95vh] overflow-y-auto relative">
          {/* Absolute Close button */}
          <button
            onClick={() => setIsRecapOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm z-50 border border-gray-150"
            title="Cerrar"
          >
            <X size={20} className="stroke-[3]" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-[#f8f9fa] flex items-center justify-between">
            <div className="w-full">
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

              {/* Event Metadata & Organizer Social Links */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 font-medium pt-3 border-t border-gray-200/60 mt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#800404]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#800404]" />
                  <span>{event.time || '08:00 – 18:00'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#800404]" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-[#800404]" />
                    <span>Organiza: <strong className="font-bold">{event.organizer}</strong></span>
                  </div>
                  {/* Social media profile links */}
                  {(event.instagramUrl || event.linkedinUrl || event.facebookUrl) && (
                    <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-1.5">
                      {event.instagramUrl && (
                        <a
                          href={event.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-pink-600 transition-colors p-0.5"
                          title="Visitar Instagram del Organizador"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                          </svg>
                        </a>
                      )}
                      {event.linkedinUrl && (
                        <a
                          href={event.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors p-0.5"
                          title="Visitar LinkedIn del Organizador"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect width="4" height="12" x="2" y="9"/>
                            <circle cx="4" cy="4" r="2"/>
                          </svg>
                        </a>
                      )}
                      {event.facebookUrl && (
                        <a
                          href={event.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-0.5"
                          title="Visitar Facebook del Organizador"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Intro text */}
            <div>
              <p className="text-sm text-gray-650 leading-relaxed text-justify">
                {event.description || 'El evento finalizó exitosamente. En el marco de la conmemoración del Sesquicentenario de la UNI, agradecemos a toda la comunidad universitaria por su grata presencia. Los certificados oficiales firmados ya se encuentran disponibles.'}
              </p>
            </div>

            {/* Layout: Main photo on the left, up to 6 recap photos on the right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Event Cover Photo */}
              <div className="lg:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Image size={12} className="text-[#800404]" /> Foto Principal del Evento
                </p>
                <div className="border border-gray-200 bg-white aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
                    className="w-full h-full object-cover"
                    alt="Portada Principal"
                  />
                </div>
              </div>

              {/* Recap Photo Gallery */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Image size={12} className="text-[#800404]" /> Galería de Fotos (Recap)
                </p>
                {event.recapImages && event.recapImages.filter(Boolean).length > 0 ? (
                  <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                    {event.recapImages.filter(Boolean).map((imgUrl, i) => (
                      <a
                        key={i}
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group overflow-hidden border border-gray-200 block aspect-[4/3] relative bg-white"
                      >
                        <img
                          src={imgUrl}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          alt={`Recap ${i + 1}`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                          Ver
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 h-full min-h-[150px] lg:min-h-[220px] flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                    Sin imágenes de recap
                  </div>
                )}
              </div>
            </div>

            {/* Social media and recap publications links */}
            {(event.instagramUrl || event.linkedinUrl || event.facebookUrl || (event.recapVideoId && !event.recapVideoId.includes('youtube.com/embed'))) && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-[#800404]" /> Publicaciones y Enlaces
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.instagramUrl && (
                    <a
                      href={event.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-pink-200 bg-pink-50/40 text-pink-700 hover:bg-pink-50 text-xs font-bold uppercase transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {event.linkedinUrl && (
                    <a
                      href={event.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50/40 text-blue-700 hover:bg-blue-50 text-xs font-bold uppercase transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect width="4" height="12" x="2" y="9"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {event.facebookUrl && (
                    <a
                      href={event.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50 text-xs font-bold uppercase transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                      Facebook
                    </a>
                  )}
                  {event.recapVideoId && (
                    <a
                      href={event.recapVideoId.startsWith('http') ? event.recapVideoId : `https://www.youtube.com/watch?v=${event.recapVideoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-red-50/40 text-red-700 hover:bg-red-50 text-xs font-bold uppercase transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 1 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                        <polygon points="10 15 15 12 10 9"/>
                      </svg>
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Event Resources */}
            <div className="pt-2">
              <Link to="/certificados" className="w-full bg-[#800404] hover:bg-[#5a0303] text-white flex items-center justify-center gap-2 py-3 text-xs font-black transition-colors uppercase tracking-wider rounded-none text-center">
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
  const [searchQuery, setSearchQuery] = useState('')
  const [pageTitle, setPageTitle] = useState(() => {
    const val = db.getCmsValue('events_title', 'Eventos')
    return typeof val === 'string' ? val : 'Eventos'
  })
  const [pageSubtitle, setPageSubtitle] = useState(() => {
    const val = db.getCmsValue('events_subtitle', 'Todos los eventos del Sesquicentenario UNI 2026')
    return typeof val === 'string' ? val : 'Todos los eventos del Sesquicentenario UNI 2026'
  })

  useEffect(() => {
    const title = db.getCmsValue('events_title', 'Eventos')
    setPageTitle(typeof title === 'string' ? title : 'Eventos')
    const subtitle = db.getCmsValue('events_subtitle', 'Todos los eventos del Sesquicentenario UNI 2026')
    setPageSubtitle(typeof subtitle === 'string' ? subtitle : 'Todos los eventos del Sesquicentenario UNI 2026')
  }, [])
  const [activeMonth, setActiveMonth] = useState(() => {
    const spanishMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const currentMonthName = spanishMonths[new Date().getMonth()]
    const monthsOptions = ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return monthsOptions.includes(currentMonthName) ? currentMonthName : 'Todos'
  })
  const [activeCategory, setActiveCategory] = useState('Todos')
  
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFiltro = searchParams.get('filtro')

  // Cargar eventos desde localStorage
  const rawEvents = db.getEvents()
  const dbEvents = Array.isArray(rawEvents) ? rawEvents : []

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

  // Efecto para leer parámetros de búsqueda de la URL
  useEffect(() => {
    if (urlFiltro) {
      if (urlFiltro === 'conferencias') {
        setSearchQuery('Conferencia')
      } else if (urlFiltro === 'feria') {
        setSearchQuery('Feria')
      } else if (urlFiltro === 'culturales') {
        setActiveCategory('Cultural')
      }
    }
  }, [urlFiltro])

  const filteredEvents = dbEvents.filter(ev => {
    // 1. Filtro por búsqueda de texto (Query)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const titleMatch = ev.title?.toLowerCase().includes(q)
      const descMatch = ev.description?.toLowerCase().includes(q)
      const orgMatch = ev.organizer?.toLowerCase().includes(q)
      const locMatch = ev.location?.toLowerCase().includes(q)
      const catMatch = ev.category?.toLowerCase().includes(q)
      const tagsMatch = Array.isArray(ev.tags) ? ev.tags.some(tag => tag.toLowerCase().includes(q)) : false
      if (!titleMatch && !descMatch && !orgMatch && !locMatch && !catMatch && !tagsMatch) {
        return false
      }
    }

    // 2. Filtro por Mes
    if (activeMonth !== 'Todos') {
      const eventMonth = getEventMonth(ev.date)
      if (eventMonth !== activeMonth) {
        return false
      }
    }

    // 3. Filtro por Categoría
    if (activeCategory !== 'Todos') {
      if (ev.category !== activeCategory) {
        return false
      }
    }



    return true
  })

  const eventsInOtherMonths = (searchQuery.trim() !== '' && activeMonth !== 'Todos')
    ? dbEvents.filter(ev => {
        const q = searchQuery.toLowerCase()
        const titleMatch = ev.title?.toLowerCase().includes(q)
        const descMatch = ev.description?.toLowerCase().includes(q)
        const orgMatch = ev.organizer?.toLowerCase().includes(q)
        const locMatch = ev.location?.toLowerCase().includes(q)
        const catMatch = ev.category?.toLowerCase().includes(q)
        const tagsMatch = Array.isArray(ev.tags) ? ev.tags.some(tag => tag.toLowerCase().includes(q)) : false
        if (!titleMatch && !descMatch && !orgMatch && !locMatch && !catMatch && !tagsMatch) {
          return false
        }

        if (activeCategory !== 'Todos' && ev.category !== activeCategory) {
          return false
        }

        const eventMonth = getEventMonth(ev.date)
        if (eventMonth === activeMonth) {
          return false
        }

        return true
      })
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl sm:text-2xl font-black">{pageTitle}</h1>
          <p className="text-white/70 text-xs sm:text-sm mt-0.5">{pageSubtitle}</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main search and selectors row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="flex flex-col md:col-span-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Buscar</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por título, organizador, palabra clave o etiquetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 focus:border-[#800404] focus:outline-none transition-colors text-sm text-gray-800 bg-gray-50/50 rounded-none h-[38px]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Selectors grid: 3 columns on mobile, 6 columns span on desktop */}
            <div className="grid grid-cols-3 md:col-span-6 gap-2 md:gap-3 items-end">
              {/* Selector de Mes */}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mes</span>
                <select
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                  className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white font-medium focus:border-[#800404] focus:outline-none cursor-pointer rounded-none h-[38px] w-full"
                >
                  {months.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Selector de Categoría */}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categoría</span>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white font-medium focus:border-[#800404] focus:outline-none cursor-pointer rounded-none h-[38px] w-full"
                >
                  <option value="Todos">Todas</option>
                  <option value="Académico">Académico</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Egresados">Egresados</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Laboral">Laboral</option>
                </select>
              </div>

              {/* Botón Limpiar Filtros */}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveMonth('Todos')
                  setActiveCategory('Todos')
                  setSearchParams({})
                }}
                disabled={!(searchQuery || activeMonth !== 'Todos' || activeCategory !== 'Todos')}
                className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black px-2 py-2 transition-colors uppercase tracking-wider rounded-none h-[38px] w-full ${
                  (searchQuery || activeMonth !== 'Todos' || activeCategory !== 'Todos')
                    ? 'text-[#800404] hover:text-[#5a0303] border border-[#800404]/20 hover:bg-red-50/50 cursor-pointer'
                    : 'text-gray-350 border border-gray-200 bg-gray-50/80 cursor-not-allowed opacity-60'
                }`}
              >
                <X size={11} className="shrink-0" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {activeMonth === 'Todos' ? 'Todos los Eventos' : `${activeMonth} 2026`}
            </h2>
            {activeCategory !== 'Todos' || searchQuery ? (
              <p className="text-xs font-bold text-[#800404] mt-1 uppercase tracking-wider">
                Filtros activos: {[
                  activeCategory !== 'Todos' && `Categoría: ${activeCategory}`,
                  searchQuery && `Búsqueda: "${searchQuery}"`
                ].filter(Boolean).join(' | ')}
              </p>
            ) : null}
          </div>
          <span className="text-sm font-bold text-gray-400 shrink-0">
            {filteredEvents.length} evento(s) encontrado(s)
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-300 bg-white border border-dashed border-gray-200">
            <Calendar size={32} className="mx-auto mb-2 opacity-30 text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">
              No se encontraron eventos con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(ev => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}

        {/* Sección de eventos recomendados en otros meses */}
        {eventsInOtherMonths.length > 0 && (
          <div className="mt-12">
            <div className="border-b border-gray-200 pb-3 mb-6">
              <h3 className="text-base sm:text-lg font-black text-[#800404] uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#800404]"></span>
                Eventos con esta búsqueda en otros meses
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Se encontraron los siguientes eventos que coinciden con "{searchQuery}" fuera del mes de {activeMonth}.
              </p>
            </div>
            <div className="space-y-3">
              {eventsInOtherMonths.map(ev => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
