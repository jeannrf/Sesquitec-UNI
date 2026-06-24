"use client";

import { useState, useEffect } from "react";
import { Menu, X, Landmark, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Libro de Oro", href: "#libro-oro" },
    { name: "Conferencias", href: "#conferencias" },
    { name: "UNICTEC", href: "#unictec" },
    { name: "Mes Central", href: "#mes-central" },
    { name: "Danzas", href: "#danzas" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <div className="p-2.5 bg-uni-red rounded-xl border border-uni-red-dark/20 flex items-center justify-center">
              <Landmark className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-outfit text-xl font-bold tracking-tight text-zinc-900 block">
                Sesquitec<span className="text-uni-red">UNI</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase block -mt-1">
                Sesquicentenario
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-700 hover:text-uni-red hover:bg-zinc-100/50 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center">
            <a
              href="#sistemas"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-uni-red hover:bg-uni-red-light text-white text-sm font-semibold rounded-xl border border-uni-red-dark/10 shadow-lg shadow-uni-red/10 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="h-4 w-4 text-white" />
              <span>Acceso Sistemas</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 hover:text-uni-red hover:bg-zinc-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full left-0 z-40 transition-all duration-300 ease-in-out glass-nav shadow-lg ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1.5 border-t border-zinc-100">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-zinc-700 hover:text-uni-red hover:bg-zinc-50 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-zinc-100">
            <a
              href="#sistemas"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-3.5 bg-uni-red hover:bg-uni-red-light text-white font-semibold rounded-xl border border-uni-red-dark/10 shadow-md transition-all"
            >
              <ShieldCheck className="h-5 w-5 text-white" />
              <span>Acceso Sistemas</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
