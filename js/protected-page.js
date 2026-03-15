const protectedUser = window.AuthSession?.requireAuth("auth/login.html");

if (protectedUser) {
    document.addEventListener("DOMContentLoaded", () => {
        window.AuthSession.ensureProtectedLayout(protectedUser);
    });
}
