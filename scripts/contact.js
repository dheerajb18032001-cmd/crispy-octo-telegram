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
      // Get Firestore instance from firebase.js if available
      if (!window.TeaApp || !window.TeaApp.db) {
        throw new Error('Firestore not initialized');
      }

      const db = window.TeaApp.db;
      
      // Save to Firestore contacts collection
      await db.collection('contacts').add({
        name: name,
        email: email,
        message: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'new'
      });

      feedback.style.color = 'green';
      feedback.textContent = 'Thanks — your message was received. ✓';
      form.reset();
      
      // Clear feedback after 3 seconds
      setTimeout(() => {
        feedback.textContent = '';
      }, 3000);
    } catch (err) {
      feedback.style.color = 'crimson';
      feedback.textContent = err.message ? `Error: ${err.message}` : 'Failed to send message. Please try again.';
      console.error('Contact form error:', err);
    }
  });
});

