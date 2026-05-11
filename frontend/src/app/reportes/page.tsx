"use client";

import { useState } from "react";
import { downloadFile } from "@/lib/api";

export default function ReportesPage() {
  const [error, setError] = useState("");

  async function handleDownload(path: string, filename: string) {
    try {
      setError("");
      await downloadFile(path, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el reporte.");
    }
  }

  return (
    <div className="page-grid">
      <header className="page-header">
        <div className="page-copy">
          <p className="eyebrow">Salida documental</p>
          <h2 className="section-title mt-3 text-4xl sm:text-5xl">Reportes listos para examen.</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300/74 sm:text-base">
            Descarga reportes PDF operativos y de gestion directamente desde el frontend conectado al backend.
          </p>
        </div>
      </header>

      {error ? <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card-surface rounded-[1.8rem] p-6">
          <p className="eyebrow">Operacion diaria</p>
          <h3 className="section-title mt-2 text-3xl">Reporte operacional</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300/74">
            Incluye las citas del dia con su horario, cliente, placa, servicio, estado y pago asociado.
          </p>
          <button type="button" className="button-primary mt-8" onClick={() => void handleDownload("/reportes/operacional/pdf", "reporte_operacional.pdf")}>
            Descargar PDF operacional
          </button>
        </article>

        <article className="card-surface rounded-[1.8rem] p-6">
          <p className="eyebrow">Gestion global</p>
          <h3 className="section-title mt-2 text-3xl">Reporte de gestion</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300/74">
            Resume citas totales, ingresos pagados, estados, servicios mas solicitados y metodos de pago utilizados.
          </p>
          <button type="button" className="button-primary mt-8" onClick={() => void handleDownload("/reportes/gestion/pdf", "reporte_gestion.pdf")}>
            Descargar PDF de gestion
          </button>
        </article>
      </section>
    </div>
  );
}
