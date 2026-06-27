import { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeVariant = "info" | "warning" | "danger" | "success";

interface NoticeCardProps {
  variant?: NoticeVariant;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
}

const variantStyles: Record<NoticeVariant, { wrapper: string; icon: string; iconBg: string }> = {
  info: {
    wrapper: "border-blue-200 bg-blue-50/70",
    icon: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50/80",
    icon: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  danger: {
    wrapper: "border-red-200 bg-red-50/80",
    icon: "text-red-700",
    iconBg: "bg-red-100",
  },
  success: {
    wrapper: "border-emerald-200 bg-emerald-50/80",
    icon: "text-emerald-700",
    iconBg: "bg-emerald-100",
  },
};

const iconMap: Record<NoticeVariant, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
  success: CheckCircle2,
};

export function NoticeCard({
  variant = "info",
  title,
  description,
  className,
  children,
}: NoticeCardProps) {
  const style = variantStyles[variant];
  const Icon = iconMap[variant];

  return (
    <div className={cn("rounded-xl border p-4", style.wrapper, className)}>
      <div className="flex items-start gap-3">
        <div className={cn("rounded-lg p-2", style.iconBg)}>
          <Icon className={cn("h-4 w-4", style.icon)} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted">{description}</p>
          {children ? <div className="mt-3">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
