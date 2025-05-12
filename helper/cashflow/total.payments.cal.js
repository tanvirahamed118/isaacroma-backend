const Prisma = require("../../config/db.connect");

async function totalPaymentPermonthCal(cashflowId, businessId) {
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
  const totalOperating = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_OPERATING_PAYMENTS",
    },
  });
  const totalOtherPayment = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_OTHER_PAYMENTS",
    },
  });
  const existTotalOperating = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: totalOperating?.id,
      ownername: "TOTAL_OPERATING_PAYMENTS",
    },
  });
  const existTotalOtherPayment = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: totalOtherPayment?.id,
      ownername: "TOTAL_OTHER_PAYMENTS",
    },
  });

  let perMonthCal = {};
  for (const month of monthNames) {
    const perMonthOperating = existTotalOperating.find(
      (item) => item.name === month
    );
    const perMonthTOtalPayment = existTotalOtherPayment.find(
      (item) => item.name === month
    );
    const value = parseFloat(
      (perMonthOperating.value + perMonthTOtalPayment.value).toFixed(2)
    );
    perMonthCal[month] = value ? value : 0;
  }

  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_PAYMENTS",
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

async function totalPaymentTotalCal(cashflowId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "TOTAL_PAYMENTS",
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

module.exports = { totalPaymentPermonthCal, totalPaymentTotalCal };
