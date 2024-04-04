const userModel = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;
    // console.log("heloooooooooooooo");
    const userExist = await userModel.findOne({ email: email });

    if (userExist) {
      return res.send("User already Exist");
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
      pic,
    });
    if (newUser) {
      return res.json({
        msg: "User Created",
      });
    } else {
      res.status(400);
      throw new Error("Failed to create a user");
    }
  } catch (err) {
    res.send({ error: err });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (user && user.matchPassword(password)) {
      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
        },
        token: generateToken(user._id),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.send({ error: err });
  }
};

const allUsers = async (req, res) => {
  try {
    // console.log("req user ko ", req.user);
    const userId = req.user._id;
    //we will only get value on search if we match fron either name or email
    const search = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    // console.log(search);
    const users = await userModel.find(search, { password: 0 });
    const userArray = [];
    const newUsers = users.map((user) => {
      // console.log("database ko user", user._id.toString());
      // console.log("ma ho yo", userId.toString());
      // console.log(user._id.toString() === userId.toString());
      if (user._id.toString() !== userId.toString()) {
        // console.log(user._id);
        userArray.push(user);
      }
    });
    // console.log(newUsers);
    // .find({ _id: { $ne: req.user.user._id } });

    return res.send(userArray);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const userDetail = async (req, res, next) => {
  try {
    // console.log(req.user);
    const user = await userModel.findById(req.user._id, {
      password: 0,
      repeat_password: 0,
    });
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
};

const editProfilePicture = async (req, res) => {
  try {
    console.log("helooooooooo");
    console.log("file hai", req.file.filename);
    if (req.file) {
      const newPic = req.file.filename;

      const updatedUser = await userModel.findByIdAndUpdate(
        req.body.id,
        { pic: newPic },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send({ msg: "User not found!" });
      }
      console.log("Updated User here", updatedUser);
      return res.status(200).send(updatedUser);
    } else {
      return res.status(400).send({ msg: "No file uploaded" });
    }
  } catch (err) {
    console.error("Error updating profile picture:", err);
    return res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  registerUser,
  userLogin,
  allUsers,
  userDetail,
  editProfilePicture,
};
