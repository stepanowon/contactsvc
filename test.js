var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('contacts.db');

  db.each("SELECT no,name,tel,address FROM contacts", function(err, row) {
      console.log(row.no + ": " + row.name + ", " + row.auth);
  });

  db.close();