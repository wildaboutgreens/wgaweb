import Razorpay from 'razorpay';

let _instance: Razorpay | null = null;

/**
 * Returns a lazily-initialised Razorpay instance.
 * Deferred so the production build doesn't crash when env vars are absent.
 */
export function getRazorpay(): Razorpay {
  if (!_instance) {
    _instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _instance;
}
