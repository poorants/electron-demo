import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

interface TopbarProps {
  onAccountClick: () => void;
}

function Topbar({ onAccountClick }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAccountClick = () => {
    setDropdownOpen(false);
    onAccountClick();
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-5 flex-shrink-0">
      <div className="font-bold text-lg">Demo App</div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
        >
          {user?.profile.picture && (
            <img
              src={user.profile.picture}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium">{user?.profile.name}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute top-11 right-0 bg-white rounded-lg shadow-lg min-w-[220px] overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="font-semibold text-gray-900 text-sm">
                {user?.profile.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {user?.profile.email}
              </div>
            </div>
            <button
              onClick={handleAccountClick}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              계정 정보 보기
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
