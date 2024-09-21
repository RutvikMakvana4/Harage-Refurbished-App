import OrderStatus from "../model/orderStatus";

const data = [
  {
    paymentType: 1,
    status: "Order Placed",
    statusCode: 1,
  },
  {
    paymentType: 1,
    status: "Processing",
    statusCode: 2,
  },
  {
    paymentType: 1,
    status: "Out for Delivery",
    statusCode: 3,
  },
  {
    paymentType: 1,
    status: "Delivered",
    statusCode: 4,
  },
  {
    paymentType: 1,
    status: "Returned",
    statusCode: 7,
  },
  {
    paymentType: 1,
    status: "Refunded",
    statusCode: 8,
  },
  {
    paymentType: 2,
    status: "Order Placed",
    statusCode: 1,
  },
  {
    paymentType: 2,
    status: "Payment Confirmed",
    statusCode: 2,
  },
  {
    paymentType: 2,
    status: "Processing",
    statusCode: 3,
  },
  {
    paymentType: 2,
    status: "Out for Delivery",
    statusCode: 4,
  },
  {
    paymentType: 2,
    status: "Delivered",
    statusCode: 5,
  },
  {
    paymentType: 2,
    status: "Returned",
    statusCode: 7,
  },
  {
    paymentType: 2,
    status: "Refunded",
    statusCode: 8,
  },
];

async function orderStatusSeeder() {
  const findOrderStatus = await OrderStatus.countDocuments();

  if (findOrderStatus === 0) {
    await OrderStatus.insertMany(data);
    console.log("Order status seeded");
  }
}

orderStatusSeeder();
