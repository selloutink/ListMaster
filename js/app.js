var db = new PouchDB('producten', {adapter : 'websql'});

db.sync('http://listmaster.couchappy.com/listmaster/');

function addProduct(text, merk){
	var product = {
		naam: text,
		hoeveelheid: 1,
		merk: merk,
		boodschappenhoeveelheid: 1,
		imgurl: "http://placehold.it/100x100",
		prijs: 1.21,
		eancode: 000,
		winkelid: 1
	};
	db.post(product, function callback(err, result) {
    if (!err) {
      console.log('Successful!');
    }
  });
}

function toonProducten(){
	function map(doc) {
	emit([doc.hoeveelheid, doc.naam]);
	}
	db.query({map: map}, {reduce: false, include_docs: true, descending:true }, function(err, response) { redrawProducts(response.rows);});
}

function redrawProducts(producten){
	var div = document.getElementById('productenlijst');
    var html = "";
    producten.forEach(function(product){
   		html = html + "\
   		<div class='product " + product.id + "'>\
              <img src='" + product.doc.imgurl + "' alt='' /> <a href=''>\
              <div class='productdata  alleproducten'>\
                  <h4 class='title '>" + product.doc.naam + "</h4>\
                  <p class='metadata'>" + product.doc.merk + "</p>\
              </div></a>\
                  <div class='voegtoe alleproducten'>\
                      <div class='plusmin'>\
                          <button onclick='addhoeveelheid("+'"'+product.id+'"'+")' class='btn btn-success'><b>+</b></button>\
                          <button onclick='minhoeveelheid("+'"'+product.id+'"'+")'class='btn btn-danger'>-</button>\
                      </div>\
					<button class='btn btn-warning' data-id='" + product.id + "' data-toggle='modal' data-target='#confirmDelete' data-title='Verwijder Product' data-message='Weet je zeker dat je " + product.doc.naam + " uit je database wilt verwijderen?'><i class='glyphicon glyphicon-trash'></i><br>Wis <br>uit <br>database</button>\
                    <button class='btn btn-info' data-id='" + product.id + "' data-toggle='modal' data-target='#editProduct'>Pas aan</button>\
                  </div>\
                  <div class='hoeveelheiddata voorraad'>\
                       <h1>" + product.doc.hoeveelheid + "</h1><small>in voorraad</small>\
                  </div>\
            </div> <!-- end product -->";    });
	div.innerHTML = html;
	
	//time = 0;
	//time = new Date().getTime();;
	//console.log("TIME UPDATE: " + time);
	//console.log(time - time2);
}

function toonBoodschappenlijst(){
	function map(doc) {
	  	if (doc.boodschappenhoeveelheid > 0) {
	    	emit([doc.naam]);
	  	}
	}
	db.query({map: map}, {reduce: false, include_docs: true, }, function(err, response) { redrawBoodschappenlijst(response.rows);});
}

function redrawBoodschappenlijst(producten){
	var div = document.getElementById('productenlijst');
    var html = "";

    producten.forEach(function(product){
    	//console.log(product);
    	html = html + "\
    	<div class='product " + product.id + "'>\
                  <img src='" + product.doc.imgurl + "' alt='' /> <a href=''>\
              <div class='productdata'>\
                  <h4 class='title'>" + product.doc.naam + "</h4>\
                  <p class='metadata'>" + product.doc.merk + "</p>\
              </div></a>\
                  <div class='voegtoe'>\
                      <div class='plusmin'>\
                          <button onclick='addboodschappenlijst("+'"'+ product.id +'"'+")' class='btn btn-success'><b>+</b></button>\
                          <button onclick='minboodschappenlijst("+'"'+ product.id +'"'+")' class='btn btn-danger'>-</button>\
                      </div>\
                      <button class='btn btn-warning' data-id='" + product.id + "' onclick='verwijderboodschappenlijst("+'"'+ product.id +'"'+")'><i class='glyphicon glyphicon-trash'></i>Wis <br>uit lijst</button>\
                      <button class='btn btn-info' data-id='" + product.id + "' data-toggle='modal' data-target='#confirmFinished'>Gekocht</button>\
                  </div>\
                  <div class='hoeveelheiddata boodschappen'>\
                       <h1>" + product.doc.boodschappenhoeveelheid + "</h1><small>te kopen</small>\
                  </div>\
                  <div class='hoeveelheiddata voorraad'>\
                       <h1>" + product.doc.hoeveelheid + "</h1><small>in voorraad</small>\
                  </div>\
            </div> <!-- end product -->";
   	});
	div.innerHTML = html;
	
	//time = 0;
	//time = new Date().getTime();;
	//console.log("TIME UPDATE: " + time);
	//console.log(time - time2);
}

function verwijderboodschappenlijst(productid){
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.boodschappenhoeveelheid - 1;
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: retrieved.hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: 0,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	});
	toonBoodschappenlijst();
}
function verwijderproduct(id){
	db.get(id, function(err, doc){
	  	db.remove(doc, function(err, response) { console.log(response); console.log(err)});
	});
	toonProducten();
}
	

function createProductItem(product){
	console.log(product);
}

function addhoeveelheid(productid, value){
	var hoeveelheid = 0;
	if(!value){value = 1};
	value = Number(value);
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.hoeveelheid + value;
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: retrieved.boodschappenhoeveelheid,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	  	$(".product." + productid + " .hoeveelheiddata.voorraad h1").html(hoeveelheid);

	});
}

function minhoeveelheid(productid){
	var hoeveelheid = 0;
	var boodschappenlijst = 0;
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.hoeveelheid - 1;
	  if (hoeveelheid <= 0){
	  	hoeveelheid = 0;
	  	boodschappenlijst = retrieved.boodschappenhoeveelheid + 1;
	  }
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: boodschappenlijst,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	  $(".product." + productid + " .hoeveelheiddata.voorraad h1").html(hoeveelheid);

	});
	//time2 = 0;
	//time2 = new Date().getTime();
	//console.log("TIME DATABASE: " + time2);
}

function addboodschappenlijst(productid){
	var hoeveelheid = 0;
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.boodschappenhoeveelheid + 1;
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: retrieved.hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: hoeveelheid,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	  $(".product." + productid + " .hoeveelheiddata.boodschappen h1").html(hoeveelheid);
	});
}

function minboodschappenlijst(productid){
	var hoeveelheid = 0;
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.boodschappenhoeveelheid - 1;
	  if (hoeveelheid <= 0){
	  	hoeveelheid = 0;
	  	verwijderboodshcappenlijst()
	  }
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: retrieved.hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: hoeveelheid,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	  	 $(".product." + productid + " .hoeveelheiddata.boodschappen h1").html(hoeveelheid);

	});
	//time2 = 0;
	//time2 = new Date().getTime();
	//console.log("TIME DATABASE: " + time2);
}