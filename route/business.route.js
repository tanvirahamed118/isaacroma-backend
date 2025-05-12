const express = require("express");
const {
  createBusiness,
  createCategory,
  deleteCategory,
  createBudgetCalculation,
  updateDeprecationPerMonth,
  updateDeprecationProjection,
  updatePerMonth,
  getOneBusiness,
  deleteBusiness,
  updateCashflowMonth,
  updateCashflowAccoumulatedMonth,
  CashflowTotalCalculation,
  getAllBusinessByUserid,
  updateCategoryById,
  updateBusiness,
  getOnePermonth,
  getOneCashflowPermonth,
  updateCashflowPercent,
  getOneCashflow,
  getOneBusinessResult,
  getOneBusinessByList,
  getAllBusinessDefaultByUserid,
} = require("../controller/business.controller");
const auth = require("../middleware/auth");
const router = express.Router();

// get
router.get("/", auth, getAllBusinessByUserid);
router.get("/deafult/:id", auth, getAllBusinessDefaultByUserid);
router.get("/:id", auth, getOneBusiness);
router.get("/by/list/:id", auth, getOneBusinessByList);
router.get("/permonth/:id", auth, getOnePermonth);
router.get("/businessResult/:id", auth, getOneBusinessResult);
router.get("/cashflow/:id", auth, getOneCashflow);
router.get("/cashflow/permonth/:id", auth, getOneCashflowPermonth);

// post
router.post("/budget", auth, createBudgetCalculation);
router.post("/cashflow", auth, CashflowTotalCalculation);
router.post("/", auth, createBusiness);
router.post("/category", auth, createCategory);

// update
router.patch("/:id", auth, updateBusiness);
router.patch("/cashflow/percent/:id", auth, updateCashflowPercent);
router.patch("/update/permonth/:id", auth, updatePerMonth);
router.patch("/update/projection/:id", auth, updateDeprecationProjection);
router.patch("/cashflow/permonth/:id", auth, updateCashflowMonth);
router.patch("/cashflow/single/:id", auth, updateCashflowAccoumulatedMonth);
router.patch("/category/permonth/:id", auth, updateCategoryById);

// delete
router.delete("/category/:id", auth, deleteCategory);
router.delete("/:id", auth, deleteBusiness);

module.exports = router;
