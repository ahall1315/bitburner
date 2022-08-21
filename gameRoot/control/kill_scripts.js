// Kills running scripts on all purchased servers

/** @param {NS} ns */
export async function main(ns) {
	const hostPrefix = "golem";
	let servers = ns.getPurchasedServers();
	let error = false;
	let killed = false;

	ns.tprint("Attempting to kill all scripts on purchased servers...");

	for (var i = 0; i < servers.length; ++i) {
		killed = ns.killall(hostPrefix + i);
		if (!killed) {
			error = true;
		}
	}

	if (!error) {
		ns.tprint("Scripts successfully killed on all purchased servers");
	} else {
		ns.tprint("There was an error in killing the scripts.");
	}

}