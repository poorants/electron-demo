import { Home, Settings, PanelLeftClose, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const sidebarMenuItems = [
  { id: "dashboard", label: "대시보드", icon: Home },
  { id: "settings", label: "설정", icon: Settings },
] as const;

export type SidebarViewId = (typeof sidebarMenuItems)[number]["id"];

interface IconSidebarProps {
  currentView: string;
  onNavigate: (view: SidebarViewId) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function IconSidebar({
  currentView,
  onNavigate,
  isExpanded,
  onToggle,
}: IconSidebarProps) {
  return (
    <aside className="w-12 bg-[#F6F8FA] flex flex-col flex-shrink-0">
      <div className="h-8 border-b flex items-center justify-center bg-[#FCFCFC]">
        <button
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          {isExpanded ? (
            <PanelLeftClose className="h-3.5 w-3.5" />
          ) : (
            <PanelRightOpen className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <nav className="flex-1 flex flex-col items-center gap-1 py-2 border-r">
        {sidebarMenuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "p-1.5 rounded transition-colors",
              currentView === id
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-label={label}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </nav>
    </aside>
  );
}

interface SubSidebarProps {
  width: number;
}

export function SubSidebar({ width }: SubSidebarProps) {
  return (
    <aside
      className="bg-[#F6F8FA] flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-200 ease-out"
      style={{ width }}
    >
      <div className="h-8 border-b flex items-center px-3 text-xs text-muted-foreground bg-[#FCFCFC]">
        {/* Reserved for future sub-sidebar header content */}
      </div>
      <div className="flex-1" />
    </aside>
  );
}
