const Prisma = require("../config/db.connect");
const { devidePerMonth } = require("./budget.calculation");

async function createBudgetTotalInstance(name, businessId, userId) {
  const existData = await Prisma.businessResult.findFirst({
    where: {
      name: name,
      businessId: businessId,
      userId: userId,
    },
  });
  if (existData) {
    return;
  }

  const newBusinessResult = await Prisma.businessResult.create({
    data: {
      name: name,
      businessId: businessId,
      userId: userId,
    },
  });
  await devidePerMonth(name, totalFirstYear, null, newBusinessResult?.id);
}

module.exports = createBudgetTotalInstance;
