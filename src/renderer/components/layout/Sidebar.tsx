import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: "dashboard" | "settings" | "account") => void;
  width: number;
}

function Sidebar({ currentView, onNavigate, width }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "대시보드" },
    { id: "settings", label: "설정" },
  ] as const;

  return (
    <aside
      className="border-r bg-card flex-shrink-0 py-4"
      style={{ width: `${width}px` }}
    >
      <nav className="space-y-1 px-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              currentView === item.id && "bg-secondary"
            )}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
