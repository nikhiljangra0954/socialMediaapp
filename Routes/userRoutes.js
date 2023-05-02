// here we will create all User Routes

const express = require("express");
const bcrypt = require("bcrypt");
const { userModel } = require("../Model/userModel");
const userRouter = express.Router();

// userRouter.get("/", async (req, res) => {
//   res.send("welcome to User Route");
// });

// Registering a new User to our app
userRouter.post("/register", async (req, res) => {
  // get details from the body
  const { name, email, password, dob, bio } = req.body;
  if (!name || !email || !password || !dob || !bio) {
    res.send("Please fill all the details");
  }
  try {
    // change the password usig bcrypt
    bcrypt.hash(password, 3, async function (err, hash_password) {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        const User = new userModel({
          name,
          email,
          password: hash_password,
          dob,
          bio,
        });
        await User.save();
        res.status(201).send(`${User.name} registered successfully`);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});

// /Users to get all the User Registred in our dataBase

userRouter.get("/users", async (req, res) => {
  // get all the User List
  try {
    const users = await userModel.find();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});

// Now send a friend request to the User and show it in the friendsRequest array
userRouter.post("/users/:id/friends", async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  // find the User by its Id if present
  try {
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      res.send("This user does not exist");
    } else if (user) {
      // res.send(payload)
      // check if he already sent him req or not
      const friendreq = user.friendRequests;
      for (let i = 0; i < friendreq.length; i++) {
        if (friendreq[i] == _id) {
          res.send("You already sent him friend request");
        }
      }
      user.friendRequests.push(_id);
      user.save();
      res.status(201).send("Friend request sent");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});

// get all the friends of a particular user

userRouter.get("/users/:id/friends", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      res.send("User Not found");
    } else {
      const friends = user.friends;
      res.status(200).send(friends);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});

// lets create a new Route to accept and reject the friend req by the User

userRouter.patch("/users/:id/friends/:friendid", async (req, res) => {
  const id = req.params.id;
  const friendid = req.params.friendid;
  // find the User first
  try {
    const user = await userModel.findOne({ _id: id });
    const friendReq = user.friendRequests;
    const friends = user.friends;
    // if user want to accept friend req than he will pop the friend from the friend req and push it into the friends array
    // res.send(friendReq)
    for (let i = 0; i < friendReq.length; i++) {
      if (friendReq[i] == friendid) {
        friends.push(friendReq[i]);
        friendReq.splice(i, 1);
      }
    }
    await user.save();
    res.status(204).send("Friend Request accepted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
});

module.exports = {
  userRouter,
};
