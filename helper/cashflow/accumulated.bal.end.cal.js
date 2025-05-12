const Prisma = require("../../config/db.connect");

async function accoumulatedBalEndPermonthCal(cashflowId, businessId) {
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

  const monthlyNetBal = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "MONTHLY_NET_BALANCE",
    },
  });
  const accumulatedBegain = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "ACCUMULATED_BALANCE_BEGAINING",
    },
  });

  const existmonthlyNetBal = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: monthlyNetBal?.id,
      ownername: "MONTHLY_NET_BALANCE",
    },
  });
  const accumulatedPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: accumulatedBegain?.id,
      ownername: "ACCUMULATED_BALANCE_BEGAINING",
    },
  });
  let perMonthCal = {};
  let accumulated = 0;

  for (const month of monthNames) {
    const netBalEntry = existmonthlyNetBal.find((item) => item.name === month);
    const accumEntry = accumulatedPermonth.find((item) => item.name === month);
    const netBal = netBalEntry ? parseFloat(netBalEntry.value) : 0;
    const accumBal = netBalEntry ? parseFloat(accumEntry.value) : 0;

    if (month === "JANUARY") {
      perMonthCal[month] = netBal + accumBal;
    } else {
      perMonthCal[month] = accumulated + netBal;
    }

    accumulated = perMonthCal[month];
  }
  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "ACCUMULATED_BALANCE_END",
      },
    });
    const perMonth = updatePermonth.find((item) => item.name === month);
    if (perMonth) {
      await Prisma.cashflowmonth.update({
        where: { id: perMonth.id },
        data: { value: Math.ceil(perMonthCal[month]) },
      });
    }
  }
}

module.exports = accoumulatedBalEndPermonthCal;
