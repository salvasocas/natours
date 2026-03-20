(function () {
  const form = document.querySelector('.form--signup');
  if (!form) return;

  const handler = async function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const submitBtn = form.querySelector('button[type="submit"], button');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) submitBtn.textContent = 'Processing...';

    const payload = {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      password: document.getElementById('password')?.value || '',
      passwordConfirm: document.getElementById('passwordConfirm')?.value || '',
    };

    try {
      const response = await fetch('/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Signup failed');
      }

      window.location.assign('/');
    } catch (err) {
      alert(err.message || 'Signup failed');
      if (submitBtn) submitBtn.textContent = originalText;
    }
  };

  // Capture phase ensures this fallback works even if bundled handlers are stale.
  form.addEventListener('submit', handler, true);
})();
