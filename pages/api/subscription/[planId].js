import cookie from "cookie";
import { supabase } from "../../../utils/supabase";
import initStrip from "stripe";

const handler = async (req, res) => {
  const { user } = req.body;

  const stripe = initStrip(process.env.STRIPE_SECRET_KEY);

  const { planId } = req.query;
  const items = [
    {
      price: planId,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    customer: user.stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: items,
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancel",
  });

  res.send({
    id: session.id,
  });
};

export default handler;
