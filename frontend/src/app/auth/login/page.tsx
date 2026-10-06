"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginUser, storeAuth } from "@/lib/api";
import type { ApiError } from "@/lib/types";

// ============================================================================
// Login Page — app/auth/login
// ============================================================================

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ email: email.trim(), password });

      if (res.success && res.data) {
        storeAuth(res.data.token, res.data.user);

        // Redirect based on role
        const dashboardPath =
          res.data.user.role === "LANDOWNER"
            ? "/dashboard/landowner"
            : res.data.user.role === "EXPORTER"
              ? "/dashboard/exporter"
              : "/dashboard/buyer";
        router.push(dashboardPath);
      } else {
        setError(res.message ?? "Login failed. Please try again.");
      }
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.errors) {
        const flattened: Record<string, string> = {};
        for (const [key, messages] of Object.entries(apiErr.errors)) {
          flattened[key] = messages[0];
        }
        setFieldErrors(flattened);
      }
      setError(apiErr.message ?? "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your CarbonForge account"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* General error */}
        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          required
        />

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={[
              "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
              fieldErrors.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-100",
            ].join(" ")}
            aria-invalid={fieldErrors.password ? "true" : "false"}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            required
          />
          {fieldErrors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-emerald-700 hover:text-emerald-800"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
