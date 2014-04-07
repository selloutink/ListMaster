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
		"inlijst SMALLINT NOT NULL," +
		"verversing SMALLINT NOT NULL," +
		"totaalkeerververst SMALLINT NOT NULL," +
		"houdbaarheid SMALLINT NOT NULL)";
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
function createTable2(){
db.transaction (function (transaction) 
  {
    var sql = 
		"CREATE TABLE lijst " +
        " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
        "naam VARCHAR(255) NOT NULL, " +
		"hoeveel VARCHAR(255) NOT NULL, " + 
        "idref VARCHAR(255) NOT NULL) ";
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
       console.log("Geen Items in de grote lijst");
	   var totalhtml = ""; 	$('ul.inventorycontainer').html(totalhtml).trigger('create').listview('refresh');

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
				listItems();
			}, error);
      }
      else
      {
       alert("Fout, product niet gevonden");
      }
      
    }, error);
  });
}
function changeList(plusminus, id, howmany){
  if(!id){ id = -1}
  if(!howmany){howmany = 1}
  var final = 0;
  db.transaction (function (transaction) 
  {
    var sql = "SELECT verversing FROM alleproducten WHERE id=" + id + ""; 
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

		  var sql = "UPDATE alleproducten SET verversing=" + final + " WHERE id=" + id; 
			transaction.executeSql (sql, undefined, function (){
			$('li.' + id + ' .lijstvoorraad span.getal').html(final);
			
			/*if(final <= 0){
				$( "#errorgeenproduct" ).popup();
				$( "#errorgeenproduct" ).popup( "open" );
		    inventoryItems();
			}*/
				listItems();
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
  		createTable2();
		// Flag the user no first time login
		window.localStorage.setItem("loggedinbefore", true);
		// Redirect the user to the main page
		window.location.href = "#home";	
}

function nieuwProduct(naam,barcode,merk,beschrijving,imageurl,hoeveelheid,inlijst,verversing,totaalkeerververst,houdbaarheid){
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
		"inlijst ," +
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
		 "'" + inlijst + "'," +
		 "'" + verversing + "'," +
		 "'" + totaalkeerververst + "'," +
		 "'" + houdbaarheid + "') ";
	  
    transaction.executeSql (sql, undefined, function ()
    { 
      console.log ("Product Toegevoegd");
	$('.scannedtitle').html(naam);
	$('.scannedimage').html("<img src='" + imageurl + "'>");
	  inventoryItems();
    }, error);
  });
};


function getCode(ean){
	/*ean = "8722700463115";
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
          dataType: 'jsonp',
		  crossDomain: true,
          success: function() { alert('hello!'); },
          error: function() { alert('boo!'); },
          beforeSend: function(xhr){$.mobile.loading('show'); setHeader(xhr); },
		  complete: function(){$.mobile.loading('hide');}
        });

      function setHeader(xhr) {
       xhr.setRequestHeader('Authorization', 'Key="' + privatekey + '",Timestamp="' + timestamp + '",Nonce="' + nonce + '",Signature="' + str + '"');
      }*/
	switch(ean)
	{
	case "8710452210231":
			var u = jQuery.parseJSON( ' {"Allergens": [], "Brand": { "Description": null, "Id": "0575f6ec-211c-41bb-80cf-c6bab9a5220b", "ManufacturerId": "00000000-0000-0000-0000-000000000000", "Name": "Autodrop", "Website": null }, "Description": "Machtige amerikaan vol pk\'s. Lekker breeduit over de weg zoeven met een draaikolk in de tank. De bosvruchtrode cadillacs bevat 3 smaken: aardbei, cassis en kers.", "Id": "5b94056a-8fcc-4bb4-b09f-330f5a26abee", "ImageUrl": "http://syndicateplus.blob.core.windows.net/resources/products/images/autodrop_cadillacs.jpg", "Ingredients": "", "Manufacturer": { "Description": null, "Id": "32381894-e374-4dae-8172-721258cfd5db", "Name": "Concorp Brands N.V.", "Website": null }, "Name": "Bosvruchten Cadillacs", "Nutrients": [] }' );
			nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
			break;
	case "5449000009500":
			var u = jQuery.parseJSON( '{ "Allergens": [], "Brand": { "Description": null, "Id": "d52239cb-1761-4138-94e4-02a84a3ce0c8", "ManufacturerId": "00000000-0000-0000-0000-000000000000", "Name": "Coca Cola", "Website": null }, "Description": "Coca Cola", "Id": "3f163247-c1a6-4685-aa90-823b5f96a527", "ImageUrl": "http://www2.woolworthsonline.com.au/Content/ProductImages/big/038121.jpg", "Ingredients": "", "Manufacturer": { "Description": null, "Id": "3c839208-e692-4403-9cba-1b9d26189289", "Name": "Coca Cola Nederland B.V.", "Website": null }, "Name": "Cola cherry blik 33 cl", "Nutrients": [] }' );
			nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
			break;
	case "5410041054309":
			var u = jQuery.parseJSON( '{ "Allergens": [], "Brand": { "Description": null, "Id": "5d838d4b-0eab-4c36-ba09-100719bac18e", "ManufacturerId": "00000000-0000-0000-0000-000000000000", "Name": "Lu", "Website": null }, "Description": "", "Id": "62a89897-f580-44b5-9d5c-531b96e1b734", "ImageUrl": "http://syndicateplus.blob.core.windows.net/resources/products/images/lu_bastogne_original.jpg", "Ingredients": "", "Manufacturer": { "Description": null, "Id": "2e7db1ee-98df-4984-ac11-69443359d0e3", "Name": "Koninklijke Verkade N.V.", "Website": null }, "Name": "Bastogne", "Nutrients": [] }' );
			nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
			break;
		case "5901234123457":
			var u = jQuery.parseJSON( '{ "Allergens": [], "Brand": { "Description": null, "Id": "5e9d8454-4dd7-4b16-92e6-69a657e9e217", "ManufacturerId": "00000000-0000-0000-0000-000000000000", "Name": "Hertog", "Website": null }, "Description": "", "Id": "fa949514-3fd4-472f-a29a-d8feee65b28d", "ImageUrl": "http://www.unilever.nl/Images/Vanille-Rond-450x450_tcm164-313540.jpg", "Ingredients": "", "Manufacturer": { "Description": null, "Id": "ecfd039c-7191-47fb-8761-5a7c9bde8584", "Name": "Unilever Nederland B.V.", "Website": null }, "Name": "Slagroomijs bak 900 ml", "Nutrients": [] }' );
			nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
			break;		
	case "3290123456786":
			var u = jQuery.parseJSON( '{ "Allergens": [], "Brand": { "Description": null, "Id": "e56dd92c-4475-44cb-aba3-09bee09a797c", "ManufacturerId": "00000000-0000-0000-0000-000000000000", "Name": "Chocomel", "Website": null }, "Description": "", "Id": "06d938ce-8ddb-4b6a-912d-7aef19e08e2f", "ImageUrl": "http://syndicateplus.blob.core.windows.net/resources/products/images/634765679126350000_chocomel_vol.jpg", "Ingredients": "gedeeltelijke afgeroomde melk, suiker, cacao (1,9%), stabilisator: carregeen", "Manufacturer": { "Description": null, "Id": "9da25934-5f77-434f-ad27-48305eef0946", "Name": "Friesland Campina N.V.", "Website": null }, "Name": "Chocomel", "Nutrients": [] }' );
			nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
			break;
	case "6005809655035":
			var u = jQuery.parseJSON( '{ "Allergens": [], "Brand": { "Description": null, "Id": "6ef7ff73-dd85-4884-9beb-23e3bc56b692", "ManufacturerId": "00000000-0000-0000-0000-000000000000", "Name": "Conimex", "Website": null }, "Description": "", "Id": "695e44f2-9131-4f62-89d4-ad4b802524ec", "ImageUrl": "http://www.vettefeiten.nl/images/Conimex_KroepoekNaturelA_pv.jpg", "Ingredients": "", "Manufacturer": { "Description": null, "Id": "ecfd039c-7191-47fb-8761-5a7c9bde8584", "Name": "Unilever Nederland B.V.", "Website": null }, "Name": "Kroepoek gebakken groot naturel zak 80 gram", "Nutrients": [] }' );
			nieuwProduct(" " + u.Name + " ",ean,u.Brand.Name,u.Description,u.ImageUrl,1,0,0,0,0);
			break;
}
	
}

function naarLijst(id){
db.transaction (function (transaction) 
  {
	  var sql = "UPDATE alleproducten SET inlijst=1, verversing=1 WHERE id=" + id + ""; 
			transaction.executeSql (sql, undefined, function (){
			$('li.' + id + ' .lijstvoorraad span.getal').html("1");
			
			/*if(final <= 0){
				$( "#errorgeenproduct" ).popup();
				$( "#errorgeenproduct" ).popup( "open" );
		    inventoryItems();
			}*/
				listItems();
				
			}, error);
      
  });
}

function listItems(){
		db.transaction (function (transaction) 
  {
    var sql = "SELECT * FROM alleproducten WHERE hoeveelheid = 0";
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
			"<div class='addonebutton'><a href='#inlijst' data-role='button' onclick='" + 'changeInventory("+",' + row.id + ");' data-theme='g'>+</a></div>" +
		   "<div class='hidden removeonebutton'><a data-role='button' onclick='" + 'changeList("+",' + row.id + ");' data-theme='d'>-</a></div>" +
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
		
	  $('ul.inventorycontainerlijst').html(totalhtml).listview('refresh');
		
      }
      else
      {
       console.log("Geen Items in de Boodschappenlijst");
	   var totalhtml = ""; 	$('ul.inventorycontainerlijst').html(totalhtml).trigger('create').listview('refresh');
      }
    }, error);
  });
}