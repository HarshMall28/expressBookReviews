const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const BASE_URL = 'http://localhost:5000';
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

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});

// Get book details based on ISBN
// Using PROMISE CALLBACKS with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                return res.status(404).json({ message: "Book not found" });
            }
            return res.status(500).json({ message: "Error fetching book", error: err.message });
        });
});

// Get book details based on author
// Using ASYNC/AWAIT with Axios
public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        return res.status(200).json(response.data);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return res.status(404).json({ message: "No books found for this author" });
        }
        return res.status(500).json({ message: "Error fetching books by author", error: err.message });
    }
});

// Get all books based on title
// Using PROMISE CALLBACKS with Axios
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    axios.get(`${BASE_URL}/title/${title}`)
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                return res.status(404).json({ message: "No books found for this title" });
            }
            return res.status(500).json({ message: "Error fetching books by title", error: err.message });
        });
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
