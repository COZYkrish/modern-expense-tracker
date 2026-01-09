/* ======================================================
   SMART EXPENSE TRACKER — CORE APPLICATION LOGIC
   UI ↔ Data ↔ Calculations
====================================================== */

/* ===============================
   HELPERS
================================ */

function formatCurrency(amount) {
    const { currency } = getSettings();
    return `${currency}${amount.toLocaleString()}`;
}

function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
}

/* ===============================
   DASHBOARD KPIs
================================ */

function updateDashboardKPIs() {
    const month = getCurrentMonth();

    const totalIncome = getTotalIncome(month);
    const totalExpenses = getTotalExpenses(month);
    const balance = getBalance(month);
    const savings = totalIncome - totalExpenses;

    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expenses");
    const balanceEl = document.getElementById("balance");
    const savingsEl = document.getElementById("savings");

    if (incomeEl) incomeEl.innerText = formatCurrency(totalIncome);
    if (expenseEl) expenseEl.innerText = formatCurrency(totalExpenses);
    if (balanceEl) balanceEl.innerText = formatCurrency(balance);
    if (savingsEl) savingsEl.innerText = formatCurrency(savings);
}

/* ===============================
   RECENT TRANSACTIONS
================================ */

function renderRecentTransactions(limit = 5) {
    const container = document.querySelector(".transactions-grid");
    if (!container) return;

    const expenses = getExpenses();
    const incomes = getIncomes();

    const transactions = [
        ...expenses.map(e => ({
            type: "expense",
            title: e.title,
            amount: e.amount,
            date: e.createdAt
        })),
        ...incomes.map(i => ({
            type: "income",
            title: i.title,
            amount: i.amount,
            date: i.createdAt
        }))
    ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);

    container.innerHTML = "";

    if (transactions.length === 0) {
        container.innerHTML = `<p class="text-muted">No transactions yet</p>`;
        return;
    }

    transactions.forEach(tx => {
        const row = document.createElement("div");
        row.className = "transaction-row";

        row.innerHTML = `
            <span>${tx.type === "expense" ? "🧾" : "💰"} ${tx.title}</span>
            <span class="amount ${
                tx.type === "expense" ? "negative" : "positive"
            }">
                ${tx.type === "expense" ? "-" : "+"}
                ${formatCurrency(tx.amount)}
            </span>
        `;

        container.appendChild(row);
    });
}

/* ===============================
   TOP INSIGHT
================================ */

function renderTopInsight() {
    const topCategory = getTopExpenseCategory(getCurrentMonth());
    const insightEl = document.getElementById("topInsight");

    if (insightEl) {
        insightEl.innerText =
            topCategory === "None"
                ? "No expense data yet"
                : `Highest spending in: ${topCategory}`;
    }
}

/* ===============================
   PAGE INITIALIZER
================================ */

function initDashboard() {
    updateDashboardKPIs();
    renderRecentTransactions();
    renderTopInsight();
}

/* ===============================
   AUTO INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});
