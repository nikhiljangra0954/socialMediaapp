// here we  will create all post related Routes
const express = require("express");
const { userModel } = require("../Model/userModel");
const { postModel } = require("../Model/postModel");
const postRoute = express.Router();

// postRoute.get("/post",(req,res)=>{
//     res.send("Post Route in working")
// })

// first lets post a post

postRoute.post("/post/:id", async (req, res) => {
  const id = req.params.id;
  const { text, image, createdAt } = req.body;
  try {
    const user = await userModel.findOne({ _id: id });
    const userposts = user.posts;
    const newpost = new postModel({
      user: id,
      text,
      image,
      createdAt,
    });
    await newpost.save();
    // get the post from the post Model and send it to the User Model
    const userPost = await postModel.findOne({ user: id });
    userposts.push(userPost);
    user.save();
    res.send("Post created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// get all the post of a particular User

postRoute.get("/posts", async (req, res) => {
  // get all the post from the posts database
  try {
    const allpost = await postModel.find();
    res.status(200).send(allpost);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});



// delete a post using his id

postRoute.delete("/posts/:id", async (req, res) => {

    const id = req.params.id;
    try {
        const post = await postModel.findByIdAndDelete({ _id:id });
        res.status(202).send("Post deleted successfully")
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message });
    }

})

// get a specific post using its id

postRoute.get("/post/:id",async (req,res)=>{
    const id = req.params.id
    try {
        const post = await postModel.findOne({_id :id})
        res.status(200).send(post)
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error})
    }
})

module.exports = {
  postRoute,
};
