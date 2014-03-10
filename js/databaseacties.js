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
    var sql = "SELECT * FROM alleproducten ORDER BY hoeveelheid DESC"
    transaction.executeSql (sql, undefined, function (transaction, result)
    { 
      if (result.rows.length)
      {
        for (var i = 0; i < result.rows.length; i++) 
        {
          console.log(result.rows.item (i));
        }
      }
      else
      {
       console.log("Geen Items");
      }
      
    }, error);
  });
}


//////////////////////////////////
// Maak lijst met items///////////
//////////////////////////////////
function inventoryItems(){
	db.transaction (function (transaction) 
  {
    var sql = "SELECT * FROM alleproducten WHERE hoeveelheid > 0";
    transaction.executeSql (sql, undefined, function (transaction, result)
    { 
      if (result.rows.length)
      {
		var totalhtml = "";
        for (var i = 0; i < result.rows.length; i++) 
        {
		  var row = result.rows.item(i);
          var html = '<li background-size:contain; background-position:left; background-repeat:no-repeat;" class="'+ row.id + '">'+
			 "<img src ='" +row.imageurl + "' class='nothumb'/>" +
			  "<center>" +
           "<div class='titel'>" +
			   	"<span class='naam'>" +
		  		row.naam +
				"</span>" +
		   "</div>" +
           "<div class='voorraad'>" +
			   		"<span class='top'><small>Nog</small></span>" +
					"<span class='getal'>" +
					row.hoeveelheid +
					"</span> " +
					"<span class='bottom'><small>In huis</small></span>" +
		   "</div>" +
			  "</center>" +
           /*"<div class='houdbaarheid'>" +
			   	"<center>" +
			   		"<span class='top'><small>Houdbaar tot</small></span>" +
					"<span class='getal'>" +
					row.houdbaarheid +
					"</span>" + 
					"<span class='bottom'><small>nog " + 
					row.houdbaarheid +
		   " dagen</small></span>" +
		   		"</center>" + 
		   "</div>" +     */
           "<span class='buttonspan'>" +
			"<div class='addonebutton'><a data-role='button' onclick='" + 'changeInventory("+",' + row.id + ");' data-theme='g'>+</a></div>" +
		   "<div class='removeonebutton'><a data-role='button' onclick='" + 'changeInventory("-",' + row.id + ");' data-theme='d'>-</a></div>" +
           "</span>" +
           "<div class='clearfix'></div>" +
       	   "</li>";
			totalhtml = totalhtml + html;
			/*console.log(i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i)
			console.log(row.imageurl + " url");
			console.log(row.naam + " naam");
			console.log(row.hoeveelheid + " hoeveelheid");
			console.log(row.houdbaarheid + " houdbaarheid");*/
        }
		
	  $('ul.inventorycontainer').html(totalhtml).trigger('create').listview('refresh');
		
      }
      else
      {
       console.log("Geen Items hier");
      }
    }, error);
  });
}

///////////////////////////////////////////
// Voeg een product toe in je inventaris //
///////////////////////////////////////////
function changeInventory(plusminus, id, howmany){
  if(!id){ id = -1}
  if(!howmany){howmany = 1}
  var final = 0;
  db.transaction (function (transaction) 
  {
    var sql = "SELECT hoeveelheid FROM alleproducten WHERE id=" + id + ""; 
    transaction.executeSql (sql, undefined, function (transaction, result)
    { 
      if (result.rows.length)
	  {     var row = result.rows.item(0);
			if(plusminus == "+"){
			final = row.hoeveelheid + howmany;
			} else if(plusminus == "-"){
			final = row.hoeveelheid - howmany;}
			//console.log("Final: " + final);
	   		///console.log("Row.hoeveelheid: " + row.hoeveelheid);

		  var sql = "UPDATE alleproducten SET hoeveelheid=" + final + " WHERE id=" + id + ""; 
			transaction.executeSql (sql, undefined, function (){
			$('li.' + id + ' .voorraad span.getal').html(final);
			
			/*if(final <= 0){
				$( "#errorgeenproduct" ).popup();
				$( "#errorgeenproduct" ).popup( "open" );
		    inventoryItems();
			}*/
				inventoryItems();
			}, error);
      }
      else
      {
       alert("Fout, product niet gevonden");
      }
      
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
      //console.log (" >:) Database deleted.");
    }, error);
  });
}


function firstTimeLogin()
{
		createTable();
		var deviceID = device.uuid;
	    var nonce = "selloutink_" + device.uuid + Math.floor(Math.random() * 99999) + "";
		// Flag the user no first time login
		window.localStorage.setItem("loggedinbefore", true);
		window.localStorage.setItem("nonce", nonce);
		// Redirect the user to the main page
		window.location.href = "#home";	
}

function nieuwProduct(naam,barcode,merk,beschrijving,imageurl,hoeveelheid,aantalkeerinlijst,verversing,totaalkeerververst,houdbaarheid){
db.transaction (function (transaction) 
  {
    var sql = 
		"INSERT INTO alleproducten (" +
		"naam ," +
		"barcode ," +
		"merk ," +
		"beschrijving ," +
		"imageurl ," +
		"hoeveelheid, " +
		"aantalkeerinlijst ," +
		"verversing ," +
		"totaalkeerververst ," +
		"houdbaarheid)" +
		"VALUES (" +
		 "'" + naam + "'," +
		 "'" + barcode + "'," +
		 "'" + merk + "'," +
		 "'" + beschrijving + "'," +
		 "'" + imageurl + "'," +
		 "'" + hoeveelheid + "'," +
		 "'" + aantalkeerinlijst + "'," +
		 "'" + verversing + "'," +
		 "'" + totaalkeerververst + "'," +
		 "'" + houdbaarheid + "') ";
	  
    transaction.executeSql (sql, undefined, function ()
    { 
      console.log ("Product Toegevoegd");
    }, error);
  });
};


function getCode(ean){
	ean = "8722700463115";
	var privatekey = "Um2TuBS8o_KYCFQ-YmCF6owOprQsNo4ki0qJ0jJJ7CtJmOyDTQhmAPjFHLiKxXC166beu80fqkg3Xcb8D__Yv1V05YO2kQgHAmWuS0Mccf7VZLkqpGhwNIZ5qkowkjRAl4r9eQZSLD9Ior_RbOA-WeHePLxS-2ShSRbglArYOuE=";
	var httpverb = "GET";
	var requesturl = "http://api.syndicateplus.com/v1/products/product";
	var querystring = "ean=" + ean;
	var secret = "sY76ezrweHk3VXvyWLJBHkNdh4a5zVXLRsEYj9R9yxPARkCK1Pvdz6Py4RAYSqjLPZMKt3ESmoRX6CxKlookQQzFSjPutLmSHg4wt-Oc2ghQXZaV-L7PILRj8pohInkbeFiJ4JL0o1eiVEd13q0cuPFGyYAaU8G60VAFpW0LRrM=";
	var nonce = window.localStorage.getItem("nonce");
	var timestamp = Date.now();

	
	// create Signature:
	var str = secret + httpverb + requesturl + querystring + nonce + timestamp;
	str = $().crypt({method: "sha1", source: str });
 	
      $.ajax({
          url: 'http://api.syndicateplus.com/v1/products/product/',
          type: 'GET',
          dataType: 'json',
          success: function() { alert('hello!'); },
          error: function() { alert('boo!'); },
          beforeSend: setHeader
        });

      function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Key="' + privatekey + '",Timestamp="' + timestamp + '",Nonce="' + nonce + '",Signature="' + str + '"');
      }
}

	//nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
	
	//return u;