// Handle nav mobile toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Smooth scroll for CTA buttons
const scrollButtons = document.querySelectorAll("[data-scroll-target]");

scrollButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetSelector = btn.getAttribute("data-scroll-target");
    if (!targetSelector) return;
    const target = document.querySelector(targetSelector);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Close mobile nav if open
    if (navLinks && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
    }
  });
});

// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  if (!question) return;

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((i) => i.classList.remove("open"));
    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

// Billing toggle
const billingToggle = document.getElementById("billing-toggle");
const proPrice = document.getElementById("pro-price");
const toggleLabels = document.querySelectorAll(".toggle-label");

if (billingToggle && proPrice) {
  billingToggle.addEventListener("change", () => {
    const yearly = billingToggle.checked;
    if (yearly) {
      proPrice.innerHTML = "₹9,590<span>/year</span>";
    } else {
      proPrice.innerHTML = "₹999<span>/month</span>";
    }

    toggleLabels.forEach((label) => {
      const billing = label.getAttribute("data-billing");
      const shouldBeActive =
        (billing === "yearly" && yearly) || (billing === "monthly" && !yearly);
      label.classList.toggle("active", shouldBeActive);
    });
  });
}

// Live watchlist (polling)
const watchlistRows = document.querySelectorAll(".watchlist-row[data-symbol]");

async function fetchLivePrice(symbol) {
  // IMPORTANT:
  // Replace the URL below with a real market data API endpoint and attach your API key.
  // Example (Alpha Vantage, Finnhub, etc.). This is a placeholder and will likely fail
  // without modification due to CORS and auth.
  const demoUrl = `https://example.com/api/price?symbol=${encodeURIComponent(
    symbol
  )}`;

  try {
    const res = await fetch(demoUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Network response not ok");
    const data = await res.json();

    // Expected structure (adjust to your real API):
    // { price: number, changePercent: number }
    return {
      price: data.price,
      changePercent: data.changePercent,
    };
  } catch (error) {
    // Fallback: simple simulated price movement
    const basePrices = {
      NIFTY: 21430.5,
      BANKNIFTY: 45230.1,
      RELIANCE: 2650.4,
      TCS: 3540.2,
    };
    const base = basePrices[symbol] || 100;
    const randomDelta = (Math.random() - 0.5) * 0.4; // +/-0.2%
    const changePercent = randomDelta;
    const price = base * (1 + changePercent / 100);

    return {
      price,
      changePercent,
      simulated: true,
    };
  }
}

async function updateWatchlist() {
  if (!watchlistRows.length) return;

  watchlistRows.forEach((row) => row.classList.add("live-updating"));

  for (const row of watchlistRows) {
    const symbol = row.getAttribute("data-symbol") || "";
    const priceEl = row.querySelector("[data-field='price']");
    const changeEl = row.querySelector("[data-field='change']");
    if (!symbol || !priceEl || !changeEl) continue;

    const previousPrice = parseFloat(
      priceEl.textContent.replace(/,/g, "")
    );

    try {
      const { price, changePercent, simulated } = await fetchLivePrice(symbol);
      const formattedPrice = price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      const sign = changePercent > 0 ? "+" : changePercent < 0 ? "-" : "";
      const formattedChange = `${sign}${Math.abs(changePercent).toFixed(2)}%${
        simulated ? " (sim)" : ""
      }`;

      priceEl.textContent = formattedPrice;
      changeEl.textContent = formattedChange;
      changeEl.classList.remove("positive", "negative");
      if (changePercent > 0) {
        changeEl.classList.add("positive");
      } else if (changePercent < 0) {
        changeEl.classList.add("negative");
      }

      if (!Number.isNaN(previousPrice) && previousPrice !== price) {
        row.classList.add("price-tick");
        setTimeout(() => row.classList.remove("price-tick"), 180);
      }
    } catch {
      changeEl.textContent = "Data unavailable";
      changeEl.classList.remove("positive", "negative");
    }
  }
}

if (watchlistRows.length) {
  updateWatchlist();
  setInterval(updateWatchlist, 15000); // refresh every 15s
}

// Hero email form (simple validation + toast)
const heroForm = document.getElementById("hero-form");
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

if (heroForm) {
  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = heroForm.querySelector("input[type='email']");
    const value = emailInput ? emailInput.value.trim() : "";

    if (!value || !value.includes("@") || !value.includes(".")) {
      showToast("Please enter a valid email address.");
      return;
    }

    showToast("Thank you! You’ve been added to the waitlist.");
    heroForm.reset();
  });
}

// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Scroll reveal animations
const revealTargets = document.querySelectorAll(
  ".section, .feature-card, .track-card, .price-card, .faq-list"
);

if ("IntersectionObserver" in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  // Fallback: show all
  revealTargets.forEach((el) => el.classList.add("reveal"));
}


