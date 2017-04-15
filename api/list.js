const router  = require("express").Router()

const db      = require("./db")
const getJSON = require("./utils/get-json")
const tvMaze  = require("./utils/tvmaze")

const UPDATE_INTERVAL = 60 * 60 * 1000 // 1 hour

function sortObjectsByName(a, b) {
	return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

function sendShowList(res) {
	const showList = db.get("shows").value().sort(sortObjectsByName)
	db.set("app.updated", Date.now()).write()
	console.log("Sending", showList.length, "shows!")
	return res.status(200).json({ "shows": showList })
}

router.use("/", (req, res) => {
	console.log(" ")
	console.log("List shows")

	const lastUpdated = db.get("app.updated")

	if (lastUpdated + UPDATE_INTERVAL > Date.now() && !req.query.force) {
	 	console.log("Already updated recently.")
		return sendShowList(res)
	}

	console.log("Getting updates...")
	tvMaze.getUpdates((updates) => {
		if (!updates) {
			console.log("Error getting updates!")
			return res.status(500).json({ "error": "Error getting updates" })
		}

		console.log("Scanning updates...")

		let pending = 0

		function saveShow(name, data) {
			console.log("Saving new data for show:", name, typeof data)

			if (data) {
				db.get("shows")
					.find({ name: name })
					.assign(data)
					.write()
			}

			pending--
			if (pending === 0) {
				sendShowList(res)
			}
		}

		db.get("shows").value().forEach((show) => {
			const id = show.tvmaze
			const name = show.name

			const needsUpdate = !id || !updates[id]
				|| updates[id] > lastUpdated
				|| req.query.force

			if (!needsUpdate) {
				return
			}

			console.log(name, "needs update...")
			pending++

			function callback(data) {
				console.log("Got update for", name)
				saveShow(name, data)
			}

			if (id && updates[id]) {
				tvMaze.getShowById(id, callback)
			} else {
				tvMaze.getShowByName(name, callback)
			}
		})

		if (pending === 0) {
			console.log("No tracked shows have updates.")
			sendShowList(res)
		}
	})
})

module.exports = router
