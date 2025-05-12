const Prisma = require("../../config/db.connect");

async function operatingCollPermonthCal(cashflowId, businessId) {
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
  const existPresented = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });
  const existUnpaid = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "UNPAIN_PERCENT",
    },
  });
  const existRecovered = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "RECOVERED_PERCENT",
    },
  });
  const existPresentedPercent = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: existPresented?.id,
      ownername: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });
  const existUnpaidPercent = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: existUnpaid?.id,
      ownername: "UNPAIN_PERCENT",
    },
  });
  const existRecoveredPercent = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: existRecovered?.id,
      ownername: "RECOVERED_PERCENT",
    },
  });
  const perMonthCal = {};
  for (const month of monthNames) {
    const presentedMonth = existPresentedPercent.find(
      (item) => item.name === month
    );
    const unpaidMonth = existUnpaidPercent.find((item) => item.name === month);
    const recoveredMonth = existRecoveredPercent.find(
      (item) => item.name === month
    );
    const value = parseFloat(
      (presentedMonth.value + unpaidMonth.value + recoveredMonth.value).toFixed(
        2
      )
    );
    perMonthCal[month] = value ? value : 0;
  }
  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_OPERATING_COLLECTION",
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

async function operatingCollTotalCal(cashflowId) {
  const existOperationCollection = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_OPERATING_COLLECTION",
    },
  });
  const totalPermonth = existOperationCollection.reduce(
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

async function operatingCollPercentCal(cashflowId, businessId) {
  const existOperationCollection = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_OPERATING_COLLECTION",
    },
  });
  const totalPermonth = existOperationCollection.reduce(
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
  operatingCollPermonthCal,
  operatingCollTotalCal,
  operatingCollPercentCal,
};
