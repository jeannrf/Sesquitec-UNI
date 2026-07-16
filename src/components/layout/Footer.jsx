import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import logoUnicode from '../../assets/logo-unicode.png'
import { useAuth } from '../../context/AuthContext'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={logo}
              alt="Sesquicentenario UNI 150 años"
              className="h-14 w-auto object-contain mb-5"
              style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}
            />
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Celebrando 150 años de excelencia en ingeniería, ciencia y tecnología al servicio del Perú.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Desarrollado por</p>
              <a href="https://unicode.pe" target="_blank" rel="noopener noreferrer">
                <img
                  src={logoUnicode}
                  alt="UNICODE"
                  className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#800404]">Explorar</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/cronograma" className="hover:text-white transition-colors">Cronograma de Eventos</Link></li>
              <li><Link to="/cena-gala" className="hover:text-white transition-colors">Cena de Gala</Link></li>
              <li><Link to="/validar" className="hover:text-white transition-colors">Validar Certificado</Link></li>
            </ul>
          </div>

          {/* Mi Cuenta */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#800404]">Mi Cuenta</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {user ? (
                <>
                  <li><Link to="/dashboard?tab=eventos" className="hover:text-white transition-colors">Mis Entradas / QR</Link></li>
                  <li><Link to="/dashboard?tab=certificados" className="hover:text-white transition-colors">Mis Certificados</Link></li>
                  <li><Link to="/dashboard?tab=perfil" className="hover:text-white transition-colors">Editar Perfil</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/iniciar-sesion" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                  <li><Link to="/registrarse" className="hover:text-white transition-colors">Registrarse</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#800404]">Institucional</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a 
                  href="https://www.uni.edu.pe" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Universidad Nacional de Ingeniería
                </a>
              </li>
              <li>
                <a 
                  href="https://unicode.pe" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Portal UNICODE
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Universidad Nacional de Ingeniería — Comisión del Sesquicentenario</p>
          <div className="flex gap-4">
            <span className="text-gray-600">Aviso legal</span>
            <span className="text-gray-600">Política de privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
