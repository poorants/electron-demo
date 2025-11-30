import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">구글 로그인 데모</CardTitle>
          <CardDescription>Google 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "로그인 중..." : "구글로 로그인"}
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {isLoading && !error && (
            <p className="text-sm text-muted-foreground text-center">
              브라우저에서 로그인 후 이 창으로 돌아오세요...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
