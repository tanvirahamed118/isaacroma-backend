const Prisma = require("../../config/db.connect");

async function otherPaymentPermonthCal(userId, businessId, cashflowId) {
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
  const existbusinessRes = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "OTHER_INCOME_EXPENSES",
    },
  });
  const existOtherIncomeExpense = await Prisma.permonth.findMany({
    where: {
      businessResultId: existbusinessRes?.id,
      ownername: "OTHER_INCOME_EXPENSES",
    },
  });
  let perMonthCal = {};

  for (const month of monthNames) {
    const existPermonth = existOtherIncomeExpense.find(
      (item) => item.name === month
    );

    perMonthCal[month] = existPermonth.value ? existPermonth.value : 0;
  }
  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_OTHER_PAYMENTS",
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

async function otherPaymentTotalCal(cashflowId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_OTHER_PAYMENTS",
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
      total: Math.ceil(totalPermonth),
    },
  });
}

async function otherPaymentPercentCal(cashflowId, businessId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "TOTAL_OTHER_PAYMENTS",
    },
  });
  const totalPermonth = existPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const totalPayment = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_PAYMENTS",
    },
  });
  const existTotalPayment = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: totalPayment?.id,
      ownername: "TOTAL_PAYMENTS",
    },
  });
  const totalPaymentPermonth = existTotalPayment.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      flowPercent: parseFloat(
        ((totalPermonth / totalPaymentPermonth) * 100).toFixed(2)
      ),
    },
  });
}

module.exports = {
  otherPaymentPermonthCal,
  otherPaymentTotalCal,
  otherPaymentPercentCal,
};
