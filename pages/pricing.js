import axios from "axios";
import React from "react";
import initStripe from "stripe";
import { useUser } from "../contexts/user";
import { loadStripe } from "@stripe/stripe-js";

function pricing({ plans }) {
  const { user, login } = useUser();

  const showSubscribeButton = user && user?.is_subscribed == false;
  const manageSubscribeButton = user && user?.is_subscribed == true;
  const showCreateAccountButton = user && Object.keys(user).length == 0;

  const processSubscription = async (planId) => {
    const {
      data: { id },
    } = await axios.post(`/api/subscription/${planId}`, { user });
    const stripeClient = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripeClient.redirectToCheckout({
      sessionId: id,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans?.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-6">
          <h2>{plan.name}</h2>
          <p>
            Rs{plan.price / 100} / {plan.interval}
          </p>
          {showSubscribeButton && (
            <button onClick={() => processSubscription(plan.id)}>Subscribe</button>
          )}
          {showCreateAccountButton && <button onClick={login}>Create Account</button>}
          {manageSubscribeButton && <button>Manage Subscription</button>}
        </div>
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      };
    })
  );

  plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans,
    },
  };
};

export default pricing;
