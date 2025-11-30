import { cn } from "@/lib/utils";
import { LAYOUT_HEADER_CLASS } from "./layoutConstants";
import type { HTMLAttributes, ReactNode } from "react";

interface LayerSectionProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  children?: ReactNode;
}

export function LayerSection({
  header,
  headerClassName,
  contentClassName,
  children,
  className,
  ...rest
}: LayerSectionProps) {
  return (
    <section {...rest} className={cn("flex flex-col", className)}>
      {header && (
        <div className={cn(LAYOUT_HEADER_CLASS, headerClassName)}>{header}</div>
      )}
      <div className={cn("flex-1", contentClassName)}>{children}</div>
    </section>
  );
}

export default LayerSection;
