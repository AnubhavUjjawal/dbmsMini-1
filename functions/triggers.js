const deleteTrigger = (con, callback) => {
  return new Promise(resolve => {
    const query = `DROP TRIGGER IF EXISTS genre_delete;`;
    const query1 = `CREATE TRIGGER genre_delete
                        BEFORE DELETE ON Movie 
                        FOR EACH ROW
                        BEGIN
                        DELETE FROM Genre_list WHERE  mid = OLD.mid ;
                        DELETE FROM Production_list WHERE  mid = OLD.mid;
                        DELETE FROM Keyword_list WHERE  mid = OLD.mid;
                        DELETE FROM Subtitle WHERE  mid = OLD.mid;
                        END`;
    con.query(
      query,
      (err, result) => {
        if (err) throw err;
        con.query(
            query1, (err, result) => {
                if (err) throw err;
                console.log("Trigger delete created");
                console.log(result);
                resolve(result);
            }
        );
      }
    );
  });
};

const updateExperience = (con, callback) => {
  return new Promise(resolve => {
    const query = `DROP TRIGGER IF EXISTS update_Exper;`;
    const query1 = `CREATE TRIGGER update_Exper
                        AFTER INSERT ON Subtitle 
                        FOR EACH ROW
                        BEGIN
                        UPDATE USERS SET expr = expr + 1 WHERE uid = NEW.uid;
                        END`;
    con.query(
      query,
      (err, result) => {
        if (err) throw err;
        con.query(
            query1, (err, result) => {
                if (err) throw err;
                console.log("Trigger insert created");
                console.log(result);
                resolve(result);
            }
        );
      }
    );
  });
};


module.exports = {
  deleteTrigger,
  updateExperience
};
