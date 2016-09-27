"use strict"

const router = require("express").Router()
const shows  = require("./db").get("shows")

const VALID_DATA_TYPES = {
	name        : "string",
	image       : "string",
	imdb        : "string",
	nextDate    : "string",
	nextDateTime: "string",
	nextURL     : "string",
	premiered   : "string",
	status      : "string",
	tvmaze      : "number",
	url         : "string",
	updated     : "string",
	weekday     : "string",
	pref        : "string"
}

router.post("/", (req, res) => {
	const name = req.body.name
	const changes = req.body.changes
	// console.log("/editshow", name, changes)
	if (typeof(name) !== "string") {
		return res.status(400).json({ error: "Show name not specified." })
	}
	if (typeof(changes) !== "object" || changes == null || Object.keys(changes).length === 0) {
		return res.status(200).json({ error: "No changes specified." })
	}

	Object.keys(changes).forEach((k) => {
		let v = changes[k]
		// TODO: use empty string to delete?
		// TODO: send list of dropped properties with response?
		if (v == null || VALID_DATA_TYPES[k] == null || typeof(v) !== typeof(VALID_DATA_TYPES[k])) {
			// console.log("Dropping invalid property:", k, v, typeof(v), typeof(VALID_DATA_TYPES[k]))
			delete changes[k]
		}
	})

	shows.find({ name: name })
		.assign(changes)
		.value()

	return res.status(200).json({ message: "Changes saved." })
})

module.exports = router

