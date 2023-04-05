//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

const homeStartingContent = "Welcome to our blog, your ultimate source for the latest updates in the field of machine learning and deep learning. As the world becomes increasingly digitized, these technologies have become integral to many industries, including healthcare, finance, and transportation. Our team of experts is dedicated to keeping you informed about the latest trends, breakthroughs, and advancements in the field, with in-depth analysis, comprehensive guides, and engaging tutorials. Whether you're a seasoned professional or just starting out, our blog is the perfect destination for anyone who wants to stay on the cutting edge of machine learning and deep learning.";
const aboutContent = "Welcome to our blog about the latest updates in the field of machine learning and deep learning! Our mission is to provide valuable insights and knowledge about these exciting topics to help you stay up-to-date and informed.Our team is comprised of passionate data scientists and machine learning experts who are committed to sharing their expertise with the wider community. We believe that knowledge should be shared and accessible to everyone, and that's why we've created this blog. Whether you're a beginner or an expert in the field of machine learning and deep learning, our blog has something for everyone. From introductory articles to in-depth tutorials, we cover a wide range of topics to help you expand your knowledge and improve your skills. We're also committed to fostering a community of like-minded individuals who share our passion for machine learning and deep learning. That's why we encourage our readers to leave comments, share their thoughts and ideas, and engage in discussions with other members of the community.Thank you for visiting our blog and being a part of our community. If you have any feedback or suggestions for future articles, please don't hesitate to contact us. We're always looking for ways to improve and provide the best possible content for our readers.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String,
  tags: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res) {
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving posts");
  }
});


app.get("/about", function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact",{contactContent: contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.post("/compose", async function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    tags: req.body.postTags
  });
  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating post");
  }
});

app.get("/posts/:postId", async function(req, res) {
  const requestedPostId = req.params.postId;
  try {
    const post = await Post.findOne({ _id: requestedPostId });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.render("post", {
      title: post.title,
      content: post.content,
      tags: post.tags
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving post");
  }
});

app.post("/posts/:postId/delete", async function(req, res) {
  const requestedPostId = req.params.postId;
  try {
    await Post.deleteOne({ _id: requestedPostId });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
