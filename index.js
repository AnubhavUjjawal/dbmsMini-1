const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const passport = require("passport");
const cookieSession = require("cookie-session");
const formidable = require("express-formidable");
const CSV = require("comma-separated-values");

const functions = require("./functions");
const authRoutes = require("./routes/authRoutes");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

var con = mysql.createConnection({
  host: "159.89.166.158",
  user: "root",
  password: "qazwsxedc"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySql DB!");

  // CREATING TABLES IF THEY DON'T EXIST!
  con.query("CREATE DATABASE IF NOT EXISTS SUBS_DB;", (err, result) => {
    if (err) throw err;

    con.changeUser({ database: "SUBS_DB" }, err => {
      functions.createTables.checkAndCreate(con, () => {
        console.log("TABLES INITIALIZED");
      });
    });
  });
});

passport.serializeUser((user, done) => {
  done(null, user.uid);
});
passport.deserializeUser((id, done) => {
  con.query(`SELECT * from USERS WHERE uid=${id}`, (err, result) => {
    if (err) throw err;
    done(null, result[0]);
  });
});

//passport for google
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "117404136941-8rjlig8nhvd7r2ugon2pgqe3fmqbgd1v.apps.googleusercontent.com",
      clientSecret: "Qmz6nrDBqIP8kMexKexi3j5E",
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      console.log(profile);
      con.query(
        `SELECT * FROM USERS WHERE uid=${profile.id}`,
        (err, result) => {
          if (err) throw err;
          // console.log(result);
          if (result.length == 0) {
            let query = `INSERT INTO USERS (uid, name) VALUES ( ${profile.id}, 
              "${profile.displayName}" );`;
            // console.log(query);
            con.query(query, (err, result) => {
              if (err) throw err;
              // console.log(result);
              con.query(
                `SELECT * FROM USERS WHERE uid=${profile.id}`,
                (err, result) => {
                  if (err) throw err;
                  // console.log(result);
                  done(null, result[0]);
                }
              );
            });
          } else {
            done(null, result[0]);
          }
        }
      );
    }
  )
);

var app = express();

app.use(express.static("static"));
app.use(require("cookie-parser")());
// app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  cookieSession({
    maxAge: 24 * 12 * 3600 * 1000,
    keys: ["anuragguptapreethihena"]
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);
app.set("view engine", "ejs");
authRoutes(app);
app.use(formidable());

const getGenreListAndSetUser = (req, res, next) => {
  con.query("SELECT * FROM Genre;", (err, result) => {
    if (err) throw err;
    // console.log(result);
    // resolve(result);
    res.locals.genres = result;
    res.locals.user = req.user;
    next();
  });
};
app.use(getGenreListAndSetUser);

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

app.get("/search-movie", (req, res) => {
  res.redirect("/");
});

// searching movie in database.
app.post("/search-movie", async (req, res) => {
  const genre = req.fields.genre;
  if (genre == undefined) {
    const movies = await functions.queries.getTop30Movies(con);
    res.render("query", { movies, genre: "All" });
  } else {
    const gname = await functions.queries.getGenreName(con, genre);
    // console.log(gname, gname[0].gname);
    const results = await functions.queries.searchMoviesByGenre(con, genre);
    res.render("query", { movies: results, genre: gname[0].gname });
    // res.send(results);
  }
});

//requesting for movie
app.get("/add-new-movie", (req, res) => {
  res.render("addMovie");
});

app.post("/add-new-movie", (req, res) => {
  const values = req.fields;
  var csv = new CSV(req.fields.keywords);
  values.keywords = csv.parse()[0];
  res.send(values);
});

app.listen(4000, function() {
  console.log("Server running at port 4000");
});
