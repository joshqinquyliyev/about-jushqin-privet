document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  let submitting = false;

  ['name','email','subject','message'].forEach(f => {
    form[f]?.addEventListener('input', () => {
      const err = document.getElementById(f + '-error');
      if (err) err.textContent = '';
      form[f].style.borderColor = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;

    clearErrors();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let valid = true;
    if (!name) { showError('name', 'Name is required'); valid = false; }
    if (!email) { showError('email', 'Email is required'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Invalid email'); valid = false; }
    if (!subject) { showError('subject', 'Subject is required'); valid = false; }
    if (!message) { showError('message', 'Message is required'); valid = false; }
    if (!valid) return;

    submitting = true;
    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate network
    await new Promise(r => setTimeout(r, 800));

    try {
      const messages = getMessages();
      messages.unshift({
        id: generateId('msg'),
        name,
        email,
        subject,
        message,
        read: false,
        createdAt: new Date().toISOString()
      });
      saveData('messages', messages);

      form.reset();
      document.getElementById('form-status').innerHTML = `<span class="status-success">${typeof t === 'function' ? t('form_success') : 'Xabar muvaffaqiyatli yuborildi!'}</span>`;
      showToast('Message sent', 'success');
    } catch (err) {
      document.getElementById('form-status').innerHTML = '<span class="status-error">Something went wrong. Try again.</span>';
      showToast('Error sending message', 'error');
    }

    btn.textContent = 'Send Message';
    btn.disabled = false;
    submitting = false;
  });

  function showError(field, msg) {
    const el = document.getElementById(field + '-error');
    if (el) el.textContent = msg;
    form[field].style.borderColor = 'var(--error)';
  }

  function clearErrors() {
    ['name', 'email', 'subject', 'message'].forEach(f => {
      const el = document.getElementById(f + '-error');
      if (el) el.textContent = '';
      if (form[f]) form[f].style.borderColor = '';
    });
    document.getElementById('form-status').innerHTML = '';
  }
});
