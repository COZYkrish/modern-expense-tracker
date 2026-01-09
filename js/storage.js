/* ======================================================
   SMART EXPENSE TRACKER — DATA STORAGE LAYER
   localStorage Wrapper (Clean & Scalable)
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
   GENERIC HELPERS
================================ */

/**
 * Get data safely from localStorage
 * @param {string} key
 * @param {any} defaultValue
 */
function getStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error("Storage read error:", error);
        return defaultValue;
    }
}

/**
 * Save data safely to localStorage
 * @param {string} key
 * @param {any} value
 */
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Storage write error:", error);
    }
}

/* ===============================
   ID GENERATOR
================================ */

function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

/* ===============================
   EXPENSES
================================ */

function getExpenses() {
    return getStorage(STORAGE_KEYS.EXPENSES, []);
}

function addExpense(expense) {
    const expenses = getExpenses();
    expenses.push({
        id: generateId(),
        ...expense,
        createdAt: new Date().toISOString()
    });
    setStorage(STORAGE_KEYS.EXPENSES, expenses);
}

function deleteExpense(id) {
    const expenses = getExpenses().filter(e => e.id !== id);
    setStorage(STORAGE_KEYS.EXPENSES, expenses);
}

/* ===============================
   INCOMES
================================ */

function getIncomes() {
    return getStorage(STORAGE_KEYS.INCOMES, []);
}

function addIncome(income) {
    const incomes = getIncomes();
    incomes.push({
        id: generateId(),
        ...income,
        createdAt: new Date().toISOString()
    });
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
    budgets[category] = amount;
    setStorage(STORAGE_KEYS.BUDGETS, budgets);
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
    const settings = { ...getSettings(), ...newSettings };
    setStorage(STORAGE_KEYS.SETTINGS, settings);
}

/* ===============================
   CALCULATIONS
================================ */

function getTotalExpenses() {
    return getExpenses().reduce((sum, e) => sum + Number(e.amount), 0);
}

function getTotalIncome() {
    return getIncomes().reduce((sum, i) => sum + Number(i.amount), 0);
}

function getBalance() {
    return getTotalIncome() - getTotalExpenses();
}

/* ===============================
   INSIGHTS (LOGIC BASED)
================================ */

function getTopExpenseCategory() {
    const expenses = getExpenses();
    const categoryMap = {};

    expenses.forEach(e => {
        categoryMap[e.category] =
            (categoryMap[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
}
