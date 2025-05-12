const Prisma = require("../config/db.connect");
const {
  devidePerMonth,
  updatePerMonthForBusinessRes,
} = require("./budget.calculation");

async function totalExpensesCal(update, businessId, userId) {
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

  if (update) {
    const existBusinessResult = await Prisma.businessResult.findFirst({
      where: {
        businessId: businessId,
        userId: userId,
        name: "TOTAL_EXPENSES",
      },
    });

    await Prisma.businessResult.update({
      where: {
        id: existBusinessResult?.id,
      },
      data: {
        firstYear: Math.ceil(totalFirstYearExpense),
      },
    });
    await updatePerMonthForBusinessRes(
      totalFirstYearExpense,
      existBusinessResult?.id
    );
  } else {
    const existResult = await Prisma.businessResult.findFirst({
      where: {
        userId: userId,
        businessId: businessId,
        name: "TOTAL_EXPENSES",
      },
    });
    if (existResult) {
      return;
    }
    const newResult = await Prisma.businessResult.create({
      data: {
        businessId: businessId,
        name: "TOTAL_EXPENSES",
        firstYear: Math.ceil(totalFirstYearExpense),
        userId: userId,
      },
    });
    await devidePerMonth(
      "TOTAL_EXPENSES",
      totalFirstYearExpense,
      null,
      newResult?.id
    );
  }
}

module.exports = totalExpensesCal;
