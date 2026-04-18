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

  // Backend API URL (adjust if backend is hosted elsewhere)
  const API_URL = 'http://localhost:3000/api/contact';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = 'Sending...';
    feedback.style.color = 'var(--muted)';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      feedback.style.color = 'crimson';
      feedback.textContent = 'Please fill in all fields.';
      return;
    }

    try {
      // Send to backend server
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok) {
        feedback.style.color = 'green';
        feedback.textContent = 'Thanks — your message was received. ✓';
        form.reset();
        
        // Clear feedback after 3 seconds
        setTimeout(() => {
          feedback.textContent = '';
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to save message');
      }
    } catch (err) {
      feedback.style.color = 'crimson';
      feedback.textContent = err.message ? `Error: ${err.message}` : 'Failed to send message. Please try again.';
      console.error('Contact form error:', err);
    }
  });
});

