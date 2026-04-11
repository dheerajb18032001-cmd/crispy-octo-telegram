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

  // Wait for Firestore to be available
  async function waitForFirestore(maxWait = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
      if (window.TeaApp && window.TeaApp.db) {
        return window.TeaApp.db;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Firestore initialization timeout');
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
      // Wait for Firestore to initialize
      const db = await waitForFirestore();
      
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

