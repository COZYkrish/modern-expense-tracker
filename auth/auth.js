const users = JSON.parse(localStorage.getItem("users")) || [];

/* ---------- REGISTER ---------- */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (users.find(u => u.email === email)) {
      alert("User already exists");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully");
    window.location.href = "login.html";
  });
}

/* ---------- LOGIN ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "../index.html";
  });
}
