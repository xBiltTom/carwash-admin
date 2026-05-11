"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    index: "01",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 13.5h6V20H4zM14 4h6v16h-6zM4 4h6v5.5H4zM14 12h6v3.5h-6z" />
      </svg>
    ),
  },
  {
    href: "/clientes",
    label: "Clientes",
    index: "02",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0" />
        <path d="M18.5 11.5a3 3 0 1 0-2.12-5.12M19 20a5.5 5.5 0 0 0-2.4-4.53" />
      </svg>
    ),
  },
  {
    href: "/vehiculos",
    label: "Vehiculos",
    index: "03",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M5 14l1.5-4.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 14" />
        <path d="M4 14h16v4a2 2 0 0 1-2 2h-1v-2H7v2H6a2 2 0 0 1-2-2z" />
        <circle cx="7.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/citas",
    label: "Citas",
    index: "04",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 3v3M17 3v3M4 9h16" />
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 13h2v2H9zM13 13h2v2h-2z" />
      </svg>
    ),
  },
  {
    href: "/pagos",
    label: "Pagos",
    index: "05",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 7h16v10H4z" />
        <path d="M4 10.5h16" />
        <path d="M8 15h3" />
      </svg>
    ),
  },
  {
    href: "/reportes",
    label: "Reportes",
    index: "06",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4M10 13h5M10 17h5M10 9h2" />
      </svg>
    ),
  },
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

      <aside className="hidden h-screen w-[300px] shrink-0 flex-col justify-between overflow-y-auto border-r border-white/8 px-6 py-8 lg:flex">
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
                  <div className="flex items-center gap-3">
                    <span className="text-amber-100/80">{item.icon}</span>
                    <span className="section-title text-2xl">{item.label}</span>
                  </div>
                  <span className="text-sm uppercase tracking-[0.28em] text-stone-400 group-hover:text-amber-100">
                    {item.index}
                  </span>
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
