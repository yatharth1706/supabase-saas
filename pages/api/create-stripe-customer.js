import initStripe from "stripe";
import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    res.status(401).send({ message: "You are not authorized to call this api" });
  }

  // first step to create stripe
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  // create stripe customer
  const customer = await stripe.customers.create({ email: req.body.record.email });

  // update profile table with stripe customer id
  await supabase
    .from("profile")
    .update({
      stripe_customer: customer.id,
    })
    .eq("id", req.body.record.id);

  res.send({
    message: `Successfully created the stripe customer: ${customer.id}`,
  });
}
