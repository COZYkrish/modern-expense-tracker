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
        type,
        category,
        date: new Date().toISOString().split("T")[0]
    };

    transactions.push(transaction);
    saveTransactions(transactions);

    closeModal();
    renderDashboard();
    renderRecentTransactions();

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
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const expense = txns
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const balance = income - expense;

    document.getElementById("income").innerText = `Rs ${income}`;
    document.getElementById("expenses").innerText = `Rs ${expense}`;
    document.getElementById("savings").innerText = `Rs ${balance}`;
    document.getElementById("balance").innerText = `Rs ${balance}`;
}

function renderRecentTransactions() {
    const container = document.querySelector(".transactions-grid");
    if (!container) return;

    container.innerHTML = "";

    const txns = getTransactions().sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    if (txns.length === 0) {
        container.innerHTML = "<p class='text-muted'>No transactions yet</p>";
        return;
    }

    txns.slice(0, 5).forEach((transaction) => {
        const row = document.createElement("div");
        row.className = "transaction-row";

        row.innerHTML = `
            <div>
                <strong>${transaction.title}</strong>
                <p class="text-muted">${transaction.category}</p>
            </div>
            <span class="${transaction.type}">
                ${transaction.type === "income" ? "+" : "-"}Rs ${transaction.amount}
            </span>
        `;

        container.appendChild(row);
    });
}

window.addEventListener("transactionsUpdated", () => {
    renderDashboard();
    renderRecentTransactions();

    if (typeof updateCharts === "function") {
        updateCharts();
    }
});
