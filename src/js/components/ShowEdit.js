const React = require("react")
const $ = require("jquery")

const FormInput = require("./FormInput")

const ShowEdit = React.createClass({
	propTypes: {
		item: React.PropTypes.shape({
			name  : React.PropTypes.string.isRequired,
			pref  : React.PropTypes.string,
			imdb  : React.PropTypes.string,
			tvmaze: React.PropTypes.oneOfType([
						React.PropTypes.number,
						React.PropTypes.string
					])
		}).isRequired,
		whenDoneEditing: React.PropTypes.func
	},
	getInitialState: function() {
		const state = {
			canDelete: false
		}
		if (this.props.item) {
			Object.keys(this.props.item).forEach((key) => {
				state[key] = this.props.item[key]
			})
		}
		return state
	},
	handleChange: function(event) {
		// console.log("handleChange", event.target.name, event.target.value)
		const value = event.target.value
		let newstate = {}
		newstate[event.target.name] = (value.length > 0 && value.trim().length > 0) ? value : ""
		this.setState(newstate)
	},
	handleSubmit: function(event) {
		event.preventDefault()
		let changes = {}
		Object.keys(this.state).forEach((key) => {
			const oldValue = (this.props.item[key] || "").toString()
			const newValue = (this.state[key] || "").toString()
			if (oldValue !== newValue) {
				changes[key] = newValue
			}
		})
		if (Object.keys(changes).length === 0) {
			console.log("handleSubmit", this.props.item.name, "no changes")
			this.handleCancel(event)
		} else {
			console.log("handleSubmit", this.props.item.name, changes)
			$.post({
				url: "/api/editshow",
				data: {
					name: this.props.item.name,
					changes: changes
				}
			})
			.done((data, textStatus, jqXHR) => {
				// Pass back up the chain
				console.log("submission succeeded:", this.props.item.name, data)
				this.props.whenDoneEditing && this.props.whenDoneEditing("REFRESH")
			})
			.fail((jqXHR, textStatus, errorThrown) => {
				console.log("submission failed:", this.props.item.name, textStatus, errorThrown)
				this.handleCancel(event)
			})
		}
	},
	handleCancel: function(event) {
		event.preventDefault()
		// Pass back up the chain
		this.props.whenDoneEditing && this.props.whenDoneEditing()
	},
	handleDeleteConfirm: function(event) {
		this.setState({ canDelete: event.target.checked })
	},
	handleDelete: function(event) {
		event.preventDefault()
		if (this.state.canDelete) {
			console.log("handleDelete", this.props.item.name)
			// TODO: delete show
			$.post({
				url: "/api/deleteshow",
				data: {
					name: this.props.item.name
				}
			})
			.done((data, textStatus, jqXHR) => {
				// Pass back up the chain
				console.log("submission succeeded:", this.props.item.name, data)
				this.props.whenDoneEditing && this.props.whenDoneEditing("REFRESH")
			})
			.fail((jqXHR, textStatus, errorThrown) => {
				console.log("submission failed:", this.props.item.name, textStatus, errorThrown)
				this.handleCancel(event)
			})
		}
	},
	render: function() {
		return (
			<section id="editor">
				<h1>Edit Show</h1>

				<form onSubmit={this.handleSubmit} onCancel={this.handleCancel}>
					<FormInput label="Show Name" name="name"
						value={this.state.name}
						onChange={this.handleChange} />

					<FormInput label="Additional Search Keywords" name="pref"
						value={this.state.pref}
						onChange={this.handleChange} />

					<div className="row">
						<div className="col-xs">
							<FormInput label="IMDb ID" name="imdb"
								value={this.state.imdb}
								onChange={this.handleChange} />
						</div>
						<div className="col-xs">
							<FormInput label="TVMaze ID" name="tvmaze"
								value={this.state.tvmaze}
								onChange={this.handleChange} />
						</div>
					</div>

					<footer className="row reverse">
						<div className="col-xs">
							<button type="submit" className="btn btn-block btn-primary"
								onClick={this.handleSubmit}>Save</button>
						</div>
						<div className="col-xs">
							<button type="cancel" className="btn btn-block"
								onClick={this.handleCancel}>Cancel</button>
						</div>
					</footer>

					<aside className="row">
						<div className="col-xs">
							<button type="button" ref="deleteButton" className="btn btn-block"
								disabled={!this.state.canDelete}
								onClick={this.handleDelete}>Delete</button>
						</div>
						<div className="col-xs">
							<label>
								<input type="checkbox" ref="deleteBox"
									onChange={this.handleDeleteConfirm} />
								Confirm
							</label>
						</div>
					</aside>
				</form>
			</section>
		)
	}
})

module.exports = ShowEdit
