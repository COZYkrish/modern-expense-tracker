(function () {
    const USERS_KEY = "users";
    const CURRENT_USER_KEY = "currentUser";

    function readJson(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.error(`Failed to read ${key}`, error);
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    function getUsers() {
        return readJson(USERS_KEY, []);
    }

    function saveUsers(users) {
        writeJson(USERS_KEY, users);
    }

    function getCurrentUser() {
        return readJson(CURRENT_USER_KEY, null);
    }

    function setCurrentUser(user) {
        writeJson(CURRENT_USER_KEY, user);
    }

    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function registerUser({ name, email, password }) {
        const users = getUsers();
        const normalizedEmail = normalizeEmail(email);

        if (!name || !normalizedEmail || !password) {
            return { ok: false, message: "All fields are required" };
        }

        if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
            return { ok: false, message: "User already exists" };
        }

        const newUser = {
            id: Date.now().toString(),
            name: String(name).trim(),
            email: normalizedEmail,
            password: String(password)
        };

        users.push(newUser);
        saveUsers(users);

        return { ok: true, user: newUser };
    }

    function loginUser({ email, password }) {
        const normalizedEmail = normalizeEmail(email);
        const user = getUsers().find(
            (entry) =>
                normalizeEmail(entry.email) === normalizedEmail &&
                String(entry.password) === String(password)
        );

        if (!user) {
            return { ok: false, message: "Invalid email or password" };
        }

        setCurrentUser(user);
        return { ok: true, user };
    }

    function logout(redirectPath = "auth/login.html") {
        clearCurrentUser();
        window.location.href = redirectPath;
    }

    function requireAuth(loginPath = "auth/login.html") {
        const user = getCurrentUser();

        if (!user) {
            window.location.href = loginPath;
            return null;
        }

        return user;
    }

    function redirectIfAuthenticated(homePath = "../dashboard.html") {
        if (getCurrentUser()) {
            window.location.href = homePath;
        }
    }

    function ensureProtectedLayout(currentUser) {
        const sidebar = document.querySelector(".sidebar");
        const userNameEl = document.getElementById("userName");

        if (!userNameEl && sidebar) {
            const logo = sidebar.querySelector(".logo");
            const userBox = document.createElement("div");
            userBox.className = "user-box";
            userBox.innerHTML = '<span class="user-name" id="userName"></span>';
            logo?.insertAdjacentElement("afterend", userBox);
        }

        const resolvedUserNameEl = document.getElementById("userName");
        if (resolvedUserNameEl && currentUser?.name) {
            resolvedUserNameEl.textContent = currentUser.name;
        }

        if (sidebar && !document.getElementById("logoutBtn")) {
            const logoutBtn = document.createElement("button");
            logoutBtn.id = "logoutBtn";
            logoutBtn.className = "logout-btn";
            logoutBtn.type = "button";
            logoutBtn.textContent = "Logout";
            sidebar.appendChild(logoutBtn);
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn && !logoutBtn.dataset.authBound) {
            logoutBtn.dataset.authBound = "true";
            logoutBtn.addEventListener("click", () => logout("auth/login.html"));
        }
    }

    window.AuthSession = {
        getUsers,
        getCurrentUser,
        setCurrentUser,
        clearCurrentUser,
        registerUser,
        loginUser,
        logout,
        requireAuth,
        redirectIfAuthenticated,
        ensureProtectedLayout
    };
})();
