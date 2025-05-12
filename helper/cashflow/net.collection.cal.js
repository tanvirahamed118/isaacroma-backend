const Prisma = require("../../config/db.connect");

async function netCollectionPermonth(cashflowId, businessId) {
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
  const OtherChanges = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_OTHER_CHARGES",
    },
  });
  const OperatingColl = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_OPERATING_COLLECTION",
    },
  });
  const existOtherChanges = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: OtherChanges?.id,
      ownername: "TOTAL_OTHER_CHARGES",
    },
  });
  const existOperatingColl = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: OperatingColl?.id,
      ownername: "TOTAL_OPERATING_COLLECTION",
    },
  });

  const perMonthCal = {};
  for (const month of monthNames) {
    const otherChargePermonth = existOtherChanges.find(
      (item) => item.name === month
    );
    const operatingPermonth = existOperatingColl.find(
      (item) => item.name === month
    );
    const value = parseFloat(
      (otherChargePermonth.value + operatingPermonth.value).toFixed(2)
    );
    perMonthCal[month] = value ? value : 0;
  }

  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_NET_COLLECTIONS",
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

async function netCollectionTotal(cashflowId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_NET_COLLECTIONS",
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

module.exports = { netCollectionPermonth, netCollectionTotal };
