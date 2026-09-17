document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = submitBtn.querySelector('.btn-text');
  const alertBanner = document.getElementById('alert-banner');
  const googleLoginBtn = document.getElementById('google-login');
  const otpLoginBtn = document.getElementById('otp-login');
  const forgotPasswordLink = document.getElementById('forgot-password');

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.textContent = isPassword ? '🙈' : '👁️';
  });

  // Clear errors on input
  emailInput.addEventListener('input', () => clearError('email'));
  passwordInput.addEventListener('input', () => clearError('password'));

  function clearError(field) {
    const group = document.getElementById(field).closest('.form-group');
    group.classList.remove('has-error');
    alertBanner.classList.add('hidden');
  }

  function showError(field, message) {
    const group = document.getElementById(field).closest('.form-group');
    group.classList.add('has-error');
    if (message) {
      const errorEl = document.getElementById(`${field}-error`);
      if (errorEl) errorEl.textContent = message;
    }
  }

  function showAlert(message, type = 'error') {
    alertBanner.textContent = message;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.classList.remove('hidden');
  }

  // Handle Form Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;

    // Basic Validation
    if (!email || !email.includes('@')) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }

    if (!password || password.length < 6) {
      showError('password', 'Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    // Show Loading State
    submitBtn.disabled = true;
    btnSpinner.classList.remove('hidden');
    btnText.textContent = 'Authenticating...';

    // Simulate API request delay
    setTimeout(() => {
      // Save Session Data
      const userName = email.split('@')[0];
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
      
      const userSession = {
        isLoggedIn: true,
        name: formattedName,
        email: email,
        role: 'Homeowner',
        projectName: 'The Emerald Villa & Residence',
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('onedream_user', JSON.stringify(userSession));

      showAlert('Login successful! Redirecting to your dashboard...', 'success');

      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1200);

    }, 1500);
  });

  // Social Login Simulations
  googleLoginBtn.addEventListener('click', () => {
    showAlert('Connecting to Google Auth...', 'success');
    setTimeout(() => {
      const googleUser = {
        isLoggedIn: true,
        name: 'Alex Morgan',
        email: 'alex.morgan@gmail.com',
        role: 'Homeowner & Investor',
        projectName: 'Skyline Haven Villa',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('onedream_user', JSON.stringify(googleUser));
      window.location.href = 'profile.html';
    }, 1000);
  });

  otpLoginBtn.addEventListener('click', () => {
    const phone = prompt('Enter your 10-digit mobile number for OTP login:');
    if (phone && phone.length >= 10) {
      showAlert(`OTP sent to +91 ${phone}. Verifying...`, 'success');
      setTimeout(() => {
        const phoneUser = {
          isLoggedIn: true,
          name: `User ${phone.slice(-4)}`,
          email: `${phone}@onedream.home`,
          role: 'Homeowner',
          projectName: 'Custom Dream Villa',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('onedream_user', JSON.stringify(phoneUser));
        window.location.href = 'profile.html';
      }, 1200);
    }
  });

  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Enter your registered email address to receive password reset instructions:');
    if (email) {
      showAlert(`Password reset link sent to ${email}`, 'success');
    }
  });
});
