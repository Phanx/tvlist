var express = require("express")
var http    = require("http")
var router  = express.Router()

// Set up the DB
var low = require("lowdb")
var dbStorage = require("lowdb/file-async")
var dbFile = require("path").resolve(__dirname, "data/db.json")
var db = low(dbFile, { storage: dbStorage })

// Send list of tracked shows
router.get("/shows", function(req, res) {
	var shows = db("shows")

	// Populate with defaults on first run
	if (shows.length == 0) {
		var defaults = require("./data/shows.json")
		defaults.forEach(function(name) {
			shows.push({ name: name })
		})
	}

	return res.status(200).json(shows)
})

// Add new show to be tracked
function addShow(name, res) {
	if (typeof(name) == "string") {
		console.log("Received request to add show: " + name)
		db("shows").push({ name: name })
		return res.status(200).json({ message: "Show added!" })
	} else {
		return res.status(400).json({ error: "Show name not specified." })
	}
}

router.route("/addshow")
	.get(function(req, res) {
		addShow(req.query.name, res)
	})
	.post(function(req, res) {
		addShow(req.body.name, res)
	})

// EOF
module.exports = router

