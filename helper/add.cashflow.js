const Prisma = require("../config/db.connect");

async function devideCashflowPermonth(value, name, businessId) {
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

  const newResult = await Prisma.cashflow.create({
    data: {
      name: name,
      businessId: businessId,
      total: 0,
      flowPercent: 0,
      inputPercent: 0,
    },
  });

  const data = monthNames.map((month) => ({
    name: month,
    value: perMonthValue,
    cashflowId: newResult?.id,
    ownername: name,
  }));

  await Prisma.cashflowmonth.createMany({ data });
}

module.exports = { devideCashflowPermonth };
