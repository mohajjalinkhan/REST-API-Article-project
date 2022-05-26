const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static("public"));

// testing root = home
//app.get("/", function (req, res) {
//    res.send("hello");
//});

// Mongodb connection 
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});
//creating schema
const articleSchema = {
    title: String,
    content: String
};
//creating  Model
const Article = mongoose.model("Article", articleSchema);

// // Read get request
// app.get("/articles", function (req, res) {
//     Article.find(function (err, foundArticles) {
//         if (!err) {
//             res.send(foundArticles);
//         } else {
//             // If there is some error then send error to client
//             res.send(err);
//         }
//     });
// });
// // create post 
// app.post("/articles", function (req, res) {
//     // console.log(req.body.title);
//     // console.log(req.body.content);
//     //adding post in mongodb
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function (err) {
//         if (!err) {
//             res.send("Post Successfully added a new article.")
//         } else {
//             res.send(err);
//         }
//     });
// });
// // deleting all article 
// app.delete("/articles", function (req, res) {

//     Article.deleteMany(function (err) {
//         if (!err) {
//             res.send("Articles Deleted Succesfully.");
//         } else {
//             res.send(err);
//         }
//     });

// });

// REST Route Method
//app.route("/article").get().post().delete()
//Requests targetting all article
app.route("/article")

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                // If there is some error then send error to client
                res.send(err);
            }
        });
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Post Successfully added a new article.")
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {

        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Articles Deleted Succesfully.");
            } else {
                res.send(err);
            }
        });

    });
//Requests tragetting a specific article

app.route("/articles/:articleTitle")
    // req.params.articleTitle = "Name of Query"
    .get(function (req, res) {

        Article.findOne({
            title: req.params.articleTitle
        }, function (err, foundArticles) {
            if (foundArticles) {
                res.send(foundArticles);
            } else {
                res.send("No articles matching that title.");
            }
        })
    })
    .put(function (req, res) {
        Article.updateMany(
            {title:req.params.articleTitle},
            {title:req.body.title,content:req.body.content},
            {overwrite:true},
            function(err){
                if(!err){
                    res.send("Successfully updated article.");
                }
            }
        );
    })
    .patch(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle},
            {$set:req.body},
            function(err){
                if(!err){
                    res.send("Updated successfully")
                }else{
                    res.send(err);
                }
            }

        );
    })
    .delete(function(req,res){
     Article.deleteOne(
         {title:req.params.articleTitle},
         function(err){
             if(!err){
                 res.send("Article deleted successfully.");
             }else{
                 res.send(err);
             }
         }
     );
    });








app.listen(3000, function () {
    console.log("Server started on port 3000");
});

//For Testing I used Postman