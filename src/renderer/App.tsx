import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

function App() {
  const { user, isLoading, tryRestore } = useAuthStore();

  useEffect(() => {
    tryRestore();
  }, [tryRestore]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">로그인 상태 확인 중...</div>
      </div>
    );
  }

  return user ? <MainPage /> : <LoginPage />;
}

export default App;
