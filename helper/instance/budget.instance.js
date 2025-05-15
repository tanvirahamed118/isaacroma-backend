const Prisma = require("../../config/db.connect");
const { devidePerMonth } = require("../budget.calculation");

async function budgetInstance(userId, businessId) {
  const allNames = [
    "TOTAL_PAYMENT_FOR_MONTH",
    "MONTHLY_SALES_FORECAST",
    "TOTAL_SALES_REVENUE",
    "TOTAL_CAPITAL_INCRIEASE_LOAN",
    "TOTAL_EXPENSES",
    "TOTAL_COST_OF_SALES",
    "TOTAL_SHOPPING",
    "TOTAL_EXTRAORDINARY_EXPENSES",
    "TOTAL_PERSOANL_EXPENSES",
    "TOTAL_FINIANCIAL_EXPENSES",
    "DIRECT_EXPENSES",
    "EBITDA",
    "BUDGET_DEPRECIATION",
    "PROJECTION_DEPRECIATION",
    "DIRECT_RESULT",
    "OTHER_INCOME_EXPENSES",
    "OPERATING_PROFIT",
    "CUMULATIVE_RESULT",
  ];

  for (let i = 0; i < allNames?.length; i++) {
    const newRes = await Prisma.businessResult.create({
      data: {
        firstYear: 0,
        secondYear: 0,
        budgetPercent: 0,
        expectedPercent: 0,
        flowPercent: 0,
        deviation: 0,
        businessId: businessId,
        userId: userId,
        name: allNames[i],
      },
    });
    await devidePerMonth(allNames[i], 0, null, newRes?.id);
  }
}

module.exports = budgetInstance;
