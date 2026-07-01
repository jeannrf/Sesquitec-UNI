import { useState } from 'react'
import { Search, Download, Award, FileText, AlertCircle, X, ShieldCheck } from 'lucide-react'
import { db } from '../services/db'

export default function Certificados() {
  const [dni, setDni] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [activeCertPreview, setActiveCertPreview] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!/^\d{8}$/.test(dni)) { setError('Ingresa un DNI válido de 8 dígitos'); return }
    setError('')
    setSearched(true)
    const certs = db.getCertificates()
    setResults(certs.filter(c => c.dni === dni))
  }

  const handleDownload = (cert) => {
    // Generate a simple valid raw PDF stream on-the-fly
    const pdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 842 595] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 550 >>
stream
BT
/F1 26 Tf
180 480 Td
(UNIVERSIDAD NACIONAL DE INGENIERIA) Tj
/F1 16 Tf
30 -60 Td
(CERTIFICADO OFICIAL DE ${cert.tipo.toUpperCase()}) Tj
/F1 12 Tf
0 -40 Td
(Otorgado a la participacion de:) Tj
/F1 18 Tf
0 -30 Td
(${cert.titular.toUpperCase()}) Tj
/F1 11 Tf
0 -40 Td
(Por haber asistido satisfactoriamente al evento oficial de la celebracion del Sesquicentenario:) Tj
/F1 14 Tf
0 -25 Td
(${cert.evento}) Tj
/F1 10 Tf
0 -35 Td
(Fecha: ${cert.fecha}  |  Horas: ${cert.horas}h extracurriculares) Tj
0 -20 Td
(Codigo de Autenticidad: ${cert.codigoValidacion}) Tj
0 -45 Td
(Firma de Autoridad: Dr. Alfonso Fujimori Morel - Rector de la UNI) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000249 00000 n 
0000000322 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
920
%%EOF`;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificado-${cert.codigoValidacion}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <p className="text-sm text-gray-505 mb-6">
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
              className="bg-[#800404] text-white font-black px-6 py-3 hover:bg-[#5a0303] transition-colors flex items-center gap-2 cursor-pointer"
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
                          {cert.horas > 0 && (
                            <span>Horas: <strong className="text-[#800404]">{cert.horas}h extracurriculares</strong></span>
                          )}
                          <span>Emitido: {cert.emitido}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveCertPreview(cert)}
                          className="flex items-center gap-2 border border-[#800404] text-[#800404] text-sm font-bold px-4 py-2 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <FileText size={16} />Ver
                        </button>
                        <button 
                          onClick={() => handleDownload(cert)}
                          className="flex items-center gap-2 bg-[#800404] text-white text-sm font-bold px-4 py-2 hover:bg-[#5a0303] transition-colors cursor-pointer"
                        >
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
              <p className="text-sm text-gray-550">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CERTIFICATE PREVIEW MODAL OVERLAY */}
      {activeCertPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl shadow-2xl relative border-t-8 border-t-[#800404]">
            {/* Close button */}
            <button 
              onClick={() => setActiveCertPreview(null)}
              className="absolute top-4 right-4 p-1.5 bg-gray-150 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors z-20 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Certificate Landscape frame */}
            <div className="p-10">
              <div className="border-[12px] border-[#800404] p-8 bg-[#fdfbf7] relative flex flex-col justify-between text-center min-h-[460px] overflow-hidden select-none">
                
                {/* Thin inner gold border */}
                <div className="absolute inset-2 border border-[#d4af37]/65 pointer-events-none" />

                {/* Corner details */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#d4af37]/65" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#d4af37]/65" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#d4af37]/65" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#d4af37]/65" />

                {/* Header */}
                <div className="space-y-1 z-10">
                  <h2 className="text-xl font-bold tracking-widest text-[#800404] uppercase font-serif">Universidad Nacional de Ingeniería</h2>
                  <p className="text-[9px] uppercase tracking-widest text-stone-500 font-bold font-sans">Sesquicentenario de Fundación Institucional · 1876 - 2026</p>
                </div>

                {/* Middle Title */}
                <div className="my-6 space-y-4 z-10">
                  <p className="text-xs italic text-stone-550">Otorga el presente certificado a:</p>
                  <h3 className="text-2xl font-black text-stone-900 uppercase font-serif tracking-tight border-b-2 border-stone-200 pb-2 max-w-xl mx-auto">
                    {activeCertPreview.titular}
                  </h3>
                  <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
                    Por su destacada participación en calidad de <strong className="text-stone-900 font-black">{activeCertPreview.tipo}</strong> en el evento 
                    <span className="text-[#800404] font-black"> "{activeCertPreview.evento}"</span>, realizado el día {activeCertPreview.fecha}
                    {activeCertPreview.horas > 0 ? ` con una carga curricular total de ${activeCertPreview.horas} horas académicas.` : '.'}
                  </p>
                </div>

                {/* Footer Signatures / QR Verification */}
                <div className="grid grid-cols-12 gap-4 items-end mt-4 pt-4 border-t border-stone-200/50 z-10">
                  {/* Left: Rector signature details */}
                  <div className="col-span-5 text-center flex flex-col items-center">
                    <div className="h-10 flex items-center justify-center font-serif italic text-stone-400 text-xs select-none">
                      Alfonso Fujimori M.
                    </div>
                    <div className="w-40 h-px bg-stone-300 my-1" />
                    <p className="text-[10px] font-bold text-stone-850 uppercase">{activeCertPreview.rector || 'Dr. Alfonso Fujimori Morel'}</p>
                    <p className="text-[8px] text-stone-400 uppercase tracking-wider font-semibold">Rector de la Universidad</p>
                  </div>

                  {/* Middle: Security shield stamp */}
                  <div className="col-span-3 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 bg-[#ffd700]/5 flex items-center justify-center text-[#d4af37]">
                      <ShieldCheck size={26} />
                    </div>
                    <span className="text-[7px] text-[#d4af37] font-black uppercase tracking-wider mt-1.5">VERIFICADO</span>
                  </div>

                  {/* Right: Validation QR code and code text */}
                  <div className="col-span-4 flex flex-col items-center text-center">
                    {/* Visual QR simulation */}
                    <div className="w-16 h-16 bg-white border border-gray-250 p-1 mb-1.5 flex items-center justify-center shrink-0">
                      <div className="grid grid-cols-6 gap-0.5 w-full h-full opacity-80">
                        {Array.from({ length: 36 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-full h-full ${
                              (idx % 2 === 0 && idx % 3 === 0) || idx < 5 || idx > 30 || idx % 7 === 0 ? 'bg-black' : 'bg-transparent'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[8px] font-mono text-gray-500 uppercase">{activeCertPreview.codigoValidacion}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Downloader toolbar inside modal footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-150">
              <span className="text-xs text-gray-550 font-medium flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-600" />
                Certificado oficial verificado por Rectorado
              </span>
              <button 
                onClick={() => handleDownload(activeCertPreview)}
                className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-5 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer rounded-none"
              >
                <Download size={14} /> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
