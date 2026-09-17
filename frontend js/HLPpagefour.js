// Interactive logic for Home Loans & Build Plans page (HLPpagefour)

document.addEventListener("DOMContentLoaded", () => {
  // Calculator Sliders & Displays
  const loanAmountRange = document.getElementById("loan-amount-range");
  const loanTenureRange = document.getElementById("loan-tenure-range");
  const loanRateRange = document.getElementById("loan-rate-range");

  const loanAmountVal = document.getElementById("loan-amount-val");
  const loanTenureVal = document.getElementById("loan-tenure-val");
  const loanRateVal = document.getElementById("loan-rate-val");

  const calculatedEmi = document.getElementById("calculated-emi");
  const calculatedTotal = document.getElementById("calculated-total");

  // Plan Selection & Form Elements
  const selectPlanBtns = document.querySelectorAll(".select-plan-btn");
  const selectedPlanInput = document.getElementById("selected-plan-input");
  const loanAppForm = document.getElementById("loan-application-form");
  const loanFormStatus = document.getElementById("loan-form-status");

  const toastMsg = document.getElementById("toast-msg");
  const heroVideo = document.querySelector(".hero-video");

  // Toast Helper
  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add("show");
    setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 2800);
  }

  // Format Currency (INR)
  function formatCurrency(amount) {
    return "Rs " + Math.round(amount).toLocaleString("en-IN");
  }

  // Calculate EMI
  function updateEmiCalculator() {
    if (!loanAmountRange || !loanTenureRange || !loanRateRange) return;

    const P = parseFloat(loanAmountRange.value);
    const tenureYears = parseInt(loanTenureRange.value, 10);
    const N = tenureYears * 12; // Months
    const annualRate = parseFloat(loanRateRange.value);
    const R = annualRate / (12 * 100); // Monthly rate

    // Update Slider Value Labels
    if (loanAmountVal) loanAmountVal.textContent = formatCurrency(P);
    if (loanTenureVal) loanTenureVal.textContent = `${tenureYears} Years`;
    if (loanRateVal) loanRateVal.textContent = `${annualRate.toFixed(1)}%`;

    // EMI Formula: E = P * R * (1+R)^N / ((1+R)^N - 1)
    let emi = 0;
    if (R > 0) {
      const pow = Math.pow(1 + R, N);
      emi = (P * R * pow) / (pow - 1);
    } else {
      emi = P / N;
    }

    const totalPayable = emi * N;

    if (calculatedEmi) calculatedEmi.textContent = `${formatCurrency(emi)} / mo`;
    if (calculatedTotal) calculatedTotal.textContent = formatCurrency(totalPayable);
  }

  // Event Listeners for Sliders
  if (loanAmountRange) loanAmountRange.addEventListener("input", updateEmiCalculator);
  if (loanTenureRange) loanTenureRange.addEventListener("input", updateEmiCalculator);
  if (loanRateRange) loanRateRange.addEventListener("input", updateEmiCalculator);

  // Initial Calculation
  updateEmiCalculator();

  // Plan Selection Handler
  selectPlanBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const planName = btn.getAttribute("data-plan");
      if (selectedPlanInput && planName) {
        selectedPlanInput.value = planName;
        showToast(`Selected: ${planName}`);
        
        // Scroll to form smoothly
        const formCard = document.querySelector(".form-card");
        if (formCard) formCard.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Submit Loan Application Form
  if (loanAppForm) {
    loanAppForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById("btn-submit-loan");
      const nameVal = document.getElementById("applicant-name")?.value;
      const planVal = selectedPlanInput?.value || "Selected Plan";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting Loan & Plan Application...";
      }

      setTimeout(() => {
        if (loanFormStatus) {
          loanFormStatus.className = "form-status success";
          loanFormStatus.textContent = `Thank you, ${nameVal || "Customer"}! Your application for ${planVal} and pre-approval loan assistance has been submitted. Our bank agent will contact you shortly.`;
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Application Submitted Successfully! ✓";
        }

        loanAppForm.reset();
        if (selectedPlanInput) selectedPlanInput.value = planVal;

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = "Submit Loan & Plan Request &rarr;";
          }
        }, 4000);

      }, 900);
    });
  }

  // Reduced motion check
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo?.pause();
  }
});
