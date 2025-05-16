const Prisma = require("../config/db.connect");

async function directResultCal(businessId, userId) {
  const totalSalesRevenue = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_SALES_REVENUE",
    },
  });
  const salesForeCast = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "MONTHLY_SALES_FORECAST",
    },
  });
  const projectionDeprecation = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "PROJECTION_DEPRECIATION",
    },
  });

  const directExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "DIRECT_EXPENSES",
    },
  });

  const existResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "DIRECT_RESULT",
    },
  });
  await directResultPermonthCal(businessId, userId, existResult?.id);
  const directResultPermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: existResult?.id,
      ownername: "DIRECT_RESULT",
    },
  });

  const firstYearDirectResult = directResultPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const budgetPercentDirectResult = parseFloat(
    ((firstYearDirectResult / salesForeCast?.firstYear) * 100).toFixed(2)
  );
  const projectionDirectResult = parseFloat(
    (
      totalSalesRevenue?.firstYear -
      directExpense?.firstYear -
      projectionDeprecation?.firstYear
    ).toFixed(2)
  );
  const secondYearDirectResult = parseFloat(
    (
      totalSalesRevenue?.secondYear -
      directExpense?.secondYear -
      projectionDeprecation?.secondYear
    ).toFixed(2)
  );

  const expectedPercentDirectResult = parseFloat(
    ((secondYearDirectResult / existResult?.projection - 1) * 100).toFixed(2)
  );

  const totalDeprecationDirectResult = parseFloat(
    (
      totalSalesRevenue.deviation -
      directExpense.deviation -
      projectionDeprecation.deviation
    ).toFixed(2)
  );

  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      firstYear: Math.ceil(firstYearDirectResult),
      projection: Math.ceil(projectionDirectResult),
      secondYear: Math.ceil(secondYearDirectResult),
      expectedPercent: expectedPercentDirectResult,
      budgetPercent: Math.ceil(budgetPercentDirectResult),
      deviation: Math.ceil(totalDeprecationDirectResult),
    },
  });
}

async function directResultPermonthCal(businessId, userId, businessResId) {
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
  const totalSalesRev = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_SALES_REVENUE",
    },
  });
  const totalSalesPermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: totalSalesRev?.id,
    },
  });
  const directExpense = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "DIRECT_EXPENSES",
    },
  });
  const directExpensePermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: directExpense?.id,
    },
  });
  const depriation = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "BUDGET_DEPRECIATION",
    },
  });
  const depriationPermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: depriation?.id,
    },
  });

  for (const month of monthNames) {
    const depValue = depriationPermonth.find((item) => item.name === month);
    const salesValue = totalSalesPermonth.find((item) => item.name === month);
    const directValue = directExpensePermonth.find(
      (item) => item.name === month
    );
    const total = Math.ceil(
      salesValue.value - directValue.value - depValue.value
    );
    const existMonth = await Prisma.permonth.findFirst({
      where: {
        name: month,
        ownername: "DIRECT_RESULT",
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

module.exports = directResultCal;
