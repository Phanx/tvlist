var React = require("react")
var $ = require("jquery")

var EditListItem = require("./EditListItem")

module.exports = React.createClass({
	getInitialState: function() {
		return {
			items: [],
			expandedItem: null
		}
	},
	componentDidMount: function() {
		$.getJSON("/api/shows", (json) => {
			console.log("Show list received...")
			this.setState({ items: json })
		})
	},
	setSelectedItem: function(showName) {
		this.setState({ expandedItem: showName })
	},
	render: function() {
		var itemNodes = $.map(this.state.items, (item, index) => {
			return (
				<EditListItem key={index}
					item={item}
					expanded={item.name === this.state.expandedItem}
					setExpanded={this.setSelectedItem} />
			)
		})
		return (
			<section id="edit-list">
				<h1>Edit Shows</h1>
				{itemNodes}
			</section>
		)
	}
})
