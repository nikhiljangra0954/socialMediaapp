//  here we will create first a simple app

const express = require("express");
const { connection } = require("./config/db");
const app = express();
const cors = require("cors");
const { userRouter } = require("./Routes/userRoutes");
const { postRoute } = require("./Routes/PostRoutes");
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Social Media Application ");
});
app.use("/api", userRouter);
app.use("/api",postRoute)

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connection established with MongoDB Atlas");
  } catch (error) {
    console.log(error);
  }
});
