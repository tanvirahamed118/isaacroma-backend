const Prisma = require("../../config/db.connect");

async function operatingPaymentPermonth(userId, businessId, cashflowId) {
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
  const existCostBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_COST_OF_SALES",
    },
  });

  const existCostOfSalePermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: existCostBusinessResult?.id,
      ownername: "TOTAL_COST_OF_SALES",
    },
  });

  const existPersonalBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_PERSOANL_EXPENSES",
    },
  });
  const existPersonalPermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: existPersonalBusinessResult?.id,
      ownername: "TOTAL_PERSOANL_EXPENSES",
    },
  });
  const existextraBusinessResult = await Prisma.businessResult.findFirst({
    where: {
      businessId,
      userId,
      name: "TOTAL_EXTRAORDINARY_EXPENSES",
    },
  });
  const existextraordinaryPermonth = await Prisma.permonth.findMany({
    where: {
      businessResultId: existextraBusinessResult?.id,
      ownername: "TOTAL_EXTRAORDINARY_EXPENSES",
    },
  });

  let perMonthCal = {};
  for (const month of monthNames) {
    const costOfSalePermonth = existCostOfSalePermonth.find(
      (item) => item.name === month
    );
    const personalPermonth = existPersonalPermonth.find(
      (item) => item.name === month
    );
    const extraordinaryPermonth = existextraordinaryPermonth.find(
      (item) => item.name === month
    );
    const value = parseFloat(
      (
        costOfSalePermonth.value +
        personalPermonth.value +
        extraordinaryPermonth.value
      ).toFixed(2)
    );
    perMonthCal[month] = value ? value : 0;
  }

  for (const month of monthNames) {
    const updatePermonth = await Prisma.cashflowmonth.findMany({
      where: {
        cashflowId,
        ownername: "TOTAL_OPERATING_PAYMENTS",
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

async function operatingPaymentTotal(cashflowId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "TOTAL_OPERATING_PAYMENTS",
    },
  });
  const totalPermonth = existPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      total: Math.ceil(totalPermonth),
    },
  });
}

async function operatingPaymentPercent(cashflowId, businessId) {
  const existPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: cashflowId,
      ownername: "TOTAL_OPERATING_PAYMENTS",
    },
  });
  const existPayment = await Prisma.cashflow.findFirst({
    where: {
      businessId,
      name: "TOTAL_PAYMENTS",
    },
  });
  const existTotalPaymentPermonth = await Prisma.cashflowmonth.findMany({
    where: {
      cashflowId: existPayment?.id,
      ownername: "TOTAL_PAYMENTS",
    },
  });
  const totalPermonth = existPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const totalPaymentPermonth = existTotalPaymentPermonth.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  await Prisma.cashflow.update({
    where: {
      id: cashflowId,
    },
    data: {
      flowPercent: parseFloat(
        ((totalPermonth / totalPaymentPermonth) * 100).toFixed(2)
      ),
    },
  });
}

module.exports = {
  operatingPaymentPermonth,
  operatingPaymentTotal,
  operatingPaymentPercent,
};
