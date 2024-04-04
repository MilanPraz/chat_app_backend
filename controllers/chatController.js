const { default: mongoose, mongo } = require("mongoose");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

//to create a chat room
const createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    // console.log(senderId);

    const newChat = new chatModel({ members: [senderId, receiverId] });
    await newChat.save();

    res.status(200).send("created succesffully");
  } catch (err) {
    console.log(err);
  }
};

//to get all his chats with other people to display on the left side a list of chats
const getUserChats = async (req, res) => {
  try {
    const userId = req.params.id;

    const allChats = await chatModel.find({ members: { $in: [userId] } }); //in means include
    // console.log(allChats);

    const chatUserData = Promise.all(
      allChats.map(async (chat) => {
        const receiverId = chat.members.find((user) => user !== userId);
        const receiveruser = await userModel.findById(receiverId);
        console.log(receiveruser);
        return {
          user: {
            _id: receiveruser._id,
            name: receiveruser.name,
            email: receiveruser.email,
            pic: receiveruser.pic,
          },
          chatId: chat._id,
        };
      })
    );
    res.status(200).json(await chatUserData);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createChat, getUserChats };
