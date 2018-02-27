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
    con.query(
      `SELECT * FROM Movie AS m WHERE m.mid=${mid}`, (err, result) => {
        if(err) throw err;
        console.log(result);
        resolve(result);
      }
    );
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
    con.query("SELECT * FROM Movie ORDER BY mid DESC LIMIT 1;",(err, result) => {
      if(err) throw err;
      // console.log(result[0].mid);
      resolve(result);
    });
  });
};

const insertMovie = (con, values, mid) => {
  return new Promise(resolve => {
    console.log(values.title);
    con.query(`INSERT INTO Movie (mid, title, release_date, vote_avg, budget, homepage) VALUES(${mid}, "${values.title}", "${values.release_date}", "${values.vote_avg}", "${values.budget}", "${values.homepage}");`,(err, result) => {
      if(err) throw err;
      // console.log(result[0].mid);
      resolve(result);
    });
  });
}

const getGenreName = (con, genre, callback) => {
  return new Promise(resolve => {
    con.query(`SELECT * FROM Genre WHERE gid=${genre}`, (err, result) => {
      if (err) throw err;
      // console.log(result);
      resolve(result);
    });
  });
};

const subtitle = (con, callback) => {
  return new Promise(resolve => {
    con.query(
      "SELECT * FROM Subtitle WHERE sid=1;",
      (err, result) => {
        if (err) throw err;
        // console.log(result);
        resolve(result);
      }
    );
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
  getNextMovieId,
  insertMovie
};
