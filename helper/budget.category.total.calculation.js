const Prisma = require("../config/db.connect");
const { categoryTotalCal } = require("./budget.calculation");

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
