const Prisma = require("../config/db.connect");

async function personalExpenseBudgetPercentCal(userId, businessId) {
  const existTotalExpense = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_EXPENSES",
    },
  });

  const totalExpense = existTotalExpense.firstYear;

  const allPersonalExpense = await Prisma.category.findMany({
    where: {
      userId,
      businessId,
      category: "PERSOANL",
    },
  });
  for (const per of allPersonalExpense) {
    const percent = parseFloat(
      ((per.firstYear / totalExpense) * 100).toFixed(2)
    );
    await Prisma.category.update({
      where: { id: per.id },
      data: { budgetPercent: percent },
    });
  }
}

async function extraordinaryExpensebudgetPercentCal(userId, businessId) {
  const existTotalExpense = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_EXPENSES",
    },
  });

  const totalExpense = existTotalExpense.firstYear;

  const allPersonalExpense = await Prisma.category.findMany({
    where: {
      userId,
      businessId,
      category: "EXTRAORDINARY",
    },
  });

  for (const per of allPersonalExpense) {
    const percent = parseFloat(
      ((per.firstYear / totalExpense) * 100).toFixed(2)
    );
    await Prisma.category.update({
      where: { id: per.id },
      data: { budgetPercent: percent },
    });
  }
}

async function financialExpenseBudgetPercentCal(userId, businessId) {
  const existTotalExpense = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_EXPENSES",
    },
  });

  const totalExpense = existTotalExpense.firstYear;

  const allPersonalExpense = await Prisma.category.findMany({
    where: {
      userId,
      businessId,
      category: "FINIANCIAL",
    },
  });

  for (const per of allPersonalExpense) {
    const percent = parseFloat(
      ((per.firstYear / totalExpense) * 100).toFixed(2)
    );
    await Prisma.category.update({
      where: { id: per.id },
      data: { budgetPercent: percent },
    });
  }
}

async function costOfSalesExpenseBudgetPercentCal(userId, businessId) {
  const existTotalExpense = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_EXPENSES",
    },
  });

  const totalExpense = existTotalExpense.firstYear;

  const allPersonalExpense = await Prisma.category.findMany({
    where: {
      userId,
      businessId,
      category: "COST_OF_SALES",
    },
  });

  for (const per of allPersonalExpense) {
    const percent = parseFloat(
      ((per.firstYear / totalExpense) * 100).toFixed(2)
    );
    await Prisma.category.update({
      where: { id: per.id },
      data: { budgetPercent: percent },
    });
  }
}

async function categoryBudgerPercentCal(userId, businessId) {
  await personalExpenseBudgetPercentCal(userId, businessId);
  await extraordinaryExpensebudgetPercentCal(userId, businessId);
  await financialExpenseBudgetPercentCal(userId, businessId);
  await costOfSalesExpenseBudgetPercentCal(userId, businessId);
}

module.exports = categoryBudgerPercentCal;
