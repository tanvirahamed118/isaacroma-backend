const Prisma = require("../../config/db.connect");
const { devideCashflowPermonth } = require("../add.cashflow");

async function cashflowInstance(businessId) {
  const allNames = [
    "ACCUMULATED_BALANCE_BEGAINING",
    "ACCUMULATED_BALANCE_END",
    "SALES_COLLECTIONS",
    "PREVIOUS_BALANCE",
    "TOTAL_PERCENT_FOR_COLLECTION",
    "UNPAIN_PERCENT",
    "RECOVERED_PERCENT",
    "TOTAL_OPERATING_COLLECTION",
    "TOTAL_OTHER_CHARGES",
    "TOTAL_NET_COLLECTIONS",
    "OPERATIONAL_PAYMENTS",
    "TOTAL_OPERATING_PAYMENTS",
    "OTHER_PAYMENTS",
    "TOTAL_OTHER_PAYMENTS",
    "TOTAL_PAYMENTS",
    "MONTHLY_NET_BALANCE",
  ];

  for (let i = 0; i < allNames?.length; i++) {
    const newRes = await Prisma.cashflow.create({
      data: {
        total: 0,
        inputPercent: 0,
        flowPercent: 0,
        businessId: businessId,
        name: allNames[i],
      },
    });
    await devideCashflowPermonth(allNames[i], newRes?.id);
  }
}

module.exports = cashflowInstance;
