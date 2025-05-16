const Prisma = require("../config/db.connect");
const { categoryTotalCal } = require("./budget.calculation");
const TotalCategoryPermonthUpdate = require("./total.update.permonth");

async function budgetCategoryTotalCalculation(userId, businessId) {
  const categories = await Prisma.category.findMany({
    where: {
      businessId: businessId,
      userId: userId,
    },
  });
  const salesRevenue = categories.filter(
    (item) => item.category === "SALES_REVENUE"
  );
  const capitalIncrease = categories.filter(
    (item) => item.category === "CAPITAL_INCRIEASE_LOAN"
  );
  const costOfSales = categories.filter(
    (item) => item.category === "COST_OF_SALES"
  );
  const extraordinary = categories.filter(
    (item) => item.category === "EXTRAORDINARY"
  );
  const personal = categories.filter((item) => item.category === "PERSOANL");
  const financial = categories.filter((item) => item.category === "FINIANCIAL");

  // update per month value
  const totalSales = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_SALES_REVENUE",
    },
  });
  const totalCapital = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_CAPITAL_INCRIEASE_LOAN",
    },
  });
  const totalCostOf = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_COST_OF_SALES",
    },
  });
  const totalExtra = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_EXTRAORDINARY_EXPENSES",
    },
  });
  const totalPersonal = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_PERSOANL_EXPENSES",
    },
  });
  const totalFinancial = await Prisma.businessResult.findFirst({
    where: {
      userId,
      businessId,
      name: "TOTAL_FINIANCIAL_EXPENSES",
    },
  });

  await TotalCategoryPermonthUpdate(
    "SALES_REVENUE",
    businessId,
    userId,
    "TOTAL_SALES_REVENUE",
    totalSales?.id
  );
  await TotalCategoryPermonthUpdate(
    "CAPITAL_INCRIEASE_LOAN",
    businessId,
    userId,
    "TOTAL_CAPITAL_INCRIEASE_LOAN",
    totalCapital?.id
  );
  await TotalCategoryPermonthUpdate(
    "COST_OF_SALES",
    businessId,
    userId,
    "TOTAL_COST_OF_SALES",
    totalCostOf?.id
  );
  await TotalCategoryPermonthUpdate(
    "EXTRAORDINARY",
    businessId,
    userId,
    "TOTAL_EXTRAORDINARY_EXPENSES",
    totalExtra?.id
  );
  await TotalCategoryPermonthUpdate(
    "PERSOANL",
    businessId,
    userId,
    "TOTAL_PERSOANL_EXPENSES",
    totalPersonal?.id
  );
  await TotalCategoryPermonthUpdate(
    "FINIANCIAL",
    businessId,
    userId,
    "TOTAL_FINIANCIAL_EXPENSES",
    totalFinancial?.id
  );

  await categoryTotalCal(
    salesRevenue,
    "TOTAL_SALES_REVENUE",
    businessId,
    userId
  );
  await categoryTotalCal(
    capitalIncrease,
    "TOTAL_CAPITAL_INCRIEASE_LOAN",
    businessId,
    userId
  );
  await categoryTotalCal(
    costOfSales,
    "TOTAL_COST_OF_SALES",
    businessId,
    userId
  );
  await categoryTotalCal(
    extraordinary,
    "TOTAL_EXTRAORDINARY_EXPENSES",
    businessId,
    userId
  );
  await categoryTotalCal(
    personal,
    "TOTAL_PERSOANL_EXPENSES",
    businessId,
    userId
  );
  await categoryTotalCal(
    financial,
    "TOTAL_FINIANCIAL_EXPENSES",
    businessId,
    userId
  );
}

module.exports = budgetCategoryTotalCalculation;
