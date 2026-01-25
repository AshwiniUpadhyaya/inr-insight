// ==============================
// Currency Master List (FINAL)
// ==============================
const currencies = [
  // Global Majors
  { code: "USD", name: "United States Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro (Eurozone)", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },

  // Asia & Middle East

  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },

  // Western & Trade
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },

  // Emerging / Popular
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" }
];

const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");
const convertBtn = document.getElementById("convertBtn");
const resultText = document.querySelector(".result-card h2");



const trendText = document.querySelector(".trend-text") || null;



const statusText = document.querySelector(".status p");

const historyList =
  document.querySelector(".history ul") ||
  document.querySelector(".history-list") ||
  null;


function populateCurrencyDropdown() {
  if (!currencySelect) return; // ✅ guard

  currencies.forEach(currency => {
    const option = document.createElement("option");
    option.value = currency.code;
    option.textContent = `${currency.flag} ${currency.name} (${currency.code})`;
    currencySelect.appendChild(option);
  });
}

// Call only if dropdown exists
populateCurrencyDropdown();
if (convertBtn){
convertBtn.addEventListener("click", function () {
  const amount = amountInput.value;
  const currency = currencySelect.value;

  if (amount === "") {
    alert("Please enter an amount");
    return;
  }

  fetch(`https://open.er-api.com/v6/latest/${currency}`)
    .then(response => response.json())
    .then(data => {
      const todayRate = data.rates.INR;
      const converted = amount * todayRate;

      // Show INR value
      resultText.textContent = `₹ ${converted.toFixed(2)}`;
resultText.style.opacity = "0";
resultText.style.transform = "translateY(4px)";

setTimeout(() => {
  resultText.style.opacity = "1";
  resultText.style.transform = "translateY(0)";
}, 50);
const now = new Date();
const timeString = now.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit"
});

statusText.textContent = `Last updated: ${timeString}`;

      // 🔹 Get yesterday's rate from localStorage
      const lastRate = localStorage.getItem(`${currency}_INR_RATE`);

if (lastRate) {
  const difference = todayRate - lastRate;

  if (trendText) {
    trendText.style.color = difference > 0 ? "#c0392b" : "#1a8f5a";

    if (difference > 0) {
      trendText.textContent =
        `1 ${currency} was ₹${Number(lastRate).toFixed(2)} earlier. Today: ₹${todayRate.toFixed(2)} ↑ (+${difference.toFixed(2)})`;
    } else if (difference < 0) {
      trendText.textContent =
        `1 ${currency} was ₹${Number(lastRate).toFixed(2)} earlier. Today: ₹${todayRate.toFixed(2)} ↓ (${difference.toFixed(2)})`;
    } else {
      trendText.textContent =
        `No change from last rate. Still ₹${todayRate.toFixed(2)}.`;
      trendText.style.color = "#555";
    }
  }

} else {
  if (trendText) {
    trendText.textContent =
      "No previous data available to show trend.";
  }
}

      // 🔹 Save today's rate for next time
      localStorage.setItem(`${currency}_INR_RATE`, todayRate);

      // 🔹 Build history text
const historyItem = `${currency} → INR : ₹${converted.toFixed(2)}`;

// 🔹 Get existing history or empty array
let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

// 🔹 Add new item at top
history.unshift(historyItem);

// 🔹 Keep only last 5 items
history = history.slice(0, 5);

// 🔹 Save back to localStorage
localStorage.setItem("conversionHistory", JSON.stringify(history));

// 🔹 Update UI
updateHistoryUI(history);

    })
    .catch(error => {
      trendText.textContent =
        "Unable to fetch exchange rate. Please check internet.";
      console.error(error);
    });
});
}

if (amountInput && convertBtn) {
  setInterval(() => {
    if (amountInput.value !== "") {
      convertBtn.click();
    }
  }, 300000);
}


function updateHistoryUI(history) {
  if (!historyList) return;

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No conversions yet</li>";
    return;
  }

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}


const savedHistory = JSON.parse(localStorage.getItem("conversionHistory")) || [];
updateHistoryUI(savedHistory);

const chartCanvas = document.getElementById("rateChart");

if (chartCanvas) {
  const ctx = chartCanvas.getContext("2d");

  // Temporary demo data (we’ll improve this later)
  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Today"];
  const rates = [82.9, 83.1, 83.0, 83.2, 83.15];

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "USD → INR",
          data: rates,
          borderColor: "#0b5e34",
          backgroundColor: "rgba(11, 94, 52, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: {
            callback: value => "₹" + value
          }
        }
      }
    }
  });
}

