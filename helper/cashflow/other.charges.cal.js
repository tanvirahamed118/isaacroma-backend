const Prisma = require("../../config/db.connect");

async function otherChargesPermonthCal(userId, businessId, cashflowId) {
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
  const existCapitatBusinessres = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_CAPITAL_INCRIEASE_LOAN",
    },
  });
  const existCapitalLoans = await Prisma.permonth.findMany({
    where: {
      businessResultId: existCapitatBusinessres?.id,
      ownername: "TOTAL_CAPITAL_INCRIEASE_LOAN",
    },
  });

  const perMonthCal = {};
  for (const month of monthNames) {
    const eixstPermonth = existCapitalLoans.find((item) => item.name === month);
    perMonthCal[month] = eixstPermonth.value ? eixstPermonth.value : 0;
  }

  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_OTHER_CHARGES",
      },
    });
    const perMonth = updatePermonth.find((item) => item.name === month);
    if (perMonth) {
      await Prisma.cashflowmonth.update({
        where: { id: perMonth.id },
        data: { value: Math.ceil(perMonthCal[month]) },
      });
    }
  }
}

async function otherChargesTotalCal(cashflowId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_OTHER_CHARGES",
    },
  });
  const totalPermonth = existPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      total: parseFloat(totalPermonth.toFixed(2)),
    },
  });
}

async function otherChargesPercentCal(cashflowId, businessId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_OTHER_CHARGES",
    },
  });
  const totalPermonth = existPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const totalCollPerMonth = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_NET_COLLECTIONS",
    },
  });
  const existTotalCollPerMonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: totalCollPerMonth?.id,
      ownername: "TOTAL_NET_COLLECTIONS",
    },
  });
  const totalNetCollection = existTotalCollPerMonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      flowPercent: parseFloat(
        ((totalPermonth / totalNetCollection) * 100).toFixed(2)
      ),
    },
  });
}

module.exports = {
  otherChargesPermonthCal,
  otherChargesTotalCal,
  otherChargesPercentCal,
};
