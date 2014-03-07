// Maak de database aan:
var db = $.db("listmaster", "1.0", "Listmaster Database", 1024 * 1024);

// Maak de eerste tabel aan: Boodschappen
if(!db.tables()){
db.createTable({
	name: "Alleproducten",
	columns: 
	[
		"id INTEGER PRIMARY KEY",
		"barcode INT",
		"naam TEXT",
		"merk TEXT",
		"beschrijving TEXT",
		"imageurl TEXT",
		"hoeveelheid INT",
		"aantalkeerinlijst INT",
		"verversing INT",
		"totaalkeerververst INT",
		"houdbaarheid INT"
	],
	done: function() {
		console.log("Eerste tabel aangemaakt!");
	},
	fail:function() {
		console.log("Hmm... Er is iets misgegaan...");
	}
});
} else {
console.log("Database al aangemaakt");
}


function createRecord(){
db.insert("Alleproducten", {
    data: {
        barcode: 8722220011235,
        naam: "Sergeant Pepper",
		merk: "Selloutink&CO",
		beschrijving: "Dit is een zeer mooi voorbeeldproduct",
		imageurl: "placehold.it/100x100",
		hoeveelheid: 1,
		houdbaarheid: 5,
    },
    done: function () {
        console.log("Yay!  I created a product!");
    },
    fail: function () {
        console.log("Something went wrong....");
    }
});
}


function selectProducts(){
	db.criteria("Alleproducten").list(
    function (transaction, results) {
        var rows = results.rows;

        for (var i = 0; i < rows.length; i++) {
            var row = rows.item(i);
            console.log(row.naam + " " + row.name + " [" + row.barcode + "]");
        }
    },
    function (transaction, error) {
        console.log("Something went wrong....");
    }
);
}