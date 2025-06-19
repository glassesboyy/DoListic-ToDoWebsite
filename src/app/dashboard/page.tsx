"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Halo, {user?.name || user?.username || "User"}! 👋
        </h1>
        <p className="text-text-secondary text-lg">
          Ini adalah halaman terautentikasi. Selamat datang di dashboard Anda!
        </p>
        <div className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-200">
          <p className="text-primary-700">✅ Anda berhasil masuk ke sistem</p>
        </div>
      </div>
    </div>
  );
}
