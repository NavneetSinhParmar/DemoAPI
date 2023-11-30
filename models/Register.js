const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const reqDate = {
  type: Date,
  required: true,
};

const RegisterDataSchema = mongoose.Schema(
  {
    name: reqString,
    num1: reqNumber,
    date: reqDate,
    num2: reqNumber,
    num3: reqNumber,
    name2: reqString,
    name3: reqString,
    name4: reqString,
    name5: reqString,
    name6: reqString,
    name7: reqString,
    name8: reqString,
    name9: reqString,
    name10: reqString,
    name11: reqString,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("register_data", RegisterDataSchema, "register_data");