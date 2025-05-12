const Prisma = require("../config/db.connect");

async function devidePerMonth(name, value, categoryId, businessResultId) {
  const perMonthValue = parseFloat((value / 12).toFixed(2));
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

  let existResult;
  if (categoryId) {
    existResult = await Prisma.permonth.findFirst({
      where: {
        categoryId: categoryId,
        ownername: name,
      },
    });
  }

  if (businessResultId) {
    existResult = await Prisma.permonth.findFirst({
      where: {
        businessResultId: businessResultId,
        ownername: name,
      },
    });
  }

  if (existResult) {
    return;
  }

  const data = monthNames.map((month) => ({
    name: month,
    value: Math.ceil(perMonthValue),
    categoryId: categoryId ? categoryId : null,
    businessResultId: businessResultId ? businessResultId : null,
    ownername: name,
  }));

  await Prisma.permonth.createMany({ data });
}

async function updatePerMonthForBusinessRes(value, businessResultId) {
  const perMonthValue = parseFloat((value / 12).toFixed(2));
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

  const existingMonths = await Prisma.permonth.findMany({
    where: { businessResultId },
    orderBy: { name: "asc" },
  });

  for (const month of existingMonths) {
    if (monthNames.includes(month.name)) {
      await Prisma.permonth.update({
        where: { id: month.id },
        data: {
          value: Math.ceil(perMonthValue),
        },
      });
    }
  }
}

async function createCumulativePerMonth(update, userId, businessId) {
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

  const operatingProfitResult = await Prisma.businessResult.findFirst({
    where: {
      businessId: businessId,
      userId: userId,
      name: "OPERATING_PROFIT",
    },
  });

  const perMonths = await Prisma.permonth.findMany({
    where: {
      businessResultId: operatingProfitResult.id,
    },
  });

  const monthValues = {};
  for (const month of monthNames) {
    monthValues[month] = 0;
  }

  for (const item of perMonths) {
    const monthName = item.name;
    if (monthValues.hasOwnProperty(monthName)) {
      monthValues[monthName] += item.value || 0;
    }
  }

  const cumulativeResult = {};
  let cumulativeSum = 0;
  for (const month of monthNames) {
    cumulativeSum += monthValues[month];
    cumulativeResult[month] = cumulativeSum;
  }

  if (update) {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        userId: userId,
        businessId: businessId,
        name: "CUMULATIVE_RESULT",
      },
    });
    const id = existResult?.id;
    await Prisma.businessResult.update({
      where: {
        id: id,
      },
      data: {
        secondYear: Math.ceil((operatingProfitResult.secondYear ?? 0) + 0),
        deviation: Math.ceil(
          (operatingProfitResult.secondYear ?? 0) +
            (operatingProfitResult.deviation ?? 0)
        ),
        expectedPercent: 0,
      },
    });
    for (const month of monthNames) {
      await Prisma.permonth.updateMany({
        where: {
          businessResultId: id,
          name: month, // also match month name!
        },
        data: {
          value: Math.ceil(cumulativeResult[month]),
        },
      });
    }
  } else {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        userId: userId,
        businessId: businessId,
        name: "CUMULATIVE_RESULT",
      },
    });
    if (existResult) {
      return;
    }
    const newResult = await Prisma.businessResult.create({
      data: {
        userId: userId,
        businessId: businessId,
        name: "CUMULATIVE_RESULT",
        secondYear: Math.ceil((operatingProfitResult.secondYear ?? 0) + 0),
        deviation: Math.ceil(
          (operatingProfitResult.secondYear ?? 0) +
            (operatingProfitResult.deviation ?? 0)
        ),
        expectedPercent: 0,
      },
    });
    const createData = monthNames.map((month) => ({
      name: month,
      value: cumulativeResult[month],
      businessResultId: newResult.id,
      ownername: "CUMULATIVE_RESULT",
    }));

    await Prisma.permonth.createMany({
      data: createData,
    });
  }
}

