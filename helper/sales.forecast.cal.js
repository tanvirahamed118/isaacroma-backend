const Prisma = require("../config/db.connect");
const { updatePerMonthForBusinessRes } = require("./budget.calculation");
async function salesForeCastCal(businessId, userId) {
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
  const secondSalesForecCast = salesRev.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const deviationSalesForecCast = salesRev.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );

  const firstCapitalRevenue = capitalRev.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const secondCapitalRevenue = capitalRev.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const deviationCapitalRevenue = capitalRev.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );

  const secondYearResult = parseFloat(
    (secondSalesForecCast + secondCapitalRevenue).toFixed(2)
  );

  const deviation = Math.ceil(
    parseFloat((deviationSalesForecCast + deviationCapitalRevenue).toFixed(2))
  );

  const firsttotalSalesForecCast = parseInt(
    (firstSalesRevenue + firstCapitalRevenue).toFixed(2)
  );
  const existBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "MONTHLY_SALES_FORECAST",
    },
  });

  await Prisma.businessResult.update({
    where: {
      id: existBusinessResult?.id,
    },
    data: {
      firstYear: Math.ceil(firsttotalSalesForecCast),
      secondYear: Math.ceil(secondYearResult),
      deviation: Math.ceil(deviation),
    },
  });
  await updatePerMonthForBusinessRes(
    firsttotalSalesForecCast,
    existBusinessResult?.id
  );
}

module.exports = salesForeCastCal;
