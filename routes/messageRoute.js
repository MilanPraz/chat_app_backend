const express = require("express");
const {
  createMessage,
  getAllMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/api/message", createMessage);
router.get("/api/message/:id", getAllMessages);

module.exports = router;
