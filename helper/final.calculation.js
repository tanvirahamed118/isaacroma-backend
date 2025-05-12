const {
  categoryFlowPercentCal,
  categoryTotalFlowPercentCal,
} = require("./budget.calculation");
const budgetCategoryTotalCalculation = require("./budget.category.total.calculation");
const {
  businessResBudgetPercentCal,
  totalSalesRevFlowPercentCal,
  otherIncomeExpenseFlowpercentCal,
} = require("./businessRes.budgetPercent.cal");
const requestPercentCal = require("./cashflow/request.percent.cal");
const requestPermonthCal = require("./cashflow/request.permonth.cal");
const requestTotalCal = require("./cashflow/request.total.cal");
const requestFullCalculation = require("./request.full.calculation");
const salesForeCastCal = require("./sales.forecast.cal");
const totalExpensesCal = require("./total.expense.cal");

async function finalCalculation(update, userId, businessId) {
  await budgetCategoryTotalCalculation(update, userId, businessId);
  await totalExpensesCal(update, businessId, userId);
  await businessResBudgetPercentCal(businessId, userId);
  await salesForeCastCal(update, businessId, userId);
  await requestFullCalculation(update, businessId, userId);
  await requestPermonthCal(userId, businessId);
  await requestTotalCal(businessId);
  await requestPercentCal(businessId);
  await categoryFlowPercentCal(userId, businessId);
  await categoryTotalFlowPercentCal(userId, businessId);
  await totalSalesRevFlowPercentCal(businessId, userId);
  await otherIncomeExpenseFlowpercentCal(businessId);
}

module.exports = finalCalculation;
