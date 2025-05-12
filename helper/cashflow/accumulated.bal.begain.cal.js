const Prisma = require("../../config/db.connect");

async function accoumulatedBalBegainPermonthCal(cashflowId, businessId) {
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

  const filteredMonths = monthNames.filter((month) => month !== "JANUARY");

  // Fetch ACCUMULATED_BALANCE_END cashflow and months
  const acculateBalanceEnd = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "ACCUMULATED_BALANCE_END",
    },
  });

  const existAcculateBalanceEnd = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: acculateBalanceEnd?.id,
      ownername: "ACCUMULATED_BALANCE_END",
    },
  });

  // Calculate values per month
  let perMonthCal = {};
  let previousValue = 0;

  for (const month of monthNames) {
    if (month === "JANUARY") {
      perMonthCal[month] = 0;
      previousValue = 0;
    } else {
      perMonthCal[month] = previousValue;
    }

    const netBalEntry = existAcculateBalanceEnd.find(
      (item) => item.name.toUpperCase() === month
    );
    previousValue = netBalEntry ? Number(netBalEntry.value) : previousValue;
  }

  // Fetch existing entries for update just once
  const updatePermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId,
      ownername: "ACCUMULATED_BALANCE_BEGAINING",
    },
  });

  for (const month of filteredMonths) {
    const perMonth = updatePermonth.find(
      (item) => item.name.toUpperCase() === month
    );

    if (perMonth) {
      await Prisma.cashflowmonth.update({
        where: { id: perMonth.id },
        data: { value: Math.ceil(perMonthCal[month]) },
      });
    }
  }
}

module.exports = accoumulatedBalBegainPermonthCal;
