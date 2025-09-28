"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CustomTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  errors?: string;
  containerClasses?: string;
  rows?: number;
  isOptional?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export function CustomTextArea({
  id,
  label,
  errors,
  maxLength,
  containerClasses = "",
  rows = 5,
  isOptional = false,
  showCharCount = false,
  ...rest
}: CustomTextAreaProps) {
  const t = useTranslations("common");
  
  const currentValue = rest.value || rest.defaultValue || "";
  const currentLength = typeof currentValue === 'string' ? currentValue.length : 0;
  
  const isOverLimit = maxLength && currentLength > maxLength;
  
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
          <textarea
            id={id}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "text-sm placeholder:text-muted-foreground border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
              errors || isOverLimit ? "ring-destructive/20 border-destructive" : "hover:border-[#A57DA8] focus:border-[#A57DA8] focus:outline-none focus:ring-0"
            )}
            {...rest}
          />
        </div>
        {errors && <p className="text-destructive text-sm mt-1">{errors}</p>}
        {showCharCount && maxLength && (
          <div className="mt-1">
            <div className="text-xs text-muted-foreground">
              {currentLength} / {maxLength} znaków
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
