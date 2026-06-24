"use client";

import { Calendar, User, Clock, Cpu, Leaf, Hammer, Microscope } from "lucide-react";

export default function Conferencias() {
  const conferencesList = [
    {
      title: "Inteligencia Artificial Aplicada a la Infraestructura Vial",
      topic: "Ingeniería y Computación",
      speaker: "Dr. Kenji Takahashi (Japón)",
      date: "14 de Julio, 2026",
      time: "10:00 AM",
      icon: Cpu,
      color: "text-red-700",
      iconBg: "bg-red-50",
    },
    {
      title: "Matriz Energética Limpia e Industrialización al 2050",
      topic: "Energías Renovables",
      speaker: "Dra. Helena Rostova (Alemania)",
      date: "15 de Julio, 2026",
      time: "03:00 PM",
      icon: Leaf,
      color: "text-emerald-700",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Nuevas Fronteras de la Sismorresistencia en Edificaciones",
      topic: "Construcción Sostenible",
      speaker: "MSc. Carlos Villacorta (UNI, Perú)",
      date: "16 de Julio, 2026",
      time: "11:30 AM",
      icon: Hammer,
      color: "text-amber-700",
      iconBg: "bg-amber-50",
    },
    {
      title: "Nanomateriales y Dispositivos Biomédicos del Mañana",
      topic: "Ciencia e Innovación",
      speaker: "Dra. Sofía Mendoza (MIT, EE.UU.)",
      date: "17 de Julio, 2026",
      time: "05:00 PM",
      icon: Microscope,
      color: "text-rose-700",
      iconBg: "bg-rose-50",
    },
  ];

  return (
    <section id="conferencias" className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text and Introduction */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
                Ciclo Académico Internacional
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-outfit">
                Conferencias Académicas <br />
                y de <span className="text-gradient-red">Investigación</span>
              </h2>
            </div>
            
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-semibold">
              Expertos nacionales e internacionales de reconocido prestigio compartirán sus conocimientos, experiencias y visiones estratégicas sobre ingeniería, ciencia, arquitectura y tecnología.
            </p>
            <p className="text-zinc-500 text-xs sm:text-sm font-semibold">
              Este ciclo promueve el intercambio científico, la transferencia tecnológica y la colaboración interinstitucional para sentar las bases del desarrollo futuro de nuestro país.
            </p>
            
            {/* Visual Callout */}
            <div className="p-5 bg-red-50/80 border border-red-100/60 rounded-2xl flex items-start space-x-4">
              <div className="h-2.5 w-2.5 rounded-full bg-uni-red mt-1.5 animate-ping shrink-0" />
              <div>
                <h5 className="text-zinc-950 text-sm font-bold">Certificación Extracurricular</h5>
                <p className="text-zinc-600 text-xs mt-1 font-semibold leading-relaxed">
                  La asistencia total acumulada sumará horas válidas para la emisión del certificado académico oficial firmado por el Rector de la UNI.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive list of conferences */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-zinc-500 text-xs font-mono font-bold uppercase tracking-widest mb-2 block">
              Ponencias Principales Destacadas
            </h4>
            
            <div className="space-y-4">
              {conferencesList.map((conf) => (
                <div
                  key={conf.title}
                  className="glass-card p-5 rounded-xl border border-zinc-200/80 bg-white hover:border-uni-red/30 flex items-start space-x-4 transition-all shadow-sm"
                >
                  <div className={`p-3 ${conf.iconBg} rounded-xl border border-zinc-100 flex items-center justify-center`}>
                    <conf.icon className={`h-6 w-6 ${conf.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-[10px] font-mono text-uni-red font-bold uppercase">
                        {conf.topic}
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-semibold font-mono">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-zinc-400" />
                          {conf.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-zinc-400" />
                          {conf.time}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-zinc-900 text-sm sm:text-base font-bold">
                      {conf.title}
                    </h4>
                    <p className="text-zinc-600 text-xs flex items-center pt-1 font-semibold">
                      <User className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                      {conf.speaker}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
