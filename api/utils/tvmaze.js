const getJSON = require("./get-json")

function getShow(url, callback) {
	getJSON(url, (data) => {
		callback(data ? {
			image       : data.image && data.image.medium,
			imdb        : data.externals && data.externals.imdb,
			nextDate    : data._embedded && data._embedded.nextepisode && data._embedded.nextepisode.airdate,
			nextDateTime: data._embedded && data._embedded.nextepisode && data._embedded.nextepisode.airstamp,
			nextURL     : data._links && data._links.nextepisode && data._links.nextepisode.href,
			premiered   : data.premiered,
			status      : data.status,
			tvmaze      : data.id && String(data.id),
			url         : data._links && data._links.self && data._links.self.href,
			weekday     : data.schedule && data.schedule.days && data.schedule.days[0],
		} : undefined)
	})
}

function getShowById(id, callback) {
	const url = "http://api.tvmaze.com/shows/" + id + "?embed=nextepisode"
	getShow(url, callback)
}

function getShowByName(name, callback) {
	const url = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(name) + "&embed=nextepisode"
	getShow(url, callback)
}

function getUpdates(callback) {
	getJSON("http://api.tvmaze.com/updates/shows", callback)
}

module.exports = {
	getShow,
	getShowById,
	getShowByName,
	getUpdates,
}
