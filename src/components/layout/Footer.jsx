import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import logoUnicode from '../../assets/logo-unicode.png'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src={logo}
              alt="Sesquicentenario UNI 150 años"
              className="h-16 w-auto object-contain mb-5"
              style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Celebrando 150 años de excelencia en ingeniería, ciencia y tecnología al servicio del Perú.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Desarrollado por</p>
              <img
                src={logoUnicode}
                alt="UNICODE"
                className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#800404]">Sesquicentenario</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/cronograma" className="hover:text-white transition-colors">Cronograma de Eventos</Link></li>
              <li><Link to="/certificados" className="hover:text-white transition-colors">Mis Certificados</Link></li>
              <li><Link to="/cena-gala" className="hover:text-white transition-colors">Cena de Gala</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#800404]">Servicios</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/validar" className="hover:text-white transition-colors">Validar Certificado</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Control de Asistencia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Panel Administrativo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#800404]">Universidad</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre la UNI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">UNICODE</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mapa del sitio</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Universidad Nacional de Ingeniería — Comisión del Sesquicentenario</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Aviso legal</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
