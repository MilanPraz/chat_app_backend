const express = require("express");
const { createChat, getUserChats } = require("../controllers/chatController");

const router = express.Router();

router.post("/api/chat", createChat);
router.get("/api/chat/:id", getUserChats);

module.exports = router;
