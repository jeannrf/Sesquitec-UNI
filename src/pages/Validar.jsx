import { useState } from 'react'
import { QrCode, Search, CheckCircle, XCircle, Shield } from 'lucide-react'

const mockValidations = {
  'CERT-UNI-2026-72341567-001': {
    valid: true,
    titular: 'Juan Carlos Pérez López',
    dni: '72341567',
    evento: 'Simposio de Ciencias Básicas',
    fecha: '10 de Junio, 2026',
    horas: 4,
    tipo: 'Participación',
    rector: 'Dr. Alfonso Fujimori Morel',
    emision: '15 de Junio, 2026',
  },
  'CERT-UNI-2026-45678901-002': {
    valid: true,
    titular: 'María Fernanda González Soto',
    dni: '45678901',
    evento: 'Foro de Innovación Tecnológica',
    fecha: '18 de Junio, 2026',
    horas: 3,
    tipo: 'Ponente',
    rector: 'Dr. Alfonso Fujimori Morel',
    emision: '22 de Junio, 2026',
  },
}

export default function Validar() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleValidate = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setSearched(true)
    setResult(mockValidations[code.trim().toUpperCase()] || null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={32} className="text-white/50" />
            <h1 className="text-4xl font-black">Validador de Certificados</h1>
          </div>
          <p className="text-white/70 text-lg">
            Verifica la autenticidad de un certificado emitido por la Comisión del Sesquicentenario UNI
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-2">Ingresa el código</h2>
            <p className="text-sm text-gray-500 mb-6">El código de verificación aparece en el certificado bajo el código QR.</p>
            <form onSubmit={handleValidate} className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="CERT-UNI-2026-XXXXXXXX-XXX"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#800404] font-mono tracking-wider"
              />
              <button type="submit"
                className="w-full bg-[#800404] text-white font-black py-3 hover:bg-[#5a0303] transition-colors flex items-center justify-center gap-2">
                <Search size={18} />
                Verificar autenticidad
              </button>
            </form>
            <p className="mt-4 text-xs text-gray-300">Ejemplo: <span className="font-mono">CERT-UNI-2026-72341567-001</span></p>
          </div>

          <div className="bg-white border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
            <QrCode size={64} className="text-gray-200 mb-4" />
            <h3 className="font-black text-gray-700 mb-2">Escanea el código QR</h3>
            <p className="text-sm text-gray-400">
              Usa la cámara de tu dispositivo para escanear el código QR impreso en el certificado. Serás dirigido automáticamente a esta página.
            </p>
          </div>
        </div>

        {searched && (
          <>
            {result && result.valid ? (
              <div className="bg-white border-2 border-[#800404] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={28} className="text-[#800404]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#800404]">Certificado Válido y Auténtico</h2>
                    <p className="text-sm text-gray-400">Verificado por la Universidad Nacional de Ingeniería</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Titular del certificado</p>
                      <p className="font-black text-gray-900 text-xl">{result.titular}</p>
                      <p className="text-sm text-gray-400">DNI: {result.dni}</p>
                    </div>
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tipo</p>
                      <span className="inline-block bg-[#800404] text-white text-sm font-black px-3 py-1">{result.tipo}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Horas extracurriculares</p>
                      <p className="text-4xl font-black text-[#800404]">{result.horas}h</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Evento</p>
                      <p className="font-black text-gray-900">{result.evento}</p>
                      <p className="text-sm text-gray-400">{result.fecha}</p>
                    </div>
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Firmado por</p>
                      <p className="font-black text-gray-900">{result.rector}</p>
                      <p className="text-sm text-gray-400">Rector de la UNI</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fecha de emisión</p>
                      <p className="font-black text-gray-900">{result.emision}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-red-50 border border-[#800404]/20 text-xs text-gray-600 flex items-start gap-2">
                  <Shield size={14} className="shrink-0 mt-0.5 text-[#800404]" />
                  Este certificado fue emitido y verificado por la Comisión del Sesquicentenario de la Universidad Nacional de Ingeniería (UNI). La información presentada es auténtica y auditada.
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-black text-gray-700 mb-2">Certificado no encontrado</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  El código <strong className="font-mono">{code}</strong> no corresponde a ningún certificado registrado.
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-12 bg-red-50 border border-[#800404]/20 p-6">
          <h3 className="font-black text-[#800404] mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Shield size={16} />
            ¿Por qué verificar un certificado UNI?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Los certificados del Sesquicentenario son firmados digitalmente por el Rector de la Universidad Nacional de Ingeniería.
            Este portal permite a empleadores, empresas e instituciones confirmar en segundos que las horas extracurriculares registradas son verídicas y auditadas por la institución.
          </p>
        </div>
      </div>
    </div>
  )
}
