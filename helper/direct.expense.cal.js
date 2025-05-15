const Prisma = require("../config/db.connect");
const { updatePerMonthForBusinessRes } = require("./budget.calculation");

async function directExpenseCal(businessId, userId) {
  const categories = await Prisma.category.findMany({
    where: {
      businessId,
      userId,
    },
  });

  const costOfsales = categories.filter(
    (item) => item.category === "COST_OF_SALES"
  );
  const extraordinary = categories.filter(
    (item) => item.category === "EXTRAORDINARY"
  );
  const personal = categories.filter((item) => item.category === "PERSOANL");
  const finalncial = categories.filter(
    (item) => item.category === "FINIANCIAL"
  );

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
  const firstTotalFinancial = finalncial.reduce(
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

  const costOfsaleDiv = costOfsales.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const extraordinaryDiv = extraordinary.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const personalDiv = personal.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );

  const totalExpense =
    firstTotalCostOfSales +
    firstTotalExtraordinary +
    firstTotalPersonal +
    firstTotalFinancial;
  const firstYearResult = parseFloat(
    (
      firstTotalCostOfSales +
      firstTotalExtraordinary +
      firstTotalPersonal
    ).toFixed(2)
  );
  const secondYearResult = parseFloat(
    (
      secondTotalCostOfSales +
      secondTotalExtraordinary +
      secondTotalPersonal
    ).toFixed()
  );
  const expectedPercent = parseFloat(
    ((secondYearResult / firstYearResult - 1) * 100).toFixed(2)
  );
  const budgetPercent = parseFloat(
    ((firstYearResult / totalExpense) * 100).toFixed(2)
  );
  const totalDeviation = parseFloat(
    (costOfsaleDiv + extraordinaryDiv + personalDiv).toFixed(2)
  );

  const existBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "DIRECT_EXPENSES",
    },
  });
  await Prisma.businessResult.update({
    where: {
      id: existBusinessResult?.id,
    },
    data: {
      firstYear: Math.ceil(firstYearResult),
      secondYear: Math.ceil(secondYearResult),
      expectedPercent: expectedPercent,
      budgetPercent: Math.ceil(budgetPercent),
      deviation: Math.ceil(totalDeviation),
    },
  });
  await updatePerMonthForBusinessRes(firstYearResult, existBusinessResult?.id);
}

module.exports = directExpenseCal;
