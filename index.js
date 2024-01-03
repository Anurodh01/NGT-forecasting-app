const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();
const SchemaDefinitionModel = require("./schemadefinitionModel");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: "datacube",
  pass: "teamdata3",
});

app.post("/schema", async(req, res) => {

  // check whether schema already exist or not
  let tableName= req.body.tableName;
  const schemaExist= await SchemaDefinitionModel.findOne({tableName: tableName});
  console.log(schemaExist)

  if(schemaExist){
    return res.status(400).json({
      "status":"fail",
      "message": `Sheet with name ${tableName} is already exist!!`
    });
  }

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
  if (schema) {
    res.send(schema).status(200);
  } else {
    res.status(404).json({
      message: `Sheet ${tableName} does not exist`,
    });
  }
});

app.post("/sheet/:tableName", async (req, res) => {
  const { tableName } = req.params;
  console.log(req.params);
  const schemaDefinition = await SchemaDefinitionModel.findOne({
    tableName: tableName,
  });
  const dynamicSchema = new Schema({}, { versionKey: false });

  schemaDefinition.fields.forEach((field) => {
    dynamicSchema.add({
      [field.name]: {
        type: mongoose.Schema.Types[field.type],
      },
    });
  });
  const DataModel = mongoose.model(tableName, dynamicSchema, tableName);
  let sheet = [];
  for (let cell of req.body.sheet) {
    const result = await DataModel.create(cell);
    sheet.push(result);
  }
  res
    .json({
      sheet,
    })
    .status(201);
});

app.get("/sheet/:tablename", async (request, response) => {
  const { tablename } = request.params;
  const db = mongoose.connection.db;
  const result = await db.collection(`${tablename}`).find().toArray();
  response
    .json({
      sheet: result,
    })
    .status(200);
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
