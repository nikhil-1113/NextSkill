const express = require("express");
const router = express.Router();
const Contact = require("../Models/Contact");

// POST contact message
router.post("/", async (req, res) => {

  try {

    const newMessage = new Contact(req.body);
    await newMessage.save();

    res.json({ message: "Message saved successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router;