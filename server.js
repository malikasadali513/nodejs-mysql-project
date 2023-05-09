const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
// const cors = require("cors");
const dotenv = require("dotenv");

var bodyParser = require("body-parser");

dotenv.config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
const connection = require("./config/db");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/viewsf"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/create", (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const name = req.body.name;
  const isbn = req.body.isbn;

  try {
    connection.query(
      "INSERT into books_table(title, name, isbn) value(?, ?, ?)",
      [title, name, isbn],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/data")
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
app.get("/data", (req, res)=>{
    connection.query("select * from books_table", (err, rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('read', {rows: rows});
        }
    });
});
app.listen(process.env.PORT || 4000, (error) => {
  if (error) throw error;
  console.log(`server runing on ${process.env.PORT}`);
});
