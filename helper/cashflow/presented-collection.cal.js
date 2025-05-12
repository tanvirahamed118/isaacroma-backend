const Prisma = require("../../config/db.connect");

async function presentedCollPermonthCal(businessId, userId, cashflowId) {
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

  const existbusinessResult = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_SALES_REVENUE",
    },
  });

  const existSales = await Prisma.permonth.findMany({
    where: {
      businessResultId: existbusinessResult?.id,
      ownername: "TOTAL_SALES_REVENUE",
    },
  });

  const existPrevBalanceCashflow = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "PREVIOUS_BALANCE",
    },
  });

  const existPrevBalance = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: existPrevBalanceCashflow?.id,
      ownername: "PREVIOUS_BALANCE",
    },
  });

  const perMonthCal = {};

  for (const month of monthNames) {
    const salesMonth = existSales.find((item) => item.name === month);
    const prevBalanceMonth = existPrevBalance.find(
      (item) => item.name === month
    );
    const value = parseFloat(
      (salesMonth.value + prevBalanceMonth.value).toFixed(2)
    );
    perMonthCal[month] = value ? value : 0;
  }

  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_PERCENT_FOR_COLLECTION",
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

async function presentedCollTotalCal(cashflowId) {
  const existPresentedPerMonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });
  const totalPresendtedCollections = existPresentedPerMonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      total: parseFloat(totalPresendtedCollections.toFixed(2)),
    },
  });
}

async function presentedCollPercentCal(cashflowId, businessId) {
  const existPresentedPerMonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });
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

  const totalPresendtedCollections = existPresentedPerMonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
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
        ((totalPresendtedCollections / totalNetCollection) * 100).toFixed(2)
      ),
    },
  });
}

module.exports = {
  presentedCollPermonthCal,
  presentedCollTotalCal,
  presentedCollPercentCal,
};
