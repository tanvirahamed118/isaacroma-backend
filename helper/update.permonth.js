const Prisma = require("../config/db.connect");

async function updatePermonth(id, value) {
  const existPermonth = await Prisma.permonth.findMany({
    where: { categoryId: id },
  });

  const perMonthValue = Math.ceil(value / 12);

  await Promise.all(
    existPermonth.map((month) =>
      Prisma.permonth.update({
        where: { id: month.id },
        data: { value: perMonthValue },
      })
    )
  );
}

module.exports = updatePermonth;
