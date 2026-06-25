import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, User, ChevronDown, Calendar, CreditCard, Award, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

const navLinks = [
  { label: 'Inicio', path: '/' },
  { label: 'Eventos', path: '/cronograma' },
  { label: 'Inscripción', path: '/inscripcion' },
  { label: 'Certificados', path: '/certificados' },
  { label: 'Cena de Gala', path: '/cena-gala' },
  { label: 'Validar Certificado', path: '/validar' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown and menu on path change
  useEffect(() => {
    setDropdownOpen(false)
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
      {/* Top bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 text-xs text-gray-600">
          <div className="flex items-center gap-6">
            <span className="font-black text-[#800404] uppercase tracking-wider">UNI</span>
            <span className="hidden sm:inline">Sesquicentenario 2026</span>
            <span className="hidden sm:inline">UNICODE</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cena-gala" className="hover:text-[#800404] transition-colors">Cena de Gala</Link>
            <Link to="/validar" className="hover:text-[#800404] transition-colors">Validar Certificado</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Sesquicentenario UNI 150 años"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {navLinks.map(link => (
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
          ))}
        </nav>

        {/* Action Buttons / Profile info */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-[#800404] transition-colors cursor-pointer">
            <Search size={20} />
          </button>
          
          {/* User state buttons */}
          {user ? (
            /* Logged in: Dropdown profile menu */
            <div className="relative hidden sm:block" ref={dropdownRef}>
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

              {/* Dropdown Card */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white border border-gray-200 shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Dropdown User header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-black text-gray-800 truncate">{user.nombres} {user.apellidos}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    {!user.verified && (
                      <span className="mt-2 inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                        Cuenta no verificada
                      </span>
                    )}
                  </div>
                  
                  {/* Dropdown Options */}
                  <div className="py-1">
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm font-black text-[#800404] hover:bg-red-50 transition-colors flex"
                      >
                        <Shield size={15} />
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => navigateToTab('perfil')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer"
                    >
                      <User size={15} />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => navigateToTab('eventos')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer"
                    >
                      <Calendar size={15} />
                      Mis Eventos
                    </button>
                    <button
                      onClick={() => navigateToTab('entradas')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer"
                    >
                      <CreditCard size={15} />
                      Mis Entradas
                    </button>
                    <button
                      onClick={() => navigateToTab('certificados')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer"
                    >
                      <Award size={15} />
                      Certificados
                    </button>
                    <button
                      onClick={() => navigateToTab('configuracion')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#800404] transition-colors cursor-pointer"
                    >
                      <Settings size={15} />
                      Configuración
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1 bg-gray-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={15} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out: Login and Register buttons styled dynamically */
            <div className="hidden sm:flex items-center gap-3">
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

          {/* Hamburger (Mobile nav toggle) */}
          <button
            className="lg:hidden p-2 bg-[#800404] text-white hover:bg-[#5a0303] transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
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
            {navLinks.map(link => (
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
            ))}
          </div>

          {/* User state links in Mobile */}
          <div className="bg-gray-50 p-6 border-t border-gray-200 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <img src={user.profilePic} className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                  <div>
                    <p className="text-sm font-black text-gray-800">{user.nombres} {user.apellidos}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/dashboard?tab=perfil') }}
                    className="border border-gray-200 bg-white p-2.5 font-bold text-gray-700 hover:bg-gray-150 cursor-pointer"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/dashboard?tab=eventos') }}
                    className="border border-gray-200 bg-white p-2.5 font-bold text-gray-700 hover:bg-gray-150 cursor-pointer"
                  >
                    Mis Eventos
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/dashboard?tab=entradas') }}
                    className="border border-gray-200 bg-white p-2.5 font-bold text-gray-700 hover:bg-gray-150 cursor-pointer"
                  >
                    Mis Entradas
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/dashboard?tab=certificados') }}
                    className="border border-gray-200 bg-white p-2.5 font-bold text-gray-700 hover:bg-gray-150 cursor-pointer"
                  >
                    Certificados
                  </button>
                </div>

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/admin') }}
                    className="w-full bg-[#800404] text-white py-2 font-black text-xs hover:bg-[#5a0303] transition-colors cursor-pointer mt-2"
                  >
                    Panel de Administración
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold py-2.5 text-sm transition-colors text-center block mt-3 cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </header>
  )
}
