const express = require("express");
var bodyParser = require("body-parser");

//Databe
const database = require("./database");

//Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",(req,res) => {
  return res.json({books: database.books});
});


/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN ===  req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route            /c
Description      Get specific book on Category
Access           PUBLIC
Parameter        category
Methods          GET
*/
booky.get("/c/:category", (req,res) => {
  const getSpecificBook = database.books.filter (
    (book) => book.category.includes(req.params.category)
  )

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the Category of ${req.params.category}`})
  }

  return res.json({book: getSpecificBook});
});


/*
Route            /lang
Description      Get specific book on Language
Access           PUBLIC
Parameter        language
Methods          GET
*/
booky.get("/lang/:language", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );
  if (getSpecificBook.length === 0) {
    return res.json({error:`No book found in the language of ${req.params.language}`})
  }

  return res.json({book: getSpecificBook});
});





/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/author", (req,res) => {
  return res.json({authors: database.author});
});


/*
Route            /author/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0) {
    return res.json({error:`No author found for the book of ${req.params.isbn}`})
  }

  return res.json({authors: getSpecificAuthor});
});


/*
Route            /author
Description      Get a specific author on ID
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/author/:id", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({error:`No author found on id ${req.params.id}`})
  }

  return res.json({author: getSpecificAuthor});
});





/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/publications", (req,res) => {
  return res.json({publications: database.publication});
});


/*
Route            /publications
Description      Get specific publications on ID
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/publications/:id", (req, res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.id === parseInt(req.params.id)
  );

  if (getSpecificPublication.length === 0) {
    return res.json({error:`No publication found on id ${req.params.id}`})
  }
  return res.json({publication: getSpecificPublication})
 });


 /*
 Route            /publications/book
 Description      Get list of publications based on the Book
 Access           PUBLIC
 Parameter        isbn
 Methods          GET
 */
 booky.get("/publications/book/:isbn", (req,res) => {
   const getSpecificPublication = database.publication.filter(
     (publication) => publication.books.includes(req.params.isbn)
   )

   if (getSpecificPublication.length === 0) {
     return res.json({error:`No Publication found based on ${req.params.isbn}`})
   }
   return res.json({publication: getSpecificPublication});
 });



//------------------------------------------------------------------------------------//

//POST
/*
Route            /book/new
Description      Add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/book/new",(req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});


/*
Route            /author/new
Description      Add new Authors
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/author/new", (req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json(database.author);
});


/*
Route            /publication/new
Description      Add new Publications
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});





booky.listen(3000,() => {
  console.log("Server is up and running");
});
