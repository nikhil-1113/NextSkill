const express = require("express");
const router = express.Router();
const User = require("../Models/User");


// REGISTER
router.post("/register", async (req, res) => {

  const { name, email, password, role } = req.body;

  try {

    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "user" // default role if not provided
    });

    await newUser.save();

    res.json({
      success: true,
      message: "User registered successfully",
      user: newUser
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email: email.toLowerCase(), password });

    if (user) {

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role   // send role to frontend
        }
      });

    } else {

      res.json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;