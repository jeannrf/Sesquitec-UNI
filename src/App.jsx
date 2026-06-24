import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Cronograma from './pages/Cronograma'
import Inscripcion from './pages/Inscripcion'
import Certificados from './pages/Certificados'
import CenaGala from './pages/CenaGala'
import Validar from './pages/Validar'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/inscripcion" element={<Inscripcion />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/cena-gala" element={<CenaGala />} />
          <Route path="/validar" element={<Validar />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
