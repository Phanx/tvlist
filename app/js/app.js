var LoadingDots = React.createClass({
	displayName: "LoadingDots",

	render: function () {
		return React.createElement(
			"div",
			{ className: "loading-dots" },
			React.createElement("span", null),
			React.createElement("span", null),
			React.createElement("span", null)
		);
	}
});

var Show = React.createClass({
	displayName: "Show",

	render: function () {
		var show = this.props.show;
		var nextEpisode = show._links && show._links.nextepisode && parseInt(show._links.nextepisode.href.match(/\d+$/)[0], 10);
		var statusText = null;
		if (nextEpisode) {
			show._embedded.episodes.forEach(function (episode) {
				if (!statusText && episode.id === nextEpisode) {
					/*
     					var airdate = new Date(episode.airdate)
     					var today = new Date()
     					var days = Math.floor((airdate - today) / (1000 * 60 * 60 * 24))
     */
					statusText = "Next: " + episode.airdate;
				}
			});
		}
		statusText = statusText || (show.status === "Running" ? "On Break" : show.status);

		var style = statusText == "Ended" ? { display: "none" } : statusText == "On Break" ? { opacity: "0.5" } : null;

		var showNameForURL = encodeURIComponent(show.name.replace(/[^\w\s]/g, ""));
		return React.createElement(
			"article",
			{ className: "row", style: style },
			React.createElement(
				"div",
				{ className: "col-xs-12 col-sm-8" },
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-xs-12 col-sm-8" },
						React.createElement(
							"h2",
							null,
							show.name
						)
					),
					React.createElement(
						"div",
						{ className: "col-xs-12 col-sm-4" },
						React.createElement(
							"p",
							null,
							statusText
						)
					)
				)
			),
			React.createElement(
				"div",
				{ className: "col-xs-12 col-sm-4" },
				React.createElement(
					"ul",
					{ className: "dl-list" },
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ className: "dl-tvm", href: show.url },
							"TVMaze"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ className: "dl-kat", href: "https://kat.cr/usearch/?q=" + showNameForURL + "&field=time_add&sorder=desc" },
							"KAT"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ className: "dl-rar", href: "https://rarbg.to/torrents.php?search=" + showNameForURL },
							"RARBG"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ className: "dl-tz", href: "https://torrentz.eu/searchA?f=" + showNameForURL },
							"Torrentz"
						)
					)
				)
			)
		);
	}
});

var ShowGroup = React.createClass({
	displayName: "ShowGroup",

	handleHeaderClick: function (event) {
		var header = event.target.parentNode;
		var thisDay = header.parentNode.id;
		console.log('handleHeaderClick ' + thisDay);
		$(header.nextElementSibling).slideDown(200);
		$('#tv section').each(function () {
			if (this.id != thisDay) {
				$('.content', this).slideUp(200);
			}
		});
	},
	render: function () {
		var showItems = [];
		this.props.shows.forEach(function (show) {
			showItems.push(React.createElement(Show, { show: show, key: show.id }));
		});

		var style = !this.props.selected ? { display: "none" } : null;

		return React.createElement(
			"section",
			{ id: this.props.name.toLowerCase() },
			React.createElement(
				"header",
				null,
				React.createElement(
					"h1",
					{ onClick: this.handleHeaderClick },
					this.props.name
				)
			),
			React.createElement(
				"div",
				{ className: "content", style: style },
				showItems
			)
		);
	}
});

var ShowList = React.createClass({
	displayName: "ShowList",

	render: function () {
		console.log('initial selection: ' + this.props.today);
		var selectedDay = this.props.today;
		var showGroups = $.map(this.props.data, function (day) {
			return React.createElement(ShowGroup, { name: day.name, shows: day.shows, selected: day.name == selectedDay, key: day.name });
		});
		return React.createElement(
			"section",
			{ id: "tv" },
			showGroups
		);
	}
});

// Collect all the data from the TVMaze API, join it together,
// sort it, and pass it off to the renderer.

console.log("Fetching show list...");
$.getJSON("/api/shows", function (SHOWS) {
	console.log("Show list received...");

	var numShows = SHOWS.length;
	var numFetched = 0;

	var data = [];
	var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Unknown"];
	DAYS.forEach(function (day, i) {
		data.push({ name: day, shows: [] });
	});

	SHOWS.forEach(function (showName) {
		var URL = "http://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(showName.toLowerCase()) + "&embed=episodes";
		console.log("Fetching data for show: " + showName + " @ " + URL);

		$.getJSON(URL, function (show) {
			numFetched++;
			console.log("Received data for show: " + show.name + " (" + numFetched + "/" + numShows + ")");
			console.log(show);

			var i = DAYS.indexOf(show.schedule.days[0] || "Unknown");
			if (i === -1) {
				i = DAYS.indexOf("Unknown");
			}
			data[i].shows.push(show);
			data[i].shows.sort(function (a, b) {
				return a.name.toLowerCase().replace(/^the /, "") > b.name.toLowerCase().replace(/^the /, "");
			});

			if (numFetched === numShows) {
				console.log("All data received!");
				console.log(data);

				DAYS.pop(); // remove "Unknown"
				DAYS.unshift(DAYS.pop()); // move "Sunday" from end to start
				var date = new Date();
				var day = date.getDay();
				if (date.getHours() < 17) {
					// Before 9 PM, show yesterday instead of today
					day = day > 0 ? day - 1 : DAYS.length - 1;
				}
				ReactDOM.render(React.createElement(ShowList, { data: data, today: DAYS[day] }), document.getElementById("content"));
			}
		});
	});
});

ReactDOM.render(React.createElement(LoadingDots, null), document.getElementById("content"));