document.addEventListener("DOMContentLoaded", renderExpenses);

function renderExpenses() {
    const container = document.querySelector(".expense-list");
    if (!container) return;

    const expenses = getExpenses();
    container.innerHTML = "";

    if (expenses.length === 0) {
        container.innerHTML =
            "<p class='text-muted'>No expenses added yet</p>";
        return;
    }

    expenses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .forEach(exp => {
            const card = document.createElement("div");
            card.className = "card expense-card";

            card.innerHTML = `
                <strong>${exp.title}</strong>
                <p class="text-muted">${exp.category}</p>
                <span class="danger">-₹${exp.amount}</span>
            `;

            container.appendChild(card);
        });
}

