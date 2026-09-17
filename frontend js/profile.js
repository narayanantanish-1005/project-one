document.addEventListener('DOMContentLoaded', () => {
  // Load Session Data from LocalStorage
  const sessionData = localStorage.getItem('onedream_user');
  let user = {
    isLoggedIn: true,
    name: 'Alex Morgan',
    email: 'alex.morgan@onedream.home',
    phone: '+91 98765 43210',
    role: 'Verified Homeowner',
    projectName: 'The Emerald Villa & Residence'
  };

  if (sessionData) {
    try {
      user = { ...user, ...JSON.parse(sessionData) };
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }

  // Update UI Elements with User Info
  updateUserUI(user);

  // Tabs Switching Logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab)?.classList.add('active');
    });
  });

  // Edit Profile Form Submission
  const editForm = document.getElementById('edit-profile-form');
  const alertBanner = document.getElementById('profile-alert');

  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const updatedName = document.getElementById('edit-fullname').value.trim();
      const updatedEmail = document.getElementById('edit-email').value.trim();
      const updatedPhone = document.getElementById('edit-phone').value.trim();
      const updatedRole = document.getElementById('edit-role').value;
      const updatedProject = document.getElementById('edit-project').value.trim();

      user.name = updatedName || user.name;
      user.email = updatedEmail || user.email;
      user.phone = updatedPhone || user.phone;
      user.role = updatedRole || user.role;
      user.projectName = updatedProject || user.projectName;

      localStorage.setItem('onedream_user', JSON.stringify(user));
      updateUserUI(user);

      if (alertBanner) {
        alertBanner.textContent = 'Profile details successfully updated!';
        alertBanner.className = 'alert-banner success';
        alertBanner.classList.remove('hidden');

        setTimeout(() => {
          alertBanner.classList.add('hidden');
        }, 3000);
      }
    });
  }

  // Logout Handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out of The One Dream?')) {
        localStorage.removeItem('onedream_user');
        window.location.href = 'login.html';
      }
    });
  }

  function updateUserUI(userObj) {
    const initials = getInitials(userObj.name);

    // Sidebar
    const sidebarInitials = document.getElementById('sidebar-avatar-initials');
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');
    if (sidebarInitials) sidebarInitials.textContent = initials;
    if (sidebarName) sidebarName.textContent = userObj.name;
    if (sidebarRole) sidebarRole.textContent = userObj.role;

    // Header
    const avatarInitials = document.getElementById('avatar-initials');
    const displayName = document.getElementById('user-display-name');
    const displayRole = document.getElementById('user-display-role');
    const displayEmail = document.getElementById('user-display-email');
    const projectName = document.getElementById('user-project-name');
    const siteNameVal = document.getElementById('site-name-val');

    if (avatarInitials) avatarInitials.textContent = initials;
    if (displayName) displayName.textContent = userObj.name;
    if (displayRole) displayRole.textContent = userObj.role;
    if (displayEmail) displayEmail.textContent = userObj.email;
    if (projectName) projectName.textContent = userObj.projectName;
    if (siteNameVal) siteNameVal.textContent = userObj.projectName;

    // Populate Form Inputs
    const inputName = document.getElementById('edit-fullname');
    const inputEmail = document.getElementById('edit-email');
    const inputPhone = document.getElementById('edit-phone');
    const inputRole = document.getElementById('edit-role');
    const inputProject = document.getElementById('edit-project');

    if (inputName) inputName.value = userObj.name || '';
    if (inputEmail) inputEmail.value = userObj.email || '';
    if (inputPhone) inputPhone.value = userObj.phone || '';
    if (inputRole) inputRole.value = userObj.role || 'Homeowner';
    if (inputProject) inputProject.value = userObj.projectName || '';
  }

  function getInitials(name) {
    if (!name) return 'OD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
});
