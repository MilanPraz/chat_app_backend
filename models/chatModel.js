// thing we need
/* 
chat name
isgroupchat to check if it is a group chat or single chat
users
latestmessage
groupadmin
*/

const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const chatSchema = new schema(
  {
    members: {
      type: Array,
      required: true,
    },
    latestMessage: {
      type: ObjectId,
      ref: "message",
    },
  },
  { timestamps: true } //mongoose gonna add new time for every chat
);

const chatModel = mongoose.model("chat", chatSchema);
module.exports = chatModel;
