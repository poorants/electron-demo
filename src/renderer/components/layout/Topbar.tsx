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
    <header className="h-12 flex items-center justify-between px-4 flex-shrink-0 text-foreground">
      <div className="font-semibold text-base tracking-tight">Demo App</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center rounded-full p-[1px] outline-none transition hover:bg-muted/80">
            <Avatar className="h-7 w-7 border border-border">
              <AvatarImage
                src={user?.profile.picture}
                alt={user?.profile.name}
              />
              <AvatarFallback>{getInitials(user?.profile.name)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.profile.picture}
                  alt={user?.profile.name}
                />
                <AvatarFallback>
                  {getInitials(user?.profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-none">
                  {user?.profile.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.profile.email}
                </p>
              </div>
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
