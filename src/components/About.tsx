"use client";

import { Landmark, Compass, Target, GraduationCap } from "lucide-react";

export default function About() {
  const pillars = [
    {
      icon: Compass,
      title: "Legado Histórico",
      desc: "Más de un siglo y medio liderando la formación de los ingenieros y científicos que estructuraron y modernizaron el país.",
    },
    {
      icon: Target,
      title: "Impacto País",
      desc: "Propuestas de desarrollo científico, tecnológico y territorial para los desafíos nacionales hacia el periodo 2026-2050.",
    },
    {
      icon: GraduationCap,
      title: "Calidad Académica",
      desc: "Fomento constante del intercambio intelectual con expertos de rango nacional e internacional, impulsando la excelencia.",
    },
  ];

  return (
    <section id="nosotros" className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Lado Gráfico */}
          <div className="lg:col-span-5 order-last lg:order-first">
            <div className="relative">
              {/* Círculos decorativos */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border border-uni-red/10 rounded-full -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-uni-red/15 rounded-full -z-10" />
              
              {/* Tarjeta gráfica premium */}
              <div className="glass-card p-6 rounded-2xl border border-zinc-200 shadow-lg relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-uni-red/5 to-transparent pointer-events-none" />
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-100/50 flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-uni-red" />
                  </div>
                  <div>
                    <h5 className="text-zinc-900 text-sm font-bold">Comisión Especial</h5>
                    <span className="text-[10px] text-zinc-500 font-mono font-semibold">Sesquicentenario UNI</span>
                  </div>
                </div>
                
                {/* Gráfico representativo */}
                <div className="aspect-[4/3] rounded-xl bg-zinc-50 border border-zinc-150 p-4 relative flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#8b00000a_0%,transparent_70%)]" />
                  
                  {/* Ilustración de columnas */}
                  <div className="h-2/3 border-b border-dashed border-zinc-200 flex items-end justify-between px-4 pb-2 relative">
                    <div className="w-1.5 h-16 bg-zinc-200 border-t-2 border-uni-red/60 rounded-t" />
                    <div className="w-1.5 h-12 bg-zinc-200 border-t-2 border-zinc-300 rounded-t" />
                    <div className="w-2.5 h-20 bg-zinc-300 border-t-2 border-uni-red rounded-t relative">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-uni-red rounded-full" />
                    </div>
                    <div className="w-1.5 h-14 bg-zinc-200 border-t-2 border-zinc-300 rounded-t" />
                    <div className="w-1.5 h-16 bg-zinc-200 border-t-2 border-uni-red/60 rounded-t" />
                  </div>
                  
                  <div className="space-y-1.5 z-10">
                    <div className="w-1/3 h-2 bg-uni-red/60 rounded" />
                    <div className="w-full h-1.5 bg-zinc-200 rounded" />
                    <div className="w-2/3 h-1.5 bg-zinc-200 rounded" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 font-semibold font-mono">
                  <span>Planificación Estratégica</span>
                  <span className="text-uni-red">95% Completado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado de Texto */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
                Identidad y Propósito
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight font-outfit">
                ¿Qué significa 150 años <br />
                de la <span className="text-uni-red">Universidad Nacional de Ingeniería</span>?
              </h2>
            </div>

            <div className="space-y-4 text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
              <p>
                Un siglo y medio de excelencia al servicio de la ciencia, la ingeniería, la arquitectura y el desarrollo estratégico de la nación peruana.
              </p>
              <p>
                Desde su fundación en 1876 bajo el liderazgo del ingeniero polaco Eduardo de Habich como la Escuela Especial de Ingenieros de Construcciones Civiles y de Minas, la **UNI** ha sido el pilar de la investigación académica y de la innovación del país, estructurando obras de infraestructura vitales y el desarrollo industrial.
              </p>
              <p>
                El legado de la UNI se plasma en sus miles de graduados que lideran proyectos de alto impacto a nivel global, aportando soluciones científicas y tecnológicas con compromiso social y ético.
              </p>
            </div>

            {/* Cuadrícula de Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="space-y-2.5">
                  <div className="inline-flex items-center justify-center p-2.5 bg-red-50 border border-red-100 rounded-xl">
                    <pillar.icon className="h-5 w-5 text-uni-red" />
                  </div>
                  <h4 className="text-zinc-900 text-sm font-bold">{pillar.title}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed font-semibold">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
