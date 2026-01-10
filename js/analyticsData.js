function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}
function getMonthlyExpenseData() {
  const txns = getTransactions();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const totals = [0, 0, 0, 0, 0, 0];

  txns.forEach(tx => {
    if (tx.type === "expense") {
      const monthIndex = new Date(tx.date).getMonth();
      if (monthIndex < 6) {
        totals[monthIndex] += Number(tx.amount);
      }
    }
  });

  return { months, totals };
}
function getCategoryBreakdown() {
  const txns = getTransactions();
  const categories = {};

  txns.forEach(tx => {
    if (tx.type === "expense") {
      categories[tx.category] =
        (categories[tx.category] || 0) + Number(tx.amount);
    }
  });

  return {
    labels: Object.keys(categories),
    values: Object.values(categories)
  };
}
