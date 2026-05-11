"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/dashboard", label: "Dashboard", index: "01" },
  { href: "/clientes", label: "Clientes", index: "02" },
  { href: "/vehiculos", label: "Vehiculos", index: "03" },
  { href: "/citas", label: "Citas", index: "04" },
  { href: "/pagos", label: "Pagos", index: "05" },
  { href: "/reportes", label: "Reportes", index: "06" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-white/8 px-4 py-4 lg:hidden">
        <p className="eyebrow">CarWash Admin</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                  active
                    ? "border-amber-300/30 bg-amber-200/10 text-stone-50"
                    : "border-white/8 bg-white/[0.02] text-stone-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="hidden w-[300px] shrink-0 flex-col justify-between border-r border-white/8 px-6 py-8 lg:flex">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="eyebrow">CarWash Admin</p>
            <div>
              <h1 className="section-title text-4xl text-stone-50">Control limpio.</h1>
              <p className="mt-3 max-w-xs text-sm leading-6 text-stone-300/78">
                Un panel oscuro y preciso para operar citas, pagos, vehiculos y reportes sin distracciones.
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-[1.4rem] border px-4 py-4 ${
                    active
                      ? "border-amber-300/30 bg-amber-200/10 text-stone-50"
                      : "border-white/6 bg-white/[0.02] text-stone-300 hover:border-amber-300/20 hover:bg-white/[0.05] hover:text-stone-50"
                  }`}
                >
                  <span className="text-sm uppercase tracking-[0.28em] text-stone-400 group-hover:text-amber-100">
                    {item.index}
                  </span>
                  <span className="section-title text-2xl">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="card-surface rounded-[1.6rem] p-5">
          <p className="eyebrow">Conexion</p>
          <p className="mt-3 text-sm leading-6 text-stone-300/80">
            Frontend conectado a <span className="text-amber-100">FastAPI</span> mediante
            <span className="font-medium text-stone-100"> NEXT_PUBLIC_API_URL</span>.
          </p>
        </div>
      </aside>
    </>
  );
}
