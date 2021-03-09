const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');


const app = express();
app.set("view engine" , ejs);
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});


const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article" , articleSchema );



//requesting all article


app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })
  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("no errors and a new article has been added")
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {

    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("successfuly deleted all articles");
      } else {
        res.send(err);
      }
    })

  });


//requesting specific article

  app.route("/articles/:articleTitle")
  .get(function(req,res){

    Article.findOne({title:req.params.articleTitle } , function(err, foundArticle){
      if(!err){
        if (foundArticle){
          res.send(foundArticle);
        }else{
          res.send("Not Found Article");
        }
      }else{
        res.send(err);
      }
    })
  })
  .put(function(req,res){  //put replaces the entire article
    Article.update({title:req.params.articleTitle} , {title: req.body.title , content: req.body.content}, {overwrite:true}, function(err, updatedArticle){
      if (!err){
        res.send("successfuly updated article");
      }else{
        res.send(err);
      }

    })
  })
  .patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle} ,{ $set: req.body}, function(err, updatedArticle){ //req.body = {title: "", content = ""} same as {title = " " , content=""}
      if (!err){
        res.send("successfuly updated article");
      }else{
        res.send(err);
      }

    })
  })
  .delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
      if (!err) {
        res.send("successfuly deleted one specific article");
      } else {
        res.send(err);
      }
    })
  });

// app.get("/articles", function(req,res){
//   Article.find({}, function(err, foundArticles){
//     if (!err){
//       res.send(foundArticles);
//     }else{
//       res.send(err);
//     }
//
//   });
// });
//
//
// app.post("/articles" , function(req,res){
//   console.log(req.body.title);
//   console.log(req.body.content);
//
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//
//   newArticle.save(function(err){
//     if (!err){
//       res.send("no errors and a new article has been added")
//     }else{
//       res.send(err);
//     }
//   });
// })
//
//
// app.delete("/articles", function(req,res){
//
//   Article.deleteMany({}, function(err){
//     if (!err){
//       res.send("successfuly deleted all articles");
//     }else{
//       res.send(err);
//     }
//   })
//
// })





app.listen("3000", function(){
  console.log("server started on port 3000");
})