async function categoryTotalCal(categories, name, businessId, userId, update) {
  const totalFirstYear = categories.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );

  const totalSecondYear = categories.reduce(
    (sum, item) => sum + (item.secondYear || 0),
    0
  );
  const totalDeviation = categories.reduce(
    (sum, item) => sum + (item.deviation || 0),
    0
  );
  const totalExpectedPercent = parseFloat(
    ((totalSecondYear / totalFirstYear - 1) * 100).toFixed(2)
  );

  if (update) {
    const existBusinessResult = await Prisma.businessResult.findFirst({
      where: {
        businessId: businessId,
        userId: userId,
        name: name,
      },
    });

    await Prisma.businessResult.update({
      where: {
        id: existBusinessResult?.id,
      },
      data: {
        firstYear: Math.ceil(totalFirstYear),
        secondYear: Math.ceil(totalSecondYear),
        deviation: Math.ceil(totalDeviation),
        expectedPercent: totalExpectedPercent,
      },
    });
    await updatePerMonthForBusinessRes(totalFirstYear, existBusinessResult?.id);
  } else {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        name: name,
        businessId: businessId,
        userId: userId,
      },
    });
    if (existResult) {
      return;
    }
    const newBusinessResult = await Prisma.businessResult.create({
      data: {
        name: name,
        firstYear: Math.ceil(totalFirstYear),
        secondYear: Math.ceil(totalSecondYear),
        deviation: Math.ceil(totalDeviation),
        expectedPercent: totalExpectedPercent,
        businessId: businessId,
        userId: userId,
      },
    });
    await devidePerMonth(name, totalFirstYear, null, newBusinessResult?.id);
  }
}

async function categoryFlowPercentCal(userId, businessId) {
  const existCapital = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_CAPITAL_INCRIEASE_LOAN",
    },
  });
  const existCapitalAll = await Prisma.category.findMany({
    where: {
      userId,
      businessId,
      category: "CAPITAL_INCRIEASE_LOAN",
    },
  });

  const existTotal = existCapital?.firstYear;

  for (const per of existCapitalAll) {
    const percent = parseFloat(((per.firstYear / existTotal) * 100).toFixed(2));
    await Prisma.category.update({
      where: { id: per.id },
      data: { flowPercent: percent },
    });
  }
}

async function categoryTotalFlowPercentCal(userId, businessId) {
  const totalOperatingPayment = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_OPERATING_PAYMENTS",
    },
  });

  const opreativePayment = totalOperatingPayment?.total;

  const costOfsales = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_COST_OF_SALES",
    },
  });

  const personal = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_PERSOANL_EXPENSES",
    },
  });
  const extraordinary = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_EXTRAORDINARY_EXPENSES",
    },
  });

  await Prisma.businessResult.update({
    where: {
      id: costOfsales?.id,
    },
    data: {
      flowPercent: parseFloat(
        ((costOfsales?.firstYear / opreativePayment) * 100).toFixed(2)
      ),
    },
  });

  await Prisma.businessResult.update({
    where: {
      id: personal?.id,
    },
    data: {
      flowPercent: parseFloat(
        ((personal?.firstYear / opreativePayment) * 100).toFixed(2)
      ),
    },
  });

  await Prisma.businessResult.update({
    where: {
      id: extraordinary?.id,
    },
    data: {
      flowPercent: parseFloat(
        ((extraordinary?.firstYear / opreativePayment) * 100).toFixed(2)
      ),
    },
  });
}

async function updateCategoryAll(categoryId) {
  const existCategory = await Prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  const perMonths = await Prisma.permonth.findMany({
    where: {
      categoryId: categoryId,
    },
  });
  const firstYear = perMonths.reduce((sum, item) => sum + (item.value || 0), 0);

  const secondYear =
    (Number(firstYear) * Number(existCategory?.expectedPercent)) / 100 +
    Number(firstYear);
  const deviation = secondYear - Number(firstYear);

  await Prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      firstYear: Math.ceil(firstYear),
      secondYear: Math.ceil(secondYear),
      deviation: Math.ceil(deviation),
    },
  });
}

module.exports = {
  devidePerMonth,
  categoryTotalCal,
  createCumulativePerMonth,
  categoryFlowPercentCal,
  categoryTotalFlowPercentCal,
  updatePerMonthForBusinessRes,
  updateCategoryAll,
};
