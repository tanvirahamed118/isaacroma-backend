const Prisma = require("../config/db.connect");
const { updatePerMonthForBusinessRes } = require("./budget.calculation");

async function otherIncomeExpenseCal(businessId, userId) {
  const totalCapitalIncrease = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_CAPITAL_INCRIEASE_LOAN",
    },
  });
  const totalFinancial = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_FINIANCIAL_EXPENSES",
    },
  });

  const salesForeCast = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "MONTHLY_SALES_FORECAST",
    },
  });

  const firstYearOtherIncomeExpense = parseFloat(
    (totalCapitalIncrease?.firstYear - totalFinancial?.firstYear).toFixed(2)
  );
  const budgetPercentIncomeExpense = parseFloat(
    ((firstYearOtherIncomeExpense / salesForeCast?.firstYear) * 100).toFixed(2)
  );
  const secondYearOtherIncomeExpense = parseFloat(
    (totalCapitalIncrease?.secondYear - totalFinancial?.secondYear).toFixed(2)
  );
  const expectedPercentOtherIncomeExpense = parseFloat(
    (
      (secondYearOtherIncomeExpense / firstYearOtherIncomeExpense - 1) *
      100
    ).toFixed(2)
  );
  const deviationOtherIncomeExpense = parseFloat(
    (totalCapitalIncrease.deviation - totalFinancial?.deviation).toFixed(2)
  );

  const existResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "OTHER_INCOME_EXPENSES",
    },
  });
  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      firstYear: Math.ceil(firstYearOtherIncomeExpense),
      secondYear: Math.ceil(secondYearOtherIncomeExpense),
      expectedPercent: expectedPercentOtherIncomeExpense,
      budgetPercent: budgetPercentIncomeExpense,
      deviation: Math.ceil(deviationOtherIncomeExpense),
    },
  });
  await updatePerMonthForBusinessRes(
    firstYearOtherIncomeExpense,
    existResult?.id
  );
}

module.exports = otherIncomeExpenseCal;
