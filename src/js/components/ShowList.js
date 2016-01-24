const React = require("react")
const $ = require("jquery")

const ShowListGroup = require("./ShowListGroup")

function sortByName(a, b) {
	return a.name.toLowerCase().replace(/^the /, '') > b.name.toLowerCase().replace(/^the /, '')
}

module.exports = React.createClass({
	propTypes: {
		data      : React.PropTypes.array.isRequired,
		id        : React.PropTypes.string,
		initialDay: React.PropTypes.string
	},
	render: function() {
		var showGroups = $.map(this.props.data, (day) => {
			return (
				<ShowListGroup
					key={day.name}
					name={day.name}
					shows={day.shows.sort(sortByName)}
					selected={day.name === this.props.initialDay} />
			)
		})
		return (
			<section className="show-list" id={this.props.id}>
				{showGroups}
			</section>
		)
	}
})
