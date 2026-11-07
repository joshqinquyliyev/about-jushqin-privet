document.addEventListener('DOMContentLoaded', () => {
  // If already logged in and on login page, redirect
  if (isAuthenticated() && window.location.pathname.includes('login')) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.getElementById('login-form');
  if (!form) return;

  const toggle = document.getElementById('toggle-pass');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const input = document.getElementById('password');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    errorEl.textContent = '';
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    setTimeout(() => {
      if (username === 'jushqin2013' && password === '222222') {
        setAuthenticated(true);
        if (document.getElementById('remember')?.checked) {
          localStorage.setItem('jushqin_remember', '1');
        }
        window.location.href = 'dashboard.html';
      } else {
        errorEl.textContent = 'Invalid username or password.';
        btn.textContent = 'Sign In';
        btn.disabled = false;
      }
    }, 600);
  });
});

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  setAuthenticated(false);
  window.location.href = 'login.html';
}
