import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

function ResizeHandle({ onMouseDown, className }: ResizeHandleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-y-0 -left-2 w-4 cursor-col-resize"
        onMouseDown={onMouseDown}
      />
      <div className="h-full w-px bg-border" />
      {isHovered && (
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] rounded bg-foreground/80" />
      )}
    </div>
  );
}

export default ResizeHandle;
