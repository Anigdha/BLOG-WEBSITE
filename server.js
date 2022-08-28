// const express = require('express');
// const app = express();
// const { MongoClient } = require("mongodb");
// const PORT = 8000;
// const articlesInfo={};
// // const articlesInfo = {
// //     "learn-react" : {
// //         comments: [],
// //     },
// //     "learn-node" : {
// //         comments: [],
// //     },
// //     "my-thoughts-on-learning-react" : {
// //         comments: [],
// //     },
// // }

// app.use(express.json({ extended : false }));

// app.get('/api/articles/:name' , async(req,res) => {
//     try{
//         const articleName = req.params.name;
//         const client = await MongoClient.connect('mongodb://localhost:27017')
//         const db=client.db("mernBlog")
//         articlesInfo = await db
//                             .collection('articles')
//                             .findOne({name:articleName});
//         res.status(200).json(articlesInfo);
//         client.close();
//     } catch(error) {
//         res.status(500).json({ message: "Error connecting to db", error });
//     }
// })

// app.post('/api/articles/:name/add-comments', (req,res) => {
//     const { username,text } = req.body;
//     const articleName = req.params.name;
//     articlesInfo[articleName].comments.push({username,text});
//     res.status(200).send(articlesInfo[articleName]);
// })



// //app.post("/" , (req,res) =>  res.send("Hello, world!"))
// //app.get("/hello/:name", (req,res) => res.send(`hello ${req.params.name}`)); 
// one way is req.body and other way is req.params to get data

// app.listen(PORT, () => console.log(`Server started at ${PORT}`));






const express = require("express");
const app = express(); //creating express app
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 8000;

// Initialize middleware
// we use to have to install body parser but now it is a built in middleware
// function of express. It parses incoming JSON payload
app.use(express.json({ extended: false }));
//app.get("/" , (req,res) =>  res.send("Hello, world!"))
const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("mernBlog"); 
    await operations(db);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error });
  }
};

app.get("/api/articles/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(articleInfo);
  }, res);
});

app.post("/api/articles/:name/add-comments", (req, res) => {
  // by using middleware(postman) we are able to access the JSON body that was written there for post request->req.body
  const { username, text } = req.body; 
  const articleName = req.params.name;

  withDB(async (db) => {
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({ username, text }),
        },
      }
    );
    const updateAricleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(updateAricleInfo);
  }, res);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));