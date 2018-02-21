var express = require("express");
var ejs = require("ejs");
var mysql = require("mysql");
var functions = require("./functions");

var con = mysql.createConnection({
  host: "159.89.166.158",
  user: "root",
  password: "qazwsxedc"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySql DB!");

  // con.query("SHOW DATABASES;", (err, result) => {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // CREATING TABLES IF THEY DON'T EXIST!
  con.query("CREATE DATABASE IF NOT EXISTS SUBS_DB;", (err, result) => {
    if (err) throw err;
    // console.log(result);

    // con.query("SHOW DATABASES", (err, result) => {
    //   if (err) throw err;
    //   console.log(result);
    // });
    con.changeUser({ database: "SUBS_DB" }, err => {
      functions.createTables.checkAndCreate(con, () => {
        console.log("TABLES INITIALIZED");
      });
    });
  });
});

var app = express();
app.use(express.static("static"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const movies = await functions.queries.getTopSixMovies(con);
  console.log(movies);
  res.render("index", { movies });
});

app.get("/subs", async (req, res) => {
  const movie = await functions.queries.getTopSixMovies(con);
  console.log(movie[0]);
  res.render("subs", { movie: movie[0] });
});

app.listen(4000, function() {
  console.log("Server running at port 4000");
});
