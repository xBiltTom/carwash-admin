export type EstadoCita =
  | "RESERVADA"
  | "EN_ATENCION"
  | "FINALIZADA"
  | "CANCELADA";

export type MetodoPago = "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA";

export type EstadoPago = "PENDIENTE" | "PAGADO";

export interface Cliente {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  correo: string;
  created_at: string;
}

export interface Vehiculo {
  id: number;
  cliente_id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipo: string;
  created_at: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion_minutos: number;
  activo: boolean;
  created_at: string;
}

export interface Cita {
  id: number;
  cliente_id: number;
  vehiculo_id: number;
  servicio_id: number;
  fecha_cita: string;
  hora_cita: string;
  observaciones: string | null;
  estado: EstadoCita;
  created_at: string;
}

export interface Pago {
  id: number;
  cita_id: number;
  monto: string;
  metodo_pago: MetodoPago;
  estado_pago: EstadoPago;
  codigo_operacion: string | null;
  fecha_pago: string | null;
  created_at: string;
}

export interface DashboardServicioItem {
  servicio: string;
  total: number;
}

export interface DashboardMetodoPagoItem {
  metodo_pago: string;
  total: number;
}

export interface DashboardResumen {
  total_citas: number;
  citas_reservadas: number;
  citas_en_atencion: number;
  citas_finalizadas: number;
  citas_canceladas: number;
  ingresos_totales: string;
  ingresos_hoy: string;
  servicios_mas_solicitados: DashboardServicioItem[];
  metodos_pago_usados: DashboardMetodoPagoItem[];
}
