import { Home, Settings, PanelLeftClose, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { LayerSection } from "./LayerSection";

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
    <LayerSection
      className="icon-sidebar layer-shell-bg flex-shrink-0"
      header={
        <button
          onClick={onToggle}
          className="sidebar-icon-button rounded hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          {isExpanded ? (
            <PanelLeftClose className="sidebar-icon text-muted-foreground/80" />
          ) : (
            <PanelRightOpen className="sidebar-icon text-muted-foreground/80" />
          )}
        </button>
      }
      headerClassName="justify-center"
      contentClassName="border-r flex layer-shell-bg"
    >
      <nav className="flex flex-1 flex-col items-center sidebar-nav">
        {sidebarMenuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "sidebar-icon-button rounded transition-colors",
              currentView === id
                ? "bg-secondary text-secondary-foreground/80"
                : "text-muted-foreground/80 hover:bg-muted hover:text-muted-foreground"
            )}
            aria-label={label}
          >
            <Icon className="sidebar-icon" />
          </button>
        ))}
      </nav>
    </LayerSection>
  );
}

export function SubSidebar() {
  return (
    <LayerSection
      className="w-full h-full layer-shell-bg"
      header={
        <div className="px-3 text-xs text-muted-foreground w-full">
          {/* Reserved for future sub-sidebar header content */}
        </div>
      }
      headerClassName="layer-header-bg"
      contentClassName="layer-shell-bg"
    >
      <div className="flex-1" />
    </LayerSection>
  );
}
