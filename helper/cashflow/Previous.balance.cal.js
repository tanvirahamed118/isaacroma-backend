const Prisma = require("../../config/db.connect");

async function previousCalculation(cashflowId, businessId) {
  const permonths = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "PREVIOUS_BALANCE",
    },
  });

  const totalPresentedCol = await Prisma.cashflow.findFirst({
    where: {
      businessId: businessId,
      name: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });

  const total = totalPresentedCol?.total;
  const totalPermonth = permonths.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const percentCal = parseFloat(((totalPermonth / total) * 100).toFixed(2));
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      total: Math.ceil(totalPermonth),
      flowPercent: percentCal,
    },
  });
}

module.exports = previousCalculation;
