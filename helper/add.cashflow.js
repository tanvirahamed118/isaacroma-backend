const Prisma = require("../config/db.connect");

async function devideCashflowPermonth(name, cashflowId) {
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
  const data = monthNames.map((month) => ({
    name: month,
    value: 0,
    cashflowId: cashflowId,
    ownername: name,
  }));
  await Prisma.cashflowmonth.createMany({ data });
}

async function updateCashflowPermonth(value, cashflowId) {
  const perMonthValue = parseFloat((value / 12).toFixed(2));
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
  const existingMonths = await Prisma.cashflowmonth.findMany({
    where: { cashflowId },
    orderBy: { name: "asc" },
  });
  for (const month of existingMonths) {
    if (monthNames.includes(month.name)) {
      await Prisma.cashflowmonth.update({
        where: { id: month.id },
        data: {
          value: Math.ceil(perMonthValue),
        },
      });
    }
  }
}

module.exports = { devideCashflowPermonth, updateCashflowPermonth };
