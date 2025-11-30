interface SidebarProps {
  currentView: string;
  onNavigate: (view: "dashboard" | "settings" | "account") => void;
}

function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "대시보드" },
    { id: "settings", label: "설정" },
  ] as const;

  return (
    <aside className="w-56 bg-gray-900 text-gray-300 flex-shrink-0 py-4">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`w-full text-left px-5 py-3 text-sm transition-colors
            ${
              currentView === item.id
                ? "bg-gray-700 text-white"
                : "hover:bg-white/5 hover:text-white"
            }`}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;
