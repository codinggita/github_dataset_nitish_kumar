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

// GET Profile
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { user }
  });
});

// PATCH Profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (email) {
    const existing = await User.findOne({ email });
    if (existing && existing.id !== user.id) {
      return next(new AppError('Email address is already in use by another user', 400));
    }
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// POST Forgot Password (OTP Generation Mock)
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide an email address', 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError('No user found with that email address', 404));

  // Generate OTP (Good to Have 18: OTP verification setup)
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  user.emailVerificationOTP = otp;
  user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 mins expiry

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset OTP verification code sent successfully (mocked)',
    data: { otp } // Send in payload for testing/ease of use
  });
});

// POST Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return next(new AppError('Please provide email, OTP code, and newPassword', 400));
  }

  const user = await User.findOne({
    email,
    emailVerificationOTP: otp,
    emailVerificationOTPExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid OTP code or email, or code expired', 400));
  }

  user.password = newPassword;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpires = undefined;

  await user.save();

  createSendToken(user, 200, res, 'Password reset successfully');
});

// POST Change Password
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide currentPassword and newPassword', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect current password', 401));
  }

  user.password = newPassword;
  await user.save();

  createSendToken(user, 200, res, 'Password changed successfully');
});

// POST Send OTP
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Provide email', 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError('No user found', 404));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailVerificationOTP = otp;
  user.emailVerificationOTPExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.status(200).json({ success: true, message: 'OTP sent', data: { otp } });
});

// POST Verify Email
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) return next(new AppError('Provide email and OTP', 400));

  const user = await User.findOne({
    email,
    emailVerificationOTP: otp,
    emailVerificationOTPExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Invalid or expired OTP', 400));

  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

// JWT Verification Controllers (Route 184-189)
exports.generateToken = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError('Provide userId', 400));
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ success: true, token });
});

exports.verifyToken = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new AppError('Provide token', 400));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.status(200).json({ success: true, decoded });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new AppError('Provide token', 400));
  const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
  const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ success: true, token: newToken });
});

exports.revokeToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Token revoked successfully (mocked)' });
});

// Admin User CRUD Operations (Good to Have 13 / Dashboard Module Integration)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: { users }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Please provide a name, email and password', 400));
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('Email address is already in use', 400));
  }
  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });
  newUser.password = undefined;
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user: newUser }
  });
});

exports.updateUserByAdmin = catchAsync(async (req, res, next) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  if (name) user.name = name;
  if (role) user.role = role;
  if (email) {
    const existing = await User.findOne({ email });
    if (existing && existing.id !== user.id) {
      return next(new AppError('Email address is already in use by another user', 400));
    }
    user.email = email;
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

exports.deleteUserByAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: null
  });
});

