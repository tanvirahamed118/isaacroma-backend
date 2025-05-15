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

async function finalCalculation(userId, businessId) {
  // budget calculation
  await budgetCategoryTotalCalculation(userId, businessId);
  await totalExpensesCal(businessId, userId);
  await businessResBudgetPercentCal(businessId, userId);
  await salesForeCastCal(businessId, userId);
  await requestFullCalculation(businessId, userId);
  await categoryFlowPercentCal(userId, businessId);
  await categoryTotalFlowPercentCal(userId, businessId);
  await totalSalesRevFlowPercentCal(businessId, userId);
  await otherIncomeExpenseFlowpercentCal(businessId);

  // cashflow calculation
  await requestTotalCal(businessId);
  await requestPermonthCal(userId, businessId);
  await requestPercentCal(businessId);
}

module.exports = finalCalculation;
