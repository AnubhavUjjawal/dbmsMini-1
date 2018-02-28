const async = require("async");
const getTopSixMovies = (con, callback) => {
  return new Promise(resolve => {
    con.query(
      "SELECT * FROM Movie ORDER BY release_date DESC LIMIT 6;",
      (err, result) => {
        if (err) throw err;
        // console.log(result);
        resolve(result);
      }
    );
  });
};

const getTop30Movies = (con, callback) => {
  return new Promise(resolve => {
    con.query(
      "SELECT * FROM Movie ORDER BY release_date DESC LIMIT 30;",
      (err, result) => {
        if (err) throw err;
        // console.log(result);
        resolve(result);
      }
    );
  });
};

const searchMoviesByGenre = (con, gid, callback) => {
  return new Promise(resolve => {
    con.query(
      `SELECT DISTINCT * FROM Movie AS m WHERE m.mid IN (SELECT g.mid FROM Genre_list AS g WHERE g.gid=${gid}) ORDER BY release_date DESC;`,
      (err, result) => {
        if (err) throw err;
        // console.log(result);
        resolve(result);
      }
    );
  });
};

const getMovieDetails = (con, mid, callback) => {
  return new Promise(resolve => {
    con.query(`SELECT * FROM Movie AS m WHERE m.mid=${mid}`, (err, result) => {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
};

const getGenreList = (con, callback) => {
  return new Promise(resolve => {
    con.query("SELECT * FROM Genre;", (err, result) => {
      if (err) throw err;
      // console.log(result);
      resolve(result);
    });
  });
};

const insertKeyword = (con, mid, values) => {
  return new Promise(resolve => {
    async.eachSeries(values, function(value, callback) {
      con.query(`SELECT * FROM Keyword WHERE kname="${value}";`, (err, result) => {
        if (err) throw err;
        if(result.length == 0){
          con.query("SELECT * FROM Keyword ORDER BY kid DESC LIMIT 1;", (err, result) => {
            if (err) throw err;
            const kid_insrt = result[0].kid+1;
            con.query(`INSERT INTO Keyword (kid, kname) VALUES(${result[0].kid+1}, "${value}");`, (err, result) => {
              if(err) throw err;
              console.log("inserted");
              con.query(`INSERT INTO Keyword_list (mid, kid) VALUES(${mid},${kid_insrt});`, (err, result) => {
                if (err) throw err;
                console.log("keyword with movie");
                callback();
              });
              // callback();
            });            
          }); 
        }
        else{
         console.log(result, "printing rsult"); 
         con.query(`INSERT INTO Keyword_list (mid, kid) VALUES(${mid},${result[0].kid});`, (err, result) => {
                if (err) throw err;
                console.log("keyword with movie");
                callback();
              });
      }
      });
    });
    resolve();
  });
};

const relateKeywordMovie = (con, values, mid) => {
  return new Promise(resolve => {
    async.eachSeries(values, function(value, callback1){
      con.query(`SELECT * FROM Keyword WHERE kname="${value}";`, (err, result) => {
        if (err) throw err;
        console.log("check");
        console.log(result);
        
          con.query(`INSERT INTO Keyword_list (mid, kid) VALUES(${mid},${result[0].kid});`, (err, result) => {
          if (err) throw err;
          console.log("keyword with movie");
          callback1();
        });
      });
      
    });
    resolve();
  });
};

const relateGenreMovie = (con, gid_array, mid) => {
  return new Promise(resolve => {
    gid_array.forEach(function(id) {
      con.query(`INSERT INTO Genre_list (mid, gid) VALUES(${mid}, ${id});`, (err, result) => {
        if (err) throw err;
        console.log("genre_movie");
      });
    });
    resolve();
  });
};

const getNextMovieId = (con, callback) => {
  return new Promise(resolve => {
    con.query(
      "SELECT * FROM Movie ORDER BY mid DESC LIMIT 1;",
      (err, result) => {
        if (err) throw err;
        // console.log(result[0].mid);
        resolve(result);
      }
    );
  });
};

const insertMovie = (con, values, mid) => {
  return new Promise(resolve => {
    console.log(values.title);
    con.query(
      `INSERT INTO Movie (mid, title, release_date, vote_avg, budget, homepage) VALUES(${mid}, "${
        values.title
      }", "${values.release_date}", "${values.vote_avg}", "${
        values.budget
      }", "${values.homepage}");`,
      (err, result) => {
        if (err) throw err;
        // console.log(result[0].mid);
        resolve(result);
      }
    );
  });
};

const deleteMovie = (con, mid) => {
  return new Promise(resolve => {
    con.query(
      `DELETE FROM Movie WHERE mid=${mid};`,(err, result) => {
        if (err) throw err;
        resolve(result);
      }
    );
  });
};

const insertSubtitle = (con, values, files, uid) => {
  return new Promise(resolve => {
    con.query(
      `INSERT INTO Subtitle (mid, uid, language, sfile) VALUES("${
        values.mid
      }", "${uid}", "${values.language}", "${files.sfile.path}")`,
      (err, result) => {
        if (err) throw err;
        resolve(result);
      }
    );
  });
};

const getGenreName = (con, genre, callback) => {
  return new Promise(resolve => {
    con.query(`SELECT * FROM Genre WHERE gid=${genre}`, (err, result) => {
      if (err) throw err;
      // console.log(result);
      resolve(result);
    });
  });
};

const searchMoviesByName = (con, name, callback) => {
  return new Promise(resolve => {
    con.query(
      `SELECT * FROM Movie WHERE  lower(replace(Movie.title,' ','')) LIKE lower(replace('%${name}%',' ',''))`,
      (err, result) => {
        if (err) throw err;
        // console.log(result, "result");
        resolve(result);
      }
    );
  });
};

const searchSubtitleByMid = (con, mid, callback) => {
  return new Promise(resolve => {
    con.query(
      `SELECT * FROM Subtitle INNER JOIN USERS ON USERS.uid=Subtitle.uid WHERE Subtitle.mid=${mid} `,
      (err, result) => {
        if (err) throw err;
        // console.log(result, "result");
        resolve(result);
      }
    );
  });
};

const searchMoviesByKeyword = (con, keyword, callback) => {
  return new Promise(resolve => {
    // keyword-> keyword-list-> movie
    const query = `SELECT DISTINCT * FROM Movie AS m WHERE m.mid IN (SELECT k.mid FROM Keyword_list AS k WHERE k.kid IN (SELECT kid FROM Keyword WHERE  lower(replace(Keyword.kname,' ','')) LIKE lower(replace('%${keyword}%',' ','')) ))`;
    con.query(
      // `SELECT * FROM Keyword WHERE (lower(replace(Keyword.kname,' ','')) IN  LIKE lower(replace('%${name}%',' ','')))`,
      query,
      (err, result) => {
        if (err) throw err;
        // console.log(result, "result");
        resolve(result);
      }
    );
  });
};

const searchMoviesByKeywordAndGenre = (con, keyword, genre, callback) => {
  return new Promise(resolve => {
    // keyword-> keyword-list-> movie
    const query = `SELECT DISTINCT * FROM (SELECT * FROM Movie AS m WHERE m.mid IN (SELECT k.mid FROM Keyword_list AS k WHERE k.kid IN (SELECT kid FROM Keyword WHERE  lower(replace(Keyword.kname,' ','')) LIKE lower(replace('%${keyword}%',' ','')) ))) as t1 INNER JOIN (SELECT DISTINCT gl.mid, gl.gid, Genre.gname FROM Genre_list as gl INNER JOIN Genre ON gl.gid=Genre.gid) as t2 ON t1.mid=t2.mid`;
    con.query(
      // `SELECT * FROM Keyword WHERE (lower(replace(Keyword.kname,' ','')) IN  LIKE lower(replace('%${name}%',' ','')))`,
      query,
      (err, result) => {
        if (err) throw err;
        // console.log(result, "result");
        resolve(result);
      }
    );
  });
};

const searchMoviesByNameAndGenre = (con, name, genre, callback) => {
  return new Promise(resolve => {
    con.query(
      `SELECT * FROM Movie WHERE  lower(replace(Movie.title,' ','')) LIKE lower(replace('%${name}%',' ',''))`,
      (err, result) => {
        if (err) throw err;
        // console.log(result, "result");
        resolve(result);
      }
    );
  });
};

// const getSubtitleUsers = (con, subs) => {
//   let arr = Array();
//   for (var i = 0; i < subs.length; i++) {
//     arr.push(subs.mid);
//   }

//   return new Promise(resolve => {
//     const query = `SELECT * FROM USERS WHERE uid in (${arr.toString()})`;
//     con.query(query, (err, result) => {
//       if (err) throw err;
//       resolve(result);
//     });
//   });
// };

const subtitle = (con, callback) => {
  return new Promise(resolve => {
    con.query("SELECT * FROM Subtitle WHERE sid=1;", (err, result) => {
      if (err) throw err;
      // console.log(result);
      resolve(result);
    });
  });
};

module.exports = {
  getTopSixMovies,
  getGenreList,
  searchMoviesByGenre,
  getGenreName,
  getTop30Movies,
  subtitle,
  getMovieDetails,
  searchMoviesByName,
  searchMoviesByKeyword,
  getNextMovieId,
  insertMovie,
  insertSubtitle,
  searchSubtitleByMid,
  insertKeyword,
  relateKeywordMovie,
  relateGenreMovie,
  searchMoviesByKeywordAndGenre,
  searchMoviesByNameAndGenre,
  deleteMovie
  // getSubtitleUsers
};
