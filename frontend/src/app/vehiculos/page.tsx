"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api, formatDate } from "@/lib/api";
import type { Cliente, Vehiculo } from "@/types";

const initialForm = {
  cliente_id: "",
  placa: "",
  marca: "",
  modelo: "",
  color: "",
  tipo: "",
};

export default function VehiculosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setError("");
      const [clientesData, vehiculosData] = await Promise.all([
        api.get<Cliente[]>("/clientes"),
        api.get<Vehiculo[]>("/vehiculos"),
      ]);
      setClientes(clientesData);
      setVehiculos(vehiculosData);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");
      await api.post<Vehiculo, Record<string, string | number>>("/vehiculos", {
        ...form,
        cliente_id: Number(form.cliente_id),
      });
      setForm(initialForm);
      setSuccess("Vehiculo registrado correctamente.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el vehiculo.");
    }
  }

  return (
    <div className="page-grid">
      <header className="page-header">
        <div className="page-copy">
          <p className="eyebrow">Flota activa</p>
          <h2 className="section-title mt-3 text-4xl sm:text-5xl">Vehiculos por cliente.</h2>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="eyebrow">Nuevo vehiculo</p>
          <h3 className="section-title mt-2 text-3xl">Registrar unidad</h3>
          <div className="mt-6 grid gap-4">
            <select className="select" value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} required>
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
              ))}
            </select>
            <input className="field" placeholder="Placa" value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field" placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required />
              <input className="field" placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field" placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required />
              <input className="field" placeholder="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} required />
            </div>
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-200">{success}</p> : null}
            <button className="button-primary" type="submit">Registrar vehiculo</button>
          </div>
        </form>

        <DataTable
          title="Vehiculos registrados"
          description="Relacionados con sus propietarios para crear citas rapidamente."
          rows={vehiculos}
          emptyMessage="No hay vehiculos registrados todavia."
          columns={[
            { key: "placa", header: "Placa", render: (vehiculo) => <span className="font-medium text-stone-50">{vehiculo.placa}</span> },
            { key: "detalle", header: "Detalle", render: (vehiculo) => <div><p>{vehiculo.marca} {vehiculo.modelo}</p><p className="text-xs text-stone-400">{vehiculo.color} · {vehiculo.tipo}</p></div> },
            { key: "cliente", header: "Cliente", render: (vehiculo) => clientes.find((cliente) => cliente.id === vehiculo.cliente_id)?.nombre ?? `#${vehiculo.cliente_id}` },
            { key: "fecha", header: "Registro", render: (vehiculo) => formatDate(vehiculo.created_at) },
          ]}
        />
      </section>
    </div>
  );
}
