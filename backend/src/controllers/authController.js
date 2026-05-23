const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// JWT Token Helper
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Central response token sender (Good to Have 1: Response Standardization)
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user
    }
  });
};

// POST Register
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Custom Data Validation Layer (Good to Have 5 / Route 215)
  if (!name || !email || !password) {
    return next(new AppError('Please provide a name, email and password', 400));
  }
  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('Email address is already in use', 400));
  }

  // Create User
  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  createSendToken(newUser, 201, res, 'User account registered successfully');
});

// POST Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate credentials input (Route 216)
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  // Verify user and password correctness
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res, 'User logged in successfully');
});

// POST Logout
exports.logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});
