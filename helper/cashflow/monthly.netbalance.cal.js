const Prisma = require("../../config/db.connect");

async function monthlyNetbalancePermonth(cashflowId, businessId) {
  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const [accBegain, totalPayment, totalNetCollec] = await Promise.all([
    Prisma.cashflow.findFirst({
      where: { businessId, name: "ACCUMULATED_BALANCE_BEGAINING" },
    }),
    Prisma.cashflow.findFirst({
      where: { businessId, name: "TOTAL_PAYMENTS" },
    }),
    Prisma.cashflow.findFirst({
      where: { businessId, name: "TOTAL_NET_COLLECTIONS" },
    }),
  ]);

  const [accBegainMonths, paymentMonths, netCollecMonths] = await Promise.all([
    Prisma.cashflowmonth.findMany({
      where: {
        cashflowId: accBegain?.id,
        ownername: "ACCUMULATED_BALANCE_BEGAINING",
      },
    }),
    Prisma.cashflowmonth.findMany({
      where: { cashflowId: totalPayment?.id, ownername: "TOTAL_PAYMENTS" },
    }),
    Prisma.cashflowmonth.findMany({
      where: {
        cashflowId: totalNetCollec?.id,
        ownername: "TOTAL_NET_COLLECTIONS",
      },
    }),
  ]);

  const monthValues = {};

  for (const month of monthNames) {
    const net = netCollecMonths.find((item) => item.name === month)?.value || 0;
    const pay = paymentMonths.find((item) => item.name === month)?.value || 0;

    if (month === "JANUARY") {
      const acc =
        accBegainMonths.find((item) => item.name === month)?.value || 0;
      monthValues[month] = parseFloat((net - pay + acc).toFixed(2));
    } else {
      monthValues[month] = parseFloat((net - pay).toFixed(2));
    }
  }

  const updatePermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "MONTHLY_NET_BALANCE",
    },
  });

  for (const item of updatePermonth) {
    const value = monthValues[item.name];
    if (value !== undefined) {
      await Prisma.cashflowmonth.update({
        where: { id: item.id },
        data: { value: Math.ceil(value) },
      });
    }
  }
}

module.exports = monthlyNetbalancePermonth;
