const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const bcrypt = require("bcrypt");

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,

      default: "usericon.jpg",
    },
  },
  {
    timestamps: true,
  }
);

//this for the password comparing using bcrypt
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//here pre = before save=saving i.e before saving run this func to encrypt our password
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
