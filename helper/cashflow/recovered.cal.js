const Prisma = require("../../config/db.connect");

async function recoveredPermonthCal(cashflowId, businessId) {
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
  const eixstRecovered = await Prisma.cashflow.findFirst({
    where: {
      id: cashflowId,
      name: "RECOVERED_PERCENT",
    },
  });
  const existUnpainRes = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "UNPAIN_PERCENT",
    },
  });
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: existUnpainRes?.id,
      ownername: "UNPAIN_PERCENT",
    },
  });

  const perMonthCal = {};

  for (const month of monthNames) {
    const perMonth = existPermonth.find((item) => item.name === month);
    const value = parseFloat(
      ((-perMonth.value * eixstRecovered?.inputPercent) / 100).toFixed(2)
    );
    perMonthCal[month] = value ? value : 0;
  }

  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "RECOVERED_PERCENT",
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

async function recoveredTotalCal(cashflowId) {
  const existPermonthRecovered = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "RECOVERED_PERCENT",
    },
  });
  const recoveredTotal = existPermonthRecovered.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      total: parseFloat(recoveredTotal.toFixed(2)),
    },
  });
}

async function recoveredPercentCal(cashflowId, businessId) {
  const existPermonthRecovered = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "RECOVERED_PERCENT",
    },
  });
  const recoveredTotal = existPermonthRecovered.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const presentedPerMonth = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });
  const existPresentedPerMonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: presentedPerMonth?.id,
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
      flowPercent: parseFloat(
        ((recoveredTotal / totalPresendtedCollections) * 100).toFixed(2)
      ),
    },
  });
}

module.exports = {
  recoveredPermonthCal,
  recoveredTotalCal,
  recoveredPercentCal,
};
