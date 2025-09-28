"use client";

import { cn } from "@/lib/utils";
import type { ChangeEvent } from "react";

interface CustomInputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id: string;
  label?: string;
  errors?: string;
  onChange?: (value: string) => void;
  value?: string | null;
  containerClasses?: string;
  allowDecimals?: boolean;
}

export function CustomInputNumber({
  id,
  label,
  errors,
  onChange,
  value,
  containerClasses = "",
  allowDecimals = false,
  ...rest
}: CustomInputNumberProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    if (input === "") {
      onChange?.("");
      return;
    }

    const regex = allowDecimals 
      ? /^[0-9]*[,.]?[0-9]*$/
      : /^[0-9]*$/;
    
    if (regex.test(input)) {
      onChange?.(input);
    }
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
            type="text"
            inputMode={allowDecimals ? "decimal" : "numeric"}
            value={value || ""}
            onChange={handleChange}
            className={cn(
              "text-sm placeholder:text-muted-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              errors ? "ring-destructive/20 border-destructive" : "hover:border-[#A57DA8] focus:border-[#A57DA8] focus:outline-none focus:ring-0"
            )}
            {...rest}
          />
        </div>
        {errors && <p className="text-destructive text-sm mt-1">{errors}</p>}
      </div>
    </div>
  );
}
