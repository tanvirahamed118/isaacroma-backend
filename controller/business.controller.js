const Prisma = require("../config/db.connect");
const {
  devidePerMonth,
  updateCategoryAll,
} = require("../helper/budget.calculation");
const createBlankInstance = require("../helper/cashflow/create.blank.instance");
const {
  BUSINESS_CREATE_SUCCESS_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  ERROR_FOR_CREATE_CALCULATION_MESSAGE,
} = require("../utils/response");
const { SUCCESS_STATUS, ERROR_STATUS } = require("../utils/status");
const updatePermonth = require("../helper/update.permonth");
const finalCalculation = require("../helper/final.calculation");

// get all user
async function getAllBusinessByUserid(req, res) {
  const { page = 1, limit = 10, userId, sort } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const business = await Prisma.business.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      skip: skip,
      take: limitNumber,
      orderBy: {
        createdAt: sort.toLowerCase(),
      },
    });
    const totalBusiness = await Prisma.business.count({
      where: {
        userId: userId,
      },
    });
    const totalPage = Math.ceil(totalBusiness / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        business,
        totalPage,
        totalBusiness,
        currentPage: pageNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getAllBusinessDefaultByUserid(req, res) {
  const id = req.params.id;
  try {
    const business = await Prisma.business.findMany({
      where: {
        userId: id,
      },
      include: {
        categories: true,
      },
    });

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      business: business,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function createBusiness(req, res) {
  const { userId, name, sector, description } = req.body;
  try {
    const membership = await Prisma.userMembership.findFirst({
      where: { userId },
    });
    if (!membership?.active) {
      return res.status(403).json({
        status: ERROR_STATUS,
        message: "You do not have valid membership",
      });
    }
    const newBusiness = await Prisma.business.create({
      data: {
        userId,
        name,
        sector,
        description,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: BUSINESS_CREATE_SUCCESS_MESSAGE,
      business: newBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updateBusiness(req, res) {
  const { name, sector, description } = req.body;
  const id = req.params.id;
  try {
    const updateBusiness = await Prisma.business.update({
      where: {
        id: id,
      },
      data: {
        name,
        sector,
        description,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      business: updateBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getOneBusiness(req, res) {
  const id = req.params.id;

  try {
    const existBusiness = await Prisma.business.findUnique({
      where: {
        id: id,
      },
      include: {
        businessResults: {
          include: {
            permonths: {
              orderBy: {
                name: "asc",
              },
            },
          },
        },
        categories: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            permonths: {
              orderBy: {
                name: "asc",
              },
            },
          },
        },
        cashflows: {
          include: {
            permonths: {
              orderBy: {
                name: "asc",
              },
            },
          },
        },
      },
    });

    if (!existBusiness) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      business: existBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getOneBusinessByList(req, res) {
  const id = req.params.id;
  try {
    const existBusiness = await Prisma.business.findUnique({
      where: {
        id: id,
      },
    });

    if (!existBusiness) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      business: existBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getOneBusinessResult(req, res) {
  const id = req.params.id;

  try {
    const existBusiness = await Prisma.businessResult.findUnique({
      where: {
        id: id,
      },
    });

    if (!existBusiness) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      business: existBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getOnePermonth(req, res) {
  const id = req.params.id;

  try {
    const existPermonth = await Prisma.permonth.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPermonth) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      category: existPermonth,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getOneCashflowPermonth(req, res) {
  const id = req.params.id;

  try {
    const existPermonth = await Prisma.cashflowmonth.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPermonth) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      category: existPermonth,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function getOneCashflow(req, res) {
  const id = req.params.id;

  try {
    const existCashflow = await Prisma.cashflow.findUnique({
      where: {
        id: id,
      },
    });
    if (!existCashflow) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      category: existCashflow,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function createCategory(req, res) {
  const {
    name,
    category,
    firstYear,
    expectedPercent,
    type,
    userId,
    businessId,
  } = req.body;
  const secondYear =
    (Number(firstYear) * Number(expectedPercent)) / 100 + Number(firstYear);
  const deviation = secondYear - Number(firstYear);

  try {
    const membership = await Prisma.userMembership.findFirst({
      where: { userId },
    });
    const membershipLimits = {
      BASIC: {
        SALES_REVENUE: 10,
        CAPITAL_INCRIEASE_LOAN: 5,
        COST_OF_SALES: 15,
        EXTRAORDINARY: 15,
        PERSOANL: 10,
        FINIANCIAL: 5,
      },
      MEDIUM: {
        SALES_REVENUE: 20,
        CAPITAL_INCRIEASE_LOAN: 10,
        COST_OF_SALES: 30,
        EXTRAORDINARY: 30,
        PERSOANL: 20,
        FINIANCIAL: 10,
      },
      PREMIUM: {
        SALES_REVENUE: 30,
        CAPITAL_INCRIEASE_LOAN: 15,
        COST_OF_SALES: 45,
        EXTRAORDINARY: 45,
        PERSOANL: 30,
        FINIANCIAL: 15,
      },
    };
    const userCategoryCount = await Prisma.category.count({
      where: {
        userId,
        category,
      },
    });

    const allowedLimit =
      membershipLimits[membership.plan.toUpperCase()][category];

    if (userCategoryCount >= allowedLimit) {
      return res.status(403).json({
        message: `Limit reached in your ${membership.plan} plan.`,
      });
    }

    const newCategory = await Prisma.category.create({
      data: {
        name,
        category,
        firstYear: Number(firstYear),
        expectedPercent: Number(expectedPercent),
        type,
        userId,
        businessId,
        secondYear: secondYear,
        deviation: deviation,
      },
    });
    await devidePerMonth(category, Number(firstYear), newCategory.id, null);
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updateCategoryById(req, res) {
  const { name, firstYear, expectedPercent, userId, businessId } = req.body;
  const id = req.params.id;

  const secondYear =
    (Number(firstYear) * Number(expectedPercent)) / 100 + Number(firstYear);
  const deviation = secondYear - Number(firstYear);
  try {
    const newCategory = await Prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name,
        firstYear: Number(firstYear),
        expectedPercent: Number(expectedPercent),
        secondYear: secondYear,
        deviation: deviation,
      },
    });
    await updatePermonth(id, firstYear);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function createBudgetCalculation(req, res) {
  const { userId, businessId } = req.body;
  try {
    const existBusiness = await Prisma.business.findUnique({
      where: {
        id: businessId,
      },
      include: {
        businessResults: true,
        categories: {
          include: {
            permonths: true,
          },
        },
        cashflows: true,
      },
    });
    const existBudgetDep = await Prisma.businessResult.findFirst({
      where: {
        userId,
        businessId,
        name: "BUDGET_DEPRECIATION",
      },
    });
    const existprojectionDep = await Prisma.businessResult.findFirst({
      where: {
        userId,
        businessId,
        name: "PROJECTION_DEPRECIATION",
      },
    });
    if (!existBudgetDep) {
      const newResult = await Prisma.businessResult.create({
        data: {
          budgetPercent: 0,
          deviation: 0,
          firstYear: 0,
          secondYear: 0,
          expectedPercent: 0,
          name: "BUDGET_DEPRECIATION",
          userId: userId,
          businessId: businessId,
        },
      });
      await devidePerMonth(
        "BUDGET_DEPRECIATION",
        newResult?.firstYear,
        null,
        newResult?.id
      );
    }
    if (!existprojectionDep) {
      await Prisma.businessResult.create({
        data: {
          budgetPercent: 0,
          deviation: 0,
          firstYear: 0,
          secondYear: 0,
          expectedPercent: 0,
          name: "PROJECTION_DEPRECIATION",
          userId: userId,
          businessId: businessId,
        },
      });
    }
    const requiredCategories = [
      "SALES_REVENUE",
      "CAPITAL_INCRIEASE_LOAN",
      "COST_OF_SALES",
      "EXTRAORDINARY",
      "PERSOANL",
      "FINIANCIAL",
    ];
    const existingCategoryNames = existBusiness.categories.map(
      (cat) => cat.category
    );
    const missingCategories = requiredCategories.filter(
      (cat) => !existingCategoryNames.includes(cat)
    );
    if (missingCategories.length > 0) {
      return res.status(400).json({
        status: "ERROR",
        message: ERROR_FOR_CREATE_CALCULATION_MESSAGE,
      });
    }
    if (existBusiness?.cashflows?.length === 0) {
      await createBlankInstance(businessId);
    }
    await finalCalculation(false, userId, businessId);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      business: existBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updatePerMonth(req, res) {
  const { id } = req.params;
  const { value, categoryId, userId, businessId } = req.body;

  try {
    const existPerMonth = await Prisma.permonth.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPerMonth) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateData = await Prisma.permonth.update({
      where: {
        id: id,
      },
      data: {
        value: Number(value),
      },
    });
    if (categoryId) {
      await updateCategoryAll(categoryId);
    }
    await finalCalculation(true, userId, businessId);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      permonth: updateData,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updateDeprecationProjection(req, res) {
  const id = req.params.id;
  const { value, userId, businessId, name } = req.body;
  try {
    const existBusinessResult = await Prisma.businessResult.findUnique({
      where: {
        id: id,
      },
    });
    if (!existBusinessResult) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    let updateBusiness;
    if (name === "secondYear") {
      updateBusiness = await Prisma.businessResult.update({
        where: {
          id: id,
        },
        data: {
          secondYear: Number(value),
        },
      });
    }
    if (name === "expectedPercent") {
      updateBusiness = await Prisma.businessResult.update({
        where: {
          id: id,
        },
        data: {
          expectedPercent: Number(value),
        },
      });
    }
    if (name === "deviation") {
      updateBusiness = await Prisma.businessResult.update({
        where: {
          id: id,
        },
        data: {
          deviation: Number(value),
        },
      });
    }
    await finalCalculation(true, userId, businessId);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      businessResult: updateBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updateCashflowMonth(req, res) {
  const { id } = req.params;
  const { value, businessId, userId } = req.body;
  try {
    const existPermonth = await Prisma.cashflowmonth.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPermonth) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateData = await Prisma.cashflowmonth.update({
      where: {
        id: id,
      },
      data: {
        value: Number(value),
      },
    });

    await finalCalculation(true, userId, businessId);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      cashflowpermonth: updateData,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updateCashflowAccoumulatedMonth(req, res) {
  const { id } = req.params;
  const { value } = req.body;
  try {
    const existPermonth = await Prisma.cashflowmonth.findUnique({
      where: {
        id: id,
      },
    });
    if (existPermonth) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateData = await Prisma.cashflowmonth.update({
      where: {
        id: id,
        name: "JANUARY",
      },
      data: {
        value: value,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      cashflowpermonth: updateData,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function updateCashflowPercent(req, res) {
  const { id } = req.params;
  const { value, businessId, userId } = req.body;
  try {
    const existPermonth = await Prisma.cashflow.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPermonth) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateData = await Prisma.cashflow.update({
      where: {
        id: id,
      },
      data: {
        inputPercent: Number(value),
      },
    });

    await finalCalculation(true, userId, businessId);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      cashflowpermonth: updateData,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function CashflowTotalCalculation(req, res) {
  const { businessId, userId } = req.body;
  try {
    const existBusiness = await Prisma.business.findUnique({
      where: {
        id: businessId,
      },
      include: {
        cashflows: {
          include: {
            permonths: true,
          },
        },
      },
    });
    if (!existBusiness) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await finalCalculation(true, userId, businessId);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      business: existBusiness,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function deleteCategory(req, res) {
  const id = req.params.id;
  try {
    const existCategory = await Prisma.category.findUnique({
      where: {
        id,
      },
    });
    if (!existCategory) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    const deleteData = await Prisma.category.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESSFUL_MESSAGE,
      category: deleteData,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function deleteBusiness(req, res) {
  const id = req.params.id;
  try {
    const existBusiness = await Prisma.business.findUnique({
      where: {
        id,
      },
    });
    if (!existBusiness) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    const deleteData = await Prisma.business.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESSFUL_MESSAGE,
      business: deleteData,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

module.exports = {
  getAllBusinessByUserid,
  createBusiness,
  createCategory,
  deleteCategory,
  createBudgetCalculation,
  updatePerMonth,
  getOneBusiness,
  deleteBusiness,
  updateDeprecationProjection,
  updateCashflowMonth,
  updateCashflowAccoumulatedMonth,
  getOneCashflowPermonth,
  CashflowTotalCalculation,
  updateCategoryById,
  updateBusiness,
  getOnePermonth,
  updateCashflowPercent,
  getOneCashflow,
  getOneBusinessResult,
  getOneBusinessByList,
  getAllBusinessDefaultByUserid,
};
