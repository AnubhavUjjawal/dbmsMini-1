var express = require("express");
var ejs = require("ejs");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "159.89.166.158",
  user: "root",
  password: "qazwsxedc"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySql DB!");
});

var app = express();

// index html page
var template = ejs.renderFile("./templates/index.ejs", (err, str) => {
  if (err) {
    console.log(err);
    res.send("some error occured");
  }
  app.get("/", (req, res) => {
    res.send(str);
  });
});

app.listen(5000, function() {
  console.log("Server running at port 5000");
});
