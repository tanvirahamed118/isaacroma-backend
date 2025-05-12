const Prisma = require("../config/db.connect");
const {
  devidePerMonth,
  updatePerMonthForBusinessRes,
} = require("./budget.calculation");

async function operatingProfiteCal(update, businessId, userId) {
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
  const firstYearDirectResult = directResult?.firstYear;
  const secondYearDirectResult = directResult?.secondYear;
  const firstOtherIncomeExpense = otherIncomeExpense?.firstYear;
  const secondOtherIncomeExpense = otherIncomeExpense?.secondYear;
  const firstYearOperatingProfit = parseFloat(
    (firstYearDirectResult + firstOtherIncomeExpense).toFixed(2)
  );
  const secondYearOperatingProfit = parseFloat(
    (secondYearDirectResult + secondOtherIncomeExpense).toFixed(2)
  );
  const expectedPercent = parseFloat(
    ((secondYearOperatingProfit / firstYearOperatingProfit - 1) * 100).toFixed(
      2
    )
  );
  const budgetPercent = parseFloat(
    (firstYearOperatingProfit / salesForeCast?.firstYear).toFixed(2)
  );

  const deviation = parseFloat(
    (directResult?.deviation + otherIncomeExpense?.deviation).toFixed(2)
  );
  if (update) {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        businessId: businessId,
        userId: userId,
        name: "OPERATING_PROFIT",
      },
    });
    await Prisma.businessResult.update({
      where: {
        id: existResult?.id,
      },
      data: {
        firstYear: Math.ceil(firstYearOperatingProfit),
        secondYear: Math.ceil(secondYearOperatingProfit),
        expectedPercent: expectedPercent,
        budgetPercent: Math.ceil(budgetPercent * 100),
        deviation: Math.ceil(deviation),
      },
    });
    await updatePerMonthForBusinessRes(
      firstYearOperatingProfit,
      existResult?.id
    );
  } else {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        userId: userId,
        businessId: businessId,
        name: "OPERATING_PROFIT",
      },
    });
    if (existResult) {
      return;
    }
    const newResult = await Prisma.businessResult.create({
      data: {
        name: "OPERATING_PROFIT",
        firstYear: Math.ceil(firstYearOperatingProfit),
        secondYear: Math.ceil(secondYearOperatingProfit),
        expectedPercent: expectedPercent,
        budgetPercent: Math.ceil(budgetPercent * 100),
        deviation: Math.ceil(deviation),
        businessId: businessId,
        userId: userId,
      },
    });
    await devidePerMonth(
      "OPERATING_PROFIT",
      firstYearOperatingProfit,
      null,
      newResult?.id
    );
  }
}

module.exports = operatingProfiteCal;
