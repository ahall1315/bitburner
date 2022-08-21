// Executes a script on the purchased servers that takes no argument

/** @param {NS} ns */
export async function main(ns) {
	let script = ns.args[0];
	let threads = ns.args[1];
	const hostPrefix = "golem";
	let servers = ns.getPurchasedServers();
	let error = false;
	let pid = -1;

	ns.tprint("Attempting to run script " + script + " on " + servers.length + " servers...");

	if (script == undefined) {
		ns.tprint("Incorrect usage of arguments. Provide filename of script and number of threads \nUsage: run exec.js [filename] [threads]");
	} else {
		for (var i = 0; i < servers.length; ++i) {
			pid = ns.exec(`${script}`, hostPrefix + i, threads);
			if (pid === 0) {
				error = true;
			}
		}
	}

	if (error) {
		ns.tprint("There was an error in attempting to run the script.");
	} else {
		ns.tprint("Script successfully executed.");
	}
}