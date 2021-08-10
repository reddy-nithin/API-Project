const mongoose = require("mongoose");

//create book schema
const AuthorSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String]
  }
);

//Model
const AuthorModel = mongoose.model("authors",AuthorSchema);

//exports
module.exports = AuthorModel;
