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

const insertSubtitle = (con, values, files, uid) => {
  return new Promise(resolve => {
    con.query(
      `INSERT INTO Subtitle (mid, uid, rating, language, sfile) VALUES("${
        values.mid
      }", "${uid}", 0, "${values.language}", "${files.sfile.path}")`,
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
    const query = `SELECT * FROM Movie AS m WHERE m.mid IN (SELECT k.mid FROM Keyword_list AS k WHERE k.kid IN (SELECT kid FROM Keyword WHERE  lower(replace(Keyword.kname,' ','')) LIKE lower(replace('%${keyword}%',' ','')) ))`;
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
  searchSubtitleByMid
  // getSubtitleUsers
};
