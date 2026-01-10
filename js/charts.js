// ================================
// GLOBAL SETTINGS
// ================================
Chart.defaults.color = "#cbd5f5";
Chart.defaults.font.family = "Inter";

// ================================
// MONTHLY EXPENSE TREND (LINE)
// ================================
const expenseCanvas = document.getElementById("expenseChart");

if (expenseCanvas) {
  const ctx = expenseCanvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(99,102,241,0.6)");
  gradient.addColorStop(1, "rgba(99,102,241,0.05)");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Expenses ₹",
        data: [3200, 4200, 2800, 5100, 3900, 4600],
        fill: true,
        backgroundColor: gradient,
        borderColor: "#6366f1",
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffffff"
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
          borderWidth: 1
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "rgba(255,255,255,0.08)" } }
      }
    }
  });
}

// ================================
// CATEGORY BREAKDOWN (DOUGHNUT)
// ================================
const categoryCanvas = document.getElementById("categoryChart");

if (categoryCanvas) {
  new Chart(categoryCanvas, {
    type: "doughnut",
    data: {
      labels: ["Food", "Rent", "Shopping", "Transport", "Other"],
      datasets: [{
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          "#6366f1",
          "#22d3ee",
          "#22c55e",
          "#f59e0b",
          "#ec4899"
        ],
        borderWidth: 0,
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
