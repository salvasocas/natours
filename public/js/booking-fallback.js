(function () {
  const bookBtn = document.getElementById('book-tour');
  if (!bookBtn) return;

  const publicKey = bookBtn.dataset.stripePublicKey;
  if (!publicKey || typeof Stripe === 'undefined') return;

  const onClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const tourId = bookBtn.dataset.tourId;
    if (!tourId) return;

    const originalText = bookBtn.textContent;
    bookBtn.textContent = 'Processing...';

    try {
      const stripe = Stripe(publicKey);
      const response = await fetch('/api/v1/bookings/checkout.session/' + tourId, {
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok || !data || !data.session || !data.session.id) {
        throw new Error((data && data.message) || 'Could not start checkout');
      }

      const redirectResult = await stripe.redirectToCheckout({
        sessionId: data.session.id,
      });

      if (redirectResult && redirectResult.error) {
        throw new Error(redirectResult.error.message);
      }
    } catch (err) {
      alert((err && err.message) || 'Booking failed');
      bookBtn.textContent = originalText;
    }
  };

  // Run in capture phase so this fallback can take precedence over stale bundled handlers.
  bookBtn.addEventListener('click', onClick, true);
})();
