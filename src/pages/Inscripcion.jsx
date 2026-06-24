import { useState } from 'react'
import { CheckCircle, QrCode, Mail } from 'lucide-react'

const conferences = [
  { id: 'c1', time: '09:00', title: 'Inteligencia Artificial en la Ingeniería Peruana', speaker: 'Dr. Roberto Vargas', room: 'Auditorium A', quota: 200 },
  { id: 'c2', time: '09:00', title: 'Gestión de Proyectos con Metodologías Ágiles', speaker: 'Mg. Sofia Herrera', room: 'Auditorium B', quota: 150 },
  { id: 'c3', time: '11:00', title: 'Infraestructura Sostenible para el Siglo XXI', speaker: 'Mg. Carmen Flores', room: 'Auditorium C', quota: 180 },
  { id: 'c4', time: '11:00', title: 'Ciberseguridad en Sistemas Críticos', speaker: 'Dr. Andrés Gutiérrez', room: 'Aula Magna', quota: 300 },
  { id: 'c5', time: '13:00', title: 'Robótica e Industria 4.0 en el Perú', speaker: 'Ing. María Quispe', room: 'Auditorium A', quota: 200 },
  { id: 'c6', time: '13:00', title: 'Modelado BIM para Construcción Moderna', speaker: 'Arq. Javier Romero', room: 'Auditorium B', quota: 150 },
  { id: 'c7', time: '15:00', title: 'Energías Renovables y Transición Energética', speaker: 'Dr. Ana Torres', room: 'Auditorium C', quota: 180 },
  { id: 'c8', time: '15:00', title: 'Emprendimiento Tecnológico Universitario', speaker: 'Ing. Luis Mendoza', room: 'Aula Magna', quota: 300 },
  { id: 'c9', time: '17:00', title: 'Minería Sostenible y Tecnología Verde', speaker: 'Dr. Pablo Díaz', room: 'Auditorium A', quota: 200 },
  { id: 'c10', time: '17:00', title: 'Algoritmos para Optimización Industrial', speaker: 'Mg. Rosa Salinas', room: 'Auditorium B', quota: 150 },
]

const STEPS = ['Datos personales', 'Selección de conferencias', 'Confirmación']

