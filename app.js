var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer = require('express-sanitizer');

//mongoose.connect("mongodb://localhost/blog_app");
mongoose.connect("mongodb://zankhana:password@ds249707.mlab.com:49707/blogapp_zankhana")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//schema setup

var blogSchema = new mongoose.Schema({
    title: "String",
    image: "String",
    body: "String",
    created: {type: Date, default: Date.now()} 
});

var Blog = mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } else {
           res.render("index",{blogs: blogs});       
       }
    });
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } else {
           res.render("index",{blogs: blogs});       
       }
    });
});

//CREATE ROUTE

app.post("/blogs",function(req,res){
    
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new.ejs");
       } else {
           res.redirect("/blogs");
       }
   }); 
});


//NEW ROUTE
app.get("/blogs/new",function(req,res){
   res.render("new.ejs"); 
});



app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
       if(err) {
           res.render("/blogs");
       } else {
            res.render("show",{blog: foundBlog});       
       }
    });
    
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog: foundBlog});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitze(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/"+ req.params.id);
      }
    });      
});


app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server started!!!");
});