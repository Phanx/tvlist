const lowdb  = require("lowdb")
const dbFile = require("path").resolve(__dirname, "data/db.json")
const db     = lowdb(dbFile, { storage: require("lowdb/lib/storages/file-async") })

const defaults = require("./data/shows.json")
db.defaults(defaults).write()

module.exports = db
