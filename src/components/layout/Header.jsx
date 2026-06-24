import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, User } from 'lucide-react'
import logo from '../../assets/logo.png'

const navLinks = [
  { label: 'Inicio', path: '/' },
  { label: 'Cronograma', path: '/cronograma' },
  { label: 'Inscripción', path: '/inscripcion' },
  { label: 'Certificados', path: '/certificados' },
  { label: 'Cena de Gala', path: '/cena-gala' },
  { label: 'Validar Certificado', path: '/validar' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 text-xs text-gray-600">
          <div className="flex items-center gap-6">
            <span className="font-black text-[#800404] uppercase tracking-wider">UNI</span>
            <span>Sesquicentenario 2026</span>
            <span>UNICODE</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cena-gala" className="hover:text-[#800404] transition-colors">Cena de Gala</Link>
            <Link to="/validar" className="hover:text-[#800404] transition-colors">Validar Certificado</Link>
            <button className="flex items-center gap-1 hover:text-[#800404] transition-colors">
              <User size={13} />
              Iniciar sesión
            </button>
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

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-[#800404] transition-colors">
            <Search size={20} />
          </button>
          <Link
            to="/inscripcion"
            className="hidden sm:block bg-[#800404] text-white text-sm font-bold px-5 py-2 hover:bg-[#5a0303] transition-colors"
          >
            Inscríbete
          </Link>
          <button
            className="lg:hidden p-2 bg-[#800404] text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
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
      )}
    </header>
  )
}
