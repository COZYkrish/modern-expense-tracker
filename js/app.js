function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(txns) {
    localStorage.setItem("transactions", JSON.stringify(txns));
}

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
    const type = document.getElementById("txType").value.toLowerCase();
    const title = document.getElementById("txTitle").value.trim();
    const amount = Number(document.getElementById("txAmount").value);
    const category = document.getElementById("txCategory").value;

    if (!title || !amount) {
        alert("Please enter title and amount");
        return;
    }

    const transactions = getTransactions();

    const transaction = {
        id: Date.now(),
        title,
        amount,
        type,                 // "expense" | "income"
        category,
        date: new Date().toISOString().split("T")[0]
    };

    transactions.push(transaction);
    saveTransactions(transactions);

    closeModal();
    renderDashboard();
    renderRecentTransactions();

    // 🔥 UPDATE CHARTS LIVE
    if (typeof updateCharts === "function") {
        updateCharts();
    }
}

/* ===============================
   DASHBOARD KPIs
================================ */

function renderDashboard() {
    const txns = getTransactions();

    const income = txns
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = txns
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("income").innerText = `₹${income}`;
    document.getElementById("expenses").innerText = `₹${expense}`;
    document.getElementById("savings").innerText = `₹${income - expense}`;
}

function renderRecentTransactions() {
    const container = document.querySelector(".transactions-grid");
    if (!container) return;

    container.innerHTML = "";

    const txns = getTransactions().sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    if (txns.length === 0) {
        container.innerHTML =
            "<p class='text-muted'>No transactions yet</p>";
        return;
    }

    txns.slice(0, 5).forEach(t => {
        const row = document.createElement("div");
        row.className = "transaction-row";

        row.innerHTML = `
            <div>
                <strong>${t.title}</strong>
                <p class="text-muted">${t.category}</p>
            </div>
            <span class="${t.type}">
                ${t.type === "income" ? "+" : "-"}₹${t.amount}
            </span>
        `;

        container.appendChild(row);
    });
}
