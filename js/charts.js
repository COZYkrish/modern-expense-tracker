/* =====================================================
   CHARTS.JS
   Smart Expense Tracker
   Used by: Dashboard & Analytics pages
===================================================== */

/* -------------------------------------
   GLOBAL CHART DEFAULTS
------------------------------------- */
Chart.defaults.color = "#cbd5f5";
Chart.defaults.font.family = "Inter";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;

/* =====================================================
   MONTHLY EXPENSE TREND (LINE CHART)
===================================================== */
const expenseCanvas = document.getElementById("expenseChart");

if (expenseCanvas && typeof getMonthlyExpenseData === "function") {
  const ctx = expenseCanvas.getContext("2d");
  const { months, totals } = getMonthlyExpenseData();

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(99,102,241,0.55)");
  gradient.addColorStop(1, "rgba(99,102,241,0.05)");

  new Chart(ctx, {
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
          bodyColor: "#c7d2fe"
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
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
   CATEGORY BREAKDOWN (DOUGHNUT CHART)
===================================================== */
const categoryCanvas = document.getElementById("categoryChart");

if (categoryCanvas && typeof getCategoryBreakdown === "function") {
  const { labels, values } = getCategoryBreakdown();

  new Chart(categoryCanvas, {
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
        hoverOffset: 14
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
            label: function (ctx) {
              return `${ctx.label}: ₹${ctx.raw}`;
            }
          }
        }
      }
    }
  });
}
