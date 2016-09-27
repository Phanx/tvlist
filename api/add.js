"use strict"

const router = require("express").Router()
const shows = require("./db").get("shows")

function addShow(req, res, name) {
	// console.log("Received request to add show:", name)
	if (typeof(name) === "string") {
		const found = shows.find({ name: name }).value()
		if (!found) {
			shows.push({ name: name }).value()
			// TODO: fetch data for it now
			return res.status(200).json({
				message: "Show added!",
				show: found
			})
		} else {
			return res.status(409).json({
				error: "Show already added.",
				show: found
			})
		}
	} else {
		return res.status(400).json({
			error: "Show name not specified."
		})
	}
}

router.get("/", (req, res) => {
	addShow(req, res, req.query.name)
})

router.post("/", (req, res) => {
	addShow(req, res, req.body.name)
})

module.exports = router

