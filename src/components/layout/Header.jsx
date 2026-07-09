import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, ChevronDown, Calendar, CreditCard, Award, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

const navLinks = [
  { label: 'Inicio', path: '/' },
  { label: 'Eventos', path: '/cronograma' },
  { label: 'Encuentro Internacional', path: '/encuentro-internacional' },
  { label: 'Certificados', path: '/certificados' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false)
  const [encuentroOpen, setEncuentroOpen] = useState(false)
  const [mobileEncuentroOpen, setMobileEncuentroOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const mobileProfileRef = useRef(null)
  const encuentroRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
        setMobileProfileOpen(false)
      }
      if (encuentroRef.current && !encuentroRef.current.contains(event.target)) {
        setEncuentroOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown and menu on path change
  useEffect(() => {
    setDropdownOpen(false)
    setMobileProfileOpen(false)
    setEncuentroOpen(false)
    setMobileEncuentroOpen(false)
    setMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const navigateToTab = (tabName) => {
    setDropdownOpen(false)
    navigate(`/dashboard?tab=${tabName}`)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 relative">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Sesquicentenario UNI 150 años"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {navLinks.map(link => {
            if (link.subLinks) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  ref={encuentroRef}
                  onMouseEnter={() => setEncuentroOpen(true)}
                  onMouseLeave={() => setEncuentroOpen(false)}
                >
                  <button
                    className={`px-4 py-5 text-sm font-medium transition-colors relative border-b-2 flex items-center gap-1.5 cursor-pointer ${
                      location.pathname === link.path || link.subLinks.some(s => location.pathname === s.path)
                        ? 'text-[#800404] border-[#800404]'
                        : 'text-gray-700 border-transparent hover:text-[#800404]'
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${encuentroOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {encuentroOpen && (
                    <div className="absolute left-0 mt-0 w-72 bg-white border border-gray-200 shadow-xl py-1 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                      {link.subLinks.map(subLink => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className={`block px-4 py-2.5 text-sm transition-colors text-left font-semibold ${
                            location.pathname === subLink.path
                              ? 'bg-red-50 text-[#800404]'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-[#800404]'
                          }`}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-5 text-sm font-medium transition-colors relative border-b-2 ${
                  location.pathname === link.path
                    ? 'text-[#800404] border-[#800404]'
                    : 'text-gray-700 border-transparent hover:text-[#800404]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons / Profile info */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Desktop: User state buttons */}
          {user ? (
            /* Logged in: Desktop Dropdown profile menu */
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer rounded-none"
              >
                <img 
                  src={user.profilePic} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full object-cover border border-gray-200" 
                />
                <span className="text-sm font-bold text-gray-700">Perfil</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Dropdown Card */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white border border-gray-200 shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-black text-gray-800 truncate">{user.nombres} {user.apellidos}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    {!user.verified && (
                      <span className="mt-2 inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                        Cuenta no verificada
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm font-black text-[#800404] hover:bg-red-50 transition-colors"
                      >
                        <Shield size={15} />
                        Panel Admin
                      </Link>
                    )}
                    <button onClick={() => navigateToTab('perfil')} className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <User size={15} /> Mi Perfil
                    </button>
                    <button onClick={() => navigateToTab('eventos')} className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <Calendar size={15} /> Mis Eventos
                    </button>
                    <button onClick={() => navigateToTab('certificados')} className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <Award size={15} /> Certificados
                    </button>
                    <button onClick={() => navigateToTab('configuracion')} className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <Settings size={15} /> Configuración
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1 bg-gray-50">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                      <LogOut size={15} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out: Desktop Login and Register buttons */
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/iniciar-sesion"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm px-5 py-2 transition-colors flex items-center justify-center rounded-none shadow-sm"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registrarse"
                className="bg-[#800404] hover:bg-[#5a0303] text-white font-bold text-sm px-5 py-2 transition-colors flex items-center justify-center rounded-none shadow-sm"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile/Tablet: Profile button (separate from hamburger) */}
          {user ? (
            <div className="relative lg:hidden" ref={mobileProfileRef}>
              <button
                onClick={() => { setMobileProfileOpen(!mobileProfileOpen); setMenuOpen(false) }}
                className="p-1.5 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer rounded-full"
              >
                <img 
                  src={user.profilePic} 
                  alt="Mi Perfil" 
                  className="w-7 h-7 rounded-full object-cover" 
                />
              </button>

              {/* Mobile Profile Dropdown */}
              {mobileProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-200 shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3.5 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-black text-gray-800 truncate">{user.nombres} {user.apellidos}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-black text-[#800404] hover:bg-red-50 transition-colors"
                      >
                        <Shield size={15} /> Panel Admin
                      </Link>
                    )}
                    <button onClick={() => { setMobileProfileOpen(false); navigate('/dashboard?tab=perfil') }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <User size={15} /> Mi Perfil
                    </button>
                    <button onClick={() => { setMobileProfileOpen(false); navigate('/dashboard?tab=eventos') }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <Calendar size={15} /> Mis Eventos
                    </button>
                    <button onClick={() => { setMobileProfileOpen(false); navigate('/dashboard?tab=certificados') }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <Award size={15} /> Certificados
                    </button>
                    <button onClick={() => { setMobileProfileOpen(false); navigate('/dashboard?tab=configuracion') }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer">
                      <Settings size={15} /> Configuración
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1 bg-gray-50">
                    <button onClick={() => { setMobileProfileOpen(false); handleLogout() }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                      <LogOut size={15} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mobile/Tablet: Login button when logged out */
            <Link
              to="/iniciar-sesion"
              className="lg:hidden flex items-center gap-1.5 text-sm font-bold text-gray-700 border border-gray-200 px-3 py-1.5 hover:bg-gray-50 transition-colors rounded-none"
            >
              <User size={16} />
              <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}

          {/* Hamburger (Mobile/Tablet nav toggle) */}
          <button
            className="lg:hidden p-2 bg-[#800404] text-white hover:bg-[#5a0303] transition-colors cursor-pointer"
            onClick={() => { setMenuOpen(!menuOpen); setMobileProfileOpen(false) }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-inner max-h-[85vh] overflow-y-auto">
          {/* Main Links */}
          <div className="py-2">
            {navLinks.map(link => {
              if (link.subLinks) {
                const isActive = link.subLinks.some(s => location.pathname === s.path)
                return (
                  <div key={link.label} className="border-b border-gray-100">
                    <button
                      onClick={() => setMobileEncuentroOpen(!mobileEncuentroOpen)}
                      className={`w-full flex items-center justify-between px-6 py-3.5 text-sm font-bold cursor-pointer ${
                        isActive ? 'text-[#800404] bg-red-50/50' : 'text-gray-750 hover:bg-gray-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${mobileEncuentroOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileEncuentroOpen && (
                      <div className="bg-gray-50/40 border-t border-gray-100/50 py-1 pl-4 flex flex-col">
                        {link.subLinks.map(subLink => (
                          <Link
                            key={subLink.path}
                            to={subLink.path}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-6 py-2.5 text-xs font-semibold ${
                              location.pathname === subLink.path
                                ? 'text-[#800404] border-l-2 border-[#800404] pl-5'
                                : 'text-gray-650 hover:text-[#800404]'
                            }`}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-3 text-sm font-medium border-b border-gray-100 ${
                    location.pathname === link.path
                      ? 'text-[#800404] bg-red-50 border-l-4 border-l-[#800404]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Auth buttons for non-logged-in users in mobile menu */}
          {!user && (
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                <Link
                  to="/iniciar-sesion"
                  onClick={() => setMenuOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold py-2.5 text-sm transition-colors text-center block"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registrarse"
                  onClick={() => setMenuOpen(false)}
                  className="w-full bg-[#800404] hover:bg-[#5a0303] text-white font-bold py-2.5 text-sm transition-colors text-center block"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
