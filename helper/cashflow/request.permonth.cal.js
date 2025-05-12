const Prisma = require("../../config/db.connect");
const accoumulatedBalBegainPermonthCal = require("./accumulated.bal.begain.cal");
const accoumulatedBalEndPermonthCal = require("./accumulated.bal.end.cal");
const monthlyNetbalancePermonth = require("./monthly.netbalance.cal");
const { netCollectionPermonth } = require("./net.collection.cal");
const { operatingCollPermonthCal } = require("./operating.collection.cal");
const { operatingPaymentPermonth } = require("./operating.payment.cal");
const { otherChargesPermonthCal } = require("./other.charges.cal");
const { otherPaymentPermonthCal } = require("./other.payment.cal");
const { presentedCollPermonthCal } = require("./presented-collection.cal");
const previousCalculation = require("./Previous.balance.cal");
const { recoveredPermonthCal } = require("./recovered.cal");
const { totalPaymentPermonthCal } = require("./total.payments.cal");
const { unpaidPermonthCal } = require("./unpaid-cal");

async function requestPermonthCal(userId, businessId) {
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
  const monthNetBalance = existCashflow.find(
    (item) => item.name === "MONTHLY_NET_BALANCE"
  );
  const accoumulateBegain = existCashflow.find(
    (item) => item.name === "ACCUMULATED_BALANCE_BEGAINING"
  );
  const accoumulatedEnd = existCashflow.find(
    (item) => item.name === "ACCUMULATED_BALANCE_END"
  );
  const previousBalance = existCashflow.find(
    (item) => item.name === "PREVIOUS_BALANCE"
  );

  await presentedCollPermonthCal(businessId, userId, presented?.id);
  await unpaidPermonthCal(unpaid?.id, businessId);
  await recoveredPermonthCal(recovered?.id, businessId);
  await operatingCollPermonthCal(operatingColl?.id, businessId);
  await otherChargesPermonthCal(userId, businessId, otherCharges?.id);
  await netCollectionPermonth(netCollection?.id, businessId);
  await operatingPaymentPermonth(userId, businessId, operatingPayment?.id);
  await otherPaymentPermonthCal(userId, businessId, otherPayment?.id);
  await totalPaymentPermonthCal(totalPayment?.id, businessId);
  await monthlyNetbalancePermonth(monthNetBalance?.id, businessId);
  await accoumulatedBalEndPermonthCal(accoumulatedEnd?.id, businessId);
  await accoumulatedBalBegainPermonthCal(accoumulateBegain?.id, businessId);
  await previousCalculation(previousBalance?.id, businessId);
}

module.exports = requestPermonthCal;
