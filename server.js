var express = require("express")
var app = express()

var bodyParser = require("body-parser")
var api = require("./api")

// Set up the middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve static files from app directory
app.use(express.static(__dirname + "/app"))

// API router
app.use("/api", api)

// Start the server
app.set("port", process.env.PORT || 10101)

var server = app.listen(app.get("port"), function() {
	console.log("Serving on port " + app.get("port"))
})
