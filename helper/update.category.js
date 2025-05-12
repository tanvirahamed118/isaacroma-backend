const Prisma = require("../config/db.connect");

async function updateCategory(id) {
  const existCategory = await Prisma.category.findUnique({
    where: {
      id,
    },
  });
  const percent = existCategory?.expectedPercent;
  const findAllPermonth = await Prisma.permonth.findMany({
    where: {
      categoryId: id,
    },
  });
  const firstYearValue = findAllPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const secondYear =
    (Number(firstYearValue) * Number(percent)) / 100 + Number(firstYearValue);
  const deviation = secondYear - Number(firstYearValue);

  await Prisma.category.update({
    where: {
      id,
    },
    data: {
      secondYear: Math.ceil(parseFloat(secondYear.toFixed(2))),
      deviation: Math.ceil(parseFloat(deviation.toFixed(2))),
      firstYear: Math.ceil(parseFloat(firstYearValue.toFixed(2))),
    },
  });
}

module.exports = updateCategory;
