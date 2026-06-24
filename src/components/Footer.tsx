"use client";

import { useState } from "react";
import { Landmark, Send, ShieldCheck } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-200">
          
          {/* Logo and brief */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center">
                <Landmark className="h-5.5 w-5.5 text-uni-red" />
              </div>
              <span className="font-outfit text-lg font-bold tracking-tight text-zinc-900">
                Sesquitec<span className="text-uni-red">UNI</span>
              </span>
            </div>
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-sm font-semibold">
              Plataforma unificada del Sesquicentenario de la Universidad Nacional de Ingeniería. Un legado de ciencia y tecnología para el desarrollo estratégico de la sociedad peruana.
            </p>
            <div className="flex items-center space-x-3 text-zinc-400 pt-2">
              <a href="#" className="hover:text-uni-red transition-colors"><GithubIcon className="h-5 w-5" /></a>
              <a href="#" className="hover:text-uni-red transition-colors"><LinkedinIcon className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-zinc-800 text-xs font-bold uppercase font-mono tracking-widest">
              Plataforma
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-650 font-bold">
              <li><a href="#inicio" className="hover:text-uni-red transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-uni-red transition-colors">Nosotros</a></li>
              <li><a href="#libro-oro" className="hover:text-uni-red transition-colors">Libro de Oro</a></li>
              <li><a href="#conferencias" className="hover:text-uni-red transition-colors">Conferencias</a></li>
            </ul>
          </div>

          {/* More links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-zinc-800 text-xs font-bold uppercase font-mono tracking-widest">
              Eventos
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-650 font-bold">
              <li><a href="#unictec" className="hover:text-uni-red transition-colors">UNICTEC</a></li>
              <li><a href="#mes-central" className="hover:text-uni-red transition-colors">Mes Central</a></li>
              <li><a href="#danzas" className="hover:text-uni-red transition-colors">Eventos Culturales</a></li>
              <li><a href="#sistemas" className="hover:text-uni-red transition-colors">Módulos</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-zinc-800 text-xs font-bold uppercase font-mono tracking-widest">
              Suscripción Boletín
            </h5>
            <p className="text-zinc-650 text-xs leading-relaxed max-w-sm font-semibold">
              Entérate antes que nadie de las ponencias académicas internacionales, resultados de concursos y pases para los eventos del aniversario.
            </p>
            
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-uni-red focus:ring-1 focus:ring-uni-red transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-uni-red hover:bg-uni-red-light text-white rounded-xl border border-uni-red-dark/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl max-w-sm font-semibold shadow-sm">
                ¡Gracias por suscribirte al boletín!
              </div>
            )}
          </div>

        </div>

        {/* Legal & Credits footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 font-bold font-mono">
          <div className="text-center sm:text-left space-y-1">
            <span>© {new Date().getFullYear()} Comisión del Sesquicentenario - UNI. Todos los derechos reservados.</span>
            <span className="block text-zinc-400">Av. Túpac Amaru 210, Rímac, Lima, Perú.</span>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-1">
            <ShieldCheck className="h-4 w-4 text-uni-red" />
            <span>Desarrollado y mantenido por </span>
            <a href="#" className="text-zinc-600 font-bold hover:underline hover:text-uni-red">UNICODE</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
