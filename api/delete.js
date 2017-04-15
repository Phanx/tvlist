const router = require("express").Router()
const db = require("./db")

router.post("/", (req, res) => {
	const name = req.body.name

	if (typeof name !== "string") {
		return res.status(400).json({ error: "Show name must be a string." })
	}

	console.log("Received request to delete show:", name)
	db.get("shows").remove({ name: name }).write()
	return res.status(200).json({ message: "Show deleted." })
})

module.exports = router
