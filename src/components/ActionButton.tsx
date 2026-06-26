import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ActionButtonProps extends ButtonProps {
  href?: string;
}

export function ActionButton({ href, children, ...props }: ActionButtonProps) {
  if (href) {
    return (
      <Button asChild {...props}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }
  return <Button {...props}>{children}</Button>;
}
