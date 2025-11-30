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
      className="w-12 bg-[#F6F8FA] flex-shrink-0"
      header={
        <button
          onClick={onToggle}
          className="p-[4px] rounded hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          {isExpanded ? (
            <PanelLeftClose className="h-[18px] w-[18px] text-muted-foreground/80" />
          ) : (
            <PanelRightOpen className="h-[18px] w-[18px] text-muted-foreground/80" />
          )}
        </button>
      }
      headerClassName="justify-center"
      contentClassName="border-r flex"
    >
      <nav className="flex flex-1 flex-col items-center gap-1 py-2">
        {sidebarMenuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "p-[4px] rounded transition-colors",
              currentView === id
                ? "bg-secondary text-secondary-foreground/80"
                : "text-muted-foreground/80 hover:bg-muted hover:text-muted-foreground"
            )}
            aria-label={label}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        ))}
      </nav>
    </LayerSection>
  );
}

export function SubSidebar() {
  return (
    <LayerSection
      className="w-full h-full bg-[#F6F8FA]"
      header={
        <div className="px-3 text-xs text-muted-foreground w-full">
          {/* Reserved for future sub-sidebar header content */}
        </div>
      }
      headerClassName="bg-[#FCFCFC]"
      contentClassName="bg-[#F6F8FA]"
    >
      <div className="flex-1" />
    </LayerSection>
  );
}
