const express = require("express");
const router = express.Router();
const Contact = require("../Models/Contact");

// ✅ POST: Save contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 🔒 Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newMessage = new Contact({
      name,
      email,
      message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message saved successfully ✅"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ GET: Fetch all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ DELETE: Remove a message by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message deleted" });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;