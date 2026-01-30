import Razorpay from "razorpay";

const instance = new Razorpay({
  // key_id: process.env.RAZORPAY_KEY_ID,
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

export default instance;
