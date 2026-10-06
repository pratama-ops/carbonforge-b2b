"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RoleSelector from "@/components/ui/RoleSelector";
import { registerUser, storeAuth } from "@/lib/api";
import type { ApiError, UserRole } from "@/lib/types";

// ============================================================================
// Register Page — app/auth/register
// ============================================================================

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "Full name is required";
    else if (name.trim().length < 2)
      errors.name = "Name must be at least 2 characters";

    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters";

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (!role) errors.role = "Please select a role";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role as UserRole,
      });

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
        setError(res.message ?? "Registration failed. Please try again.");
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
      title="Create your account"
      subtitle="Join the CarbonForge marketplace"
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
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          required
        />

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

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          helperText={
            !fieldErrors.password
              ? "Must be at least 8 characters"
              : undefined
          }
          required
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          required
        />

        <RoleSelector
          value={role}
          onChange={setRole}
          error={fieldErrors.role}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create account
        </Button>

        <p className="text-center text-xs leading-relaxed text-slate-500">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-emerald-700 hover:text-emerald-800"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
