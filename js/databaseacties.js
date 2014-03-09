// Maak de database aan:
var db = openDatabase("listmaster", "1.0", "Listmaster Database", 1024 * 1024);
// Maak de eerste tabel aan: Boodschappen

function createTable(){
db.transaction (function (transaction) 
  {
    var sql = 
		"CREATE TABLE alleproducten " +
        " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
        "naam VARCHAR(255) NOT NULL, " + 
        "barcode VARCHAR(13) NOT NULL," +
		"merk VARCHAR(255) NOT NULL," +
		"beschrijving TEXT NOT NULL," +
		"imageurl VARCHAR(255) NOT NULL," +
		"hoeveelheid SMALLINT NOT NULL," +
		"aantalkeerinlijst SMALLINT NOT NULL," +
		"verversing SMALLINT NOT NULL," +
		"totaalkeerververst SMALLINT NOT NULL," +
		"houdbaarheid SMALLINT NOT NULL)"
    transaction.executeSql (sql, undefined, function ()
    { 
      console.log ("Table created");
    }, error);
  });
};
//////////////////////////////////
// Krijg alle items///////////////
//////////////////////////////////
function allItems(){
	db.transaction (function (transaction) 
  {
    var sql = "SELECT * FROM alleproducten"
    transaction.executeSql (sql, undefined, function ()
    { 
      
    }, error);
  });
}



function error (transaction, err) 
{
  console.log("DB error : " + err.message);
  return false;
}

function dropTable(sqlcode){
  db.transaction (function (transaction) 
  {
    var sql = sqlcode;
    transaction.executeSql (sql, undefined, function ()
    { 
      console.log (" >:) Database deleted.");
    }, error);
  });
};


function firstTimeLogin(){
		createTable();
		// Flag the user no first time login
		window.localStorage.setItem("loggedinbefore", true);
		// Redirect the user to the main page
		window.location.replace("index.html");	
}
