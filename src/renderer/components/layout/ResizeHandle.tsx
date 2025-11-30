import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  onMouseDown: () => void;
  className?: string;
}

function ResizeHandle({ onMouseDown, className }: ResizeHandleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div
        className="absolute -left-3 top-0 bottom-0 w-6 cursor-col-resize"
        onMouseDown={onMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <span
        className={cn(
          "block h-full transition-all duration-150 bg-border",
          isHovered ? "w-[6px] bg-neutral-900" : "w-px"
        )}
      />
    </div>
  );
}

export default ResizeHandle;
