import React, { PropTypes } from "react"

const ignoredTagNames = ["a", "button", "input", "label", "select", "textarea"]

const LongPressHandler = React.createClass({
	propTypes: {
		// Function to call when a longpress is triggered.
		action: PropTypes.func.isRequired,

		// Mouse button to trigger the longpress action.
		// May be 1 (middle button, default) or 2 (right button).
		button: PropTypes.oneOf([1,2]),

		// React component or HTML tag name (default `div`).
		component: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.string
		]),

		// String containing a list of lowercase modifier key name(s) to let
		// left-click trigger the longpress action. Separators are optional.
		// Examples: "shift" (default), "ctrl-shift", "shift alt", "altctrl".
		modKeys: PropTypes.string,

		// Trigger the longpress action with `<modKeys> + <button>` instead of
		// with either `<button>` OR `<modKeys> + left-click`.
		strict: PropTypes.bool,

		// Time in MS required to count as a longpress. Default 500.
		timeout: PropTypes.number,

		children: PropTypes.node
	},

	defaultProps: {
		button : 1, // middle button
		modKeys: "shift",
		timeout: 500
	},

	render: function() {
		const {
			children, component,
			action, button, modKeys, strict, timeout, // eslint-disable-line
			...otherProps
		} = this.props

		return React.createElement(component || "div", {
			...otherProps,
			onMouseDown: this.mouseDown,
			onMouseUp: this.mouseUp,
			ref: "container"
		}, children)
	},

	/**
	 * Indicates whether elements with the given tag name have predefined
	 * interactive behaviors, eg. `a` or `label`, and should therefore not
	 * trigger the component's custom click/touch handlers.
	 */
	isIgnoredTarget: function(element) {
		return ignoredTagNames.indexOf(element.tagName.toLowerCase()) !== -1
	},

	/**
	 * Calculates whether the specified combination of mouse button and/or
	 * modifier keys should be treated as a long-press based on the props
	 * set on the component.
	 */
	isLikeLongPress: function(event) {
		const buttonOK = event.button === this.props.button
		if (buttonOK && !this.props.strict) {
			return true
		}
		if (this.props.strict && !buttonOK) {
			return false
		}
		if (!event.altKey && this.props.modKeys.indexOf("alt") !== -1) {
			return false
		}
		if (!event.ctrlKey && this.props.modKeys.indexOf("ctrl") !== -1) {
			return false
		}
		if (!event.shiftKey && this.props.modKeys.indexOf("shift") !== -1) {
			return false
		}
		return true
	},

	mouseDown: function(event) {
		if (this.isIgnoredTarget(event.target)) {
			return
		}
		this.longPressTimeout = window.clearTimeout(this.longPressTimeout)
		if (event.button === 0) { // left button
			this.longPressTimeout = window.setTimeout(() => {
				this.longPressTimeout = null
				this.triggerLongPress()
			}, this.props.timeout)
		}
	},

	mouseUp: function(event) {
		if (this.isIgnoredTarget(event.target)) {
			return
		}
		if (!this.longPressTimeout, this.isLikeLongPress(event)) {
			this.triggerLongPress()
		}
		this.longPressTimeout = window.clearTimeout(this.longPressTimeout)
	},

	triggerLongPress: function() {
		this.props.action()
	}

})

export default LongPressHandler
