import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Cronograma from './pages/Cronograma'
import Certificados from './pages/Certificados'
import EncuentroInternacional from './pages/EncuentroInternacional'
import Validar from './pages/Validar'
import Dashboard from './pages/Dashboard'
import IniciarSesion from './pages/IniciarSesion'
import Registrarse from './pages/Registrarse'
import Admin from './pages/Admin'
import AuthModal from './components/auth/AuthModal'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { isAuthOpen, authView, closeAuth } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/inscripcion" element={<Navigate to="/" replace />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/encuentro-internacional" element={<EncuentroInternacional />} />
          <Route path="/cena-gala" element={<Navigate to="/encuentro-internacional" replace />} />
          <Route path="/validar" element={<Validar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Authentic Routes */}
          <Route path="/iniciar-sesion" element={<IniciarSesion />} />
          <Route path="/registrarse" element={<Registrarse />} />
          
          {/* Redirect aliases for login and registration */}
          <Route path="/login" element={<Navigate to="/iniciar-sesion" replace />} />
          <Route path="/registro" element={<Navigate to="/registrarse" replace />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Global Auth Modal for quick inline triggers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={closeAuth}
        initialView={authView}
      />
    </div>
  )
}
