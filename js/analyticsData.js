/* =========================================
   analyticsData.js
   SINGLE SOURCE: transactions
========================================= */

function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

/* -------- TOTALS (Dashboard / KPIs) -------- */
function getTotals() {
  const txns = getTransactions();

  let income = 0;
  let expense = 0;

  txns.forEach(t => {
    if (t.type === "income") income += Number(t.amount || 0);
    if (t.type === "expense") expense += Number(t.amount || 0);
  });

  return {
    income,
    expense,
    savings: income - expense
  };
}

/* -------- MONTHLY EXPENSE TREND -------- */
function getMonthlyExpenseData() {
  const txns = getTransactions();
  const map = {};

  txns.forEach(tx => {
    if (tx.type !== "expense" || !tx.date) return;

    const d = new Date(tx.date);
    if (isNaN(d)) return;

    const key = `${d.getFullYear()}-${d.getMonth()}`;
    map[key] = (map[key] || 0) + Number(tx.amount || 0);
  });

  const entries = Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6);

  return {
    months: entries.map(([k]) => {
      const [y, m] = k.split("-");
      return new Date(y, m).toLocaleString("default", { month: "short" });
    }),
    totals: entries.map(([, v]) => v)
  };
}

/* -------- CATEGORY BREAKDOWN -------- */
function getCategoryBreakdown() {
  const txns = getTransactions();
  const categories = {};

  txns.forEach(tx => {
    if (tx.type !== "expense") return;
    const cat = tx.category || "Other";
    categories[cat] = (categories[cat] || 0) + Number(tx.amount || 0);
  });

  return {
    labels: Object.keys(categories),
    values: Object.values(categories)
  };
}

/* -------- ANALYTICS SUMMARY -------- */
function getAnalyticsSummary() {
  const txns = getTransactions().filter(t => t.type === "expense");

  const totalSpent = txns.reduce((s, t) => s + t.amount, 0);

  const categoryMap = {};
  txns.forEach(t => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + t.amount;
  });

  const highestCategory =
    Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return {
    totalSpent,
    highestCategory
  };
}
