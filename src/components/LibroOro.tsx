"use client";

import { BookOpen, Award, CheckCircle } from "lucide-react";

export default function LibroOro() {
  const versions = [
    {
      version: "Primera Versión",
      title: "Análisis y Diagnóstico",
      desc: "Etapa de análisis exhaustivo y diagnóstico de los 150 años de historia institucional, académica y su rol en la república.",
      status: "Publicado",
      color: "from-red-50/50 to-white",
      borderColor: "border-red-100",
      accentColor: "text-uni-red",
    },
    {
      version: "Segunda Versión",
      title: "Propuestas de Facultades",
      desc: "Elaboración e integración de propuestas técnicas y académicas desarrolladas individualmente por las 11 facultades de la UNI.",
      status: "En Redacción",
      color: "from-zinc-50 to-white",
      borderColor: "border-zinc-200",
      accentColor: "text-zinc-700",
    },
    {
      version: "Presentación Final",
      title: "Plan Nacional 2050",
      desc: "Presentación unificada del Plan y Propuesta de la UNI hacia el año 2050 para el desarrollo científico, industrial y social del Perú.",
      status: "Próximamente",
      color: "from-red-50/30 via-zinc-50/40 to-white",
      borderColor: "border-uni-red/20",
      accentColor: "text-uni-red-light",
    },
  ];

  return (
    <section id="libro-oro" className="py-24 bg-zinc-50/50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
            Planificación Estratégica Nacional
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-outfit">
            Propuesta de la UNI para el Futuro del Perú 2026-2050
          </h2>
          <div className="w-16 h-1 bg-uni-red mx-auto rounded-full" />
          <h3 className="text-xl font-bold text-zinc-700">
            Libro de Oro del Sesquicentenario
          </h3>
          <p className="text-zinc-600 text-sm sm:text-base font-semibold">
            Generando aportes académicos y técnicos de alta especialidad sobre las perspectivas y horizontes de desarrollo del país hacia el año 2050.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {versions.map((item, idx) => (
            <div
              key={item.version}
              className={`glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b ${item.color} border ${item.borderColor} shadow-sm`}
            >
              {/* Efecto decorativo de esquina */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-uni-red/[0.015] rounded-bl-full pointer-events-none" />

              <div className="space-y-6">
                {/* Cabecera de la tarjeta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className={`h-5 w-5 ${item.accentColor}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                      Libro de Oro
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-white border border-zinc-200 ${item.accentColor}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Simulación del libro en 3D */}
                <div className="py-6 flex justify-center">
                  <div className="w-[120px] h-[170px] bg-uni-red-dark border-r border-y border-uni-red-dark rounded-r-lg shadow-xl relative flex flex-col justify-between p-3.5 transform hover:scale-105 transition-transform duration-300">
                    {/* Lomo del libro */}
                    <div className="absolute left-1 top-0 bottom-0 w-1.5 bg-black/30 shadow-inner" />
                    
                    {/* Logo metálico en libro */}
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[7px] text-red-200/80 font-mono tracking-widest uppercase">UNI</span>
                      <Award className="h-3.5 w-3.5 text-white" />
                    </div>
                    
                    {/* Simulación de textos */}
                    <div className="space-y-1.5 z-10">
                      <div className="h-1 bg-white/20 rounded w-full" />
                      <div className="h-1.5 bg-white/40 rounded w-3/4" />
                      <div className="h-1 bg-white/20 rounded w-5/6" />
                    </div>
                    
                    <div className="text-[6px] text-red-200/60 font-mono text-right z-10 uppercase">
                      150 Años
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                    {item.version}
                  </span>
                  <h4 className="text-zinc-900 text-lg font-bold leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Botón e indicador */}
              <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-zinc-500 text-xs font-semibold flex items-center">
                  <CheckCircle className={`h-3.5 w-3.5 mr-1 ${item.accentColor}`} />
                  Fase {idx + 1}
                </span>
                <button
                  className={`text-xs font-bold hover:underline transition-colors ${item.accentColor}`}
                >
                  Ver Información &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
