require("testdom")("<html><body></body></html>")

import React from "react"
import ReactDOM from "react-dom"
import ReactTestUtils from "react-addons-test-utils"

import { expect } from "chai"

import { after } from "./utils"

import LongPressHandler from "../src/js/components/LongPressHandler"

describe("LongPressHandler", function() {
	const noop = () => { /* do nothing */ }
	const render = (props = {}) => {
		const { action, children, ...otherProps } = props
		return ReactTestUtils.renderIntoDocument(
			<LongPressHandler action={action || noop} {...otherProps}>
				{children}
			</LongPressHandler>
		)
	}

	it("renders an empty div by default", function() {
		const component = render()
		const element   = ReactDOM.findDOMNode(component)
		expect(element.tagName.toLowerCase()).to.equal("div")
		expect(element.childNodes).to.have.length(0)
	})

	it("renders as a specified element with children", function() {
		const tag       = "section"
		const childTag  = "p"
		const childText = "test"
		const component = render({
			children: React.createElement(childTag, null, childText),
			component: tag
		})

		const element = ReactDOM.findDOMNode(component)
		expect(element.tagName.toLowerCase()).to.equal(tag)

		const childNodes = element.childNodes
		expect(childNodes).to.have.length(1)

		const firstChild = childNodes[0]
		expect(firstChild.tagName.toLowerCase()).to.equal(childTag)
		expect(firstChild.textContent).to.equal(childText)
	})

	it("triggers longpress on left click after the specified timeout", function(done) {
		const timeout   = 10
		const component = render({ action: done, timeout: timeout })
		const element   = ReactDOM.findDOMNode(component)
		const testEvent = { target: element, button: 0 }

		this.timeout(timeout * 2)
		ReactTestUtils.Simulate.mouseDown(element, testEvent)
	})

	it("triggers longpress immediately on middle click (default)", function(done) {
		const timeout   = 10
		const component = render({ action: done, timeout: timeout })
		const element   = ReactDOM.findDOMNode(component)
		const testEvent = { target: element, button: 1 }

		this.timeout(timeout * 3)
		ReactTestUtils.Simulate.mouseDown(element, testEvent)
		after(5, () => {
			ReactTestUtils.Simulate.mouseUp(element, testEvent)
		})
	})

	it("triggers longpress immediately on shift click (default)", function(done) {
		const timeout   = 20
		const component = render({ action: done, timeout: timeout })
		const element   = ReactDOM.findDOMNode(component)
		const testEvent = { target: element, button: 0, shiftKey: true }

		this.timeout(timeout * 2)
		ReactTestUtils.Simulate.mouseDown(element, testEvent)
		after(5, () => {
			ReactTestUtils.Simulate.mouseUp(element, testEvent)
		})
	})

	it("triggers longpress immediately on strict ctrl right click (custom)", function(done) {
		const timeout   = 20
		const component = render({ action: done, button: 2, modKeys: "ctrl", strict: true, timeout: timeout })
		const element   = ReactDOM.findDOMNode(component)
		const testEvent = { target: element, button: 2, ctrlKey: true }

		this.timeout(timeout / 2)
		ReactTestUtils.Simulate.mouseDown(element, testEvent)
		after(5, () => {
			ReactTestUtils.Simulate.mouseUp(element, testEvent)
		})
	})

	it("does not trigger longpress on right click (default)", function(done) {
		let called = false
		const callback = () => called = true

		const timeout   = 10
		const component = render({ action: callback, timeout: timeout })
		const element   = ReactDOM.findDOMNode(component)
		const testEvent = { target: element, button: 2 }

		this.timeout(timeout * 4)
		ReactTestUtils.Simulate.mouseDown(element, testEvent)
		after(timeout + 5, () => {
			ReactTestUtils.Simulate.mouseUp(element, testEvent)
			after(5, () => {
				expect(called).to.be.false
				done()
			})
		})
	})

	it("does not trigger longpress on `a` child", function(done) {
		let called = false
		const callback = () => called = true

		const timeout = 10
		const childTag = "a"
		const component = render({
			action: callback, 
			timeout: timeout, 
			children: React.createElement(childTag, null, "click here")
		})

		const element = ReactDOM.findDOMNode(component).childNodes[0]
		const testEvent = { target: element, button: 2 }

		this.timeout(timeout * 10)
		ReactTestUtils.Simulate.mouseDown(element, testEvent)
		after(timeout + 5, () => {
			ReactTestUtils.Simulate.mouseUp(element, testEvent)
			after(5, () => {
				expect(called).to.be.false
				done()
			})
		})
	})
})
