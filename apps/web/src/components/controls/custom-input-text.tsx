"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CustomInputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  errors?: string;
  containerClasses?: string;
  isOptional?: boolean;
}

export function CustomInputText({
  id,
  label,
  errors,
  containerClasses = "",
  isOptional = false,
  ...rest
}: CustomInputTextProps) {
  const t = useTranslations("common");

  
  return (
    <div className={`${containerClasses}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
          {isOptional && <span className="text-muted-foreground"> ({t("optional")})</span>}
        </label>
      )}
      <div>
        <div className="relative flex gap-4">
          <input
            id={id}
            type="text"
            className={cn(
              "text-sm placeholder:text-muted-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
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
