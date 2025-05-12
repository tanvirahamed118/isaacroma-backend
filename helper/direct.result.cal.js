const Prisma = require("../config/db.connect");
const {
  devidePerMonth,
  updatePerMonthForBusinessRes,
} = require("./budget.calculation");

async function directResultCal(update, businessId, userId) {
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
  const budgetDeprecation = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "BUDGET_DEPRECIATION",
    },
  });
  const directExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "DIRECT_EXPENSES",
    },
  });
  const firstYearDirectResult = parseFloat(
    (
      totalSalesRevenue?.firstYear -
      directExpense?.firstYear -
      budgetDeprecation?.firstYear
    ).toFixed(2)
  );
  const budgetPercentDirectResult = parseFloat(
    ((firstYearDirectResult / salesForeCast?.firstYear) * 100).toFixed(2)
  );
  const secondYearDirectResult = parseFloat(
    (
      totalSalesRevenue?.secondYear -
      directExpense?.secondYear -
      projectionDeprecation?.secondYear
    ).toFixed(2)
  );

  const expectedPercentDirectResult = parseFloat(
    ((secondYearDirectResult / firstYearDirectResult - 1) * 100).toFixed(2)
  );

  const totalDeprecationDirectResult = parseFloat(
    (
      totalSalesRevenue.deviation -
      directExpense.deviation -
      projectionDeprecation.deviation
    ).toFixed(2)
  );

  if (update) {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        businessId: businessId,
        userId: userId,
        name: "DIRECT_RESULT",
      },
    });
    await Prisma.businessResult.update({
      where: {
        id: existResult?.id,
      },
      data: {
        firstYear: Math.ceil(firstYearDirectResult),
        secondYear: Math.ceil(secondYearDirectResult),
        expectedPercent: expectedPercentDirectResult,
        budgetPercent: Math.ceil(budgetPercentDirectResult),
        deviation: Math.ceil(totalDeprecationDirectResult),
      },
    });
    await updatePerMonthForBusinessRes(firstYearDirectResult, existResult?.id);
  } else {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        userId: userId,
        businessId: businessId,
        name: "DIRECT_RESULT",
      },
    });
    if (existResult) {
      return;
    }
    const newResult = await Prisma.businessResult.create({
      data: {
        name: "DIRECT_RESULT",
        firstYear: Math.ceil(firstYearDirectResult),
        secondYear: Math.ceil(secondYearDirectResult),
        expectedPercent: expectedPercentDirectResult,
        budgetPercent: Math.ceil(budgetPercentDirectResult),
        deviation: Math.ceil(totalDeprecationDirectResult),
        businessId: businessId,
        userId: userId,
      },
    });
    await devidePerMonth(
      "DIRECT_RESULT",
      firstYearDirectResult,
      null,
      newResult?.id
    );
  }
}

module.exports = directResultCal;
