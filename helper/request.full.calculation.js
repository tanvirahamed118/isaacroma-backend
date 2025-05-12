const { createCumulativePerMonth } = require("./budget.calculation");
const budgetDeprecationCal = require("./budget.deprecation.cal");
const categoryBudgerPercentCal = require("./category.budgetPercent.cal");
const directExpenseCal = require("./direct.expense.cal");
const directResultCal = require("./direct.result.cal");
const ebitdaCal = require("./ebitda.cal");
const operatingProfiteCal = require("./operating.profit.cal");
const otherIncomeExpenseCal = require("./other.incomeexpense.cal");
const projectionDeprecationCal = require("./projection.deprecation.cal");

async function requestFullCalculation(update, businessId, userId) {
  await directExpenseCal(update, businessId, userId);
  await ebitdaCal(update, businessId, userId);
  await projectionDeprecationCal(update, businessId, userId);
  await budgetDeprecationCal(update, businessId, userId);
  await directResultCal(update, businessId, userId);
  await otherIncomeExpenseCal(update, businessId, userId);
  await operatingProfiteCal(update, businessId, userId);
  await createCumulativePerMonth(update, userId, businessId);
  await categoryBudgerPercentCal(userId, businessId);
}

module.exports = requestFullCalculation;
