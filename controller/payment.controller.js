const Prisma = require("../config/db.connect");
const { ERROR_STATUS } = require("../utils/status");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const membershipSecret = process.env.MEMBERSHIP_WEBHOOK_SECRET;
const baseURL = process.env.CORS_URL;
const priceMapping = {
  BASIC: process.env.PRICING_ID_ONE,
  MEDIUM: process.env.PRICING_ID_TOW,
  PREMIUM: process.env.PRICING_ID_THREE,
};

async function createMembershipPayment(req, res) {
  const { title, plan, price, duration, planId } = req.body;
  const { id } = req.params;
  const successUrl = `${baseURL}/payment/success`;
  const failedUrl = `${baseURL}/business/plans`;
  try {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const existSeller = await Prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        userMemberships: true,
      },
    });

    const { username, email } = existSeller || {};

    const priceId = priceMapping[plan];
    if (!priceId) {
      return res.status(404).json({ message: INVALID_PLAN_MESSAGE });
    }
    const existingCustomer = await stripe.customers.list({ email });
    let customer;
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ email, name: username });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "bancontact"],
      mode: "payment",
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: failedUrl,
      metadata: { userId: id, planId: planId },
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
    });
    if (existSeller?.userMemberships?.length === 0) {
      await Prisma.userMembership.create({
        data: {
          name: title,
          plan: plan,
          price: price,
          duration: duration,
          userId: id,
          end_at: `${endDate}`,
          transactionId: session.id,
          active: false,
        },
      });
    } else {
      await Prisma.userMembership.updateMany({
        where: {
          userId: id,
        },
        data: {
          name: title,
          plan: plan,
          price: price,
          duration: duration,
          userId: id,
          end_at: `${endDate}`,
          transactionId: session.id,
          active: false,
        },
      });
    }

    return res.status(200).json({ pageUrl: session.url });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function membershipWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, membershipSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const transaction = await Prisma.userMembership.findFirst({
        where: {
          transactionId: session.id,
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      const id = transaction?.id;
      await Prisma.userMembership.update({
        where: {
          id: id,
        },
        data: { active: true },
      });
    }
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

module.exports = { createMembershipPayment, membershipWebhook };
