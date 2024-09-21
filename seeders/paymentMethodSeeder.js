import Card from "../model/stripeCards";

const paymentMethodData = [
  {
    type: "1",
    cardName: "Cash On Delivery",
    isDefault: true,
    label: 0,
  },
  {
    type: "2",
    cardName: "Skip Cash",
    isDefault: false,
    label: 0,
  },
];

async function paymentMethodSeeder() {
  try {
    const findPaymentMethod = await Card.find({});

    if (findPaymentMethod.length == 0) {
      await Card.insertMany(paymentMethodData);
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

paymentMethodSeeder();