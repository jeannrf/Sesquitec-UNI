import { createContext, useContext, useState } from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

const AlertContext = createContext()

export function AlertProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({
    title: '',
    message: '',
    type: 'info', // 'success', 'warning', 'error', 'info'
    isConfirm: false,
    onConfirm: null,
    onCancel: null,
  })

  // Simple alert simulation
  const showAlert = (message, title = 'Atención', type = 'info', onConfirm = null) => {
    setConfig({
      title,
      message,
      type,
      isConfirm: false,
      onConfirm,
      onCancel: null
    })
    setIsOpen(true)
  }

  // Simple confirm simulation
  const showConfirm = (message, onConfirm, title = '¿Estás seguro?', type = 'warning', onCancel = null) => {
    setConfig({
      title,
      message,
      type,
      isConfirm: true,
      onConfirm,
      onCancel
    })
    setIsOpen(true)
  }

  const handleConfirm = () => {
    setIsOpen(false)
    if (config.onConfirm) config.onConfirm()
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (config.onCancel) config.onCancel()
  }

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-gray-200 max-w-md w-full shadow-2xl flex flex-col p-6 rounded-none">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {config.type === 'success' && <CheckCircle className="text-emerald-600 shrink-0" size={24} />}
                {config.type === 'warning' && <AlertTriangle className="text-amber-500 shrink-0" size={24} />}
                {config.type === 'error' && <AlertTriangle className="text-[#800404] shrink-0" size={24} />}
                {config.type === 'info' && <Info className="text-[#800404] shrink-0" size={24} />}
                <h3 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-wider">{config.title}</h3>
              </div>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{config.message}</p>
            </div>

            {/* Footer / Buttons */}
            <div className="flex justify-end gap-3 mt-auto">
              {config.isConfirm ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-black px-5 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-5 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none"
                  >
                    Aceptar
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="bg-[#800404] hover:bg-[#5a0303] text-white text-xs font-black px-6 py-2.5 transition-colors uppercase tracking-wider cursor-pointer rounded-none"
                >
                  Aceptar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
