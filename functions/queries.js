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
module.exports = {
  getTopSixMovies
};
