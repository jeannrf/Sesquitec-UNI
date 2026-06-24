import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sesquitec-UNI | 150 Años Formando Científicos, Ingenieros y Arquitectos",
  description: "Plataforma web oficial del Sesquicentenario de la Universidad Nacional de Ingeniería (UNI). Centralización de eventos, emisión de certificados, control de asistencia y pasarela de pagos.",
  keywords: "UNI, Sesquicentenario, Sesquitec, Universidad Nacional de Ingeniería, 150 años, Certificados, Asistencia QR, Egresados",
  authors: [{ name: "UNICODE" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50 antialiased selection:bg-uni-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
