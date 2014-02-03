// Maak de database aan:
var db = $.db("listmaster", "1.0", "Listmaster Database", 1024 * 1024);

// Maak de eerste tabel aan: Boodschappen
db.createTable({
	name: "boodschappen",
	columns: 
	[
		"id INTEGER PRIMARY KEY",
		"barcode INT",
		"naam TEXT"
	],
	done: function() {
		console.log("Eerste tabel aangemaakt!");
	},
	fail:function() {
		console.log("Hmm... Er is iets misgegaan...");
	}
});