import { useState, useEffect } from 'react'
import { Search, Download, Award, FileText, AlertCircle, X, ShieldCheck } from 'lucide-react'
import { db, idbStorage } from '../services/db'

export default function Certificados() {
  const [dni, setDni] = useState('')
  const [pageTitle, setPageTitle] = useState(() => {
    const val = db.getCmsValue('certs_title', 'Mis Certificados')
    return typeof val === 'string' ? val : 'Mis Certificados'
  })
  const [pageSubtitle, setPageSubtitle] = useState(() => {
    const val = db.getCmsValue('certs_subtitle', 'Busca y descarga los certificados de tu participación en eventos del Sesquicentenario')
    return typeof val === 'string' ? val : 'Busca y descarga los certificados de tu participación en eventos del Sesquicentenario'
  })

  useEffect(() => {
    const title = db.getCmsValue('certs_title', 'Mis Certificados')
    setPageTitle(typeof title === 'string' ? title : 'Mis Certificados')
    const subtitle = db.getCmsValue('certs_subtitle', 'Busca y descarga los certificados de tu participación en eventos del Sesquicentenario')
    setPageSubtitle(typeof subtitle === 'string' ? subtitle : 'Busca y descarga los certificados de tu participación en eventos del Sesquicentenario')
  }, [])
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [activeCertPreview, setActiveCertPreview] = useState(null)
  const [activePdfUrl, setActivePdfUrl] = useState(null)
  const [activePdfCertCode, setActivePdfCertCode] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!/^\d{8}$/.test(dni)) { setError('Ingresa un DNI válido de 8 dígitos'); return }
    setError('')
    setSearched(true)
    const certs = db.getCertificates()
    setResults(certs.filter(c => c.dni === dni))
  }

  const handleViewCert = async (cert) => {
    try {
      const fileBlob = await idbStorage.getFile(cert.id)
      if (fileBlob) {
        const url = URL.createObjectURL(fileBlob)
        setActivePdfUrl(url)
        setActivePdfCertCode(cert.codigoValidacion)
        return
      }
    } catch (err) {
      console.error("Error retrieving PDF from IndexedDB:", err)
    }

    if (cert.pdfUrl) {
      setActivePdfUrl(cert.pdfUrl)
      setActivePdfCertCode(cert.codigoValidacion)
      return
    }

    // Fallback: generate simulated raw PDF
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
(${cert.titular ? cert.titular.toUpperCase() : ''}) Tj
/F1 11 Tf
0 -40 Td
(Por haber asistido satisfactoriamente al evento oficial de la celebracion del Sesquicentenario:) Tj
/F1 14 Tf
0 -25 Td
(${cert.evento}) Tj
/F1 10 Tf
0 -35 Td
(Emitido: ${cert.emitido}) Tj
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
    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    setActivePdfUrl(url)
    setActivePdfCertCode(cert.codigoValidacion)
  }

  const handleDownload = async (cert) => {
    try {
      const fileBlob = await idbStorage.getFile(cert.id)
      if (fileBlob) {
        const url = URL.createObjectURL(fileBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Certificado-${cert.codigoValidacion}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return
      }
    } catch (err) {
      console.error("Error retrieving PDF from IndexedDB:", err)
    }

    if (cert.pdfUrl) {
      window.open(cert.pdfUrl, '_blank')
      return
    }

    // Fallback: generate simulated raw PDF
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
(${cert.titular ? cert.titular.toUpperCase() : ''}) Tj
/F1 11 Tf
0 -40 Td
(Por haber asistido satisfactoriamente al evento oficial de la celebracion del Sesquicentenario:) Tj
/F1 14 Tf
0 -25 Td
(${cert.evento}) Tj
/F1 10 Tf
0 -35 Td
(Emitido: ${cert.emitido}) Tj
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
    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Certificado-${cert.codigoValidacion}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-xl sm:text-2xl font-black">{pageTitle}</h1>
          <p className="text-white/70 text-xs sm:text-sm mt-0.5">{pageSubtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search box */}
        <div className="bg-white border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-2">Buscar por DNI</h2>
          <p className="text-sm text-gray-505 mb-6">
            Ingresa tu número de DNI de 8 dígitos para ver todos los certificados emitidos a tu nombre.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md">
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
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Código: {cert.codigoValidacion}</span>
                        <h4 className="font-black text-gray-900 text-lg">{cert.evento}</h4>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                          <span>Emitido: {cert.emitido}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewCert(cert)}
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
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
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

      {/* PDF VIEWER MODAL OVERLAY */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative border-t-8 border-t-[#800404] rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h3 className="text-base font-black text-gray-900">
                Visualización de Certificado ({activePdfCertCode})
              </h3>
              <button 
                onClick={() => {
                  if (activePdfUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(activePdfUrl);
                  }
                  setActivePdfUrl(null);
                  setActivePdfCertCode(null);
                }}
                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Body: iframe */}
            <div className="flex-1 bg-gray-100 overflow-hidden relative">
              <iframe
                src={`${activePdfUrl}#toolbar=0&navpanes=0`}
                title="Certificado PDF"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
