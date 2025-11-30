import { useAuthStore } from "../../stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onAccountClick: () => void;
}

function Topbar({ onAccountClick }: TopbarProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-14 bg-primary text-primary-foreground flex items-center justify-between px-5 flex-shrink-0">
      <div className="font-bold text-lg">Demo App</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-colors outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.profile.picture}
                alt={user?.profile.name}
              />
              <AvatarFallback>{getInitials(user?.profile.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.profile.name}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.profile.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.profile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onAccountClick}>
            계정 정보 보기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Topbar;
