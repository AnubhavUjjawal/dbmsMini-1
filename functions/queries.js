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
  searchMoviesByKeyword
};
