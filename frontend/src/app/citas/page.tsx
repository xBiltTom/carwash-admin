"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { ApiError, api } from "@/lib/api";
import type { Cita, Cliente, EstadoCita, Servicio, Vehiculo } from "@/types";

const initialForm = {
  cliente_id: "",
  vehiculo_id: "",
  servicio_id: "",
  fecha_cita: "",
  hora_cita: "",
  observaciones: "",
};

const estados: EstadoCita[] = ["RESERVADA", "EN_ATENCION", "FINALIZADA", "CANCELADA"];

export default function CitasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setError("");
      const [clientesData, vehiculosData, serviciosData, citasData] = await Promise.all([
        api.get<Cliente[]>("/clientes"),
        api.get<Vehiculo[]>("/vehiculos"),
        api.get<Servicio[]>("/servicios"),
        api.get<Cita[]>("/citas"),
      ]);
      setClientes(clientesData);
      setVehiculos(vehiculosData);
      setServicios(serviciosData);
      setCitas(citasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la informacion.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const availableVehiculos = form.cliente_id
    ? vehiculos.filter((vehiculo) => vehiculo.cliente_id === Number(form.cliente_id))
    : [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");
      await api.post<Cita, Record<string, string | number | null>>("/citas", {
        cliente_id: Number(form.cliente_id),
        vehiculo_id: Number(form.vehiculo_id),
        servicio_id: Number(form.servicio_id),
        fecha_cita: form.fecha_cita,
        hora_cita: form.hora_cita,
        observaciones: form.observaciones || null,
      });
      setForm(initialForm);
      setSuccess("Cita registrada correctamente.");
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.detail.includes("No hay cupos disponibles")) {
        setError("No hay cupos disponibles para este horario. Maximo 2 citas en paralelo.");
        return;
      }

      setError(err instanceof Error ? err.message : "No se pudo registrar la cita.");
    }
  }

  async function handleStatusChange(citaId: number, estado: EstadoCita) {
    try {
      setError("");
      await api.patch<Cita, { estado: EstadoCita }>(`/citas/${citaId}/estado`, { estado });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el estado.");
    }
  }

  return (
    <div className="page-grid">
      <header className="page-header">
        <div className="page-copy">
          <p className="eyebrow">Agenda diaria</p>
          <h2 className="section-title mt-3 text-4xl sm:text-5xl">Control de citas.</h2>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="eyebrow">Nueva cita</p>
          <h3 className="section-title mt-2 text-3xl">Reservar horario</h3>
          <div className="mt-6 grid gap-4">
            <select className="select" value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value, vehiculo_id: "" })} required>
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
            </select>
            <select className="select" value={form.vehiculo_id} onChange={(e) => setForm({ ...form, vehiculo_id: e.target.value })} required>
              <option value="">Selecciona un vehiculo</option>
              {availableVehiculos.map((vehiculo) => <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.placa} · {vehiculo.marca} {vehiculo.modelo}</option>)}
            </select>
            <select className="select" value={form.servicio_id} onChange={(e) => setForm({ ...form, servicio_id: e.target.value })} required>
              <option value="">Selecciona un servicio</option>
              {servicios.map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
            </select>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field" type="date" value={form.fecha_cita} onChange={(e) => setForm({ ...form, fecha_cita: e.target.value })} required />
              <input className="field" type="time" value={form.hora_cita} onChange={(e) => setForm({ ...form, hora_cita: e.target.value })} required />
            </div>
            <textarea className="textarea min-h-28" placeholder="Observaciones" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-200">{success}</p> : null}
            <button className="button-primary" type="submit">Registrar cita</button>
          </div>
        </form>

        <DataTable
          title="Citas registradas"
          description="Actualiza el estado de cada atencion directamente desde la tabla."
          rows={citas}
          emptyMessage="No hay citas registradas todavia."
          columns={[
            { key: "cliente", header: "Cliente", render: (cita) => clientes.find((cliente) => cliente.id === cita.cliente_id)?.nombre ?? `#${cita.cliente_id}` },
            { key: "vehiculo", header: "Vehiculo", render: (cita) => vehiculos.find((vehiculo) => vehiculo.id === cita.vehiculo_id)?.placa ?? `#${cita.vehiculo_id}` },
            { key: "servicio", header: "Servicio", render: (cita) => servicios.find((servicio) => servicio.id === cita.servicio_id)?.nombre ?? `#${cita.servicio_id}` },
            { key: "horario", header: "Horario", render: (cita) => <div><p>{cita.fecha_cita}</p><p className="text-xs text-stone-400">{cita.hora_cita.slice(0, 5)}</p></div> },
            { key: "estado", header: "Estado", render: (cita) => <StatusBadge value={cita.estado} /> },
            {
              key: "acciones",
              header: "Acciones",
              render: (cita) => (
                <div className="flex flex-wrap gap-2">
                  {estados.map((estado) => (
                    <button key={estado} type="button" onClick={() => void handleStatusChange(cita.id, estado)} className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-[0.15em] text-stone-200 hover:border-amber-300/30 hover:bg-amber-200/10">
                      {estado.replaceAll("_", " ")}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
