import { cn } from "@/lib/cn";

export function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("glass-panel border-neon-pink/15", className)}>{children}</div>
  );
}
