"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  id?: string;
  name?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
}

/**
 * Compact, theme-matched combobox. Allows a custom value. The dropdown
 * closes when the user starts typing, clicks outside, presses Escape, or
 * selects an option.
 */
export function Combobox({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Select…",
  inputClassName,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(false); // typing dismisses the suggestions
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={cn(inputClassName, "pr-10")}
      />
      <button
        type="button"
        aria-label="Toggle purpose options"
        tabIndex={-1}
        onClick={() => setOpen((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-faint transition-colors hover:text-foreground"
      >
        <ChevronDown
          size={16}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-line bg-surface/95 p-1.5 backdrop-blur-xl shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "bg-white/[0.06] text-foreground"
                      : "text-muted hover:bg-white/[0.04] hover:text-foreground"
                  )}
                >
                  {opt}
                  {selected && <Check size={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
