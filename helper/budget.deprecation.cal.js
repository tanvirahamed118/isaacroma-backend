const Prisma = require("../config/db.connect");

async function budgetDeprecationCal(businessId, userId) {
  const existbusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "BUDGET_DEPRECIATION",
    },
  });

  const existForeCast = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "MONTHLY_SALES_FORECAST",
    },
  });

  const allPerMonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: existbusinessResult?.id,
    },
  });
  const totalFirstYear = allPerMonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const totalPercent = Math.ceil(
    (totalFirstYear / existForeCast?.firstYear) * 100
  );

  await Prisma.businessResult.update({
    where: {
      id: existbusinessResult?.id,
    },
    data: {
      firstYear: Math.ceil(totalFirstYear),
      budgetPercent: totalPercent,
    },
  });
}

module.exports = budgetDeprecationCal;
