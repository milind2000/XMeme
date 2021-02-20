const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Meme = require("./models/meme");

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb://localhost:27017/memeDB";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res) => {
  Meme.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .then((result) => {
      res.render("index", { memes: result, title: "All Memes" });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.post("/", (req, res) => {
  const meme = new Meme(req.body);
  meme
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(409).send(err);
    });
});

app.get("/memes", (req, res) => {
  Meme.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.post("/memes", (req, res) => {
  const meme = new Meme({
    name: req.body.name,
    url: req.body.url,
    caption: req.body.caption,
  });
  meme
    .save()
    .then((result) => {
      res.json({
        id: result._id,
      });
    })
    .catch((err) => {
      res.status(409).send(err);
    });
});

app.get("/memes/:id", (req, res) => {
  const id = req.params.id;
  Meme.findById(id)
    .then((result) => {
      res.json({
        id: result._id,
        name: result.name,
        url: result.url,
        caption: result.caption,
      });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

let port = process.env.PORT || 3000 || 8081 || 8080;

app.listen(port, function () {
  console.log("Server started.");
});
