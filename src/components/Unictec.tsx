"use client";

import { useState } from "react";
import { Cpu, Info, Satellite, Zap, Trees, Activity, Radio, ExternalLink } from "lucide-react";

export default function Unictec() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "Rover Aeroespacial Explorador",
      category: "Robótica Aeroespacial",
      fac: "FIM / FIEI",
      icon: Satellite,
      color: "text-red-700",
      iconBg: "bg-red-50",
      borderColor: "border-red-100",
      desc: "Desarrollo de un rover autónomo con sensores multiespectrales para mapeo de terrenos y análisis químico de muestras minerales de forma autónoma.",
    },
    {
      id: 2,
      title: "Smart-Grid Red Rímac",
      category: "Sistemas Eléctricos",
      fac: "FIEE",
      icon: Zap,
      color: "text-red-700",
      iconBg: "bg-red-50",
      borderColor: "border-red-100",
      desc: "Rediseño inteligente del flujo eléctrico urbano que integra generación distribuida fotovoltaica y medición bidireccional en tiempo real.",
    },
    {
      id: 3,
      title: "Nanosatélite Cúbico UNI-SAT",
      category: "Telecomunicaciones",
      fac: "INICTEL-UNI / FIEI",
      icon: Radio,
      color: "text-red-700",
      iconBg: "bg-red-50",
      borderColor: "border-red-100",
      desc: "Diseño y simulación orbital de un CubeSat de 2U para monitoreo climatológico y prevención de desastres naturales en los andes peruanos.",
    },
    {
      id: 4,
      title: "Biorreactor de Microalgas",
      category: "Biotecnología Ambiental",
      fac: "FIGMM",
      icon: Trees,
      color: "text-emerald-700",
      iconBg: "bg-emerald-50",
      borderColor: "border-emerald-100",
      desc: "Biorreactor automatizado de flujo continuo para la captación acelerada de CO2 industrial y producción de biomasa para biocombustibles.",
    },
    {
      id: 5,
      title: "Sensores IoT Estructurales",
      category: "Ingeniería Antisísmica",
      fac: "FIC / CISMID",
      icon: Activity,
      color: "text-red-700",
      iconBg: "bg-red-50",
      borderColor: "border-red-100",
      desc: "Red inalámbrica de acelerómetros y sensores de deformidad para el diagnóstico de daños estructurales críticos tras sismos severos.",
    },
    {
      id: 6,
      title: "Asistente Inteligente de Diagnóstico",
      category: "Inteligencia Artificial",
      fac: "FC / UNICODE",
      icon: Cpu,
      color: "text-red-700",
      iconBg: "bg-red-50",
      borderColor: "border-red-100",
      desc: "Modelo neuronal de deep learning entrenado con radiografías clínicas para la detección de anomalías pulmonares en postas médicas de provincias.",
    },
  ];

  return (
    <section id="unictec" className="py-24 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
            Exposición Tecnológica Global
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-outfit">
            Feria Tecnológica Internacional - UNICTEC
          </h2>
          <div className="w-16 h-1 bg-uni-red mx-auto rounded-full" />
          <p className="text-zinc-600 text-sm sm:text-base font-semibold">
            Los mejores proyectos tecnológicos y científicos desarrollados por estudiantes y docentes de la UNI, en alianza con universidades nacionales y globales de Norteamérica, Latinoamérica, Europa y Asia.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-white border border-zinc-200 shadow-sm group"
            >
              {/* Overlay visual design */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-50 rounded-bl-full group-hover:bg-zinc-100 transition-colors pointer-events-none" />

              <div className="space-y-6">
                {/* Header card info */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 font-mono">
                    Facultad: {proj.fac}
                  </span>
                  <div className={`p-2 ${proj.iconBg} rounded-lg border ${proj.borderColor} flex items-center justify-center`}>
                    <proj.icon className={`h-5 w-5 ${proj.color}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${proj.color}`}>
                    {proj.category}
                  </span>
                  <h4 className="text-zinc-900 text-base sm:text-lg font-bold group-hover:text-uni-red transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                    {proj.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveProject(proj.id)}
                  className="text-xs text-zinc-600 hover:text-uni-red font-semibold flex items-center transition-colors"
                >
                  <Info className="h-3.5 w-3.5 mr-1 text-uni-red" />
                  Ver Detalle
                </button>
                <span className="text-[10px] text-zinc-400 font-mono font-semibold">ID: UNICTEC-{proj.id}00</span>
              </div>

              {/* Quick overlay modal simulator */}
              {activeProject === proj.id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur p-6 flex flex-col justify-between z-20 border border-zinc-250 rounded-2xl transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                      <span className="text-[10px] font-bold text-uni-red font-mono uppercase">
                        Ficha Técnica
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProject(null);
                        }}
                        className="text-zinc-500 hover:text-zinc-900 text-xs font-bold font-mono p-1"
                      >
                        CERRAR
                      </button>
                    </div>
                    <h5 className="text-zinc-900 text-base font-bold">{proj.title}</h5>
                    <p className="text-zinc-600 text-xs font-semibold leading-relaxed">{proj.desc}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-500 font-mono bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <div>
                        <span className="block text-zinc-400 font-bold">FACULTAD:</span>
                        <span className="text-zinc-700 font-bold">{proj.fac}</span>
                      </div>
                      <div>
                        <span className="block text-zinc-400 font-bold">SECTOR:</span>
                        <span className="text-zinc-700 font-bold">{proj.category}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="#sistemas"
                    onClick={() => setActiveProject(null)}
                    className="w-full py-2 bg-uni-red hover:bg-uni-red-light text-center text-white text-xs font-semibold rounded-lg border border-uni-red-dark/10 flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>Solicitar Información</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
