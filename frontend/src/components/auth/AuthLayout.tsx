import type { ReactNode } from "react";
import Link from "next/link";

// ============================================================================
// AuthLayout — Split-screen layout for auth pages
// ============================================================================

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.3) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo */}
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">
              CarbonForge
            </span>
          </Link>
        </div>

        {/* Brand message */}
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight text-white xl:text-4xl">
            Carbon credit trading,{" "}
            <span className="text-emerald-400">simplified.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Connect landowners, exporters, and corporate buyers on a single
            platform for transparent, verified carbon offset projects.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p className="text-2xl font-semibold text-white">2.4M</p>
              <p className="mt-1 text-sm text-slate-500">Credits traded</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">150+</p>
              <p className="mt-1 text-sm text-slate-500">Projects listed</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">32</p>
              <p className="mt-1 text-sm text-slate-500">Countries</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CarbonForge. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center bg-slate-50 px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                CarbonForge
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
