import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4">
      <div className="pointer-events-none absolute inset-0 luxury-gradient opacity-[0.03]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-ocean/10 blur-[100px]" />
      <AdminLoginForm />
    </div>
  );
}
