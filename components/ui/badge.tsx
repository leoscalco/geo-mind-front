import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeVariant = "default" | "emerald" | "rose" | "blue" | "amber" | "slate";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-800 text-slate-300 border-slate-700",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  slate: "bg-slate-700/50 text-slate-400 border-slate-600",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
