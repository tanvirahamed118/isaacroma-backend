const Prisma = require("../config/db.connect");

async function operatingProfiteCal(businessId, userId) {
  const existResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "OPERATING_PROFIT",
    },
  });

  await operatingPermonthCal(businessId, userId, existResult?.id);

  const operatingPermonth = await Prisma.permonth.findMany({
    where: {
      ownername: "OPERATING_PROFIT",
      businessResultId: existResult?.id,
    },
  });
  const firstYearOperatingProfit = operatingPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const directResult = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "DIRECT_RESULT",
    },
  });

  const otherIncomeExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "OTHER_INCOME_EXPENSES",
    },
  });

  const salesForeCast = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "MONTHLY_SALES_FORECAST",
    },
  });

  const totalProjection =
    directResult?.projection + otherIncomeExpense?.firstYear;

  const secondYearDirectResult = directResult?.secondYear;
  const secondOtherIncomeExpense = otherIncomeExpense?.secondYear;
  const secondYearOperatingProfit = parseFloat(
    (secondYearDirectResult + secondOtherIncomeExpense).toFixed(2)
  );
  const expectedPercent = parseFloat(
    ((secondYearOperatingProfit / totalProjection - 1) * 100).toFixed(2)
  );
  const budgetPercent = parseFloat(
    (firstYearOperatingProfit / salesForeCast?.firstYear).toFixed(2)
  );

  const deviation = parseFloat(
    (directResult?.deviation + otherIncomeExpense?.deviation).toFixed(2)
  );

  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      firstYear: Math.ceil(firstYearOperatingProfit),
      projection: Math.ceil(totalProjection),
      secondYear: Math.ceil(secondYearOperatingProfit),
      expectedPercent: expectedPercent,
      budgetPercent: Math.ceil(budgetPercent * 100),
      deviation: Math.ceil(deviation),
    },
  });
}

async function operatingPermonthCal(businessId, userId, businessResId) {
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
  const directRes = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "DIRECT_RESULT",
    },
  });
  const directResPermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: directRes?.id,
    },
  });
  const otherIncome = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "OTHER_INCOME_EXPENSES",
    },
  });
  const otherIncomePermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: otherIncome?.id,
    },
  });

  for (const month of monthNames) {
    const directValue = directResPermonth.find((item) => item.name === month);
    const otherValue = otherIncomePermonth.find((item) => item.name === month);
    const total = Math.ceil(directValue.value + otherValue.value);
    const existMonth = await Prisma.permonth.findFirst({
      where: {
        name: month,
        ownername: "OPERATING_PROFIT",
        businessResultId: businessResId,
      },
    });

    await Prisma.permonth.update({
      where: {
        id: existMonth?.id,
      },
      data: {
        value: total,
      },
    });
  }
}

module.exports = operatingProfiteCal;
