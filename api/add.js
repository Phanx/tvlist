const router = require("express").Router()
const tvMaze = require("./utils/tvmaze")
const db = require("./db")

function addShow(data, res) {
	const name = data.name
	if (typeof name !== "string") {
		return res.status(400).json({ error: "Show name must be a string." })
	}

	console.log(" ")
	console.log("Add show:", name)

	const found = db.get("shows").find({ name: name }).value()
	if (found) {
		return res.status(409).json({ error: "Show already tracked." })
	}

	tvMaze.getShowByName(name, (show) => {
		if (show) {
			show.name = name
			db.get("shows").push(show).write()
			return res.status(200).json({ show: show })
		} else {
			return res.status(404).json({ error: "Show not found on TVmaze." })
		}
	})
}

router.get("/", (req, res) => {
	addShow(req.query, res)
})

router.post("/", (req, res) => {
	addShow(req.body, res)
})

module.exports = router
