import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Configuración de Turbopack para asegurar la resolución de módulos dentro de la raíz del proyecto
  turbopack: {
    root: path.join(__dirname, "./"),
  },
};

export default nextConfig;
