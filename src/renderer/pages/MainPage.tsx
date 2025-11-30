import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";

type ContentView = "dashboard" | "settings" | "account";

function MainPage() {
  const { user } = useAuthStore();
  const [currentView, setCurrentView] = useState<ContentView>("dashboard");

  const renderContent = () => {
    switch (currentView) {
      case "account":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              계정 정보
            </h2>
            <div className="bg-white p-5 rounded-lg shadow-sm max-w-md">
              <div className="flex items-center gap-4 mb-4">
                {user?.profile.picture && (
                  <img
                    src={user.profile.picture}
                    alt="avatar"
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold text-lg">
                    {user?.profile.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {user?.profile.email}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <strong>Google ID:</strong> {user?.profile.id}
                </div>
                <div>
                  <strong>이메일 인증:</strong>{" "}
                  {user?.profile.verified_email ? "완료" : "미완료"}
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">설정</h2>
            <p className="text-gray-500">설정 페이지입니다.</p>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              대시보드
            </h2>
            <p className="text-gray-500">여기에 컨텐츠가 표시됩니다.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Topbar onAccountClick={() => setCurrentView("account")} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default MainPage;
