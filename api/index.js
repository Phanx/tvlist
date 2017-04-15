const router = require("express").Router()

router.use("/addshow",    require("./add"))
router.use("/editshow",   require("./edit"))
router.use("/deleteshow", require("./delete"))
router.use("/shows",      require("./list"))

module.exports = router
