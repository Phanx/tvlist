export function after(ms, func) {
	window.setTimeout(func, ms || 0)
}

// https://github.com/robertknight/react-testing

import * as React from "react";
import {unmountComponentAtNode} from "react-dom";

export function withContainer(id = "app", callback) {
	if (typeof document === "undefined") {
		throw new Error("DOM environment has not been set up");
	}

	var React = require("react");

	let appElement = document.getElementById(id);
	if (!appElement) {
		appElement = document.createElement("div");
		appElement.id = id;
		document.body.appendChild(appElement);
	}

	appElement.innerHTML = "";
	callback(appElement);
	unmountComponentAtNode(appElement);
}
