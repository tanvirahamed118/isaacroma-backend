const Prisma = require("../config/db.connect");

async function projectionDeprecationCal(businessId, userId) {
  const existbusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "PROJECTION_DEPRECIATION",
    },
  });
  const firstYearResult = parseFloat(
    (
      existbusinessResult?.expectedPercent +
      existbusinessResult?.secondYear +
      existbusinessResult?.deviation
    ).toFixed(2)
  );
  await Prisma.businessResult.update({
    where: {
      id: existbusinessResult?.id,
    },
    data: {
      firstYear: Math.ceil(firstYearResult),
    },
  });
}

module.exports = projectionDeprecationCal;
