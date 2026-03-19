function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(txns) {
    localStorage.setItem("transactions", JSON.stringify(txns));
}

function openIncomeModal() {
    document.getElementById("incomeModal").style.display = "flex";
}

function closeIncomeModal() {
    document.getElementById("incomeModal").style.display = "none";
}

function saveIncome() {
    const title = document.getElementById("incomeTitle").value.trim();
    const amount = Number(document.getElementById("incomeAmount").value);
    const category = document.getElementById("incomeCategory").value;

    if (!title || amount <= 0) {
        alert("Please enter valid income details");
        return;
    }

    const transactions = getTransactions();

    transactions.push({
        id: Date.now(),
        title,
        amount,
        type: "income",
        category,
        date: new Date().toISOString().split("T")[0]
    });

    saveTransactions(transactions);
    closeIncomeModal();
    renderIncomeList();
    window.dispatchEvent(new Event("transactionsUpdated"));
}

function renderIncomeList() {
    const container = document.getElementById("incomeList");
    const income = getTransactions()
        .filter((transaction) => transaction.type === "income")
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = "";

    if (income.length === 0) {
        container.innerHTML = "<p class='text-muted'>No income added yet</p>";
        return;
    }

    income.forEach((transaction) => {
        const row = document.createElement("div");
        row.className = "transaction-row";

        row.innerHTML = `
            <div>
                <strong>${transaction.title}</strong>
                <p class="text-muted">${transaction.category}</p>
            </div>
            <span class="income">+Rs ${transaction.amount}</span>
        `;

        container.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderIncomeList();
    document.getElementById("addIncomeBtn").addEventListener("click", openIncomeModal);
    document.getElementById("saveIncomeBtn").addEventListener("click", saveIncome);
    document.getElementById("cancelIncomeBtn").addEventListener("click", closeIncomeModal);
});

window.addEventListener("transactionsUpdated", renderIncomeList);
