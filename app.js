const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Meme = require("./models/meme");
var PORT = 3000 || process.env.PORT;
// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI =
  "mongodb+srv://milind_30:Milind30@cluster0.04btf.mongodb.net/mern?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
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
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const meme = new Meme(req.body);
  meme
    .save()
    .then((result) => {
      //console.log(result._id);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/memes", (req, res) => {
  Meme.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .then((result) => {
      res.json(result);
      //console.log(result);
    })
    .catch((err) => {
      console.log(err);
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
      //console.log(result._id);
    })
    .catch((err) => {
      console.log(err);
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
      //console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
