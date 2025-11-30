// 요소 참조
const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");
const profileImage = document.getElementById("profile-image");
const profileName = document.getElementById("profile-name");
const dropdownName = document.getElementById("dropdown-name");
const dropdownEmail = document.getElementById("dropdown-email");
const menuAccount = document.getElementById("menu-account");
const menuLogout = document.getElementById("menu-logout");
const contentEl = document.getElementById("content");

let currentProfile = null;

// 프로필 드롭다운 토글
profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("open");
});

// 바깥 클릭 시 드롭다운 닫기
document.addEventListener("click", () => {
  profileDropdown.classList.remove("open");
});

// 계정 정보 보기
menuAccount.addEventListener("click", () => {
  profileDropdown.classList.remove("open");
  if (!currentProfile) return;

  contentEl.innerHTML = `
    <h2>계정 정보</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px;">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
        <img src="${currentProfile.picture || ""}" 
             style="width: 64px; height: 64px; border-radius: 999px;" 
             alt="avatar" />
        <div>
          <div style="font-weight: 600; font-size: 16px;">${
            currentProfile.name || "이름 없음"
          }</div>
          <div style="color: #6b7280; font-size: 14px;">${
            currentProfile.email || "이메일 없음"
          }</div>
        </div>
      </div>
      <div style="font-size: 13px; color: #6b7280;">
        <div><strong>Google ID:</strong> ${currentProfile.id || "-"}</div>
        <div><strong>이메일 인증:</strong> ${
          currentProfile.verified_email ? "완료" : "미완료"
        }</div>
      </div>
    </div>
  `;
});

// 로그아웃
menuLogout.addEventListener("click", async () => {
  profileDropdown.classList.remove("open");
  await window.api.logout();
  window.location.href = "index.html";
});

// 초기 로드: 사용자 정보 가져오기
(async () => {
  try {
    const user = await window.api.getCurrentUser();
    if (!user || !user.profile) {
      window.location.href = "index.html";
      return;
    }

    currentProfile = user.profile;

    // 탑바 프로필
    profileName.textContent = currentProfile.name || "사용자";
    if (currentProfile.picture) {
      profileImage.src = currentProfile.picture;
    }

    // 드롭다운 헤더
    dropdownName.textContent = currentProfile.name || "이름 없음";
    dropdownEmail.textContent = currentProfile.email || "이메일 없음";
  } catch (e) {
    window.location.href = "index.html";
  }
})();
