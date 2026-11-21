"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import s from "@/styles/ui.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className={`${s.card} w-full max-w-sm p-6`}>
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
            <Wallet size={22} />
          </div>
          <h1 className={s.title}>Gastos</h1>
          <p className={s.subtitle}>Ingresá para ver tus gastos</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className={s.label}>Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={s.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className={s.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={s.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={s.error}>{error}</p>}

          <button type="submit" disabled={loading} className={`${s.btn} ${s.btnPrimary} mt-2`}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
