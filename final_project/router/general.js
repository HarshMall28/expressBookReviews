const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const BASE_URL = "http://localhost:5000";
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "User successfully registered. Now you can login",
      });
    } else {
      return res
        .status(404)
        .json({ message: "User already exists!" });
    }
  }
});

public_users.get("/", async function (req, res) {
  try {
    // Get data directly, send via async/await
    const getBooks = await Promise.resolve(books);
    return res.status(200).json(getBooks);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: err.message });
  }
});

// Get book details based on ISBN
// Using PROMISE CALLBACKS with Axios
// Get book by ISBN — AXIOS with Promise callbacks
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get books by author — PROMISE CALLBACKS (no axios)
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  new Promise((resolve, reject) => {
    let filtered = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase(),
    );
    if (filtered.length > 0) resolve(filtered);
    else reject("No books found for this author");
  })
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get books by title — ASYNC/AWAIT (no axios)
public_users.get("/title/:title", async function (req, res) {
  let title = req.params.title;
  try {
    const matchingBooks = await new Promise((resolve, reject) => {
      let filtered = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase(),
      );
      if (filtered.length > 0) resolve(filtered);
      else reject("No books found for this title");
    });
    return res.status(200).json(matchingBooks);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
