const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        return res.status(200).send(JSON.stringify(book))
    }else{
        return res.status(404).json({message: "Book not found"});
    }
  //Write your code here
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author.toLocaleLowerCase();
  let book = Object.values(books).filter((book)=> book.author.toLocaleLowerCase() === author);
  if(book.length > 0){
    return res.status(200).send(JSON.stringify(book))
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title.toLocaleLowerCase();
    let book = Object.values(books).filter((book)=> book.title.toLocaleLowerCase() === title);
    if(book.length > 0){
        return res.status(200).send(JSON.stringify(book))
    }else{
        return res.status(404).json({message: "Book not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn]
  if(book.reviews){
    return res.status(200).send(JSON.stringify(book.reviews));
  }else{
    return  res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
