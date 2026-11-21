"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, List, LogOut, PlusCircle, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import s from "@/styles/ui.module.scss";

const LINKS = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/gastos", label: "Gastos", icon: List },
  { href: "/gastos/nuevo", label: "Nuevo gasto", icon: PlusCircle },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/login")) return null;

  const isActive = (href: string) => {
    if (href === "/gastos") {
      return pathname === "/gastos" || (pathname.startsWith("/gastos/") && pathname !== "/gastos/nuevo");
    }
    return pathname === href;
  };

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className={s.nav}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className={s.brand}>
          <Wallet size={20} /> Gastos
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${s.navLink} ${isActive(href) ? s.navLinkActive : ""}`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <button type="button" onClick={logout} className={s.navLink} aria-label="Cerrar sesión">
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
