const mongoose = require("mongoose");
const { Schema } = mongoose;

const schemaDefinitionSchema = new Schema({
  tableName: {
    type: String,
    required: true,
    unique: true,
  },
  fields: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  time: {
    series: {
      type: "String",
      required: true,
    },
    start: {
      type: "String",
      required: true,
    },
    end: {
      type: "String",
      required: true,
    },
  },
});

const SchemaDefinitionModel = mongoose.model(
  "SchemaDefinition",
  schemaDefinitionSchema
);

module.exports = SchemaDefinitionModel;
