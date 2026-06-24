"use client";

import { useState } from "react";
import { Award, Landmark, Sparkles, Trophy, Calendar, MapPin, Users } from "lucide-react";

export default function MesCentral() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: 1,
      title: "Ceremonias de Aniversario",
      subtitle: "Por el Aniversario de la UNI - 150 años - 22 de Julio",
      icon: Landmark,
      color: "text-red-750",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      date: "Lunes, 22 de Julio de 2026",
      place: "Teatro de la UNI y Plaza de Banderas",
      hosts: "Rectorado y Comisión del Sesquicentenario",
      details: "Sesión Solemne del Consejo Universitario, izamiento de pabellón nacional con asistencia de delegaciones nacionales, autoridades del gobierno y rectores internacionales convidados, seguido por un almuerzo de gala oficial institucional.",
    },
    {
      num: 2,
      title: "Reconocimientos Especiales",
      subtitle: "Doctor Honoris Causa y Medalla de Habich",
      icon: Award,
      color: "text-red-750",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      date: "Martes, 23 de Julio de 2026",
      place: "Auditorio del Rectorado",
      hosts: "Secretaría General de la UNI",
      details: "Ceremonia solemne para otorgar el grado de Doctor Honoris Causa a egresados de trascendencia científica global, y entrega de la Medalla de Habich a investigadores insignes por sus descubrimientos aplicados al desarrollo del país.",
    },
    {
      num: 3,
      title: "Desfile Institucional",
      subtitle: "Delegaciones de Facultades, Oficinas e Invitados",
      icon: Sparkles,
      color: "text-red-750",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      date: "Miércoles, 24 de Julio de 2026",
      place: "Avenida Principal de la UNI (Explanada)",
      hosts: "Oficina de Relaciones Públicas y OTI",
      details: "Gran parada cívica tradicional que reúne a los batallones de docentes, estudiantes y egresados de las 11 facultades de la UNI, delegaciones invitadas de otras universidades del país, acompañados por bandas militares oficiales.",
    },
    {
      num: 4,
      title: "Grandes Concursos",
      subtitle: "Premiación de Proyectos, Creatividad y Deportes",
      icon: Trophy,
      color: "text-red-750",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      date: "Jueves, 25 de Julio de 2026",
      place: "Coliseo Cerrado UNI",
      hosts: "Dirección de Bienestar Universitario",
      details: "Premiación oficial de los campeonatos deportivos interfacultades, gala de premiación de la feria tecnológica UNICTEC, y distinciones a los proyectos literarios e innovaciones creativas del año.",
    },
  ];

  return (
    <section id="mes-central" className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
            Agenda del Sesquicentenario
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-outfit">
            Julio Mes Central del Aniversario UNI
          </h2>
          <div className="w-16 h-1 bg-uni-red mx-auto rounded-full" />
          <p className="text-zinc-600 text-sm sm:text-base font-semibold">
            Actividades centrales programadas para la semana de celebración de los 150 años de trayectoria de la universidad.
          </p>
        </div>

        {/* Step Navigation Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2.5 transition-all cursor-pointer ${
                  isActive
                    ? `bg-red-50/60 border-uni-red shadow-md shadow-uni-red/5`
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-uni-red text-white" : "bg-white border border-zinc-200"
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 ${isActive ? "text-white" : "text-zinc-500"}`}
                  />
                </div>
                <div>
                  <span
                    className={`block text-[10px] font-bold font-mono uppercase ${
                      isActive ? "text-uni-red" : "text-zinc-400"
                    }`}
                  >
                    Fase {step.num}
                  </span>
                  <span className="block text-xs font-bold text-zinc-800 font-outfit mt-0.5 line-clamp-1">
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-uni-red/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Event Metadata Side */}
              <div className="md:col-span-5 space-y-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-50 border border-red-100 text-uni-red">
                  Actividad Oficial
                </span>
                <h3 className="text-zinc-900 text-xl font-bold font-outfit leading-tight">
                  {steps[activeStep].title}
                </h3>
                <p className="text-zinc-500 text-xs italic font-semibold">
                  "{steps[activeStep].subtitle}"
                </p>
                
                <div className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs text-zinc-600 font-semibold font-mono">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-uni-red mr-2 shrink-0" />
                    <span>{steps[activeStep].date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-uni-red mr-2 shrink-0" />
                    <span>{steps[activeStep].place}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-uni-red mr-2 shrink-0" />
                    <span>Organiza: {steps[activeStep].hosts}</span>
                  </div>
                </div>
              </div>

              {/* Event description Side */}
              <div className="md:col-span-7 space-y-4 md:border-l md:border-zinc-150 md:pl-8">
                <h4 className="text-zinc-450 text-xs font-mono font-bold uppercase tracking-wider">
                  Detalles y Programa
                </h4>
                <p className="text-zinc-700 text-sm sm:text-base leading-relaxed font-semibold">
                  {steps[activeStep].details}
                </p>
                <div className="pt-4 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500 font-bold">Acceso: Libre para comunidad UNI</span>
                  <a
                    href="#sistemas"
                    className="px-4 py-2 bg-uni-red hover:bg-uni-red-light text-white font-bold rounded-lg border border-uni-red-dark/10 transition-colors shadow-sm"
                  >
                    Inscribirse
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
