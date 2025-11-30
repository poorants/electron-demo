import { useAuthStore } from "../stores/authStore";

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg min-w-[320px]">
        <h1 className="text-xl font-semibold text-center mb-6">
          구글 로그인 데모
        </h1>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 
                     text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? "로그인 중..." : "구글로 로그인"}
        </button>

        {error && (
          <div className="mt-4 text-sm text-red-500 text-center">{error}</div>
        )}

        {isLoading && !error && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            브라우저에서 로그인 후 이 창으로 돌아오세요...
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
