const loginBtn = document.getElementById("login-btn");
const statusEl = document.getElementById("status");
const profileEl = document.getElementById("profile");

function setStatus(text) {
  statusEl.textContent = text;
}

function setProfile(obj) {
  profileEl.textContent = obj ? JSON.stringify(obj, null, 2) : "";
}

loginBtn.addEventListener("click", async () => {
  loginBtn.disabled = true;
  setStatus("브라우저에서 구글 로그인 창을 여는 중...");
  setProfile(null);

  const result = await window.api.loginWithGoogle();

  if (!result.ok) {
    setStatus(
      "로그인 플로우 시작 실패: " + (result.error || "알 수 없는 오류")
    );
    loginBtn.disabled = false;
    return;
  }

  setStatus("브라우저에서 로그인 후 이 창으로 돌아오세요...");
});

window.api.onGoogleOAuthResult((data) => {
  if (data.ok) {
    setStatus("로그인 성공, 메인 화면으로 이동합니다...");
    setProfile(null);
    setTimeout(() => {
      window.location.href = "main.html";
    }, 500);
  } else {
    setStatus("로그인 실패: " + (data.error || "알 수 없는 오류"));
    setProfile(null);
  }
  loginBtn.disabled = false;
});

// 앱 시작 시 저장된 세션 복원 시도
(async () => {
  setStatus("로그인 상태 확인 중...");
  try {
    const result = await window.api.tryRestoreSession();
    if (result.ok && result.user) {
      setStatus("자동 로그인 성공, 메인 화면으로 이동합니다...");
      setTimeout(() => {
        window.location.href = "main.html";
      }, 500);
    } else {
      setStatus("로그인이 필요합니다.");
    }
  } catch (e) {
    setStatus("로그인이 필요합니다.");
  }
})();
