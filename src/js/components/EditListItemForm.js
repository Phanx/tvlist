var React = require("react")
var $ = require("jquery")

var EditListItemForm = require("./EditListItemForm")

module.exports = React.createClass({
	propTypes: {
		afterSubmitOrCancel: React.PropTypes.func,
		item: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired
			pref: React.PropTypes.string,
			imdb: React.PropTypes.string,
			kat : React.PropTypes.string,
			maze: React.PropTypes.string,
		})
	},
	getInitialState: function() {
		var state = {}
		if (this.props.item) {
			Object.keys(this.props.item).forEach(function(key)
				state[key] = this.props.item[key]
			)
		}
		return state
	},
	handleSubmit: function(event) {
		event.preventDefault()
		console.log("handleSubmit " + this.props.item.name)
		// TODO: save data
		// Pass back up the chain
		this.props.afterSubmitOrCancel && this.props.afterSubmitOrCancel()
	},
	handleCancel: function(event) {
		event.preventDefault()
		console.log("handleCancel " + this.props.item.name)
		// Reset fields
		var newstate = {}
		var orgstate = this.props.item || {}
		Object.keys(this.state).forEach(function(key)
			newstate[key] = orgstate[key]
		)
		this.setState(newstate)
		// Pass back up the chain
		this.props.afterSubmitOrCancel && this.props.afterSubmitOrCancel()
	},
	render: function() {
		return (
			<form onSubmit={this.handleSubmit} onCancel={this.handleCancel}>
				<div className="form-group form-primary">
					<label htmlFor="input-name">Show Name</label>
					<input id="input-name" name="name"
						type="text"
						value={this.props.state.name}
						onChange={this.handleChange}
						className="form-control" />
				</div>

				<div className="form-group">
					<label htmlFor="input-pref">Preferred Keyword(s)</label>
					<input id="input-pref" name="pref"
						type="text"
						value={this.props.state.pref}
						onChange={this.handleChange}
						className="form-control" />
				</div>

				<div className="row">
					<div className="col-xs form-group">
						<label htmlFor="input-kat">KAT ID</label>
						<input id="input-kat" name="kat"
							type="number"
							value={this.props.state.kat}
							onChange={this.handleChange}
							className="form-control" />
					</div>
					<div className="col-xs form-group">
						<label htmlFor="input-imdb">IMDb ID</label>
						<input id="input-imdb" name="imdb"
							type="number"
							value={this.props.state.imdb}
							onChange={this.handleChange}
							className="form-control" />
					</div>
					<div className="col-xs form-group">
						<label htmlFor="input-maze">TVMaze ID</label>
						<input id="input-maze" name="maze"
							type="number"
							value={this.props.state.maze}
							onChange={this.handleChange}
							className="form-control" />
					</div>
				</div>

				<footer className="row">
					<div className="col-xs">
						<button type="submit" class="btn btn-block btn-primary">Save</button>
					</div>
					<div className="col-xs">
						<button type="cancel" class="btn btn-block">Cancel</button>
					</div>
				</footer>
			</form>
		)
	}
})
