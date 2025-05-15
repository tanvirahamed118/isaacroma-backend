const Prisma = require("../config/db.connect");
const { updatePerMonthForBusinessRes } = require("./budget.calculation");

async function ebitdaCal(businessId, userId) {
  const categories = await Prisma.category.findMany({
    where: {
      businessId,
      userId,
    },
  });
  const salesRev = categories.filter(
    (item) => item.category === "SALES_REVENUE"
  );
  const capitalRev = categories.filter(
    (item) => item.category === "CAPITAL_INCRIEASE_LOAN"
  );
  const firstSalesRevenue = salesRev.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const secondSalesRevenue = salesRev.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const deviationSalesRevenue = salesRev.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const costOfsales = categories.filter(
    (item) => item.category === "COST_OF_SALES"
  );
  const extraordinary = categories.filter(
    (item) => item.category === "EXTRAORDINARY"
  );
  const personal = categories.filter((item) => item.category === "PERSOANL");
  const firstTotalCostOfSales = costOfsales.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const firstTotalExtraordinary = extraordinary.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const firstTotalPersonal = personal.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const totalFirstCapitalRev = capitalRev.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );

  const secondTotalCostOfSales = costOfsales.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const secondTotalExtraordinary = extraordinary.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const secondTotalPersonal = personal.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const deviationTotalCostOfSales = costOfsales.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const deviationTotalExtraordinary = extraordinary.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const deviationTotalPersonal = personal.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const totalFirstForecast = totalFirstCapitalRev + firstSalesRevenue;
  const totalFirstDirectExpense =
    firstTotalCostOfSales + firstTotalExtraordinary + firstTotalPersonal;
  const totalSeondDirectExpense =
    secondTotalCostOfSales + secondTotalExtraordinary + secondTotalPersonal;
  const totalDevaitionDirectExpense =
    deviationTotalCostOfSales +
    deviationTotalExtraordinary +
    deviationTotalPersonal;

  //  result calculation
  const firstYearEbitda = parseFloat(
    (firstSalesRevenue - totalFirstDirectExpense).toFixed(2)
  );
  const secondYearEbitda = parseFloat(
    (secondSalesRevenue - totalSeondDirectExpense).toFixed()
  );
  const devationEbitda = parseFloat(
    (deviationSalesRevenue - totalDevaitionDirectExpense).toFixed(2)
  );
  const budgetPercent = parseFloat(
    ((firstYearEbitda / totalFirstForecast) * 100).toFixed(2)
  );
  const expectedPercent = parseFloat(
    ((secondYearEbitda / firstYearEbitda - 1) * 100).toFixed(2)
  );

  const existBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "EBITDA",
    },
  });
  await Prisma.businessResult.update({
    where: {
      id: existBusinessResult?.id,
    },
    data: {
      firstYear: Math.ceil(firstYearEbitda),
      secondYear: Math.ceil(secondYearEbitda),
      expectedPercent: expectedPercent,
      budgetPercent: Math.ceil(budgetPercent),
      deviation: Math.ceil(devationEbitda),
    },
  });
  await updatePerMonthForBusinessRes(firstYearEbitda, existBusinessResult?.id);
}

module.exports = ebitdaCal;
