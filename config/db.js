const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected to ", conn.connection.host);
  } catch (err) {
    console.log({ err });
    process.exit();
  }
};
module.exports = connectDB;
