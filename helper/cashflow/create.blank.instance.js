const { devideCashflowPermonth } = require("../add.cashflow");

async function createBlankInstance(businessId) {
  await devideCashflowPermonth(0, "ACCUMULATED_BALANCE_BEGAINING", businessId);
  await devideCashflowPermonth(0, "ACCUMULATED_BALANCE_END", businessId);
  await devideCashflowPermonth(0, "SALES_COLLECTIONS", businessId);
  await devideCashflowPermonth(0, "PREVIOUS_BALANCE", businessId);
  await devideCashflowPermonth(0, "TOTAL_PERCENT_FOR_COLLECTION", businessId);
  await devideCashflowPermonth(0, "UNPAIN_PERCENT", businessId);
  await devideCashflowPermonth(0, "RECOVERED_PERCENT", businessId);
  await devideCashflowPermonth(0, "TOTAL_OPERATING_COLLECTION", businessId);
  await devideCashflowPermonth(0, "TOTAL_OTHER_CHARGES", businessId);
  await devideCashflowPermonth(0, "TOTAL_NET_COLLECTIONS", businessId);
  await devideCashflowPermonth(0, "OPERATIONAL_PAYMENTS", businessId);
  await devideCashflowPermonth(0, "TOTAL_OPERATING_PAYMENTS", businessId);
  await devideCashflowPermonth(0, "OTHER_PAYMENTS", businessId);
  await devideCashflowPermonth(0, "TOTAL_OTHER_PAYMENTS", businessId);
  await devideCashflowPermonth(0, "TOTAL_PAYMENTS", businessId);
  await devideCashflowPermonth(0, "MONTHLY_NET_BALANCE", businessId);
}

module.exports = createBlankInstance;
