"use client";

import { Award, Music, Shield, Heart } from "lucide-react";

export default function EventosCulturales() {
  const winners = [
    {
      place: "1er Puesto",
      medalColor: "text-amber-500",
      borderColor: "border-amber-200",
      bgGradient: "from-amber-50/40 to-white",
      facultad: "Facultad de Ingeniería Civil (FIC)",
      danza: "Qhasway de Chumbivilcas",
      region: "Cusco",
      desc: "Danza festiva de carácter erótico-social ejecutada durante los carnavales en las zonas altas de Chumbivilcas, destacando por su energía, zapateo y colorido.",
    },
    {
      place: "2do Puesto",
      medalColor: "text-zinc-400",
      borderColor: "border-zinc-200",
      bgGradient: "from-zinc-50/50 to-white",
      facultad: "Facultad de Ingeniería Civil (FIC)",
      danza: "Shacshas de Yungay",
      region: "Áncash",
      desc: "Danza ritual andina de carácter religioso-guerrero, ejecutada tradicionalmente en honor a la festividad del Señor de la Soledad en Yungay.",
    },
    {
      place: "3er Puesto",
      medalColor: "text-amber-700",
      borderColor: "border-amber-200/50",
      bgGradient: "from-red-50/20 via-zinc-50/30 to-white",
      facultad: "Facultad de Ingeniería Ambiental (FIA)",
      danza: "Carnaval de Uripa",
      region: "Apurímac",
      desc: "Danza folklórica de carácter festivo y agrario, que conmemora el enamoramiento y el florecimiento de los sembríos en la localidad de Uripa.",
    },
  ];

  return (
    <section id="danzas" className="py-24 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold tracking-widest text-uni-red uppercase font-mono">
            Tradición y Cultura Peruana
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-outfit">
            Eventos Culturales y Tradiciones
          </h2>
          <div className="w-16 h-1 bg-uni-red mx-auto rounded-full" />
          <h3 className="text-lg font-bold text-zinc-700">
            Interfacultades de Danzas Folklóricas - Gran Duelo de Campeones
          </h3>
          <p className="text-zinc-650 text-sm sm:text-base font-semibold">
            Celebrando la diversidad cultural nacional a través del arte y el baile folklórico tradicional de las facultades de la UNI.
          </p>
        </div>

        {/* Podio / Grid of Winners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {winners.map((win, idx) => (
            <div
              key={win.danza}
              className={`glass-card p-6 sm:p-8 rounded-2xl border ${
                win.borderColor
              } bg-gradient-to-b ${win.bgGradient} flex flex-col justify-between relative overflow-hidden shadow-sm ${
                idx === 0 ? "md:-translate-y-4 border-uni-red/30 shadow-md shadow-uni-red/5" : ""
              }`}
            >
              {/* Etiqueta de Campeón */}
              {idx === 0 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-uni-red text-white font-bold font-mono text-[9px] rounded-b-lg uppercase tracking-widest">
                  CAMPEÓN
                </div>
              )}

              <div className="space-y-6">
                {/* Winner header */}
                <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
                  <div className="flex items-center space-x-2">
                    <Award className={`h-6 w-6 ${win.medalColor}`} />
                    <span className="text-zinc-900 text-base font-bold font-outfit">{win.place}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold flex items-center">
                    <Music className="h-3.5 w-3.5 mr-1 text-uni-red" />
                    Región: {win.region}
                  </span>
                </div>

                {/* Cultural Graphic Mockup */}
                <div className="py-4 flex justify-center">
                  <div className="w-[100px] h-[100px] bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-uni-red/5 to-transparent" />
                    <Shield className={`h-10 w-10 ${win.medalColor} opacity-70`} />
                    <Heart className="absolute bottom-6 right-6 h-3 w-3 text-uni-red animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-uni-red tracking-wide block uppercase">
                    {win.facultad}
                  </span>
                  <h4 className="text-zinc-900 text-lg font-bold font-outfit leading-tight">
                    {win.danza}
                  </h4>
                  <p className="text-zinc-600 text-xs sm:text-sm font-semibold leading-relaxed">
                    {win.desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-100 text-[10px] text-zinc-500 font-semibold font-mono text-center">
                Teatro de la UNI - Gran Final
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
