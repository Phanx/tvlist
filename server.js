const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const api = require("./api")

// Set up the middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve static files from app directory
app.use(express.static(__dirname + "/app"))

// API router
app.use("/api", api)

// Start the server
app.set("port", process.env.PORT || 9021)

var server = app.listen(app.get("port"), function() {
	console.log("Serving on port " + app.get("port"))
})

