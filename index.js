require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection Established"));


/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});


/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",async (req,res) => {

  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});


  //null  !0=1, !1=0
  if(!getSpecificBook) {
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
booky.get("/c/:category", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});


  //null  !0=1, !1=0
  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.category}`});
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
booky.get("/author", async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
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
booky.post("/book/new", async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added !!!"
  });
});


/*
Route            /author/new
Description      Add new Authors
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/author/new", async (req,res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);

  return res.json({
    author: addNewAuthor,
    message: "Author was added !!!"
  });
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




//------------------------------------------------------------------------------------//


//PUT
/*
Route            /book/update
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/update/:isbn", async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook
  });
});

/*------------Updating new author------------*/
/*
Route            /book/author/update
Description      Update/add new auhtor
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/author/update/:isbn", async(req,res) => {
  //Update book Database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.body.newAuthor
      }
    },
    {
      new: true
    }
  );


  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New Author was added !!"
  });

});




/*
Route            /publication/update/book
Description      Update/add new publicaiton
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );
});


//------------------------------------------------------------------------------------//


//DELETE
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/
booky.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn, just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
});


/*
Route            /book/delete/author
Description      DELETE author from the book and related book from author
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.authors.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.authors = newAuthorList;
       return;
     }
   });


  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});




booky.listen(3000,() => {
  console.log("Server is up and running");
});
