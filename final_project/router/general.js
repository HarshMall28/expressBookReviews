const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        if(!isValid(username)){
            users.push({"username":username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }else{
            return res.status(404).json({ message: "User already exists!" });
        }
    }
})

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try{
    const getBooks = await new Promise((res,rej)=>{
        res(books)
    })
    return res.status(200).send(JSON.stringify(getBooks))
  }catch(err){
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    let isbn = req.params.isbn;
     new Promise((res, rej)=>{
        let book = books[isbn];
        if(book){
            res(book);
        }else{
            rej("Book not found");
        }
     }).then((book)=>{
        return res.status(200).json(book);
     }).catch((err)=>{
        return res.status(404).json({ message: err });
     });
 
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author;
  console.log(author);
  try{
        const book = new Promise((res, rej)=>{
            let filtered = Object.values(books).filter(
                (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
            );
            console.log(filtered);
            if (filtered.length > 0) {
                res(filtered);
            } else {
                rej("No books found for this author");
            }
        }).then((book) => {
            return res.status(200).json(book);
        })
    }catch(err){
        return res.status(404).json({ message: err });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title.toLocaleLowerCase();
    try{
        const book = await new Promise((res,rej)=>{
            let filtered = Object.values(books).filter(
                (book) => book.title.toLowerCase() === title.toLowerCase()
            );
            if (filtered.length > 0) {
                res(filtered);
            } else {
                rejec("No books found for this title");
            }
        });
        return res.status(200).json(book);
    }catch(err){
        return res.status(404).json({ message: err });
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
