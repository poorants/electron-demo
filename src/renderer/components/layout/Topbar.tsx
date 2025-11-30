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
    <div className="flex items-center justify-between w-full text-foreground">
      <div className="font-semibold text-sm tracking-tight">Demo App</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center rounded-full p-px outline-none transition hover:bg-muted/80">
            <Avatar className="h-5 w-5 border border-border">
              <AvatarImage
                src={user?.profile.picture}
                alt={user?.profile.name}
              />
              <AvatarFallback>{getInitials(user?.profile.name)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 p-1">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={user?.profile.picture}
                  alt={user?.profile.name}
                />
                <AvatarFallback>
                  {getInitials(user?.profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-[11px] font-medium leading-tight">
                  {user?.profile.name}
                </p>
                <p className="text-[10px] leading-tight text-muted-foreground">
                  {user?.profile.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onAccountClick}
            className="text-[11px] py-1.5"
          >
            계정 정보 보기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive text-[11px] py-1.5"
          >
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Topbar;
