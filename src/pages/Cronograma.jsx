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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 mb-1.5">
            <span className="flex items-center gap-1"><Calendar size={12} className="text-gray-400 shrink-0" />{event.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} className="text-gray-400 shrink-0" />{event.time}</span>
            <span className="flex items-center gap-1"><MapPin size={12} className="text-gray-400 shrink-0" />{event.location}</span>
            {event.isPaid && (
              <span className="bg-[#800404] text-white text-[10px] font-bold px-2 py-0.5">PAGO · S/ 180</span>
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
      </div>      {open && (
        <div className="border-t border-gray-100 p-5 bg-gray-50 animate-fade-in">
          {isPost ? (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed text-justify">{event.description}</p>
              
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/60">
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  El evento ha finalizado
                </span>
                
                <div className="flex items-center gap-3">
                  {event.video && (
                    <a 
                      href={event.video} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-[#800404] hover:underline font-bold"
                    >
                      <Play size={12} className="fill-[#800404]" /> Ver video en YouTube
                    </a>
                  )}
                  <button
                    onClick={() => setIsRecapOpen(true)}
                    className="bg-[#800404] hover:bg-[#5a0303] text-white font-black px-4 py-2 text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer rounded-none shadow-sm hover:shadow active:scale-95"
                  >
                    <Play size={10} className="fill-white animate-pulse" /> Ver Recap
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed text-justify">{event.description}</p>
              
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/60">
                <div className="flex items-center gap-2">
                  {event.mapsUrl && (
                    <a 
                      href={event.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-[#800404] hover:underline font-bold"
                    >
                      <MapPin size={12} className="text-[#800404] shrink-0" /> Ver en Google Maps
                    </a>
                  )}
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsDetailsOpen(true)}
                    className="flex-1 sm:flex-initial text-center border border-[#800404] text-[#800404] font-black px-4 py-2 text-xs uppercase tracking-wider bg-white cursor-pointer"
                  >
                    Ver Evento
                  </button>
                  
                  {event.isSesquitec ? (
                    event.isPaid ? (
                      event.registrationOpen ? (
                        <Link
                          to="/encuentro-internacional"
                          className="flex-1 sm:flex-initial text-center bg-[#800404] text-white font-black px-4 py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <UserPlus size={14} /> Comprar entradas
                        </Link>
                      ) : (
                        <button disabled className="flex-1 sm:flex-initial text-center bg-gray-200 text-gray-400 font-bold px-4 py-2 text-xs uppercase tracking-wider cursor-not-allowed">
                          Cerrado
                        </button>
                      )
                    ) : event.registrationOpen ? (
                      isUserAlreadyRegistered ? (
                        <Link
                          to="/dashboard?tab=eventos"
                          className="flex-1 sm:flex-initial text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black px-4 py-2 text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                        >
                          <CheckCircle size={14} /> Ver mi inscripción
                        </Link>
                      ) : (
                        <button
                          onClick={handleQuickRegister}
                          disabled={isRegistering}
                          className="flex-1 sm:flex-initial text-center bg-[#800404] text-white font-black px-4 py-2 text-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60 uppercase tracking-wider"
                        >
                          {isRegistering ? (
                            <span className="animate-pulse">Procesando...</span>
                          ) : (
                            <><UserPlus size={14} /> Inscribirse</>
                          )}
                        </button>
                      )
                    ) : (
                      <button disabled className="flex-1 sm:flex-initial text-center bg-gray-200 text-gray-400 font-bold px-4 py-2 text-xs uppercase tracking-wider cursor-not-allowed">
                        Cerrado
                      </button>
                    )
                  ) : event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial text-center bg-[#800404] text-white font-black px-4 py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <UserPlus size={14} /> Inscribirse
                    </a>
                  ) : (
                    <button disabled className="flex-1 sm:flex-initial text-center bg-gray-100 text-gray-400 font-bold px-4 py-2 text-xs uppercase tracking-wider cursor-not-allowed border border-gray-250 opacity-60">
                      Próximamente
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
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
                    <div className="flex items-center gap-1.5 border-l border-gray-300 pl-2 ml-1">
                      {event.instagramUrl && (
                        <a
                          href={event.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80 p-0.5 flex items-center justify-center"
                          title="Visitar Instagram"
                        >
                          <img 
                            src="/logos_redes_sociales/instagram_logo.webp" 
                            alt="Instagram" 
                            className="w-5.5 h-5.5 object-contain"
                          />
                        </a>
                      )}
                      {event.linkedinUrl && (
                        <a
                          href={event.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80 p-0.5 flex items-center justify-center"
                          title="Visitar LinkedIn"
                        >
                          <img 
                            src="/logos_redes_sociales/linkedin_logo.webp" 
                            alt="LinkedIn" 
                            className="w-5.5 h-5.5 object-contain"
                          />
                        </a>
                      )}
                      {event.facebookUrl && (
                        <a
                          href={event.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80 p-0.5 flex items-center justify-center"
                          title="Visitar Facebook"
                        >
                          <img 
                            src="/logos_redes_sociales/facebook_logo.png" 
                            alt="Facebook" 
                            className="w-5.5 h-5.5 object-contain"
                          />
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
              {!isPost && (
                event.isSesquitec ? (
                  event.isPaid ? (
                    event.registrationOpen ? (
                      <Link
                        to="/encuentro-internacional"
                        className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none flex items-center gap-2"
                      >
                        <UserPlus size={14} /> Comprar entradas
                      </Link>
                    ) : (
                      <button disabled className="bg-gray-250 text-gray-400 text-xs font-bold px-6 py-2.5 uppercase tracking-wider cursor-not-allowed border border-gray-300">
                        Cerrado
                      </button>
                    )
                  ) : event.registrationOpen ? (
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
                            <UserPlus size={14} /> Inscribirse
                          </>
                        )}
                      </button>
                    )
                  ) : (
                    <button disabled className="bg-gray-250 text-gray-400 text-xs font-bold px-6 py-2.5 uppercase tracking-wider cursor-not-allowed border border-gray-300">
                      Cerrado
                    </button>
                  )
                ) : event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none flex items-center gap-2"
                  >
                    <UserPlus size={14} /> Inscribirse
                  </a>
                ) : (
                  <button disabled className="bg-gray-100 text-gray-400 text-xs font-bold px-6 py-2.5 uppercase tracking-wider cursor-not-allowed border border-gray-250 opacity-60">
                    Próximamente
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
                    <div className="flex items-center gap-1.5 border-l border-gray-300 pl-2 ml-1.5">
                      {event.instagramUrl && (
                        <a
                          href={event.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80 p-0.5 flex items-center justify-center"
                          title="Visitar Instagram del Organizador"
                        >
                          <img 
                            src="/logos_redes_sociales/instagram_logo.webp" 
                            alt="Instagram" 
                            className="w-5.5 h-5.5 object-contain"
                          />
                        </a>
                      )}
                      {event.linkedinUrl && (
                        <a
                          href={event.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80 p-0.5 flex items-center justify-center"
                          title="Visitar LinkedIn del Organizador"
                        >
                          <img 
                            src="/logos_redes_sociales/linkedin_logo.webp" 
                            alt="LinkedIn" 
                            className="w-5.5 h-5.5 object-contain"
                          />
                        </a>
                      )}
                      {event.facebookUrl && (
                        <a
                          href={event.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80 p-0.5 flex items-center justify-center"
                          title="Visitar Facebook del Organizador"
                        >
                          <img 
                            src="/logos_redes_sociales/facebook_logo.png" 
                            alt="Facebook" 
                            className="w-5.5 h-5.5 object-contain"
                          />
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
                      className="flex items-center gap-2 px-3 py-1.5 border border-pink-200 bg-pink-50/40 text-pink-700 hover:bg-pink-50 text-xs font-bold uppercase transition-all duration-200 hover:shadow-sm"
                    >
                      <img 
                        src="/logos_redes_sociales/instagram_logo.webp" 
                        alt="Instagram" 
                        className="w-5.5 h-5.5 shrink-0 object-contain"
                      />
                      Instagram
                    </a>
                  )}
                  {event.linkedinUrl && (
                    <a
                      href={event.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 bg-blue-50/40 text-blue-700 hover:bg-blue-50 text-xs font-bold uppercase transition-all duration-200 hover:shadow-sm"
                    >
                      <img 
                        src="/logos_redes_sociales/linkedin_logo.webp" 
                        alt="LinkedIn" 
                        className="w-5.5 h-5.5 shrink-0 object-contain"
                      />
                      LinkedIn
                    </a>
                  )}
                  {event.facebookUrl && (
                    <a
                      href={event.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50 text-xs font-bold uppercase transition-all duration-200 hover:shadow-sm"
                    >
                      <img 
                        src="/logos_redes_sociales/facebook_logo.png" 
                        alt="Facebook" 
                        className="w-5.5 h-5.5 shrink-0 object-contain"
                      />
                      Facebook
                    </a>
                  )}
                  {event.recapVideoId && (
                    <a
                      href={event.recapVideoId.startsWith('http') ? event.recapVideoId : `https://www.youtube.com/watch?v=${event.recapVideoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 border border-red-200 bg-red-50/40 text-red-700 hover:bg-red-50 text-xs font-bold uppercase transition-all duration-200 hover:shadow-sm"
                    >
                      <img 
                        src="/logos_redes_sociales/youtube_logo.png" 
                        alt="YouTube" 
                        className="w-5.5 h-5.5 shrink-0 object-contain"
                      />
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
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-row items-center gap-2 w-full">
            {/* Search Input Container */}
            <div className="flex-1 min-w-0">
              <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Buscar</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 pl-8 pr-7 py-2 focus:border-[#800404] focus:outline-none transition-colors text-xs sm:text-sm text-gray-800 bg-gray-50/50 rounded-none h-[36px]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Mes Selector */}
            <div className="w-[85px] sm:w-[120px] shrink-0">
              <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mes</span>
              <select
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                className="border border-gray-300 px-1.5 sm:px-2.5 py-2 text-xs sm:text-sm text-gray-700 bg-white font-medium focus:border-[#800404] focus:outline-none cursor-pointer rounded-none h-[36px] w-full"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Categoría Selector */}
            <div className="w-[100px] sm:w-[140px] shrink-0">
              <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categoría</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="border border-gray-300 px-1.5 sm:px-2.5 py-2 text-xs sm:text-sm text-gray-700 bg-white font-medium focus:border-[#800404] focus:outline-none cursor-pointer rounded-none h-[36px] w-full"
              >
                <option value="Todos">Todas</option>
                <option value="Académico">Académico</option>
                <option value="Cultural">Cultural</option>
                <option value="Egresados">Egresados</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Laboral">Laboral</option>
              </select>
            </div>

            {/* Limpiar Filters Button */}
            <div className="shrink-0">
              <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 invisible">Acción</span>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveMonth('Todos')
                  setActiveCategory('Todos')
                  setSearchParams({})
                }}
                title="Limpiar filtros"
                disabled={!(searchQuery || activeMonth !== 'Todos' || activeCategory !== 'Todos')}
                className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black px-2 py-2 transition-colors uppercase tracking-wider rounded-none h-[36px] w-[36px] sm:w-auto ${
                  (searchQuery || activeMonth !== 'Todos' || activeCategory !== 'Todos')
                    ? 'text-[#800404] hover:text-[#5a0303] border border-[#800404]/20 hover:bg-red-50/50 cursor-pointer'
                    : 'text-gray-350 border border-gray-200 bg-gray-50/80 cursor-not-allowed opacity-60'
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-10">
        <div className="flex flex-col gap-1.5 mb-6 border-b border-gray-200 pb-4">
          <div className="flex flex-row items-baseline justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {activeMonth === 'Todos' ? 'Todos los Eventos' : `${activeMonth} 2026`}
            </h2>
            <span className="text-xs sm:text-sm font-bold text-gray-400 shrink-0">
              {filteredEvents.length} evento(s) encontrado(s)
            </span>
          </div>
          {activeCategory !== 'Todos' || searchQuery ? (
            <p className="text-xs font-bold text-[#800404] uppercase tracking-wider">
              Filtros activos: {[
                activeCategory !== 'Todos' && `Categoría: ${activeCategory}`,
                searchQuery && `Búsqueda: "${searchQuery}"`
              ].filter(Boolean).join(' | ')}
            </p>
          ) : null}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-4 px-4 text-gray-350 bg-white border border-dashed border-gray-200 flex flex-row items-center justify-center gap-2">
            <Calendar size={18} className="opacity-30 text-gray-400 shrink-0" />
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-none">
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
