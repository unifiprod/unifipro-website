// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// WhatsApp widget
const whatsappNumber = '917893157763';
const whatsappMessage = "Hi UnifiPro, I'd like to know more about your services.";
const whatsappLink = document.createElement('a');
whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
whatsappLink.className = 'whatsapp-widget';
whatsappLink.target = '_blank';
whatsappLink.rel = 'noopener noreferrer';
whatsappLink.setAttribute('aria-label', 'Chat with us on WhatsApp');
whatsappLink.innerHTML = '<svg viewBox="0 0 32 32" fill="#ffffff" aria-hidden="true"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.912 6.48L4 29l7.72-1.876A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.354l-.355-.21-4.583 1.114 1.128-4.47-.232-.366A9.71 9.71 0 0 1 5.75 15c0-5.66 4.591-10.25 10.251-10.25S26.25 9.34 26.25 15 21.66 24.75 16.001 24.75Zm5.633-7.512c-.309-.155-1.828-.902-2.111-1.005-.283-.103-.489-.155-.694.155-.206.31-.797 1.005-.978 1.212-.18.206-.36.232-.669.077-.309-.155-1.305-.481-2.485-1.532-.919-.819-1.539-1.83-1.72-2.14-.18-.31-.019-.477.136-.63.14-.14.309-.361.464-.542.155-.18.206-.31.309-.516.103-.206.052-.387-.026-.542-.077-.155-.694-1.673-.951-2.29-.25-.601-.505-.52-.694-.53l-.591-.01c-.206 0-.542.077-.826.387-.283.31-1.08 1.056-1.08 2.574 0 1.518 1.106 2.985 1.26 3.19.155.206 2.176 3.323 5.273 4.66.737.318 1.312.508 1.76.65.739.235 1.412.202 1.944.122.593-.089 1.828-.747 2.086-1.468.258-.72.258-1.339.18-1.468-.077-.129-.283-.206-.592-.36Z"/></svg>';
document.body.appendChild(whatsappLink);

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form — submits to Web3Forms, which emails the submission
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = {
    name: { el: document.getElementById('name'), errorEl: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), errorEl: document.getElementById('emailError') },
    message: { el: document.getElementById('message'), errorEl: document.getElementById('messageError') },
  };

  function setError(field, message) {
    fields[field].el.closest('.form-field').classList.add('has-error');
    fields[field].errorEl.textContent = message;
  }

  function clearError(field) {
    fields[field].el.closest('.form-field').classList.remove('has-error');
    fields[field].errorEl.textContent = '';
  }

  function validateField(field) {
    const value = fields[field].el.value.trim();
    let message = '';

    if (field === 'name') {
      if (!value) message = 'Please enter your name.';
      else if (value.length < 2) message = 'Name must be at least 2 characters.';
    } else if (field === 'email') {
      if (!value) message = 'Please enter your email.';
      else if (!emailPattern.test(value)) message = 'Please enter a valid email address.';
    } else if (field === 'message') {
      if (!value) message = 'Please enter a message.';
      else if (value.length < 10) message = 'Message must be at least 10 characters.';
    }

    if (message) {
      setError(field, message);
      return false;
    }
    clearError(field);
    return true;
  }

  Object.keys(fields).forEach((field) => {
    fields[field].el.addEventListener('input', () => {
      if (fields[field].el.closest('.form-field').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fieldNames = Object.keys(fields);
    const results = fieldNames.map(validateField);
    const firstInvalidIndex = results.indexOf(false);

    if (firstInvalidIndex !== -1) {
      fields[fieldNames[firstInvalidIndex]].el.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formNote.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      const result = await response.json();

      if (result.success) {
        formNote.textContent = "Thanks — we'll get back to you shortly.";
        contactForm.reset();
      } else {
        formNote.textContent = 'Something went wrong. Please try again or email us directly.';
      }
    } catch (err) {
      formNote.textContent = 'Something went wrong. Please try again or email us directly.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
