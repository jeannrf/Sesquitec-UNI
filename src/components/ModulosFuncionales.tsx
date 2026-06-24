"use client";

import { useState } from "react";
import {
  Search,
  QrCode,
  ShoppingCart,
  CheckCircle,
  FileText,
  UserCheck,
  CreditCard,
  Plus,
  Lock,
} from "lucide-react";

export default function ModulosFuncionales() {
  const [activeTab, setActiveTab] = useState<"certificados" | "inscripcion" | "pagos">("certificados");

  // Tab 1: Certificados State
  const [dniSearch, setDniSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  // Tab 2: Inscripción State
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    dni: "",
    conferencias: [] as string[],
  });
  const [registeredUser, setRegisteredUser] = useState<any | null>(null);

  // Tab 3: Carrito / Pagos State
  const [ticketQty, setTicketQty] = useState(1);
  const [egresadoData, setEgresadoData] = useState({ nombre: "", dni: "", correo: "" });
  const [acompanantes, setAcompanantes] = useState<{ nombre: string; dni: string }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"yape" | "plin" | "tarjeta">("yape");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Base de datos simulada
  const certificatesDb: Record<string, any[]> = {
    "12345678": [
      {
        id: "CERT-150-001",
        name: "JUAN ALBERTO PÉREZ GÓMEZ",
        event: "Ciclo Internacional de IA Aplicada",
        hours: 12,
        date: "22 de Julio, 2026",
      },
      {
        id: "CERT-150-089",
        name: "JUAN ALBERTO PÉREZ GÓMEZ",
        event: "Feria Tecnológica Internacional - UNICTEC",
        hours: 8,
        date: "25 de Julio, 2026",
      },
    ],
    "87654321": [
      {
        id: "CERT-150-022",
        name: "MARÍA ALEJANDRA SOTO RUIZ",
        event: "Fronteras de la Sismorresistencia",
        hours: 10,
        date: "16 de Julio, 2026",
      },
    ],
  };

  const handleSearchCert = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (certificatesDb[dniSearch]) {
      setSearchResult(certificatesDb[dniSearch]);
    } else {
      setSearchResult(null);
    }
  };

  const handleInscripcion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.dni || formData.conferencias.length === 0) {
      alert("Por favor completa todos los campos y selecciona al menos una ponencia.");
      return;
    }
    setRegisteredUser({
      ...formData,
      qrCode: `SESQUITEC-PASS|DNI:${formData.dni}|CONF:${formData.conferencias.join(",")}`,
      hoursEstimated: formData.conferencias.length * 3,
    });
  };

  const handleConfCheck = (confTitle: string) => {
    setFormData((prev) => {
      const alreadyChecked = prev.conferencias.includes(confTitle);
      return {
        ...prev,
        conferencias: alreadyChecked
          ? prev.conferencias.filter((c) => c !== confTitle)
          : [...prev.conferencias, confTitle],
      };
    });
  };

  const handleQtyChange = (qty: number) => {
    setTicketQty(qty);
    const countNeeded = qty - 1;
    if (countNeeded <= 0) {
      setAcompanantes([]);
    } else {
      setAcompanantes((prev) => {
        const next = [...prev];
        while (next.length < countNeeded) {
          next.push({ nombre: "", dni: "" });
        }
        return next.slice(0, countNeeded);
      });
    }
  };

  const handleAcompananteChange = (index: number, field: "nombre" | "dni", value: string) => {
    setAcompanantes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!egresadoData.nombre || !egresadoData.dni || !egresadoData.correo) {
      alert("Por favor completa los datos del Egresado principal.");
      return;
    }
    for (let i = 0; i < acompanantes.length; i++) {
      if (!acompanantes[i].nombre || !acompanantes[i].dni) {
        alert(`Por favor completa los datos del Acompañante ${i + 1}.`);
        return;
      }
    }
    setPaymentSuccess(true);
  };

  const resetAll = () => {
    setDniSearch("");
    setSearchResult(null);
    setSearched(false);
    setFormData({ nombre: "", correo: "", dni: "", conferencias: [] });
    setRegisteredUser(null);
    setTicketQty(1);
    setEgresadoData({ nombre: "", dni: "", correo: "" });
    setAcompanantes([]);
    setPaymentSuccess(false);
  };

  const pricePerTicket = 150; // S/. 150.00 PEN

  return (
    <section id="sistemas" className="py-24 bg-white border-t border-zinc-100 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
            Portal Digital Integrado
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-outfit">
            Módulos y Sistemas de la Plataforma
          </h2>
          <div className="w-16 h-1 bg-uni-red mx-auto rounded-full" />
          <p className="text-zinc-650 text-sm sm:text-base font-semibold">
            Prueba de forma interactiva las funcionalidades clave y flujos transaccionales del sistema Sesquitec-UNI.
          </p>
        </div>

        {/* Dashboard de Módulos */}
        <div className="glass-card rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-lg">
          
          {/* Navegación por pestañas */}
          <div className="flex flex-col sm:flex-row border-b border-zinc-200">
            <button
              onClick={() => {
                setActiveTab("certificados");
                resetAll();
              }}
              className={`flex items-center justify-center space-x-2 py-4.5 px-6 font-bold text-sm transition-all border-b-2 sm:border-b-0 sm:border-r border-zinc-200 cursor-pointer ${
                activeTab === "certificados"
                  ? "bg-zinc-50 text-uni-red border-b-uni-red sm:border-r-uni-red"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Buscador de Certificados</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("inscripcion");
                resetAll();
              }}
              className={`flex items-center justify-center space-x-2 py-4.5 px-6 font-bold text-sm transition-all border-b-2 sm:border-b-0 sm:border-r border-zinc-200 cursor-pointer ${
                activeTab === "inscripcion"
                  ? "bg-zinc-50 text-uni-red border-b-uni-red sm:border-r-uni-red"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50"
              }`}
            >
              <QrCode className="h-4.5 w-4.5" />
              <span>Registro e Ingreso QR</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("pagos");
                resetAll();
              }}
              className={`flex items-center justify-center space-x-2 py-4.5 px-6 font-bold text-sm transition-all border-b-2 sm:border-b-0 border-zinc-200 cursor-pointer ${
                activeTab === "pagos"
                  ? "bg-zinc-50 text-uni-red border-b-uni-red"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50"
              }`}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>Cena de Gala (Pagos)</span>
            </button>
          </div>

          {/* Contenido de la pestaña */}
          <div className="p-6 sm:p-10 min-h-[450px]">
            
            {/* BUSCADOR DE CERTIFICADOS */}
            {activeTab === "certificados" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="max-w-xl space-y-2">
                  <h4 className="text-zinc-900 text-lg font-bold">Buscador Oficial de Certificados Firmados</h4>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold">
                    Ingresa tu número de DNI para consultar tus certificados emitidos por la Comisión Organizadora del Sesquicentenario y firmados por el Rector. 
                    <span className="text-uni-red font-mono font-bold block mt-1">DNI de prueba: 12345678 (2 certificados) o 87654321 (1 certificado).</span>
                  </p>
                </div>

                <form onSubmit={handleSearchCert} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400" />
                    <input
                      type="text"
                      maxLength={8}
                      pattern="\d{8}"
                      required
                      placeholder="Ingresa el DNI de 8 dígitos..."
                      value={dniSearch}
                      onChange={(e) => setDniSearch(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-sm focus:outline-none focus:border-uni-red focus:ring-1 focus:ring-uni-red transition-colors placeholder:text-zinc-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-uni-red hover:bg-uni-red-light text-white font-semibold rounded-xl border border-uni-red-dark/10 shadow-md transition-all cursor-pointer"
                  >
                    Buscar Certificados
                  </button>
                </form>

                {searched && (
                  <div className="border-t border-zinc-100 pt-8">
                    {searchResult ? (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <span className="text-zinc-700 text-sm font-bold">
                            Se encontraron {searchResult.length} certificado(s) asociado(s):
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {searchResult.map((cert: any) => (
                            <div
                              key={cert.id}
                              className="glass-card p-5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-4 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-400">
                                  <span>ID: {cert.id}</span>
                                  <span className="text-uni-red font-bold">FIRMADO POR RECTOR</span>
                                </div>
                                <h5 className="text-zinc-900 text-base font-bold">{cert.event}</h5>
                                <p className="text-zinc-600 text-xs font-bold uppercase">
                                  Beneficiario: {cert.name}
                                </p>
                              </div>
                              
                              <div className="border-t border-zinc-150 pt-3 flex items-center justify-between text-xs font-semibold font-mono text-zinc-500">
                                <span>Horas: {cert.hours} hrs</span>
                                <span>{cert.date}</span>
                              </div>

                              <div className="pt-2 flex items-center justify-between">
                                <div className="p-1 bg-white rounded border border-zinc-200 flex items-center justify-center">
                                  <QrCode className="h-8 w-8 text-black" />
                                </div>
                                <button
                                  onClick={() => alert(`Simulación: Descargando PDF del certificado ${cert.id}...`)}
                                  className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-lg border border-zinc-200 text-xs transition-colors cursor-pointer"
                                >
                                  Descargar PDF
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-zinc-50 border border-zinc-150 rounded-xl max-w-lg text-center text-zinc-500 text-sm font-semibold">
                        No se encontraron certificados cargados para el DNI "{dniSearch}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* REGISTRO E INGRESO QR */}
            {activeTab === "inscripcion" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="max-w-xl space-y-2">
                  <h4 className="text-zinc-900 text-lg font-bold">Simulador de Inscripción y Pase de Acceso QR</h4>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold">
                    Inscríbete a las conferencias del Sesquicentenario. Tras completar tus datos, el sistema generará tu credencial con código QR única vinculada a tu DNI para las marcas de ingreso y salida.
                  </p>
                </div>

                {!registeredUser ? (
                  <form onSubmit={handleInscripcion} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Campos de Formulario */}
                    <div className="lg:col-span-6 space-y-4">
                      <div>
                        <label className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ingresa tus nombres y apellidos..."
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-sm focus:outline-none focus:border-uni-red focus:ring-1 focus:ring-uni-red transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
                            DNI (8 dígitos)
                          </label>
                          <input
                            type="text"
                            maxLength={8}
                            required
                            placeholder="DNI"
                            value={formData.dni}
                            onChange={(e) => setFormData({ ...formData, dni: e.target.value.replace(/\D/g, "") })}
                            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-sm focus:outline-none focus:border-uni-red focus:ring-1 focus:ring-uni-red transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
                            Correo Electrónico
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="ejemplo@uni.pe"
                            value={formData.correo}
                            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-sm focus:outline-none focus:border-uni-red focus:ring-1 focus:ring-uni-red transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-uni-red hover:bg-uni-red-light text-white font-semibold rounded-xl border border-uni-red-dark/10 shadow-md transition-all cursor-pointer"
                      >
                        Completar Registro y Generar Pase QR
                      </button>
                    </div>

                    {/* Checklist de Ponencias */}
                    <div className="lg:col-span-6 space-y-4">
                      <label className="block text-zinc-500 text-xs font-bold uppercase tracking-wider font-mono">
                        Selecciona las Ponencias a asistir:
                      </label>
                      <div className="space-y-2.5">
                        {[
                          "Robótica Aeroespacial (14 Julio)",
                          "Energías Renovables (15 Julio)",
                          "Sismorresistencia Avanzada (16 Julio)",
                          "Nanomedicina Aplicada (17 Julio)",
                        ].map((conf) => {
                          const checked = formData.conferencias.includes(conf);
                          return (
                            <button
                              key={conf}
                              type="button"
                              onClick={() => handleConfCheck(conf)}
                              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                checked
                                  ? "bg-red-50/50 border-uni-red text-zinc-900"
                                  : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                              }`}
                            >
                              <span className="text-xs sm:text-sm font-bold">{conf}</span>
                              <div
                                className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                                  checked ? "bg-uni-red border-uni-red text-white" : "border-zinc-300"
                                }`}
                              >
                                {checked && <span className="text-[10px] font-bold">✓</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="max-w-xl mx-auto glass-card p-6 sm:p-8 rounded-2xl border border-uni-red/20 bg-zinc-50/50 space-y-6 text-center relative">
                    <div className="absolute top-0 right-0 p-3">
                      <button
                        onClick={() => setRegisteredUser(null)}
                        className="text-zinc-500 hover:text-uni-red text-xs font-mono font-bold uppercase cursor-pointer"
                      >
                        Registrar Otro
                      </button>
                    </div>

                    <div className="inline-flex p-3.5 bg-red-100/50 rounded-full border border-red-200/50 text-uni-red justify-center">
                      <UserCheck className="h-8 w-8" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-zinc-900 text-lg font-bold">¡Registro Exitoso Realizado!</h4>
                      <p className="text-zinc-500 text-xs font-mono font-bold uppercase">
                        DNI: {registeredUser.dni} | {registeredUser.correo}
                      </p>
                    </div>

                    {/* Representación de Pase QR */}
                    <div className="p-4 bg-white rounded-2xl border border-zinc-200 max-w-[200px] mx-auto flex flex-col items-center justify-center space-y-2.5 shadow-sm">
                      <QrCode className="h-32 w-32 text-black" />
                      <span className="text-[9px] text-zinc-500 font-mono tracking-widest font-bold">
                        UNI-PASS-{registeredUser.dni}
                      </span>
                    </div>

                    <div className="space-y-3 bg-white p-4 rounded-xl border border-zinc-200 text-left text-xs max-w-md mx-auto shadow-sm">
                      <div className="flex justify-between font-mono border-b border-zinc-150 pb-1.5 font-bold">
                        <span className="text-zinc-400">TITULAR:</span>
                        <span className="text-zinc-800 uppercase">{registeredUser.nombre}</span>
                      </div>
                      <div className="flex justify-between font-mono border-b border-zinc-150 pb-1.5 font-bold">
                        <span className="text-zinc-400">PONENCIAS REGISTRADAS:</span>
                        <span className="text-uni-red">{registeredUser.conferencias.length}</span>
                      </div>
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-zinc-400">ESTIMACIÓN CERTIFICADO:</span>
                        <span className="text-zinc-800">{registeredUser.hoursEstimated} Horas Académicas</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CARRITO Y PAGOS CENA DE GALA */}
            {activeTab === "pagos" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="max-w-xl space-y-2">
                  <h4 className="text-zinc-900 text-lg font-bold">Carrito de Compras y Pasarela de Pagos (Cena de Gala)</h4>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold">
                    Adquiere tus entradas para la Cena de Gala de Egresados del Sesquicentenario. Agrega acompañantes y simula la pasarela transaccional privada.
                  </p>
                </div>

                {!paymentSuccess ? (
                  <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Campos de egresado y acompañantes */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-200 space-y-4">
                        <h5 className="text-uni-red text-sm font-bold uppercase font-mono tracking-wide border-b border-zinc-200 pb-2">
                          1. Datos del Egresado (Titular de Compra)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">
                              Nombre Completo
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Ingresa tu nombre..."
                              value={egresadoData.nombre}
                              onChange={(e) => setEgresadoData({ ...egresadoData, nombre: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-uni-red focus:ring-1 focus:ring-uni-red"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">
                              DNI
                            </label>
                            <input
                              type="text"
                              maxLength={8}
                              required
                              placeholder="DNI"
                              value={egresadoData.dni}
                              onChange={(e) => setEgresadoData({ ...egresadoData, dni: e.target.value.replace(/\D/g, "") })}
                              className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">
                              Correo Electrónico
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="correo@ejemplo.com"
                              value={egresadoData.correo}
                              onChange={(e) => setEgresadoData({ ...egresadoData, correo: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {acompanantes.length > 0 && (
                        <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-200 space-y-4">
                          <h5 className="text-uni-red text-sm font-bold uppercase font-mono tracking-wide border-b border-zinc-200 pb-2">
                            2. Datos de los Acompañantes
                          </h5>
                          
                          <div className="space-y-4">
                            {acompanantes.map((acomp, idx) => (
                              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-150 pb-4 last:border-0 last:pb-0">
                                <div className="sm:col-span-2 text-zinc-500 text-[10px] font-bold font-mono">
                                  ACOMPAÑANTE #{idx + 1}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Nombre completo del acompañante"
                                    value={acomp.nombre}
                                    onChange={(e) => handleAcompananteChange(idx, "nombre", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    maxLength={8}
                                    required
                                    placeholder="DNI"
                                    value={acomp.dni}
                                    onChange={(e) => handleAcompananteChange(idx, "dni", e.target.value.replace(/\D/g, ""))}
                                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resumen del Carrito */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-6 shadow-sm">
                        <h5 className="text-zinc-800 text-xs font-bold uppercase font-mono tracking-widest">
                          Resumen del Carrito
                        </h5>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-700 text-xs sm:text-sm font-semibold">Cantidad de Entradas:</span>
                            <div className="flex items-center space-x-2.5">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(Math.max(1, ticketQty - 1))}
                                className="w-8 h-8 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-zinc-800 text-sm font-bold font-mono w-4 text-center">
                                {ticketQty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(Math.min(5, ticketQty + 1))}
                                className="w-8 h-8 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-150 pb-4 font-semibold font-mono">
                            <span>Precio unitario:</span>
                            <span>S/. {pricePerTicket.toFixed(2)} PEN</span>
                          </div>

                          <div className="flex items-center justify-between font-outfit text-zinc-900 text-base font-bold">
                            <span>Total del Pedido:</span>
                            <span className="font-mono text-uni-red">S/. {(pricePerTicket * ticketQty).toFixed(2)} PEN</span>
                          </div>
                        </div>

                        {/* Selección del método de pago */}
                        <div className="space-y-3 pt-4 border-t border-zinc-150">
                          <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                            Método de Pago Seguro
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["yape", "plin", "tarjeta"].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setPaymentMethod(method as any)}
                                className={`py-2 px-1 rounded-xl border text-xs font-bold font-mono uppercase text-center transition-all cursor-pointer ${
                                  paymentMethod === method
                                    ? "bg-red-50 border-uni-red text-uni-red"
                                    : "bg-white border-zinc-300 text-zinc-500 hover:border-zinc-450"
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-uni-red hover:bg-uni-red-light text-white font-semibold rounded-xl border border-uni-red-dark/10 shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                        >
                          <CreditCard className="h-4 w-4 text-white" />
                          <span>Pagar S/. {(pricePerTicket * ticketQty).toFixed(2)}</span>
                        </button>
                        
                        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-zinc-400 font-bold font-mono">
                          <Lock className="h-3.5 w-3.5 text-zinc-400" />
                          <span>Procesamiento Encriptado SSL</span>
                        </div>
                      </div>
                    </div>

                  </form>
                ) : (
                  <div className="max-w-xl mx-auto glass-card p-6 sm:p-8 rounded-2xl border border-uni-red/20 bg-zinc-50/50 space-y-6 text-center relative">
                    <div className="absolute top-0 right-0 p-3">
                      <button
                        onClick={() => resetAll()}
                        className="text-zinc-500 hover:text-uni-red text-xs font-mono font-bold uppercase cursor-pointer"
                      >
                        Nueva Compra
                      </button>
                    </div>

                    <div className="inline-flex p-3.5 bg-red-100/50 rounded-full border border-red-200/50 text-uni-red justify-center">
                      <CheckCircle className="h-8 w-8" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-zinc-900 text-lg font-bold">¡Pago Simulado Exitoso!</h4>
                      <p className="text-zinc-500 text-xs font-mono font-bold uppercase">
                        TRANSACCIÓN: #{Math.floor(Math.random() * 900000) + 100000} | MÉTODO: {paymentMethod.toUpperCase()}
                      </p>
                    </div>

                    <div className="space-y-3 bg-white p-4 rounded-xl border border-zinc-200 text-left text-xs max-w-md mx-auto shadow-sm">
                      <div className="flex justify-between font-mono border-b border-zinc-150 pb-1.5 font-bold">
                        <span className="text-zinc-400">COMPRADOR:</span>
                        <span className="text-zinc-800 uppercase">{egresadoData.nombre}</span>
                      </div>
                      <div className="flex justify-between font-mono border-b border-zinc-150 pb-1.5 font-bold">
                        <span className="text-zinc-400">CANTIDAD ENTRADAS:</span>
                        <span className="text-zinc-800">{ticketQty} pases</span>
                      </div>
                      {acompanantes.length > 0 && (
                        <div className="border-b border-zinc-150 pb-1.5 space-y-1 font-mono text-[11px] font-bold">
                          <span className="text-zinc-400 block">ACOMPAÑANTES:</span>
                          {acompanantes.map((a, i) => (
                            <span key={i} className="text-zinc-600 block pl-2">
                              • {a.nombre} (DNI {a.dni})
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-zinc-400">MONTO DEBITADO:</span>
                        <span className="text-uni-red">S/. {(pricePerTicket * ticketQty).toFixed(2)} PEN</span>
                      </div>
                    </div>

                    <p className="text-zinc-500 text-[11px] max-w-sm mx-auto leading-relaxed font-semibold">
                      Se ha enviado un correo con las entradas digitales e indicaciones de vestimenta formal al e-mail de registro.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
