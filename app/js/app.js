var SHOWS = ['12 Monkeys', 'Agent Carter', 'The Americans', 'The Blacklist', 'Blindspot', 'Bosch', 'Chicago Fire', 'Chicago Med', 'Chicago PD', 'Daredevil', 'Dark Matter', 'Doctor Who', 'Elementary', 'Empire', 'The Expanse', 'Grimm', 'Hawaii Five-0', 'Jessica Jones', 'Killjoys', 'Law and Order SVU', 'Legends', 'Lucifer', 'Outlander', 'Person of Interest', 'Quantico', 'Rosewood', 'Suits', 'Wicked City'];

var DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Unknown'];
var ORDER_DAY = {};
for (var i = 0; i < DAY_ORDER.length; i++) {
	ORDER_DAY[DAY_ORDER[i]] = i + 1;
}

/*
	data: [
		{
			name: 'Wicked City',
			status: 'Ended',
			premiered: '2015-10-27',
			schedule: { days: [ 'Wednesday' ] },
			url: 'http://www.tvmaze.com/shows/1863/wicked-city',
			image: {
				medium: 'http://tvmazecdn.com/uploads/images/medium_portrait/26/66540.jpg',
				original: 'http://tvmazecdn.com/uploads/images/original_untouched/26/66540.jpg'
			},
			'_embedded': {
				'episodes': [
					{
						'url':'http://www.tvmaze.com/episodes/212063/wicked-city-1x01-pilot',
						'name':'Pilot',
						'season':1,
						'number':1,
						'airdate':'2015-10-27'
					}
				]
			}
		}
	]
*/

var LoadingDots = React.createClass({
	displayName: 'LoadingDots',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'loading-dots' },
			React.createElement('span', null),
			React.createElement('span', null),
			React.createElement('span', null)
		);
	}
});

var Show = React.createClass({
	displayName: 'Show',

	render: function () {
		var show = this.props.show;
		var nextEpisode = show._links && show._links.nextepisode && parseInt(show._links.nextepisode.href.match(/\d+$/)[0], 10);
		var statusText = null;
		if (nextEpisode) {
			show._embedded.episodes.forEach(function (episode) {
				if (!statusText && episode.id === nextEpisode) {
					statusText = 'Next: ' + episode.airdate;
				}
			});
		}
		statusText = statusText || (show.status === 'Running' ? 'On Break' : show.status);

		var showNameForURL = encodeURIComponent(show.name.replace(/[^\w\s]/g, ''));
		return React.createElement(
			'article',
			{ className: 'row' },
			React.createElement(
				'div',
				{ className: 'col-xs-12 col-sm-8' },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-xs-12 col-sm-8' },
						React.createElement(
							'h2',
							null,
							show.name
						)
					),
					React.createElement(
						'div',
						{ className: 'col-xs-12 col-sm-4' },
						React.createElement(
							'p',
							null,
							statusText
						)
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'col-xs-12 col-sm-4' },
				React.createElement(
					'ul',
					{ className: 'dl-list' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ className: 'dl-tvm', href: show.url },
							'TVMaze'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ className: 'dl-kat', href: 'https://kat.cr/usearch/?q=' + showNameForURL + '&field=time_add&sorder=desc' },
							'KAT'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ className: 'dl-rar', href: 'https://rarbg.to/torrents.php?search=' + showNameForURL },
							'RARBG'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ className: 'dl-tz', href: 'https://torrentz.eu/searchA?f=' + showNameForURL },
							'Torrentz'
						)
					)
				)
			)
		);
	}
});

var ShowDay = React.createClass({
	displayName: 'ShowDay',

	render: function () {
		return React.createElement(
			'h1',
			null,
			this.props.day
		);
	}
});

var ShowList = React.createClass({
	displayName: 'ShowList',

	render: function () {
		var rows = [];
		var currentDay = null;
		this.props.data.forEach(function (show) {
			var showDay = show.schedule.days[0] || 'Unknown';
			if (showDay !== currentDay) {
				rows.push(React.createElement(ShowDay, { day: showDay }));
			}
			rows.push(React.createElement(Show, { show: show }));
			currentDay = showDay;
		});

		return React.createElement(
			'section',
			{ id: 'tv' },
			rows
		);
	}
});

// Collect all the data from the TVMaze API, join it together,
// sort it, and pass it off to the renderer.

var showData = [];
var numShows = SHOWS.length;
for (var i = 0; i < numShows; i++) {
	var showName = SHOWS[i];
	var URL = 'http://api.tvmaze.com/singlesearch/shows?q=' + encodeURIComponent(showName.toLowerCase()) + '&embed=episodes';
	// console.log('Fetching data for show: ' + showName + ' @ ' + URL)
	$.getJSON(URL, function (json) {
		showData.push(json);
		// console.log('Received data for show: ' + json.name + ' (' + showData.length + '/' + numShows + ')')
		// console.log(json)
		if (showData.length == numShows) {
			// console.log('All data received!')
			showData.sort(function (a, b) {
				var aDay = ORDER_DAY[a.schedule.days[0] || 'Unknown'];
				var bDay = ORDER_DAY[b.schedule.days[0] || 'Unknown'];
				return aDay == bDay ? a.name.toLowerCase().replace(/^the /, '') > b.name.toLowerCase().replace(/^the /, '') : aDay > bDay;
			});
			console.log(showData);
			ReactDOM.render(React.createElement(ShowList, { data: showData }), document.getElementById('content'));
		}
	});
}

ReactDOM.render(React.createElement(LoadingDots, null), document.getElementById('content'));