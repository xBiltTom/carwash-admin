"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { api, formatCurrency } from "@/lib/api";
import type { DashboardResumen } from "@/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResumen | null>(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setError("");
      const response = await api.get<DashboardResumen>("/dashboard/resumen");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="page-grid">
      <header className="page-header">
        <div className="page-copy">
          <p className="eyebrow">Vista central</p>
          <h2 className="section-title mt-3 text-4xl sm:text-5xl">Operacion en tiempo real.</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300/74 sm:text-base">
            Sigue el ritmo del lavadero, detecta carga operativa y revisa ingresos sin salir del panel.
          </p>
        </div>
      </header>

      {error ? <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total de citas" value={data?.total_citas ?? "--"} detail="Agenda completa registrada en el sistema." />
        <MetricCard label="Ingresos totales" value={data ? formatCurrency(data.ingresos_totales) : "--"} detail="Pagos confirmados acumulados." />
        <MetricCard label="Ingresos del dia" value={data ? formatCurrency(data.ingresos_hoy) : "--"} detail="Cobros asociados a citas del dia actual." />
        <MetricCard label="Reservadas" value={data?.citas_reservadas ?? "--"} />
        <MetricCard label="En atencion" value={data?.citas_en_atencion ?? "--"} />
        <MetricCard label="Finalizadas / Canceladas" value={data ? `${data.citas_finalizadas} / ${data.citas_canceladas}` : "--"} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="eyebrow">Demanda</p>
          <h3 className="section-title mt-2 text-3xl">Servicios mas solicitados</h3>
          <div className="mt-6 space-y-4">
            {data?.servicios_mas_solicitados.length ? (
              data.servicios_mas_solicitados.map((item) => {
                const width = `${Math.min(item.total * 20, 100)}%`;

                return (
                  <div key={item.servicio} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm text-stone-200">
                      <span>{item.servicio}</span>
                      <span className="text-stone-400">{item.total} citas</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/6">
                      <div className="h-2 rounded-full bg-[linear-gradient(90deg,#e4c08a,#c17439)]" style={{ width }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-stone-400">Aun no hay servicios registrados en citas.</p>
            )}
          </div>
        </article>

        <article className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="eyebrow">Cobranza</p>
          <h3 className="section-title mt-2 text-3xl">Metodos de pago</h3>
          <div className="mt-6 space-y-3">
            {data?.metodos_pago_usados.length ? (
              data.metodos_pago_usados.map((item) => (
                <div key={item.metodo_pago} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm uppercase tracking-[0.18em] text-stone-200">{item.metodo_pago}</span>
                  <span className="section-title text-2xl text-amber-100">{item.total}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-400">Aun no hay pagos registrados.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
