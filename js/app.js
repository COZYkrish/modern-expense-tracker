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
function renderRecentTransactions() {
    const container = document.querySelector(".transactions-grid");
    if (!container) return;

    container.innerHTML = "";

    const expenses = getExpenses();
    const incomes = getIncomes();

    const combined = [
        ...expenses.map(e => ({ ...e, type: "expense" })),
        ...incomes.map(i => ({ ...i, type: "income" }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (combined.length === 0) {
        container.innerHTML =
            "<p class='text-muted'>No transactions yet</p>";
        return;
    }

    combined.slice(0, 5).forEach(t => {
        const row = document.createElement("div");
        row.className = "transaction-row";

        row.innerHTML = `
            <div>
                <strong>${t.title}</strong>
                <p class="text-muted">${t.category || t.source}</p>
            </div>
            <span class="${t.type}">
                ${t.type === "income" ? "+" : "-"}₹${t.amount}
            </span>
        `;

        container.appendChild(row);
    });
}
