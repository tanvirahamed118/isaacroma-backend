const { updateCumulativePerMonth } = require("./budget.calculation");
const budgetDeprecationCal = require("./budget.deprecation.cal");
const categoryBudgerPercentCal = require("./category.budgetPercent.cal");
const directExpenseCal = require("./direct.expense.cal");
const directResultCal = require("./direct.result.cal");
const ebitdaCal = require("./ebitda.cal");
const operatingProfiteCal = require("./operating.profit.cal");
const otherIncomeExpenseCal = require("./other.incomeexpense.cal");
const projectionDeprecationCal = require("./projection.deprecation.cal");

async function requestFullCalculation(businessId, userId) {
  await directExpenseCal(businessId, userId);
  await ebitdaCal(businessId, userId);
  await projectionDeprecationCal(businessId, userId);
  await budgetDeprecationCal(businessId, userId);
  await directResultCal(businessId, userId);
  await otherIncomeExpenseCal(businessId, userId);
  await operatingProfiteCal(businessId, userId);
  await updateCumulativePerMonth(userId, businessId);
  await categoryBudgerPercentCal(userId, businessId);
}

module.exports = requestFullCalculation;
