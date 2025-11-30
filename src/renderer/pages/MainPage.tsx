import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResizeHandle from "../components/layout/ResizeHandle";

type ContentView = "dashboard" | "settings" | "account";

function MainPage() {
  const { user } = useAuthStore();
  const [currentView, setCurrentView] = useState<ContentView>("dashboard");
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      const minWidth = 180;
      const maxWidth = 360;
      const nextWidth = Math.min(maxWidth, Math.max(minWidth, event.clientX));
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const renderContent = () => {
    switch (currentView) {
      case "account":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">계정 정보</h2>
            <Card className="max-w-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={user?.profile.picture}
                      alt={user?.profile.name}
                    />
                    <AvatarFallback className="text-lg">
                      {user?.profile.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user?.profile.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Google ID</span>
                  <span className="font-mono text-xs">{user?.profile.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이메일 인증</span>
                  <span>
                    {user?.profile.verified_email ? "완료" : "미완료"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">설정</h2>
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">설정 페이지입니다.</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">대시보드</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  여기에 컨텐츠가 표시됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Topbar onAccountClick={() => setCurrentView("account")} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          width={sidebarWidth}
        />
        <ResizeHandle onMouseDown={() => setIsResizing(true)} />
        <main className="flex-1 bg-muted/40 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default MainPage;
