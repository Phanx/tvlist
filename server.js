var express = require("express")
var app = express()
var api = require("./api/index")

// Serve static files from app directory
app.use(express.static(__dirname + "/app"))

// API router
app.use("/api", api)

// Server
app.set("port", process.env.PORT || 10101)

var server = app.listen(app.get("port"), function() {
	console.log("Serving on port " + app.get("port"))
})
