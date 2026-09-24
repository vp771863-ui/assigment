"use client";

import { useRouter } from "next/navigation";
import { clearAuth, getUser } from "../../lib/auth";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => setUser(getUser()), []);

  function logout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          className="text-xl font-bold text-slate-900"
          onClick={() => router.push("/products")}
        >
          Product Admin
        </button>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 sm:block">
            {user?.username || "Admin"}
          </span>
          <button className="btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
