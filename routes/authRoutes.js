const express = require("express");
const { signIn, signUp } = require("../controller/authController");

const authRouter = express.Router();

// --- route endPoint ---
authRouter.post("/sign-in", signIn).post("/sign-up", signUp);

module.exports = authRouter;
