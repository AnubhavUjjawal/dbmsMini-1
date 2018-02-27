const checkAndCreate = (con, callback) => {
  return new Promise(resolve => {
    con.query(
      "CREATE TABLE IF NOT EXISTS Production (pid INT NOT NULL PRIMARY KEY, pname VARCHAR(100));",
      (err, result) => {
        if (err) console.log("production error");
        con.query(
          "CREATE TABLE IF NOT EXISTS Genre (gid INT NOT NULL PRIMARY KEY, gname VARCHAR(100));",
          (err, result) => {
            if (err) console.log("Genre error");
            con.query(
              "CREATE TABLE IF NOT EXISTS Keyword (kid INT NOT NULL PRIMARY KEY, kname VARCHAR(100));",
              (err, result) => {
                if (err) console.log("Keyword error");
                const q_string =
                  "CREATE TABLE IF NOT EXISTS Movie (mid INT NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(100), release_date DATE, vote_avg FLOAT, budget INT, homepage VARCHAR(1000));";
                con.query(q_string, (err, result) => {
                  if (err) console.log("Movie error", err.message);
                  con.query(
                    "CREATE TABLE IF NOT EXISTS Genre_list (mid INT NOT NULL, gid INT NOT NULL, FOREIGN KEY (mid) REFERENCES Movie(mid), FOREIGN KEY (gid) REFERENCES Genre(gid), PRIMARY KEY (gid, mid));",
                    (err, result) => {
                      if (err) console.log("Genre list error");
                      con.query(
                        "CREATE TABLE IF NOT EXISTS Production_list (mid INT NOT NULL, pid INT NOT NULL, FOREIGN KEY (mid) REFERENCES Movie(mid), FOREIGN KEY (pid) REFERENCES Production(pid), PRIMARY KEY (pid, mid));",
                        (err, result) => {
                          if (err) console.log("Production list error");
                          con.query(
                            "CREATE TABLE IF NOT EXISTS Keyword_list (mid INT NOT NULL, kid INT NOT NULL, FOREIGN KEY (mid) REFERENCES Movie(mid), FOREIGN KEY (kid) REFERENCES Keyword(kid), PRIMARY KEY (kid, mid));",
                            (err, result) => {
                              if (err) console.log("Keyword list error");
                              con.query(
                                "CREATE TABLE IF NOT EXISTS Subtitle (sid INT NOT NULL AUTO_INCREMENT PRIMARY KEY, mid INT NOT NULL, uid VARCHAR(200) NOT NULL, rating INT NOT NULL, language VARCHAR(20), FOREIGN KEY (mid) REFERENCES Movie(mid), FOREIGN KEY (uid) REFERENCES USERS(uid), sfile VARCHAR(1000));",
                                (err, result) => {
                                  if (err) console.log("Subtitle error");
                                  con.query(
                                    "CREATE TABLE IF NOT EXISTS Comment (cid INT NOT NULL AUTO_INCREMENT PRIMARY KEY, sid INT NOT NULL, commentor VARCHAR(30), upvotes INT, ctext TEXT, FOREIGN KEY (sid) REFERENCES Subtitle(sid));",
                                    (err, result) => {
                                      if (err) {
                                        throw err;
                                        console.log("Comment error");
                                      }
                                      con.query(
                                        "CREATE TABLE IF NOT EXISTS USERS (uid VARCHAR(200) NOT NULL PRIMARY KEY, name VARCHAR(200), expr INT DEFAULT 0);",
                                        (err, result) => {
                                          if (err) {
                                            throw err;
                                            console.log("users table err");
                                          } else {
                                            resolve(callback());
                                          }
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                });
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  checkAndCreate
};
