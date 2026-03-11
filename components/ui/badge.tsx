import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-hcg-gold/10 text-hcg-gold border border-hcg-gold/20",
        secondary: "bg-hcg-card text-hcg-muted border border-hcg-border",
        destructive: "bg-hcg-red/10 text-hcg-red border border-hcg-red/20",
        success: "bg-green-500/10 text-green-400 border border-green-500/20",
        info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        warning: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        outline: "border border-hcg-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
