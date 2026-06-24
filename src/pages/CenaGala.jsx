import { useState } from 'react'
import { Minus, Plus, CreditCard, CheckCircle, Users, Calendar, MapPin, Clock } from 'lucide-react'

const TICKET_PRICE = 180

export default function CenaGala() {
  const [quantity, setQuantity] = useState(1)
  const [companions, setCompanions] = useState([])
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paid, setPaid] = useState(false)
  const [buyerData, setBuyerData] = useState({ nombres: '', apellidos: '', dni: '', email: '', telefono: '' })
  const [errors, setErrors] = useState({})

  const handleQuantityChange = (val) => {
    const n = Math.max(1, Math.min(10, quantity + val))
    setQuantity(n)
    const comps = [...companions]
    while (comps.length < n - 1) comps.push({ nombre: '', apellido: '', dni: '' })
    setCompanions(comps.slice(0, n - 1))
  }

  const updateCompanion = (i, field, value) => {
    setCompanions(prev => { const u = [...prev]; u[i] = { ...u[i], [field]: value }; return u })
  }

  const validateBuyer = () => {
    const e = {}
    if (!buyerData.nombres.trim()) e.nombres = 'Requerido'
    if (!buyerData.apellidos.trim()) e.apellidos = 'Requerido'
    if (!/^\d{8}$/.test(buyerData.dni)) e.dni = 'DNI inválido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerData.email)) e.email = 'Email inválido'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validateBuyer()) return
    if (step === 1 && !paymentMethod) { setErrors({ payment: 'Selecciona un método de pago' }); return }
    setErrors({}); setStep(s => s + 1)
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-white border border-gray-200 p-10 text-center">
          <div className="w-20 h-20 bg-red-50 border-2 border-[#800404] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#800404]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">¡Pago completado!</h2>
          <p className="text-gray-500 mb-6">Tu compra fue exitosa. Se han reservado <strong>{quantity} entrada(s)</strong> para la Cena de Gala.</p>
          <div className="bg-gray-50 border border-gray-200 p-4 text-left space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span className="text-gray-400">Evento:</span><span className="font-bold">Cena de Gala de Egresados</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Fecha:</span><span className="font-bold">22 de Agosto, 2026</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Entradas:</span><span className="font-bold">{quantity}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total pagado:</span><span className="font-black text-[#800404]">S/ {(quantity * TICKET_PRICE).toLocaleString()}</span></div>
          </div>
          <p className="text-sm text-gray-400">Entradas con código QR enviadas a <strong>{buyerData.email}</strong></p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#800404] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-white text-[#800404] text-xs font-black px-3 py-1.5 mb-4 uppercase tracking-widest">
              Evento exclusivo para egresados
            </div>
            <h1 className="text-5xl font-black mb-4 leading-tight">
              Cena de Gala<br />
              <span className="text-white/50 text-3xl font-bold">Sesquicentenario UNI</span>
            </h1>
            <p className="text-white/70 text-lg mb-6">Celebra los 150 años de la UNI en una velada especial con cena, música en vivo y reconocimientos a egresados destacados.</p>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><Calendar size={16} className="text-white/50" />22 de Agosto, 2026</div>
              <div className="flex items-center gap-2"><Clock size={16} className="text-white/50" />19:00 – 23:00 hrs</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-white/50" />Gran Hotel Bolívar, Lima</div>
              <div className="flex items-center gap-2"><Users size={16} className="text-white/50" />Capacidad: 500 personas</div>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 p-6 text-center">
            <p className="text-white/50 text-xs font-black uppercase tracking-widest mb-2">Precio por entrada</p>
            <p className="text-6xl font-black mb-1">S/ {TICKET_PRICE}</p>
            <p className="text-white/50 text-sm">Incluye cena completa y bebidas</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6">Tus datos como egresado</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { key: 'nombres', label: 'Nombres *' },
                  { key: 'apellidos', label: 'Apellidos *' },
                  { key: 'dni', label: 'DNI *' },
                  { key: 'email', label: 'Correo electrónico *' },
                  { key: 'telefono', label: 'Teléfono' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'email' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={buyerData[f.key]}
                      onChange={e => setBuyerData(d => ({ ...d, [f.key]: e.target.value }))}
                      className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-[#800404] ${errors[f.key] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-xl font-black text-gray-900 mb-2">Cantidad de entradas</h2>
              <p className="text-sm text-gray-400 mb-6">Máximo 10 entradas por egresado</p>
              <div className="flex items-center gap-6 mb-6">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}
                  className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center hover:border-[#800404] hover:text-[#800404] transition-colors disabled:opacity-30">
                  <Minus size={18} />
                </button>
                <span className="text-4xl font-black text-[#800404] w-12 text-center">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= 10}
                  className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center hover:border-[#800404] hover:text-[#800404] transition-colors disabled:opacity-30">
                  <Plus size={18} />
                </button>
                <div className="ml-4">
                  <p className="text-3xl font-black text-gray-900">S/ {(quantity * TICKET_PRICE).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total a pagar</p>
                </div>
              </div>

              {companions.length > 0 && (
                <div>
                  <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wider text-[#800404]">Datos de acompañantes</h3>
                  <div className="space-y-3">
                    {companions.map((c, i) => (
                      <div key={i} className="grid sm:grid-cols-3 gap-3 p-4 bg-gray-50 border border-gray-200">
                        {['nombre', 'apellido', 'dni'].map(field => (
                          <div key={field}>
                            <label className="text-xs font-bold text-gray-400 mb-1 block capitalize">
                              {field === 'nombre' ? `Acompañante ${i + 1} - Nombre` : field === 'apellido' ? 'Apellido' : 'DNI'}
                            </label>
                            <input
                              type="text"
                              value={c[field]}
                              onChange={e => updateCompanion(i, field, e.target.value)}
                              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#800404]"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Método de Pago</h2>
            <div className="bg-gray-50 border border-gray-200 p-4 mb-6 flex justify-between items-center">
              <span className="text-gray-700 font-medium">{quantity} entrada(s) — Cena de Gala</span>
              <span className="text-2xl font-black text-[#800404]">S/ {(quantity * TICKET_PRICE).toLocaleString()}</span>
            </div>
            {errors.payment && <p className="text-red-500 text-sm mb-4">{errors.payment}</p>}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { id: 'yape', label: 'Yape', icon: '💜', desc: 'Pago móvil instantáneo' },
                { id: 'plin', label: 'Plin', icon: '💚', desc: 'Pago interbancario' },
                { id: 'card', label: 'Tarjeta', icon: '💳', desc: 'Crédito / Débito' },
              ].map(m => (
                <button key={m.id} onClick={() => { setPaymentMethod(m.id); setErrors({}) }}
                  className={`border-2 p-5 text-center transition-all ${paymentMethod === m.id ? 'border-[#800404] bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                  <div className="text-3xl mb-2">{m.icon}</div>
                  <p className="font-black text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div className="border border-gray-200 p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Número de tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#800404]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Vencimiento</label>
                    <input type="text" placeholder="MM/AA" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#800404]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                    <input type="text" placeholder="123" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#800404]" />
                  </div>
                </div>
              </div>
            )}
            {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
              <div className="border border-gray-200 p-5 text-center">
                <p className="text-sm text-gray-600 mb-3">Serás redirigido al portal de {paymentMethod === 'yape' ? 'Yape' : 'Plin'} para completar el pago de forma segura.</p>
                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 mx-auto flex items-center justify-center">
                  <p className="text-xs text-gray-300 text-center">QR de pago</p>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-300 mt-4 flex items-center gap-1">
              <CreditCard size={12} />
              Los datos de pago son procesados de forma segura. No almacenamos información de tarjetas.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Confirmar Compra</h2>
            <div className="space-y-4 text-sm">
              {[
                ['Comprador', `${buyerData.nombres} ${buyerData.apellidos}`],
                ['DNI', buyerData.dni],
                ['Entradas', `${quantity} entrada(s)`],
                ['Método de pago', paymentMethod],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-bold capitalize">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-4 bg-red-50 px-4 -mx-1 border border-[#800404]/20">
                <span className="font-black text-gray-900">Total a pagar</span>
                <span className="font-black text-2xl text-[#800404]">S/ {(quantity * TICKET_PRICE).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="px-6 py-2.5 border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors">
            Anterior
          </button>
          {step < 2 ? (
            <button onClick={handleNext}
              className="px-8 py-2.5 bg-[#800404] text-white font-black text-sm hover:bg-[#5a0303] transition-colors">
              {step === 0 ? `Continuar · S/ ${(quantity * TICKET_PRICE).toLocaleString()}` : 'Revisar pedido'}
            </button>
          ) : (
            <button onClick={() => setPaid(true)}
              className="px-8 py-2.5 bg-[#800404] text-white font-black text-sm hover:bg-[#5a0303] transition-colors">
              Confirmar y Pagar S/ {(quantity * TICKET_PRICE).toLocaleString()}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
