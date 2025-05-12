const Prisma = require("../config/db.connect");

async function businessResBudgetPercentCal(businessId, userId) {
  const categories = await Prisma.category.findMany({
    where: {
      businessId: businessId,
      userId: userId,
    },
  });

  await costOfSalebudgetPercentCal(categories, businessId, userId);
  await personalbudgetPercentCal(categories, businessId, userId);
  await extraordinarybudgetPercentCal(categories, businessId, userId);
  await financialbudgetPercentCal(categories, businessId, userId);
}

async function costOfSalebudgetPercentCal(categories, businessId, userId) {
  const costOfSales = categories.filter(
    (item) => item.category === "COST_OF_SALES"
  );
  const totalExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_EXPENSES",
    },
  });
  const existResult = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_COST_OF_SALES",
    },
  });
  const firstYear = costOfSales.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const budgetPercent = parseFloat(
    ((firstYear / totalExpense?.firstYear) * 100).toFixed(2)
  );

  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      budgetPercent: budgetPercent,
    },
  });
}

async function personalbudgetPercentCal(categories, businessId, userId) {
  const costOfSales = categories.filter((item) => item.category === "PERSOANL");
  const totalExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_EXPENSES",
    },
  });
  const existResult = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_PERSOANL_EXPENSES",
    },
  });
  const firstYear = costOfSales.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const budgetPercent = parseFloat(
    ((firstYear / totalExpense?.firstYear) * 100).toFixed(2)
  );
  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      budgetPercent: budgetPercent,
    },
  });
}

async function extraordinarybudgetPercentCal(categories, businessId, userId) {
  const costOfSales = categories.filter(
    (item) => item.category === "EXTRAORDINARY"
  );
  const totalExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_EXPENSES",
    },
  });
  const existResult = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_EXTRAORDINARY_EXPENSES",
    },
  });
  const firstYear = costOfSales.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const budgetPercent = parseFloat(
    ((firstYear / totalExpense?.firstYear) * 100).toFixed(2)
  );
  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      budgetPercent: budgetPercent,
    },
  });
}

async function financialbudgetPercentCal(categories, businessId, userId) {
  const costOfSales = categories.filter(
    (item) => item.category === "FINIANCIAL"
  );
  const totalExpense = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_EXPENSES",
    },
  });
  const existResult = await Prisma.businessResult.findFirst({
    where: {
      userId: userId,
      businessId: businessId,
      name: "TOTAL_FINIANCIAL_EXPENSES",
    },
  });
  const firstYear = costOfSales.reduce(
    (sum, item) => sum + (item.firstYear || 0),
    0
  );
  const budgetPercent = parseFloat(
    ((firstYear / totalExpense?.firstYear) * 100).toFixed(2)
  );

  await Prisma.businessResult.update({
    where: {
      id: existResult?.id,
    },
    data: {
      budgetPercent: budgetPercent,
    },
  });
}

async function totalSalesRevFlowPercentCal(businessId, userId) {
  const salesReveniue = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_SALES_REVENUE",
    },
  });
  const totalSales = salesReveniue.firstYear;
  const presentedColl = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_PERCENT_FOR_COLLECTION",
    },
  });
  const totalPresentColl = presentedColl.total;
  const percent = parseFloat(
    ((totalPresentColl / totalSales) * 100).toFixed(2)
  );

  await Prisma.businessResult.update({
    where: {
      id: salesReveniue?.id,
    },
    data: {
      flowPercent: percent,
    },
  });
}

async function otherIncomeExpenseFlowpercentCal(businessId, userId) {
  const otherIncomeExp = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "OTHER_INCOME_EXPENSES",
    },
  });
  const totalIncomeExpense = otherIncomeExp.firstYear;
  const otherPayments = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_OTHER_PAYMENTS",
    },
  });
  const totalOtherPayments = otherPayments.total;
  const percent = parseFloat(
    ((totalIncomeExpense / totalOtherPayments) * 100).toFixed(2)
  );
  await Prisma.businessResult.update({
    where: {
      id: otherIncomeExp?.id,
    },
    data: {
      flowPercent: percent,
    },
  });
}

module.exports = {
  businessResBudgetPercentCal,
  totalSalesRevFlowPercentCal,
  otherIncomeExpenseFlowpercentCal,
};