export default function Inscripcion() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ nombres: '', apellidos: '', dni: '', email: '', telefono: '', tipo: 'estudiante' })
  const [selected, setSelected] = useState([])
  const [errors, setErrors] = useState({})

  const toggleConf = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const validateStep0 = () => {
    const e = {}
    if (!form.nombres.trim()) e.nombres = 'Campo requerido'
    if (!form.apellidos.trim()) e.apellidos = 'Campo requerido'
    if (!/^\d{8}$/.test(form.dni)) e.dni = 'DNI debe tener 8 dígitos'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep1 = () => {
    if (selected.length === 0) { setErrors({ conferences: 'Selecciona al menos una conferencia' }); return false }
    setErrors({}); return true
  }

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    setStep(s => s + 1)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-white border border-gray-200 p-10 text-center">
          <div className="w-20 h-20 bg-red-50 border-2 border-[#800404] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#800404]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">¡Inscripción exitosa!</h2>
          <p className="text-gray-500 mb-6">
            Hola <strong>{form.nombres}</strong>, tu registro fue confirmado.
            Hemos enviado un correo a <strong>{form.email}</strong> con tu código QR de acceso.
          </p>
          <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
            <QrCode size={80} className="mx-auto text-[#800404] mb-3" />
            <p className="text-xs text-gray-500">Tu QR único será enviado a tu correo electrónico</p>
            <p className="text-sm font-black text-gray-700 mt-2">DNI: {form.dni}</p>
          </div>
          <div className="text-left border-t border-gray-200 pt-4">
            <p className="text-sm font-black text-gray-700 mb-2">Conferencias seleccionadas ({selected.length})</p>
            <ul className="space-y-1">
              {conferences.filter(c => selected.includes(c.id)).map(c => (
                <li key={c.id} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle size={14} className="text-[#800404] mt-0.5 shrink-0" />
                  <span>{c.time} – {c.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[#800404] text-sm justify-center font-medium">
            <Mail size={16} />
            Revisa tu bandeja de entrada
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#800404] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">Inscripción al Evento</h1>
          <p className="text-white/70">Encuentro Internacional de Ingeniería UNI · 14 de Julio 2026</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                  i < step ? 'bg-[#800404] text-white' : i === step ? 'bg-[#800404] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-[#800404]' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-[#800404]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Step 0 */}
        {step === 0 && (
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Datos Personales</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key: 'nombres', label: 'Nombres *', type: 'text', placeholder: 'Ingresa tus nombres' },
                { key: 'apellidos', label: 'Apellidos *', type: 'text', placeholder: 'Ingresa tus apellidos' },
                { key: 'dni', label: 'DNI *', type: 'text', placeholder: '12345678' },
                { key: 'email', label: 'Correo electrónico *', type: 'email', placeholder: 'correo@ejemplo.com' },
                { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '999 999 999' },
              ].map(field => (
                <div key={field.key} className={field.key === 'email' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-[#800404] ${
                      errors[field.key] ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors[field.key] && <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de participante *</label>
                <div className="flex flex-wrap gap-4">
                  {['estudiante', 'egresado', 'docente', 'externo'].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipo"
                        value={t}
                        checked={form.tipo === t}
                        onChange={() => setForm(f => ({ ...f, tipo: t }))}
                        className="accent-[#800404]"
                      />
                      <span className="text-sm capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">Selección de Conferencias</h2>
              <span className="text-sm text-gray-400 font-medium">{selected.length}/10 seleccionadas</span>
            </div>
            {errors.conferences && <p className="text-red-500 text-sm mb-4">{errors.conferences}</p>}
            <div className="space-y-2">
              {conferences.map(c => (
                <label
                  key={c.id}
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    selected.includes(c.id)
                      ? 'border-[#800404] bg-red-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={() => toggleConf(c.id)}
                    className="mt-0.5 accent-[#800404] w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-[#800404] text-white text-xs font-black px-2 py-0.5">{c.time}</span>
                      <span className="text-xs text-gray-400">{c.room}</span>
                      <span className="text-xs text-gray-300">· {c.quota} cupos</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.speaker}</p>
                  </div>
                  {selected.includes(c.id) && <CheckCircle size={18} className="text-[#800404] shrink-0 mt-0.5" />}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Confirma tu Inscripción</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-black text-[#800404] mb-3 text-xs uppercase tracking-widest">Tus datos</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-3"><dt className="text-gray-400 w-24 shrink-0">Nombre:</dt><dd className="font-bold">{form.nombres} {form.apellidos}</dd></div>
                  <div className="flex gap-3"><dt className="text-gray-400 w-24 shrink-0">DNI:</dt><dd className="font-bold">{form.dni}</dd></div>
                  <div className="flex gap-3"><dt className="text-gray-400 w-24 shrink-0">Email:</dt><dd className="font-bold">{form.email}</dd></div>
                  <div className="flex gap-3"><dt className="text-gray-400 w-24 shrink-0">Tipo:</dt><dd className="font-bold capitalize">{form.tipo}</dd></div>
                </dl>
              </div>
              <div>
                <h3 className="font-black text-[#800404] mb-3 text-xs uppercase tracking-widest">
                  Conferencias ({selected.length})
                </h3>
                <ul className="space-y-2">
                  {conferences.filter(c => selected.includes(c.id)).map(c => (
                    <li key={c.id} className="flex items-start gap-2 text-sm">
                      <span className="bg-[#800404] text-white text-xs px-1.5 py-0.5 shrink-0 font-bold">{c.time}</span>
                      <span>{c.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-red-50 border border-[#800404]/20 text-sm text-gray-700">
              Al confirmar, recibirás un correo en <strong>{form.email}</strong> con tu <strong>código QR único</strong> de acceso vinculado a tu DNI.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-6 py-2.5 border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-[#800404] text-white font-black text-sm hover:bg-[#5a0303] transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              className="px-8 py-2.5 bg-[#800404] text-white font-black text-sm hover:bg-[#5a0303] transition-colors"
            >
              Confirmar Inscripción
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
