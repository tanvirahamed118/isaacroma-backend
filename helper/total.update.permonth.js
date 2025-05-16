const Prisma = require("../config/db.connect");

async function TotalCategoryPermonthUpdate(
  name,
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
      category: name,
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
      (item) => item?.name === month && item.ownername === name
    );

    const getData = specificMonth?.filter((item) => item?.name === month);
    let totalPermonth = getData.reduce(
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

module.exports = TotalCategoryPermonthUpdate;
