import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "¿Cumplió? — Veeduría ciudadana",
  description:
    "Menos blablá, más acción. Seguimiento ciudadano a las promesas de presidentes, gobernadores y alcaldes: qué prometieron, qué se ha hecho y qué falta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
