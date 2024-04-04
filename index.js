const express = require("express");
const http = require("http"); // http server is a part of nodejs used to create a server for the app
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoute");
const messageRoutes = require("./routes/messageRoute");
const { pageNotFound } = require("./middleware/errorHandle");
const cors = require("cors");
const { Server } = require("socket.io");
const userModel = require("./models/userModel");

dotenv.config();

connectDB();
const app = express();
// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use(cors());
const httpServer = http.createServer(app); // here we are creating a server for the app and we dont use listen method here because we are using the listen method of the httpServer
app.use(express.json()); //to accept json data
app.use(express.static("uploads"));
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});
// const io = new Server(
//   (8009,
//   {
//     cors: {
//       origin: "http://localhost:5173/",
//     },
//   })
// );
//socket.io
console.log("beefore socket");
let users = [];
io.on("connection", (socket) => {
  // console.log("user connected here", socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find(
      (user) => user.userId.toString() === userId.toString()
    );
    console.log("existtttttttt", isUserExist);
    if (!isUserExist) {
      console.log("isthishappening????????");
      let user = { userId, socketId: socket.id };
      users.push(user);
      console.log("active usersssssssss", users);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, chatId }) => {
      console.log(senderId, receiverId, message, chatId);
      const receiver = users.find(
        (user) => user.userId.toString() === receiverId.toString()
      ); //this means hamro mathi ko tyo users id ma tyo msg receiver garne device xa that means that device is online
      const sender = users.find((user) => user.userId === senderId); //this means hamro mathi ko tyo users id ma tyo msg receiver garne device xa that means that device is online
      const userDetail = await userModel.findById(senderId, { password: 0 });
      console.log(userDetail);
      // console.log("user.userId haiiiiiiiiii",user.userId)
      console.log("receiverrrrrrrrrrrrr", receiver);
      //if receiver is in our users array that is online xa vane yo tala ko run hunxa and receiver rw sender dubai lai emit garne vayo data
      if (receiver) {
        console.log("Receiver xa hai twwwwwwwww");
        io.to(receiver?.socketId).to(sender?.socketId).emit("getMessage", {
          senderId,
          receiverId,
          message,
          chatId,
          userDetail,
        });
      } else {
        //yo chahi if tyo receiver hamrmo active users array ma chaina i.e offline xa vane atleast hami sender lai chahi message gako xa hai vani pathunu paryo or emit garnu paryo so  tala ko code
        io.to(sender?.socketId).emit("getMessage", {
          senderId,
          message,
          receiverId,
          chatId,
          userDetail,
        });
      }
    }
  );
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log("user disconnect is", socket.id);
    io.emit("getUsers", users);
  });
});

app.get("/", (req, res) => {
  res.json("yo yo wtf");
});

app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

app.use(pageNotFound);

const PORT = process.env.PORT || 8009;

httpServer.listen(PORT, () => {
  //here we
  console.log("listening to port in port ", PORT);
});
