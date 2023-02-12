import initStripe from "stripe";
import { buffer } from "micro";
import { supabase, createSupabaseService } from "../../utils/supabase";

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const signInSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signInSecret);
  } catch (er) {
    console.log(er);
    return res.status(400).send(`Webhook error: ${er.message}`);
  }

  const supabaseService = createSupabaseService();

  switch (event.type) {
    case "customer.subscription.created":
      await supabaseService
        .from("profile")
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
        })
        .eq("stripe_customer", event.data.object.customer);
  }

  console.log(event);

  res.send({ recieved: true });
};

export default handler;
