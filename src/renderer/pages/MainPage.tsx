import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import Topbar from "../components/layout/Topbar";
import { IconSidebar } from "../components/layout/Sidebar";
import ResizableSubSidebar from "../components/layout/ResizableSubSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContentView = "dashboard" | "settings" | "account";

function MainPage() {
  const { user } = useAuthStore();
  const [currentView, setCurrentView] = useState<ContentView>("dashboard");
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);

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
    <div className="h-screen flex bg-[#F6F8FA]">
      <IconSidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isExpanded={isSubSidebarOpen}
        onToggle={() => setIsSubSidebarOpen((prev) => !prev)}
      />
      <ResizableSubSidebar isOpen={isSubSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F6F8FA]">
        <Topbar onAccountClick={() => setCurrentView("account")} />
        <main className="flex-1 bg-[#FFFFFF] p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default MainPage;
