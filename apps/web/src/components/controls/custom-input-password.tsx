"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface CustomInputPasswordProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  errors?: string;
  containerClasses?: string;
}

export function CustomInputPassword({
  id,
  label,
  errors,
  containerClasses = "",
  ...rest
}: CustomInputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${containerClasses}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <div>
        <div className="relative flex gap-4">
          <input
            id={id}
            type={showPassword ? "text" : "password"}
            className={cn(
              "text-sm placeholder:text-secondary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
              errors ? "ring-destructive/20 border-destructive" : "hover:border-[#A57DA8] focus:border-[#A57DA8] focus:outline-none focus:ring-0"
            )}
            {...rest}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-0"
            aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
        {errors && <p className="text-destructive text-sm mt-1">{errors}</p>}
      </div>
    </div>
  );
}
