const Prisma = require("../config/db.connect");

async function salesForeCastCal(businessId, userId) {
  const existBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "MONTHLY_SALES_FORECAST",
    },
  });
  await salesForcastPermonth(
    "INCOME",
    businessId,
    userId,
    "MONTHLY_SALES_FORECAST",
    existBusinessResult?.id
  );
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
}

async function salesForcastPermonth(
  type,
  businessId,
  userId,
  resultName,
  businessResultId
) {
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
  const allPerMonths = await Prisma.category.findMany({
    where: {
      type: type,
      businessId,
      userId,
    },
    include: {
      permonths: true,
    },
  });
  const allPerMonthItems = allPerMonths.flatMap((item) => item.permonths);
  for (const month of monthNames) {
    const specificMonth = allPerMonthItems?.filter(
      (item) => item?.name === month
    );

    let totalPermonth = specificMonth.reduce(
      (sum, item) => sum + (item.value || 0),
      0
    );
    const existPermonth = await Prisma.permonth.findFirst({
      where: {
        name: month,
        ownername: resultName,
        businessResultId: businessResultId,
      },
    });
    await Prisma.permonth.update({
      where: {
        id: existPermonth?.id,
      },
      data: {
        value: totalPermonth,
      },
    });
  }
}

module.exports = salesForeCastCal;
