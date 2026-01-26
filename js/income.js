/* ===============================
   STORAGE (SINGLE SOURCE)
================================ */

function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(txns) {
    localStorage.setItem("transactions", JSON.stringify(txns));
}

/* ===============================
   MODAL CONTROLS
================================ */

function openIncomeModal() {
    document.getElementById("incomeModal").style.display = "flex";
}

function closeIncomeModal() {
    document.getElementById("incomeModal").style.display = "none";
}

/* ===============================
   SAVE INCOME
================================ */

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
        type: "income",          // 🔥 SAME MODEL AS EXPENSE
        category,
        date: new Date().toISOString().split("T")[0]
    });

    saveTransactions(transactions);

    closeIncomeModal();
    renderIncomeList();

    // 🔥 Notify dashboard + analytics
    window.dispatchEvent(new Event("transactionsUpdated"));
}

/* ===============================
   RENDER INCOME LIST
================================ */

function renderIncomeList() {
    const container = document.getElementById("incomeList");
    const income = getTransactions().filter(t => t.type === "income");

    container.innerHTML = "";

    if (income.length === 0) {
        container.innerHTML = "<p class='text-muted'>No income added yet</p>";
        return;
    }

    income
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(t => {
            const row = document.createElement("div");
            row.className = "transaction-row";

            row.innerHTML = `
                <div>
                    <strong>${t.title}</strong>
                    <p class="text-muted">${t.category}</p>
                </div>
                <span class="income">+₹${t.amount}</span>
            `;

            container.appendChild(row);
        });
}

/* ===============================
   INIT
================================ */

// document.addEventListener("DOMContentLoaded", () => {
//     renderIncomeList();

//     document
//         .getElementById("addIncomeBtn")
//         .addEventListener("click", openIncomeModal);

    document
        .getElementById("saveIncomeBtn")
        .addEventListener("click", saveIncome);

    document
        .getElementById("cancelIncomeBtn")
        .addEventListener("click", closeIncomeModal);
});
