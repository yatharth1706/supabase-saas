import React from "react";
import initStripe from "stripe";

function pricing({ plans }) {
  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans?.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-6">
          <h2>{plan.name}</h2>
          <p>
            Rs{plan.price / 100} / {plan.interval}
          </p>
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
        id: product.id,
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
