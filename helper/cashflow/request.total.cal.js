const Prisma = require("../../config/db.connect");
const { netCollectionTotal } = require("./net.collection.cal");
const { operatingCollTotalCal } = require("./operating.collection.cal");
const { operatingPaymentTotal } = require("./operating.payment.cal");
const { otherChargesTotalCal } = require("./other.charges.cal");
const { otherPaymentTotalCal } = require("./other.payment.cal");
const { presentedCollTotalCal } = require("./presented-collection.cal");
const { recoveredTotalCal } = require("./recovered.cal");
const { totalPaymentTotalCal } = require("./total.payments.cal");
const { unpaidTotalCal } = require("./unpaid-cal");

async function requestTotalCal(businessId) {
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
  const netCollection = existCashflow.find(
    (item) => item.name === "TOTAL_NET_COLLECTIONS"
  );
  const operatingPayment = existCashflow.find(
    (item) => item.name === "TOTAL_OPERATING_PAYMENTS"
  );
  const otherPayment = existCashflow.find(
    (item) => item.name === "TOTAL_OTHER_PAYMENTS"
  );
  const totalPayment = existCashflow.find(
    (item) => item.name === "TOTAL_PAYMENTS"
  );

  await presentedCollTotalCal(presented?.id);
  await unpaidTotalCal(unpaid?.id);
  await recoveredTotalCal(recovered?.id);
  await operatingCollTotalCal(operatingColl?.id);
  await otherChargesTotalCal(otherCharges?.id);
  await netCollectionTotal(netCollection?.id);
  await operatingPaymentTotal(operatingPayment?.id);
  await otherPaymentTotalCal(otherPayment?.id);
  await totalPaymentTotalCal(totalPayment?.id);
}

module.exports = requestTotalCal;
