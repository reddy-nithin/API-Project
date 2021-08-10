const mongoose = require("mongoose");

//create book schema
const PublicationSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String]
  }
);

//Model
const PublicationModel = mongoose.model("publications",PublicationSchema);

//exports
module.exports = PublicationModel;
