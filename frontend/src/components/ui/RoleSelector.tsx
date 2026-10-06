import type { UserRole } from "@/lib/types";

// ============================================================================
// RoleSelector — Radio button group for role selection
// ============================================================================

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "LANDOWNER",
    label: "Landowner",
    description: "Manage and list carbon offset projects on your land",
  },
  {
    value: "EXPORTER",
    label: "Exporter",
    description: "Export and trade carbon credits internationally",
  },
  {
    value: "BUYER",
    label: "Corporate Buyer",
    description: "Purchase carbon credits to offset emissions",
  },
];

interface RoleSelectorProps {
  value: UserRole | "";
  onChange: (role: UserRole) => void;
  error?: string;
  name?: string;
}

export default function RoleSelector({
  value,
  onChange,
  error,
  name = "role",
}: RoleSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700">
        Register as
      </legend>
      <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
        {roleOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={[
                "relative flex cursor-pointer flex-col rounded-lg border p-4 transition-all",
                isSelected
                  ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                  : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50",
                error && !isSelected ? "border-red-300" : "",
              ].join(" ")}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
                aria-describedby={`${option.value}-desc`}
              />
              <span
                className={[
                  "text-sm font-semibold",
                  isSelected ? "text-emerald-900" : "text-slate-900",
                ].join(" ")}
              >
                {option.label}
              </span>
              <span
                id={`${option.value}-desc`}
                className="mt-1 text-xs leading-relaxed text-slate-500"
              >
                {option.description}
              </span>
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
