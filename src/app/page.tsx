import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LibroOro from "@/components/LibroOro";
import Conferencias from "@/components/Conferencias";
import Unictec from "@/components/Unictec";
import MesCentral from "@/components/MesCentral";
import EventosCulturales from "@/components/EventosCulturales";
import ModulosFuncionales from "@/components/ModulosFuncionales";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-grow">
        {/* Section 1: Hero Banner */}
        <Hero />

        {/* Section 2: About / "¿Qué significa 150 años?" */}
        <About />

        {/* Section 3: Libro de Oro del Sesquicentenario */}
        <LibroOro />

        {/* Section 4: Conferencias Académicas e Investigación */}
        <Conferencias />

        {/* Section 5: Feria Tecnológica Internacional - UNICTEC */}
        <Unictec />

        {/* Section 6: Julio Mes Central - Cronograma */}
        <MesCentral />

        {/* Section 7: Eventos Culturales - Danzas Folklóricas */}
        <EventosCulturales />

        {/* Section 8: Interactive Core Modules (Certificates Search, QR Pass, Gala Tickets) */}
        <ModulosFuncionales />
      </main>

      {/* Footer credits and newsletter */}
      <Footer />
    </>
  );
}
