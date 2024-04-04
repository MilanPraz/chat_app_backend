const { default: mongoose } = require("mongoose");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");

//to send a message for already established chat room
const createMessage = async (req, res) => {
  try {
    const { senderId, chatId, message, receiverId } = req.body;
    // console.log(senderId, chatId, message, receiverId);

    if (!senderId || !message || !receiverId)
      return res.status(400).send("Please Fill the required fields");
    if (chatId === "new") {
      const newChat = await chatModel.create({
        members: [senderId, receiverId],
      });
      const newMessage = await messageModel.create({
        senderId,
        chatId: newChat._id,
        message,
      });

      return res.status(200).send("Message Sent Successfully!");
    } else if (!receiverId) {
      return res.send("receiver id needed").status(400);
    }

    const newMessage = await messageModel.create({
      senderId,
      chatId,
      message,
    });
    const user = await userModel.findById(senderId, {
      password: 0,
      email: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    res.status(200).send({ user, message: message });
  } catch (err) {
    console.log(err);
  }
};

//to get all messages of that chat room
const getAllMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const receiverId = req.query.receiverId;
    // console.log("receiverrrr idddddddddddddddddd", receiverId);
    const senderId = req.query.senderId;
    const checkMessages = async (chatid) => {
      const messages = await messageModel.find({ chatId: chatid });
      const messgaeUserData = Promise.all(
        messages.map(async (message) => {
          const user = await userModel.findById(message.senderId, {
            password: 0,
            email: 0,
            createdAt: 0,
            updatedAt: 0,
          });
          return { user, message: message.message };
        })
      );
      const detail = await messgaeUserData;
      res.status(200).send(detail);
    };
    //so initially tw chat khali hunca so euta khali array pathaune to show blank chat
    if (chatId === "new") {
      const checkChatExist = await chatModel.find({
        members: { $in: [receiverId.toString()] },
      });
      // console.log("chat room baneko xa ki xaina", checkChatExist);
      if (checkChatExist.length > 0) {
        checkMessages(checkChatExist[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(chatId);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createMessage, getAllMessages };
