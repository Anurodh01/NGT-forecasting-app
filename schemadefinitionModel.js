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
});

const SchemaDefinitionModel = mongoose.model(
  "SchemaDefinition",
  schemaDefinitionSchema
);

module.exports = SchemaDefinitionModel;
