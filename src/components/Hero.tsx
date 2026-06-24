"use client";

import { Calendar, ArrowRight, Award, MapPin, Landmark } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-uni"
    >
      {/* Luces y efectos de fondo claros */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-uni-red/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-uni-red/5 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Patrón de cuadrícula suave en el fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] -z-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contenido de Texto */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-red-50/80 border border-red-100/60 rounded-full text-zinc-800 text-xs sm:text-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-uni-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-uni-red"></span>
              </span>
              <span className="font-bold text-uni-red">Sesquicentenario UNI</span>
              <span className="text-zinc-300">|</span>
              <span className="font-medium text-zinc-600">1876 - 2026</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight font-outfit">
                150 Años Formando <br />
                <span className="text-gradient-red">Científicos, Ingenieros</span> <br />
                y Arquitectos para el Perú
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Bienvenidos a la plataforma oficial del Sesquicentenario de la Universidad Nacional de Ingeniería. Conmemoramos un legado científico, excelencia académica e innovación tecnológica al servicio del desarrollo nacional.
              </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 pt-2">
              <div className="p-3 bg-white rounded-xl border border-zinc-100 text-center shadow-sm">
                <span className="block text-2xl font-bold text-uni-red">150</span>
                <span className="text-xs text-zinc-500 font-semibold">Años de Historia</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-zinc-100 text-center shadow-sm">
                <span className="block text-2xl font-bold text-uni-red">11</span>
                <span className="text-xs text-zinc-500 font-semibold">Facultades</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-zinc-100 text-center shadow-sm">
                <span className="block text-2xl font-bold text-uni-red">9K+</span>
                <span className="text-xs text-zinc-500 font-semibold">Asistentes</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#sistemas"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-uni-red hover:bg-uni-red-light text-white font-semibold rounded-xl border border-uni-red-dark/10 shadow-lg shadow-uni-red/10 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Obtener pase QR</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#mes-central"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl border border-zinc-200/80 transition-all duration-200"
              >
                <Calendar className="h-4 w-4 text-uni-red" />
                <span>Ver Cronograma</span>
              </a>
            </div>
          </div>

          {/* Gráfico Ilustrativo en Tema Claro */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-[400px] lg:max-w-full">
              {/* Sombra de fondo roja suave */}
              <div className="absolute inset-0 bg-gradient-to-tr from-uni-red/5 to-uni-red/10 opacity-30 blur-2xl rounded-2xl" />

              {/* Contenedor del Mockup */}
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
                {/* Cabecera visual del Rectorado */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50 border border-zinc-150 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent z-10" />
                  
                  {/* Gráfico representativo de la fachada de la UNI */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-50 to-white">
                    <span className="text-uni-red/5 font-extrabold tracking-widest text-[55px] select-none">UNI</span>
                    <Landmark className="h-20 w-20 text-uni-red/80 animate-bounce" />
                    
                    <div className="absolute bottom-6 left-6 right-6 text-left z-20">
                      <div className="inline-block px-2.5 py-0.5 bg-uni-red text-white text-[10px] font-bold rounded mb-1.5">
                        HISTÓRICO
                      </div>
                      <h4 className="text-zinc-900 text-base font-bold">Pabellón Central "Rectorado"</h4>
                      <p className="text-zinc-500 text-xs flex items-center mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-uni-red mr-1" /> Av. Túpac Amaru 210, Rímac
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subdetalles */}
                <div className="mt-4 p-3 bg-zinc-50/60 rounded-xl border border-zinc-150 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-uni-red" />
                      <span className="text-zinc-800 text-xs font-bold">150 Años de Trayectoria</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono font-semibold">1876-2026</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed font-medium">
                    Conmemoramos el aporte continuo al desarrollo de la infraestructura, minería, física y la ingeniería en el país.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
