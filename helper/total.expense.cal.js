const Prisma = require("../config/db.connect");

async function totalExpensesCal(businessId, userId) {
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
  const totalCostOfSales = costOfsales.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const totalExtraordinary = extraordinary.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const totalPersonal = personal.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const totalFinancial = finalncial.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const totalFirstYearExpense = parseFloat(
    (
      totalCostOfSales +
      totalExtraordinary +
      totalPersonal +
      totalFinancial
    ).toFixed(2)
  );

  const existBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "TOTAL_EXPENSES",
    },
  });
  await updateTotalExpensePermonth(
    "EXPENSE",
    businessId,
    userId,
    "TOTAL_EXPENSES",
    existBusinessResult?.id
  );
  await Prisma.businessResult.update({
    where: {
      id: existBusinessResult?.id,
    },
    data: {
      firstYear: Math.ceil(totalFirstYearExpense),
    },
  });
}

async function updateTotalExpensePermonth(
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

module.exports = totalExpensesCal;
