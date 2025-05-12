const Prisma = require("../../config/db.connect");

async function unpaidPermonthCal(cashflowId, businessId) {
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
  const eixstUnpaidRes = await Prisma.cashflow.findFirst({
    where: {
      id: cashflowId,
      name: "UNPAIN_PERCENT",
    },
  });

  const totalCollection = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });

  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: totalCollection?.id,
      ownername: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });

  const perMonthCal = {};

  for (const month of monthNames) {
    const perMonth = existPermonth.find((item) => item.name === month);
    const value = parseFloat(
      ((-perMonth.value * eixstUnpaidRes?.inputPercent) / 100).toFixed(2)
    );
    perMonthCal[month] = value ? value : 0;
  }
  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "UNPAIN_PERCENT",
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

async function unpaidTotalCal(cashflowId) {
  const existPermonthUnpaid = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "UNPAIN_PERCENT",
    },
  });
  const unpaidTotal = existPermonthUnpaid.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      total: parseFloat(unpaidTotal.toFixed(2)),
    },
  });
}

async function unpaidPercentCal(cashflowId, businessId) {
  const existPermonthUnpaid = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "UNPAIN_PERCENT",
    },
  });
  const unpaidTotal = existPermonthUnpaid.reduce(
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
        ((unpaidTotal / totalPresendtedCollections) * 100).toFixed(2)
      ),
    },
  });
}

module.exports = { unpaidPermonthCal, unpaidTotalCal, unpaidPercentCal };
