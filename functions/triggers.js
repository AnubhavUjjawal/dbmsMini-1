const deleteTrigger = (con, callback) => {
  return new Promise(resolve => {
    const query = `DROP TRIGGER IF EXISTS genre_delete;`;
    const query1 = `CREATE TRIGGER genre_delete
                        AFTER DELETE ON Movie 
                        FOR EACH ROW
                        BEGIN
                        DELETE FROM Genre_list WHERE  mid IN (  SELECT mid FROM deleted );
                        DELETE FROM Production_list WHERE  mid IN (  SELECT mid FROM deleted );
                        DELETE FROM Keyword_list WHERE  mid IN (  SELECT mid FROM deleted );
                        END`;
    con.query(
      query,
      (err, result) => {
        if (err) throw err;
        con.query(
            query1, (err, result) => {
                if (err) throw err;
                console.log("Trigger created");
                console.log(result);
                resolve(result);
            }
        );
      }
    );
  });
};

module.exports = {
  deleteTrigger
};
