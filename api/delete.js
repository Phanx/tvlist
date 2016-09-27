"use strict"

const router = require("express").Router()
const shows  = require("./db").get("shows")

// Delete a show
router.post("/", (req, res) => {
	const name = req.body.name
	if (typeof(name) === "undefined") {
		return res.status(400).json({ error: "Show name not specified." })
	}
	// console.log("Received request to delete show: " + name)
	shows.remove({ name: name }).value()
	return res.status(200).json({ message: "Show deleted." })
})

module.exports = router

