"use strict"

const router = require("express").Router()
const db  = require("./db")

const validateField = {
	name  : (v) => typeof v === "string",
	imdb  : (v) => typeof v === "string" && /^tt[0-9]+$/.test(v),
	pref  : (v) => typeof v === "string",
	tvmaze: (v) => typeof v === "string" && /^[0-9]+$/.test(v),
}

router.post("/", (req, res) => {
	const name = req.body.name
	const changes = req.body.changes
	console.log(" ")
	console.log("Edit show:", name, changes)

	if (typeof name !== "string") {
		return res.status(400).json({ error: "Show name not specified." })
	}
	if (changes === null || typeof changes !== "object" || Object.keys(changes).length === 0) {
		return res.status(400).json({ error: "No changes specified." })
	}

	Object.keys(changes).forEach((k) => {
		let v = changes[k]
		// TODO: use empty string to delete?
		// TODO: send list of dropped properties with response?
		if (v === null || !validateField[k] || !validateField[k](v)) {
			console.log("Dropping invalid property:", k, typeof v, v)
			delete changes[k]
		}
	})

	var x = db.get("shows")
		.find({ name: name })
		.assign(changes)
		.write()
	console.log(x)
	return res.status(200).json({ message: "Changes saved." })
})

module.exports = router
