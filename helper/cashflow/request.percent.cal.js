const Prisma = require("../../config/db.connect");
const { operatingCollPercentCal } = require("./operating.collection.cal");
const { operatingPaymentPercent } = require("./operating.payment.cal");
const { otherChargesPercentCal } = require("./other.charges.cal");
const { otherPaymentPercentCal } = require("./other.payment.cal");
const { presentedCollPercentCal } = require("./presented-collection.cal");
const { recoveredPercentCal } = require("./recovered.cal");
const { unpaidPercentCal } = require("./unpaid-cal");

async function requestPercentCal(businessId) {
  const existCashflow = await Prisma.cashflow.findMany({
    where: {
      businessId,
    },
  });

  const presented = existCashflow.find(
    (item) => item.name === "TOTAL_PERCENT_FOR_COLLECTION"
  );
  const unpaid = existCashflow.find((item) => item.name === "UNPAIN_PERCENT");
  const recovered = existCashflow.find(
    (item) => item.name === "RECOVERED_PERCENT"
  );
  const operatingColl = existCashflow.find(
    (item) => item.name === "TOTAL_OPERATING_COLLECTION"
  );
  const otherCharges = existCashflow.find(
    (item) => item.name === "TOTAL_OTHER_CHARGES"
  );

  const otherPayment = existCashflow.find(
    (item) => item.name === "TOTAL_OTHER_PAYMENTS"
  );
  const operationPayment = existCashflow.find(
    (item) => item.name === "TOTAL_OPERATING_PAYMENTS"
  );

  await presentedCollPercentCal(presented?.id, businessId);
  await unpaidPercentCal(unpaid?.id, businessId);
  await recoveredPercentCal(recovered?.id, businessId);
  await operatingCollPercentCal(operatingColl?.id, businessId);
  await otherChargesPercentCal(otherCharges?.id, businessId);
  await otherPaymentPercentCal(otherPayment?.id, businessId);
  await operatingPaymentPercent(operationPayment?.id, businessId);
}

module.exports = requestPercentCal;
