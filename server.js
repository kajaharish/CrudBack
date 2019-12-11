const express = require('express')
const app = express()
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://mongo:27017";

const cors = require('cors');


app.use(cors());

var dbo;
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
  dbo = db.db('testDb');
  dbo.createCollection("products", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });
});

app.post("/signup123", (req, res) => {
  const myData = req.body;
  dbo.collection("products").insertOne(myData, function (err, res) {
    if (err) {
      throw err;
    }
    console.log("Number of documents inserted: " + res.insertedCount);
  });
  res.send(myData);
});


app.delete('/delete', (req, res) => {

  var uname = req.query.id;
  console.log( req.query);
  console.log(uname);
  dbo.collection("products").deleteOne({username:uname}, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/login',(req,res)=>{
  var username = req.body.uname;
  var password = req.body.pass;

  dbo.collection("products").findOne({username,password}, function (err, result){

    if(err){
      throw err;
    }
    else{
      if (result == null ){
       res.send("user doesnot exist");
      }
      else{
       res.send(JSON.stringify(result));
        // res.json(result);
      }
    }
  })
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
