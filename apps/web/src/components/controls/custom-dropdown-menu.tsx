"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type Align = "start" | "center" | "end";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  align?: Align;
}

export function DropdownMenu({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  className,
  align = "start",
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpenState = (v: boolean) => (isControlled ? onOpenChange?.(v) : setUncontrolledOpen(v));
  const toggleOpen = () => setOpenState(!isOpen);
  const closeDropdown = () => setOpenState(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const alignmentClasses: Record<Align, string> = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div className="relative" ref={rootRef}>
      <div onClick={toggleOpen} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md",
            alignmentClasses[align],
            "transition-all duration-150 ease-out",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
