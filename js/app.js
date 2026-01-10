/* ===============================
   DASHBOARD INITIALIZATION
================================ */

document.addEventListener("DOMContentLoaded", () => {
    renderDashboard();
    renderRecentTransactions();
});

/* ===============================
   MODAL CONTROLS
================================ */

function openModal() {
    document.getElementById("transactionModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("transactionModal").style.display = "none";
}

/* ===============================
   SAVE TRANSACTION (CORE)
================================ */

function saveTransaction() {
    const type = document.getElementById("txType").value;
    const title = document.getElementById("txTitle").value.trim();
    const amount = Number(document.getElementById("txAmount").value);
    const category = document.getElementById("txCategory").value;

    if (!title || !amount) {
        alert("Please enter title and amount");
        return;
    }

    if (type === "expense") {
        addExpense({ title, amount, category });
    } else {
        addIncome({ title, amount, source: category });
    }

    closeModal();
    renderDashboard();
    renderRecentTransactions();
}

/* ===============================
   DASHBOARD KPIs
================================ */

function renderDashboard() {
    const month = getCurrentMonth();

    const income = getTotalIncome(month);
    const expense = getTotalExpenses(month);
    const balance = getBalance(month);

    document.getElementById("income").innerText = `₹${income}`;
    document.getElementById("expenses").innerText = `₹${expense}`;
    document.getElementById("savings").innerText = `₹${balance}`;
}
