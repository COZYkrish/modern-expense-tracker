/* ======================================================
   SMART EXPENSE TRACKER — DATA STORAGE LAYER
   Robust | Scalable | Production-Ready
====================================================== */

/* ===============================
   STORAGE KEYS
================================ */
const STORAGE_KEYS = {
    EXPENSES: "expenses",
    INCOMES: "incomes",
    BUDGETS: "budgets",
    SETTINGS: "settings"
};

/* ===============================
   GENERIC STORAGE HELPERS
================================ */

function getStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key}`, error);
        return defaultValue;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key}`, error);
    }
}

/* ===============================
   UTILITIES
================================ */

function generateId() {
    return "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7); // YYYY-MM
}

/* ===============================
   EXPENSES
================================ */

function getExpenses() {
    return getStorage(STORAGE_KEYS.EXPENSES, []);
}

// function addExpense({ title, amount, category }) {
//     const expenses = getExpenses();

    expenses.push({
        id: generateId(),
        title,
        amount: Number(amount),
        category,
        month: getCurrentMonth(),
        createdAt: new Date().toISOString()
    });

    setStorage(STORAGE_KEYS.EXPENSES, expenses);
}

function updateExpense(id, updatedData) {
    const expenses = getExpenses().map(exp =>
        exp.id === id ? { ...exp, ...updatedData } : exp
    );
    setStorage(STORAGE_KEYS.EXPENSES, expenses);
}

function deleteExpense(id) {
    const expenses = getExpenses().filter(exp => exp.id !== id);
    setStorage(STORAGE_KEYS.EXPENSES, expenses);
}

/* ===============================
   INCOMES
================================ */

function getIncomes() {
    return getStorage(STORAGE_KEYS.INCOMES, []);
}

function addIncome({ title, amount, source }) {
    const incomes = getIncomes();

    incomes.push({
        id: generateId(),
        title,
        amount: Number(amount),
        source,
        month: getCurrentMonth(),
        createdAt: new Date().toISOString()
    });

    setStorage(STORAGE_KEYS.INCOMES, incomes);
}

function deleteIncome(id) {
    const incomes = getIncomes().filter(inc => inc.id !== id);
    setStorage(STORAGE_KEYS.INCOMES, incomes);
}

/* ===============================
   BUDGETS
================================ */

function getBudgets() {
    return getStorage(STORAGE_KEYS.BUDGETS, {});
}

function setBudget(category, amount) {
    const budgets = getBudgets();
    budgets[category] = Number(amount);
    setStorage(STORAGE_KEYS.BUDGETS, budgets);
}

function getBudgetForCategory(category) {
    const budgets = getBudgets();
    return budgets[category] || 0;
}

/* ===============================
   SETTINGS
================================ */

function getSettings() {
    return getStorage(STORAGE_KEYS.SETTINGS, {
        currency: "₹",
        theme: "dark"
    });
}

function updateSettings(newSettings) {
    const updated = { ...getSettings(), ...newSettings };
    setStorage(STORAGE_KEYS.SETTINGS, updated);
}

/* ===============================
   CALCULATIONS
================================ */

function getTotalExpenses(month = null) {
    return getExpenses()
        .filter(e => !month || e.month === month)
        .reduce((sum, e) => sum + e.amount, 0);
}

function getTotalIncome(month = null) {
    return getIncomes()
        .filter(i => !month || i.month === month)
        .reduce((sum, i) => sum + i.amount, 0);
}

function getBalance(month = null) {
    return getTotalIncome(month) - getTotalExpenses(month);
}

/* ===============================
   INSIGHTS & ANALYTICS HELPERS
================================ */

function getTopExpenseCategory(month = null) {
    const expenses = getExpenses().filter(
        e => !month || e.month === month
    );

    const categoryTotals = {};

    expenses.forEach(e => {
        categoryTotals[e.category] =
            (categoryTotals[e.category] || 0) + e.amount;
    });

    const top = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])[0];

    return top ? top[0] : "None";
}

function getCategoryTotals(month = null) {
    const totals = {};
    getExpenses()
        .filter(e => !month || e.month === month)
        .forEach(e => {
            totals[e.category] =
                (totals[e.category] || 0) + e.amount;
        });
    return totals;
}

/* ===============================
   RESET / DEBUG HELPERS
================================ */

function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key =>
        localStorage.removeItem(key)
    );
}
