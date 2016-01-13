var SHOWS = [
	'12 Monkeys',
	'Agent Carter',
	'The Americans',
	'The Blacklist',
	'Blindspot',
	'Bosch',
	'Chicago Fire',
	'Chicago Med',
	'Chicago PD',
	'Daredevil',
	'Dark Matter',
	'Doctor Who',
	'Elementary',
	'Empire',
	'The Expanse',
	'Grimm',
	'Hawaii Five-0',
	'Jessica Jones',
	'Killjoys',
	'Law and Order SVU',
	'Legends',
	'Lucifer',
	'Outlander',
	'Person of Interest',
	'Quantico',
	'Rosewood',
	'Suits',
	'Wicked City'
]

var DAY_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Unknown']
var ORDER_DAY = {}
for (var i = 0; i < DAY_ORDER.length; i++) {
	ORDER_DAY[ DAY_ORDER[i] ] = i + 1
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
	render: function() {
		return (
			<div className='loading-dots'>
				<span></span>
				<span></span>
				<span></span>
			</div>
		)
	}
})

var Show = React.createClass({
	render: function() {
		var show = this.props.show
		var nextEpisode = show._links && show._links.nextepisode && parseInt(show._links.nextepisode.href.match(/\d+$/)[0], 10)
		var statusText = null
		if (nextEpisode) {
			show._embedded.episodes.forEach(function(episode) {
				if (!statusText && episode.id === nextEpisode) {
					statusText = 'Next: ' + episode.airdate
				}
			})
		}
		statusText = statusText || (show.status === 'Running' ? 'On Break' : show.status)

		var showNameForURL = encodeURIComponent(show.name.replace(/[^\w\s]/g, ''))
		return (
			<article className="row">
				<div className="col-xs-12 col-sm-8">
					<div className="row">
						<div className="col-xs-12 col-sm-8">
							<h2>{show.name}</h2>
						</div>
						<div className="col-xs-12 col-sm-4">
							<p>{statusText}</p>
						</div>
					</div>
				</div>
				<div className="col-xs-12 col-sm-4">
					<ul className="dl-list">
						<li><a className="dl-tvm" href={show.url}>TVMaze</a></li>
						<li><a className="dl-kat" href={'https://kat.cr/usearch/?q=' + showNameForURL + '&field=time_add&sorder=desc'}>KAT</a></li>
						<li><a className="dl-rar" href={'https://rarbg.to/torrents.php?search=' + showNameForURL}>RARBG</a></li>
						<li><a className="dl-tz"  href={'https://torrentz.eu/searchA?f=' + showNameForURL}>Torrentz</a></li>
					</ul>
				</div>
			</article>
		)
	}
})

var ShowDay = React.createClass({
	render: function() {
		return (
			<h1>{this.props.day}</h1>
		)
	}
})

var ShowList = React.createClass({
	render: function() {
		var rows = []
		var currentDay = null
		this.props.data.forEach(function(show) {
			var showDay = show.schedule.days[0] || 'Unknown'
			if (showDay !== currentDay) {
				rows.push(<ShowDay day={showDay} />)
			}
			rows.push(<Show show={show} />)
			currentDay = showDay
		})

		return (
			<section id="tv">
				{rows}
			</section>
		)
	}
})

// Collect all the data from the TVMaze API, join it together,
// sort it, and pass it off to the renderer.

var showData = []
var numShows = SHOWS.length
for (var i = 0; i < numShows; i++) {
	var showName = SHOWS[i]
	var URL = 'http://api.tvmaze.com/singlesearch/shows?q=' + encodeURIComponent(showName.toLowerCase()) + '&embed=episodes'
	// console.log('Fetching data for show: ' + showName + ' @ ' + URL)
	$.getJSON(URL, function(json) {
		showData.push(json)
		// console.log('Received data for show: ' + json.name + ' (' + showData.length + '/' + numShows + ')')
		// console.log(json)
		if (showData.length == numShows) {
			// console.log('All data received!')
			showData.sort(function(a, b) {
				var aDay = ORDER_DAY[a.schedule.days[0] || 'Unknown']
				var bDay = ORDER_DAY[b.schedule.days[0] || 'Unknown']
				return (aDay == bDay) ?
					a.name.toLowerCase().replace(/^the /, '') > b.name.toLowerCase().replace(/^the /, '') :
					aDay > bDay
			})
			console.log(showData)
			ReactDOM.render(
				<ShowList data={showData} />,
				document.getElementById('content')
			)
		}
	})
}

ReactDOM.render(
	<LoadingDots />,
	document.getElementById('content')
)
