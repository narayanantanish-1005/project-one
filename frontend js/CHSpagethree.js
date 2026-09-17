// Interactive logic for Current Home Status & Engineer Connection Portal

document.addEventListener("DOMContentLoaded", () => {
  // Elements for Engineer Portal Form
  const engineerLoginForm = document.getElementById("engineer-login-form");
  const connectPortalForm = document.getElementById("connect-portal-form");
  const connectedEngineerCard = document.getElementById("connected-engineer-card");
  const progressSection = document.getElementById("progress-section");
  const activeMilestoneDesc = document.getElementById("active-milestone-desc");

  // Input Fields
  const engCodeInput = document.getElementById("eng-code-input");
  const engNameInput = document.getElementById("eng-name-input");
  const engPhoneInput = document.getElementById("eng-phone-input");
  const engEmailInput = document.getElementById("eng-email-input");

  // Display Fields
  const displayEngName = document.getElementById("display-eng-name");
  const displayEngCode = document.getElementById("display-eng-code");
  const engineerPhone = document.getElementById("engineer-phone");
  const engineerEmail = document.getElementById("engineer-email");
  const connectedAvatar = document.getElementById("connected-avatar");
  const btnCallNow = document.getElementById("btn-call-now");
  const btnSendEmail = document.getElementById("btn-send-email");
  const btnDisconnect = document.getElementById("btn-disconnect-engineer");

  // Action Buttons & Toast
  const copyPhoneBtn = document.getElementById("copy-phone-btn");
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const toastMsg = document.getElementById("toast-msg");
  const heroVideo = document.querySelector(".hero-video");

  // Toast notification helper
  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add("show");
    setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 2800);
  }

  // Get Initials from Name
  function getInitials(name) {
    if (!name) return "ENG";
    const parts = name.trim().replace(/^Er\.\s*/i, "").split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Handle Engineer Connection Form Submission
  if (engineerLoginForm) {
    engineerLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const code = engCodeInput.value.trim();
      const name = engNameInput.value.trim();
      const phone = engPhoneInput.value.trim();
      const email = engEmailInput.value.trim();

      if (!code || !name || !phone || !email) {
        showToast("Please fill in all engineer details to connect.");
        return;
      }

      // Format Phone href
      const cleanPhone = phone.replace(/[^\d+]/g, "");

      // Update Connected View DOM
      if (displayEngName) displayEngName.textContent = name;
      if (displayEngCode) displayEngCode.textContent = code.toUpperCase();
      
      if (engineerPhone) {
        engineerPhone.textContent = phone;
        engineerPhone.href = `tel:${cleanPhone}`;
      }

      if (engineerEmail) {
        engineerEmail.textContent = email;
        engineerEmail.href = `mailto:${email}`;
      }

      if (btnCallNow) btnCallNow.href = `tel:${cleanPhone}`;
      if (btnSendEmail) btnSendEmail.href = `mailto:${email}`;

      if (connectedAvatar) {
        connectedAvatar.querySelector("span").textContent = getInitials(name);
      }

      if (activeMilestoneDesc) {
        activeMilestoneDesc.textContent = `In Progress — ${name} inspection today`;
      }

      // Reveal Connected Card AND Site Progress Card
      connectPortalForm.style.display = "none";
      connectedEngineerCard.style.display = "block";
      if (progressSection) progressSection.style.display = "block";

      showToast(`Connected with Engineer ${name} (${code})!`);
    });
  }

  // Disconnect / Change Engineer Button
  if (btnDisconnect) {
    btnDisconnect.addEventListener("click", () => {
      connectedEngineerCard.style.display = "none";
      if (progressSection) progressSection.style.display = "none";
      connectPortalForm.style.display = "block";
      showToast("Disconnected engineer. Enter new engineer code & details.");
    });
  }

  // Copy Phone Number
  if (copyPhoneBtn && engineerPhone) {
    copyPhoneBtn.addEventListener("click", () => {
      const phoneText = engineerPhone.textContent.trim();
      navigator.clipboard.writeText(phoneText).then(() => {
        showToast(`Phone number (${phoneText}) copied!`);
      }).catch(() => {
        showToast(`Phone: ${phoneText}`);
      });
    });
  }

  // Copy Email Address
  if (copyEmailBtn && engineerEmail) {
    copyEmailBtn.addEventListener("click", () => {
      const emailText = engineerEmail.textContent.trim();
      navigator.clipboard.writeText(emailText).then(() => {
        showToast(`Email (${emailText}) copied!`);
      }).catch(() => {
        showToast(`Email: ${emailText}`);
      });
    });
  }

  // Reduced motion check
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo?.pause();
  }
});
