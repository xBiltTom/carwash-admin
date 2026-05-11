interface StatusBadgeProps {
  value: string;
}

const variants: Record<string, string> = {
  RESERVADA: "bg-amber-300/12 text-amber-100 border-amber-300/25",
  EN_ATENCION: "bg-sky-300/12 text-sky-100 border-sky-300/25",
  FINALIZADA: "bg-emerald-300/12 text-emerald-100 border-emerald-300/25",
  CANCELADA: "bg-rose-300/12 text-rose-100 border-rose-300/25",
  PENDIENTE: "bg-yellow-300/12 text-yellow-100 border-yellow-300/25",
  PAGADO: "bg-emerald-300/12 text-emerald-100 border-emerald-300/25",
  EFECTIVO: "bg-stone-200/10 text-stone-100 border-stone-200/15",
  YAPE: "bg-fuchsia-300/12 text-fuchsia-100 border-fuchsia-300/25",
  PLIN: "bg-violet-300/12 text-violet-100 border-violet-300/25",
  TARJETA: "bg-cyan-300/12 text-cyan-100 border-cyan-300/25",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.2em] ${variants[value] ?? "border-white/10 bg-white/5 text-stone-100"}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
