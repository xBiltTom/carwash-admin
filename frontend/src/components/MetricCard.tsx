import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <article className="card-surface relative overflow-hidden rounded-[1.8rem] p-5">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">{label}</p>
          <div className="text-amber-100/80">{icon}</div>
        </div>
        <p className="section-title text-4xl text-stone-50">{value}</p>
        {detail ? <p className="text-sm text-stone-300/70">{detail}</p> : null}
      </div>
    </article>
  );
}
