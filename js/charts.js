/* =====================================================
   charts.js
   Smart Expense Tracker
   Dashboard + Analytics
===================================================== */

/* -------------------------------------
   GLOBAL CHART DEFAULTS
------------------------------------- */
Chart.defaults.color = "#cbd5f5";
Chart.defaults.font.family = "Inter";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;

/* -------------------------------------
   CHART INSTANCES (for live updates)
------------------------------------- */
let expenseChartInstance = null;
let categoryChartInstance = null;

/* =====================================================
   UPDATE CHARTS (PUBLIC FUNCTION)
===================================================== */
function updateCharts() {
  renderExpenseChart();
  renderCategoryChart();
}

/* =====================================================
   MONTHLY EXPENSE TREND (LINE)
===================================================== */
function renderExpenseChart() {
  const canvas = document.getElementById("expenseChart");
  if (!canvas || typeof getMonthlyExpenseData !== "function") return;

  const ctx = canvas.getContext("2d");
  const { months, totals } = getMonthlyExpenseData();

  // destroy old chart
  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(99,102,241,0.6)");
  gradient.addColorStop(1, "rgba(99,102,241,0.05)");

  expenseChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Expenses (₹)",
        data: totals,
        fill: true,
        backgroundColor: gradient,
        borderColor: "#6366f1",
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#020617",
          borderColor: "#6366f1",
          borderWidth: 1,
          padding: 12,
          titleColor: "#ffffff",
          bodyColor: "#c7d2fe",
          callbacks: {
            label: ctx => `₹${ctx.raw}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255,255,255,0.08)"
          },
          ticks: {
            callback: value => `₹${value}`
          }
        }
      }
    }
  });
}

/* =====================================================
   CATEGORY BREAKDOWN (DOUGHNUT)
===================================================== */
function renderCategoryChart() {
  const canvas = document.getElementById("categoryChart");
  if (!canvas || typeof getCategoryBreakdown !== "function") return;

  const { labels, values } = getCategoryBreakdown();

  // nothing to show
  if (!labels.length) return;

  // destroy old chart
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  categoryChartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#6366f1", // Food
          "#22d3ee", // Rent
          "#22c55e", // Shopping
          "#f59e0b", // Transport
          "#ec4899"  // Other
        ],
        borderWidth: 0,
        hoverOffset: 18
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 18,
            boxWidth: 14
          }
        },
        tooltip: {
          backgroundColor: "#020617",
          padding: 12,
          callbacks: {
            label: ctx => `${ctx.label}: ₹${ctx.raw}`
          }
        }
      }
    }
  });
}

/* =====================================================
   INITIAL LOAD
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  updateCharts();
});
