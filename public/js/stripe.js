import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51O2QAhAjfYln34LPCCAPL2v2K9lroMNKLBgvq0ingPxhNoN1UbTesV5NqMXujEyJRL8J7Ryl2ld2UiPnIpY6RK0r00ZLsjVhUA'
    );

    const session = await axios(`/api/v1/bookings/checkout.session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
