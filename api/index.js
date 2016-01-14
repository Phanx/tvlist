var express = require("express")
var router = express.Router()

router.get("/shows", function(req, res) {
	var content = require("./data/shows.json")
	res.status(200).json(content)
})

module.exports = router
