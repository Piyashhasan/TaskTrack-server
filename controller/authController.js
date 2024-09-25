const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// --- SIGN UP CONTROLLER ---
const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User is already exist, Please login",
        success: false,
      });
    }
    const userModel = new User({ fullName, email, password });

    // --- password hash ---
    userModel.password = await bcrypt.hash(password, 10);

    // --- data save to DB ---
    await userModel.save();

    res.status(201).json({
      message: "Sign up successfully",
      success: true,
    });
  } catch (err) {
    console.log("--- Error form sign up controller ---", err.message);
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

// --- SIGN IN CONTROLLER ---
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found, Please sign up", success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);

    if (!isPassEqual) {
      return res
        .status(403)
        .json({ message: "Password not match ", success: false });
    }

    // --- jwt token generate ---
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Sign in Success",
      success: true,
      jwtToken,
      email,
      fullName: user.fullName,
    });
  } catch (err) {
    console.log("--- Error form sign in controller ---", err.message);
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

module.exports = {
  signUp,
  signIn,
};
