/* =========================================
   analyticsData.js
   BULLETPROOF VERSION
========================================= */

function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

/* -------- MONTHLY EXPENSE TREND -------- */
function getMonthlyExpenseData() {
  const txns = getTransactions();

  const map = {};

  txns.forEach(tx => {
    if (tx.type?.toLowerCase() !== "expense") return;
    if (!tx.date) return;

    const d = new Date(tx.date);
    if (isNaN(d)) return;

    const key = `${d.getFullYear()}-${d.getMonth()}`;

    map[key] = (map[key] || 0) + Number(tx.amount || 0);
  });

  // Convert map → sorted arrays
  const entries = Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6); // last 6 months

  const months = entries.map(([key]) => {
    const [y, m] = key.split("-");
    return new Date(y, m).toLocaleString("default", { month: "short" });
  });

  const totals = entries.map(([, val]) => val);

  return { months, totals };
}

/* -------- CATEGORY BREAKDOWN -------- */
function getCategoryBreakdown() {
  const txns = getTransactions();
  const categories = {};

  txns.forEach(tx => {
    if (tx.type?.toLowerCase() !== "expense") return;

    const cat = tx.category || "Other";
    categories[cat] = (categories[cat] || 0) + Number(tx.amount || 0);
  });

  return {
    labels: Object.keys(categories),
    values: Object.values(categories)
  };
}
