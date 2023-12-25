const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();
const SchemaDefinitionModel = require("./schemadefinitionModel");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: "datacube",
  pass: "teamdata3",
});

app.get("/", (request, response) => {
  response.json(data).status(200);
});

app.post("/schema", (req, res) => {
  const newSchemaDefinition = new SchemaDefinitionModel(req.body);
  newSchemaDefinition
    .save()
    .then((result) => {
      console.log("Schema definition saved", result);
      res
        .send({
          tableName: result["tableName"],
          id: result["_id"],
        })
        .status(201);
    })
    .catch((error) => {
      console.error("Some error occured", error);
      res.status(500);
    });
});

app.get("/schema", async (req, res) => {
  const tableName = req.query.table;
  const schema = await SchemaDefinitionModel.findOne({ tableName: tableName });
  res.send(schema).status(200);
});

app.post("/sheet/:tableName", async (req, res) => {
  const { tableName } = req.params;
  console.log(req.params);
  const schemaDefinition = await SchemaDefinitionModel.findOne({
    tableName: tableName,
  });
  const dynamicSchema = new Schema({});

  schemaDefinition.fields.forEach((field) => {
    dynamicSchema.add({
      [field.name]: {
        type: mongoose.Schema.Types[field.type],
      },
    });
  });
  const DataModel = mongoose.model(tableName, dynamicSchema, tableName);
  req.body.sheet.forEach((data) => {
    const dataModel = new DataModel(data);
    dataModel
      .save()
      .then((result) => {
        console.log("Data saved:", result);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  });
  res.status(201);
});

app.get("/sheet/:tablename", async (request, response)=>{
    const { tablename } = request.params;
    const db= mongoose.connection.db;
    const result= await db.collection(`${tablename}`).find().toArray(); 
    response.json({
      "sheet": result
    }).status(200);
});

app.put("/sheet/:tablename", async(req, res)=>{
  const data= req.body;
  const { tablename } = req.params;

  const db= mongoose.connection.db;
  const collection = await mongoose.connection.db.listCollections({ name: tablename }).toArray();
  if(collection.length > 0) {
   data.sheet.forEach(async(cell)=> {
      const collection = db.collection(tablename);
      const _id = cell._id;
      delete cell._id;
      await collection.updateOne({_id: new mongoose.Types.ObjectId(_id)}, {$set:cell }, {upsert: true});
   });
  }

  res.json({
    "status":"Sheet Updated successfully"
  }).status(200);
});


app.listen(process.env.PORT, () => {
  console.log("app is running on port: " + process.env.PORT);
});
