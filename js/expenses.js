function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function openExpenseModal() {
    document.getElementById("expenseModal").style.display = "flex";
}

function closeExpenseModal() {
    document.getElementById("expenseModal").style.display = "none";
}

function saveExpense() {
    const title = document.getElementById("expenseTitle").value.trim();
    const amount = Number(document.getElementById("expenseAmount").value);
    const category = document.getElementById("expenseCategory").value;

    if (!title || amount <= 0) {
        alert("Please enter valid expense details");
        return;
    }

    const transactions = getTransactions();

    transactions.push({
        id: Date.now(),
        title,
        amount,
        type: "expense",
        category,
        date: new Date().toISOString().split("T")[0]
    });

    saveTransactions(transactions);
    closeExpenseModal();
    renderExpenses();
    window.dispatchEvent(new Event("transactionsUpdated"));
}

function renderExpenses() {
    const container = document.querySelector(".expense-list");
    if (!container) return;

    const expenses = getTransactions()
        .filter((transaction) => transaction.type === "expense")
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = "";

    if (expenses.length === 0) {
        container.innerHTML = "<p class='text-muted'>No expenses added yet</p>";
        return;
    }

    expenses.forEach((expense) => {
        const row = document.createElement("div");
        row.className = "expense-card";

        row.innerHTML = `
            <div>
                <strong>${expense.title}</strong>
                <p class="text-muted">${expense.category}</p>
            </div>
            <span class="danger">-Rs ${expense.amount}</span>
        `;

        container.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", renderExpenses);
window.addEventListener("transactionsUpdated", renderExpenses);
