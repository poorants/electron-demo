import { memo, useRef, useState } from "react";
import { SubSidebar } from "./Sidebar";
import ResizeHandle from "./ResizeHandle";

interface ResizableSubSidebarProps {
  isOpen: boolean;
}

function ResizableSubSidebarInner({ isOpen }: ResizableSubSidebarProps) {
  const [width, setWidth] = useState(220);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(160, startWidth + delta);

      // Direct DOM manipulation for smooth resizing
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${nextWidth}px`;
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      // Sync final width to state
      const delta = upEvent.clientX - startX;
      const finalWidth = Math.max(160, startWidth + delta);
      setWidth(finalWidth);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ width: isOpen ? width : 0 }}
        className="flex-shrink-0 overflow-hidden transition-[width] duration-200 ease-out"
      >
        <SubSidebar />
      </div>
      {isOpen && <ResizeHandle onMouseDown={handleMouseDown} />}
    </>
  );
}

// Memoize to prevent re-renders from parent
const ResizableSubSidebar = memo(ResizableSubSidebarInner);

export default ResizableSubSidebar;
