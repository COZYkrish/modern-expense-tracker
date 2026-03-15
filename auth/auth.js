window.AuthSession?.redirectIfAuthenticated("../dashboard.html");

/* ---------- REGISTER ---------- */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const result = window.AuthSession.registerUser({ name, email, password });

    if (!result.ok) {
      alert(result.message);
      return;
    }

    alert("Account created successfully");
    window.location.href = "login.html";
  });
}

/* ---------- LOGIN ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const result = window.AuthSession.loginUser({ email, password });

    if (!result.ok) {
      alert(result.message);
      return;
    }

    window.location.href = "../dashboard.html";
  });
}
