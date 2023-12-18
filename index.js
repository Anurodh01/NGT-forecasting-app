const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();
const SchemaDefinitionModel = require("./schemadefinitionModel");
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: "datacube",
  pass: "teamdata3",
});

// just for reference
// const schema = {
//   tableName : "someTable",
//   fields : [
//     {
//       name : "Field Name" , type : "Number"
//     },
//     ....

//   ]
// }
const newData = {
  tableName: "MyCustomTable",
  data: [
    {
      country: "C2",
      gender: "Male",
      age: "20-40",
      data: {
        2019: 15,
        2020: 6,
      },
    },
  ],
};
const newSchemaDefinition = new SchemaDefinitionModel({
  tableName: "MyCustomTable",
  fields: [
    { name: "country", type: "String" },
    { name: "gender", type: "String" },
    { name: "age", type: "String" },
    { name: "data", type: "Object" }, // Assuming 'Object' type for simplicity
    // Add more fields as needed
  ],
});

app.get("/", (request, response) => {
  response.json(data).status(200);
});

app.post("/createSchema", (req, res) => {
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
    });
});

app.post("/sheet", async (req, res) => {
  const schemaDefinition = await SchemaDefinitionModel.findOne({
    tableName: "MyCustomTable",
  });
  const dynamicSchema = new Schema({});

  schemaDefinition.fields.forEach((field) => {
    dynamicSchema.add({
      [field.name]: {
        type: mongoose.Schema.Types[field.type],
        // You can add more options based on the schema definition
      },
    });
  });

  const DataModel = mongoose.model("MyCustomTable", dynamicSchema);
  const data = new DataModel(newData);
  data
    .save()
    .then((result) => {
      console.log("Data saved:", result);
    })
    .catch((error) => {
      console.error("Error saving data:", error);
    });
});

app.listen(process.env.PORT, () => {
  console.log("app is running on port: " + process.env.PORT);
});
