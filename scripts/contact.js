document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  let feedback = document.getElementById('contact-feedback');

  if (!form) return;

  // Ensure a feedback element exists so we can show status messages
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'contact-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.style.marginBottom = '12px';
    feedback.style.color = 'var(--muted)';
    const firstRow = form.querySelector('.input-row') || form.firstChild;
    form.insertBefore(feedback, firstRow);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (res.ok) {
        feedback.style.color = '';
        feedback.textContent = 'Thanks — your message was received.';
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        feedback.style.color = 'crimson';
        feedback.textContent = body && body.error ? body.error : 'Failed to send message';
      }
    } catch (err) {
      feedback.style.color = 'crimson';
      feedback.textContent = 'Network error — please try again later.';
      console.error(err);
    }
  });
});
