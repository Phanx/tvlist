var React = require("react")
var $ = require("jquery")

var ShowListGroup = require("./ShowListGroup")

module.exports = React.createClass({
	propTypes: {
		data      : React.PropTypes.array,
		id        : React.PropTypes.string,
		initialDay: React.PropTypes.string
	},
	render: function() {
		console.log('initial selection: ' + this.props.initialDay)
		var showGroups = $.map(this.props.data, (day) => {
			return (
				<ShowListGroup
					key={day.name}
					name={day.name}
					shows={day.shows}
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
