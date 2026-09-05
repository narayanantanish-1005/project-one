document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const roleCards = document.querySelectorAll('.role-card');
  const fullnameInput = document.getElementById('fullname');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const termsCheckbox = document.getElementById('terms');
  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = submitBtn.querySelector('.btn-text');
  const alertBanner = document.getElementById('alert-banner');
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('strength-text');

  // Role Selection Toggle
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.textContent = isPassword ? '🙈' : '👁️';
  });

  // Live Password Strength Calculator
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (val.length === 0) {
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Password strength: Empty';
      strengthText.style.color = 'var(--silver)';
    } else if (score <= 1) {
      strengthBar.style.width = '25%';
      strengthBar.style.backgroundColor = '#f87171';
      strengthText.textContent = 'Password strength: Weak';
      strengthText.style.color = '#f87171';
    } else if (score === 2 || score === 3) {
      strengthBar.style.width = '65%';
      strengthBar.style.backgroundColor = '#fbbf24';
      strengthText.textContent = 'Password strength: Medium';
      strengthText.style.color = '#fbbf24';
    } else {
      strengthBar.style.width = '100%';
      strengthBar.style.backgroundColor = '#34d399';
      strengthText.textContent = 'Password strength: Strong & Secure';
      strengthText.style.color = '#34d399';
    }

    clearError('password');
  });

  confirmPasswordInput.addEventListener('input', () => clearError('confirm-password'));
  fullnameInput.addEventListener('input', () => clearError('fullname'));
  phoneInput.addEventListener('input', () => clearError('phone'));
  emailInput.addEventListener('input', () => clearError('email'));
  termsCheckbox.addEventListener('change', () => clearError('terms'));

  function clearError(field) {
    const group = document.getElementById(field).closest('.form-group') || document.getElementById(field).closest('.form-options');
    if (group) group.classList.remove('has-error');
    alertBanner.classList.add('hidden');
  }

  function showError(field, msg) {
    const el = document.getElementById(field);
    const group = el ? (el.closest('.form-group') || el.closest('.form-options')) : null;
    if (group) group.classList.add('has-error');
    if (msg) {
      const err = document.getElementById(`${field}-error`);
      if (err) err.textContent = msg;
    }
  }

  function showAlert(msg, type = 'error') {
    alertBanner.textContent = msg;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.classList.remove('hidden');
  }

  // Handle Sign Up Submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullname = fullnameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const terms = termsCheckbox.checked;
    const selectedRole = document.querySelector('input[name="role"]:checked')?.value || 'Homeowner';

    let isValid = true;

    if (!fullname) {
      showError('fullname', 'Please enter your full name');
      isValid = false;
    }

    if (!phone || phone.length < 10) {
      showError('phone', 'Please enter a valid phone number (min 10 digits)');
      isValid = false;
    }

    if (!email || !email.includes('@')) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }

    if (!password || password.length < 8) {
      showError('password', 'Password must be at least 8 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      showError('confirm-password', 'Passwords do not match');
      isValid = false;
    }

    if (!terms) {
      showError('terms', 'You must agree to the Terms of Service & Privacy Policy');
      isValid = false;
    }

    if (!isValid) return;

    // Show Loading
    submitBtn.disabled = true;
    btnSpinner.classList.remove('hidden');
    btnText.textContent = 'Creating Your Account...';

    setTimeout(() => {
      const newUser = {
        isLoggedIn: true,
        name: fullname,
        email: email,
        phone: phone,
        role: selectedRole,
        projectName: `${fullname}'s Dream Residence`,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('onedream_user', JSON.stringify(newUser));

      showAlert('Account successfully created! Redirecting to your profile...', 'success');

      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1200);
    }, 1600);
  });
});
