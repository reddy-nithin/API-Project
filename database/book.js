const mongoose = require("mongoose");

//create book schema
const BookSchema = mongoose.Schema(
  {
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    publications: [Number],
    category: [String]
  }
);

//Model
const BookModel = mongoose.model("books",BookSchema);

//exports
module.exports = BookModel;
