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
function getAnalyticsSummary() {
  const txns = JSON.parse(localStorage.getItem("transactions")) || [];

  const expenses = txns.filter(t => t.type === "expense");

  const totalSpent = expenses.reduce((s, t) => s + t.amount, 0);

  const categoryMap = {};
  expenses.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const highestCategory = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return {
    totalSpent,
    highestCategory
  };
}
function getAnalyticsKPIs() {
  const expenses = getExpenses(); // ✅ CORRECT SOURCE

  // TOTAL SPENT
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // CATEGORY TOTALS
  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const highestCategory =
    Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // MONTHLY GROWTH
  const monthMap = {};
  expenses.forEach(e => {
    const d = new Date(e.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthMap[key] = (monthMap[key] || 0) + e.amount;
  });

  const values = Object.values(monthMap);
  let growth = 0;

  if (values.length >= 2) {
    const last = values[values.length - 1];
    const prev = values[values.length - 2];
    growth = prev ? Math.round(((last - prev) / prev) * 100) : 0;
  }

  return {
    totalSpent,
    highestCategory,
    growth
  };
}
