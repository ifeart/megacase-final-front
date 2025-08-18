/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const originalMethods = {
	log: console.log,
	warn: console.warn,
	info: console.info,
	error: console.error,
	debug: console.debug,
	trace: console.trace,
	group: console.group,
	groupCollapsed: console.groupCollapsed,
	table: console.table,
	time: console.time,
	timeEnd: console.timeEnd,
};

const createFilter = (originalMethod: any) => {
	return (...args: any[]) => {
		const allArgs = args
			.map((arg) => {
				if (typeof arg === "string") return arg;
				if (typeof arg === "object" && arg !== null)
					return JSON.stringify(arg);
				return String(arg);
			})
			.join(" ");

		if (
			allArgs.includes("[smplr.js]") ||
			allArgs.includes("Setting camera to orbit") ||
			allArgs.includes("Space rendered in") ||
			allArgs.includes("MST saved") ||
			allArgs.includes("WARNING: Too many active WebGL contexts") ||
			allArgs.includes("MapViewer-") ||
			allArgs.includes("smplr-b7407b79.mjs") ||
			allArgs.includes("esm") ||
			allArgs.includes("Babylon.js")
		) {
			return;
		}

		originalMethod(...args);
	};
};

console.log = createFilter(originalMethods.log);
console.warn = createFilter(originalMethods.warn);
console.info = createFilter(originalMethods.info);
console.error = createFilter(originalMethods.error);
console.debug = createFilter(originalMethods.debug);
console.trace = createFilter(originalMethods.trace);
console.group = createFilter(originalMethods.group);
console.groupCollapsed = createFilter(originalMethods.groupCollapsed);

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
