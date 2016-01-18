var express = require("express")
var router = express.Router()

// Set up the DB
var low = require("lowdb")
var dbStorage = require("lowdb/file-async")
var dbFile = require("path").resolve(__dirname, 'data/db.json')
var db = low(dbFile, { storage: dbStorage })

// Send list of tracked shows
router.get("/shows", function(req, res) {
	var content = db("shows")
	return res.status(200).json(content)
})

// Add new show to be tracked
router.post("/addshow", function(req, res) {
	if (req.body && req.body.name) {
		console.log("Received request to add show: " + req.body.name)
		return res.sendStatus(200)
	}
	else {
		return res.sendStatus(400).json({
			error: "Invalid data",
			got: req.body
		})
	}
})

// EOF
module.exports = router
