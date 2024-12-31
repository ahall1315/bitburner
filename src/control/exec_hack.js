// Executes hacking script on all purchased servers

/** @param {NS} ns */
export async function main(ns) {
	const script = "/scripts/hack.js";
	let target = ns.args[0];
	let threads = ns.args[1];
	const hostPrefix = "golem";
	let servers = ns.getPurchasedServers();
	let pid = -1;
	let error = false;
	let count = 0;

	if (threads == undefined || target == undefined) {
		ns.tprint("Incorrect usage of arguments. Provide number of threads for executed script and target host. \nUsage: run exec_hack.js [target] [threads]");
	} else {
		ns.tprint("Attempting to run script " + script + " on " + servers.length + " servers...");

		for (var i = 0; i < servers.length; ++i) {
			pid = ns.exec(script, hostPrefix + i, threads, target);
			if (pid === 0) {
				error = true;
			} else {
				count++;
			}
		}

		if (error) {
			ns.tprint("Failed to execute script on one or more servers. Is the script already running? Is there enough RAM?");
		}
		ns.tprint("Successfully executed script on " + count + " servers");
	}
}