const express = require("express");
const router = express.Router();
const User = require("../Models/User");


// REGISTER
router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    res.json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email, password });

    if (user) {

      res.json({
        success: true,
        user: user
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