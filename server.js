const express = require("express"); 
const app = express(); 
// const cors = require("cors");
const dotenv = require("dotenv");

var bodyParser = require("body-parser");
const multer = require('multer');

dotenv.config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
const connection = require("./config/db");


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/create", upload.single('image'), (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const name = req.body.name;
  const isbn = req.body.isbn;
  const image = req.file.filename;
  try {
    connection.query(
      "INSERT into books_table(title, name, isbn, image) value(?, ?, ?, ?)",
      [title, name, isbn, image],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.redirect("/create.html");
});
app.get("/data", (req, res) => {
  connection.query("select * from books_table", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.locals.message = "Book Data submitted successfully";
      res.render("read", { rows: rows });
    }
  });
});

app.listen(process.env.PORT || 4000, (error) => {
  if (error) throw error;
  console.log(` server is working at http://localhost:${process.env.PORT}`);
});
