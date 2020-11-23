const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs= require('fs');
const fileUpload = require('express-fileupload');


const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://shaikh:shaikh@cluster0.vs5s5.mongodb.net/AgencyIT?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('order'));
app.use(fileUpload());

const file = require('file-system');
app.get("/", (req, res) => {
  res.send("Creative Agency service provide we are");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("AgencyIT").collection("reviewData");
  // perform actions on the collection object
  app.post("/addreview", (req, res) => {
    const feedback = req.body;
    // console.log(feedback);

    collection.insertOne(feedback)
    .   then((response) => {
      res.send(res.insertedCount > 0);
    });
  });

  app.get('/getfeedback', (req, res) =>{
    collection.find({}).sort({_id:-1}).limit(3)
    .toArray((err,documents) =>{
    console.log(err)
    res.send(documents)
    })
    
    })
    
    const orderCollection = client.db("AgencyIT").collection("orderCourse");
    app.post("/addorder", (req, res) =>{
      const file = req.files.file;
      const name = req.body.name;
      const email = req.body.email;
      const service = req.body.service;
      const description = req.body.description;
      const price = req.body.price;
      console.log(name,email,service,price);
      const newImg = file.data;
    
      const encImg = newImg.toString('base64');
      
  
      var image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encImg, 'base64')
      };
      
      
    orderCollection.insertOne({name,email,service,description,price,image})
    .then((response) => {
       res.send(response.insertedCount>0)
    })
     
    })
    
    app.get('/serviceget', (req, res) =>{
      orderCollection.find({}).sort({_id:-1}).limit(3)
      .toArray((err,documents) =>{
      console.log(err)
      res.send(documents)
      })
      
      })
      app.get('/servicegetadmin', (req, res) =>{
        orderCollection.find({})
        .toArray((err,documents) =>{
        console.log(err)
        res.send(documents)
        })
        
        })
      
      app.get('/readOrder',(req,res) => {
        orderCollection.find({email:req.query.email})
        .toArray((err , documents)=>{
          res.send(documents)
        })
      })
});

app.listen(10000, () => console.log("Agency it service"));
