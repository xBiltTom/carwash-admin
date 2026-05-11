"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api, formatDate } from "@/lib/api";
import type { Cliente } from "@/types";

const initialForm = {
  nombre: "",
  documento: "",
  telefono: "",
  correo: "",
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadClientes() {
    try {
      setError("");
      setClientes(await api.get<Cliente[]>("/clientes"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los clientes.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadClientes();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");
      await api.post<Cliente, typeof form>("/clientes", form);
      setForm(initialForm);
      setSuccess("Cliente registrado correctamente.");
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el cliente.");
    }
  }

  return (
    <div className="page-grid">
      <header className="page-header">
        <div className="page-copy">
          <p className="eyebrow">Base comercial</p>
          <h2 className="section-title mt-3 text-4xl sm:text-5xl">Clientes del lavadero.</h2>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="eyebrow">Nuevo registro</p>
          <h3 className="section-title mt-2 text-3xl">Agregar cliente</h3>
          <div className="mt-6 grid gap-4">
            <input className="field" placeholder="Nombre completo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            <input className="field" placeholder="Documento" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} required />
            <input className="field" placeholder="Telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} required />
            <input className="field" type="email" placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-200">{success}</p> : null}
            <button className="button-primary" type="submit">Registrar cliente</button>
          </div>
        </form>

        <DataTable
          title="Clientes registrados"
          description="Vista rapida del padrón actual de clientes."
          rows={clientes}
          emptyMessage="No hay clientes registrados todavia."
          columns={[
            { key: "nombre", header: "Nombre", render: (cliente) => <div><p className="font-medium text-stone-50">{cliente.nombre}</p><p className="text-xs text-stone-400">{cliente.correo}</p></div> },
            { key: "documento", header: "Documento", render: (cliente) => cliente.documento },
            { key: "telefono", header: "Telefono", render: (cliente) => cliente.telefono },
            { key: "fecha", header: "Registro", render: (cliente) => formatDate(cliente.created_at) },
          ]}
        />
      </section>
    </div>
  );
}
