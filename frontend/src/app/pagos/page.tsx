"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { api, downloadFile, formatCurrency, formatDate } from "@/lib/api";
import type { Cita, Cliente, EstadoPago, MetodoPago, Pago, Servicio, Vehiculo } from "@/types";

const initialForm = {
  cita_id: "",
  monto: "",
  metodo_pago: "EFECTIVO" as MetodoPago,
  estado_pago: "PENDIENTE" as EstadoPago,
  codigo_operacion: "",
};

export default function PagosPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setError("");
      const [citasData, pagosData, clientesData, vehiculosData, serviciosData] = await Promise.all([
        api.get<Cita[]>("/citas"),
        api.get<Pago[]>("/pagos"),
        api.get<Cliente[]>("/clientes"),
        api.get<Vehiculo[]>("/vehiculos"),
        api.get<Servicio[]>("/servicios"),
      ]);
      setCitas(citasData);
      setPagos(pagosData);
      setClientes(clientesData);
      setVehiculos(vehiculosData);
      setServicios(serviciosData);
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
      await api.post<Pago, Record<string, string | number | null>>("/pagos", {
        cita_id: Number(form.cita_id),
        monto: form.monto,
        metodo_pago: form.metodo_pago,
        estado_pago: form.estado_pago,
        codigo_operacion: form.codigo_operacion || null,
      });
      setForm(initialForm);
      setSuccess("Pago registrado correctamente.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el pago.");
    }
  }

  async function handleDownload(pagoId: number) {
    try {
      await downloadFile(`/pagos/${pagoId}/voucher/pdf`, `voucher_pago_${pagoId}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el voucher.");
    }
  }

  return (
    <div className="page-grid">
      <header className="page-header">
        <div className="page-copy">
          <p className="eyebrow">Cobros</p>
          <h2 className="section-title mt-3 text-4xl sm:text-5xl">Registro de pagos.</h2>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <form onSubmit={handleSubmit} className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="eyebrow">Nuevo pago</p>
          <h3 className="section-title mt-2 text-3xl">Asociar pago a cita</h3>
          <div className="mt-6 grid gap-4">
            <select className="select" value={form.cita_id} onChange={(e) => setForm({ ...form, cita_id: e.target.value })} required>
              <option value="">Selecciona una cita</option>
              {citas.map((cita) => {
                const cliente = clientes.find((item) => item.id === cita.cliente_id);
                const vehiculo = vehiculos.find((item) => item.id === cita.vehiculo_id);
                return <option key={cita.id} value={cita.id}>#{cita.id} · {cliente?.nombre ?? "Cliente"} · {vehiculo?.placa ?? "Placa"}</option>;
              })}
            </select>
            <input className="field" type="number" min="0" step="0.01" placeholder="Monto" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <select className="select" value={form.metodo_pago} onChange={(e) => setForm({ ...form, metodo_pago: e.target.value as MetodoPago })}>
                {(["EFECTIVO", "YAPE", "PLIN", "TARJETA"] as MetodoPago[]).map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
              </select>
              <select className="select" value={form.estado_pago} onChange={(e) => setForm({ ...form, estado_pago: e.target.value as EstadoPago })}>
                {(["PENDIENTE", "PAGADO"] as EstadoPago[]).map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
            </div>
            <input className="field" placeholder="Codigo de operacion" value={form.codigo_operacion} onChange={(e) => setForm({ ...form, codigo_operacion: e.target.value })} />
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-200">{success}</p> : null}
            <button className="button-primary" type="submit">Registrar pago</button>
          </div>
        </form>

        <DataTable
          title="Pagos registrados"
          description="Incluye acceso directo al voucher PDF por cada pago."
          rows={pagos}
          emptyMessage="No hay pagos registrados todavia."
          columns={[
            { key: "cita", header: "Cita", render: (pago) => {
              const cita = citas.find((item) => item.id === pago.cita_id);
              const cliente = clientes.find((item) => item.id === cita?.cliente_id);
              return <div><p className="font-medium text-stone-50">#{pago.cita_id}</p><p className="text-xs text-stone-400">{cliente?.nombre ?? "Sin cliente"}</p></div>;
            } },
            { key: "servicio", header: "Servicio", render: (pago) => {
              const cita = citas.find((item) => item.id === pago.cita_id);
              return servicios.find((item) => item.id === cita?.servicio_id)?.nombre ?? "-";
            } },
            { key: "monto", header: "Monto", render: (pago) => formatCurrency(pago.monto) },
            { key: "estado", header: "Estado", render: (pago) => <div className="flex flex-wrap gap-2"><StatusBadge value={pago.metodo_pago} /><StatusBadge value={pago.estado_pago} /></div> },
            { key: "fecha", header: "Fecha", render: (pago) => pago.fecha_pago ? formatDate(pago.fecha_pago) : "Pendiente" },
            { key: "voucher", header: "Voucher", render: (pago) => <button type="button" className="button-secondary text-xs uppercase tracking-[0.18em]" onClick={() => void handleDownload(pago.id)}>Descargar</button> },
          ]}
        />
      </section>
    </div>
  );
}
