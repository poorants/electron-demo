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
      className={cn("resize-handle-root", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="resize-handle-hit" onMouseDown={onMouseDown} />
      <div className="h-full resize-handle-line" />
      {isHovered && <div className="resize-handle-hover-line" />}
    </div>
  );
}

export default ResizeHandle;
