const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const messageSchema = new schema(
  {
    senderId: {
      type: ObjectId,
      ref: "user",
    },
    message: {
      type: String,
      trim: true,
    },
    chatId: {
      //kun group ko chat vanerw reference
      type: ObjectId,
      ref: "chat",
    },
  },
  { timestamps: true }
);

const chatModel = mongoose.model("message", messageSchema);
module.exports = chatModel;
