const { REGISTRATION_SUCCESS_MESSAGE } = require("../utils/response");
const Prisma = require("../config/db.connect");
const {
  QUERY_SUCCESSFUL_MESSAGE,
  USER_ALREADY_EXIST_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  PASSWORD_NOT_MATCH_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  DELETE_SUCCESSFUL_MESSAGE,
  PASSWORD_CHANGE_SUCCESS_MESSAGE,
} = require("../utils/response");
const { ERROR_STATUS, SUCCESS_STATUS } = require("../utils/status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SecretKey = process.env.SECRET_KEY;

// get all user
async function getAllUser(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const users = await Prisma.user.findMany({
      skip: skip,
      take: limitNumber,
    });
    const totalUser = await Prisma.user.count();
    const totalPage = Math.ceil(totalUser / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        users,
        totalPage,
        totalUser,
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

// get one user
async function getOneUser(req, res) {
  const { id } = req.params;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        userMemberships: true,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: existUser,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// register user
async function register(req, res) {
  const { username, email, role, password } = req.body;

  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existUser) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: USER_ALREADY_EXIST_MESSAGE,
      });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await Prisma.user.create({
        data: {
          email: email,
          password: hash,
          username: username,
          role: role,
        },
      });
      const token = jwt.sign(
        { email: newUser.email, id: newUser.id },
        SecretKey
      );
      res.status(201).json({
        status: SUCCESS_STATUS,
        message: REGISTRATION_SUCCESS_MESSAGE,
        user: newUser,
        token: token,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// login user
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const matchPassword = await bcrypt.compare(password, existUser.password);
    const token = jwt.sign(
      { email: existUser.email, id: existUser.id },
      SecretKey
    );
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGIN_SUCCESS_MESSAGE,
      user: existUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      error: error.message,
    });
  }
}

// reset user
async function reset(req, res) {
  const { email, password } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const updateUser = await Prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: hash,
        },
      });

      res.status(200).json({
        status: SUCCESS_STATUS,
        message: PASSWORD_CHANGE_SUCCESS_MESSAGE,
        user: updateUser,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      error: error.message,
    });
  }
}

// update user password
async function updatePassword(req, res) {
  const { password } = req.body;
  const id = req.params.id;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const updateUser = await Prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: hash,
        },
      });

      res.status(200).json({
        status: SUCCESS_STATUS,
        message: UPDATE_SUCCESSFUL_MESSAGE,
        user: updateUser,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      error: error.message,
    });
  }
}

// update user
async function updateUser(req, res) {
  const { id } = req.params;

  const { username, phone, address, profile } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: SUCCESS_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const basePath = `${req.protocol}://${req.get("host")}/public/`;
    const profileFile = req.file?.originalname.split(" ").join("-");
    const updateUser = await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username,
        phone: Number(phone),
        address,
        profile: profileFile ? `${basePath}${profileFile}` : profile,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      error: error.message,
    });
  }
}

// delete user
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteUser = await Prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESSFUL_MESSAGE,
      user: deleteUser,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      error: error.message,
    });
  }
}

module.exports = {
  getAllUser,
  getOneUser,
  register,
  login,
  reset,
  updateUser,
  deleteUser,
  updatePassword,
};
