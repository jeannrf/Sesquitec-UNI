import { useState } from 'react'
import { Search, Download, Award, FileText, AlertCircle } from 'lucide-react'
import { db } from '../services/db'

export default function Certificados() {
  const [dni, setDni] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!/^\d{8}$/.test(dni)) { setError('Ingresa un DNI válido de 8 dígitos'); return }
    setError('')
    setSearched(true)
    const certs = db.getCertificates()
    setResults(certs.filter(c => c.dni === dni))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">Mis Certificados</h1>
          <p className="text-white/70">Busca y descarga los certificados de tu participación en eventos del Sesquicentenario</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search box */}
        <div className="bg-white border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-2">Buscar por DNI</h2>
          <p className="text-sm text-gray-500 mb-6">
            Ingresa tu número de DNI de 8 dígitos para ver todos los certificados emitidos a tu nombre.
          </p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
            <div className="flex-1">
              <input
                type="text"
                value={dni}
                onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Ej: 72341567"
                maxLength={8}
                className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-[#800404] text-center text-lg font-black tracking-widest ${
                  error ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="bg-[#800404] text-white font-black px-6 py-3 hover:bg-[#5a0303] transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              Buscar
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <>
            {results && results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900">
                    {results.length} certificado(s) para DNI: {dni}
                  </h3>
                </div>
                <div className="space-y-4">
                  {results.map(cert => (
                    <div key={cert.id} className="bg-white border border-gray-200 border-l-4 border-l-[#800404] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                        <Award size={28} className="text-[#800404]" />
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block text-xs font-black px-2.5 py-1 mb-2 ${
                          cert.tipo === 'Ponencia' ? 'bg-gray-900 text-white' : 'bg-[#800404] text-white'
                        }`}>
                          {cert.tipo}
                        </span>
                        <h4 className="font-black text-gray-900 text-lg">{cert.evento}</h4>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                          <span>Fecha: {cert.fecha}</span>
                          <span>Horas: <strong className="text-[#800404]">{cert.horas}h extracurriculares</strong></span>
                          <span>Emitido: {cert.emitido}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 border border-[#800404] text-[#800404] text-sm font-bold px-4 py-2 hover:bg-red-50 transition-colors">
                          <FileText size={16} />Ver
                        </button>
                        <button className="flex items-center gap-2 bg-[#800404] text-white text-sm font-bold px-4 py-2 hover:bg-[#5a0303] transition-colors">
                          <Download size={16} />Descargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-red-50 border border-[#800404]/20 flex items-start gap-3 text-sm text-gray-700">
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-[#800404]" />
                  <p>Cada certificado contiene un <strong>código QR institucional</strong> que permite a empresas e instituciones verificar su autenticidad en este portal.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <Award size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-xl font-black text-gray-700 mb-2">No se encontraron certificados</h3>
                <p className="text-gray-400 text-sm">
                  El DNI <strong>{dni}</strong> no tiene certificados emitidos aún.
                </p>
              </div>
            )}
          </>
        )}

        {/* Info */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {[
            { icon: <Search size={24} className="text-[#800404]" />, title: '1. Busca por DNI', desc: 'Ingresa tu número de DNI de 8 dígitos para ver todos tus certificados.' },
            { icon: <FileText size={24} className="text-[#800404]" />, title: '2. Visualiza y Descarga', desc: 'Descarga el PDF firmado digitalmente por el Rector de la UNI.' },
            { icon: <Award size={24} className="text-[#800404]" />, title: '3. Verifica el QR', desc: 'Empresas pueden escanear el QR del certificado para validar su autenticidad.' },
          ].map(item => (
            <div key={item.title} className="bg-white border border-gray-200 p-6 text-center hover:border-[#800404] transition-colors">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <h4 className="font-black text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
