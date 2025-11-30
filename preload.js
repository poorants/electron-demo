const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  loginWithGoogle: () => ipcRenderer.invoke("google-oauth-login"),
  getCurrentUser: () => ipcRenderer.invoke("get-current-user"),
  logout: () => ipcRenderer.invoke("logout"),
  tryRestoreSession: () => ipcRenderer.invoke("try-restore-session"),
  onGoogleOAuthResult: (callback) => {
    ipcRenderer.removeAllListeners("google-oauth-result");
    ipcRenderer.on("google-oauth-result", (_event, data) => {
      callback(data);
    });
  },
});
