// Kills running scripts on all purchased servers

/** @param {NS} ns */
export async function main(ns) {
	const hostPrefix = "golem";
	let servers = ns.getPurchasedServers();
	let error = false;
	let killed = false;
	let count = 0;
	let targets = [];
	
	// If there are no arguments
	if (ns.args.length === 0) {
		ns.tprint("Attempting to kill all scripts on purchased servers...");
		
		for (var i = 0; i < servers.length; ++i) {
			killed = ns.killall(hostPrefix + i);
			if (!killed) {
				error = true;
			} else {
				count++;
			}
		}
		
		if (error) {
			ns.tprint("There was an error in killing the scripts on one or more purchased servers.");
		}
		ns.tprint("Scripts successfully killed on " + count + " purchased server(s).");

	} else {
		ns.tprint("Attempting to kill scripts on targets...");

		for (i = 0; i < ns.args.length; i++) {
			targets.push(ns.args[i]);
		}

		for (i = 0; i < targets.length; i++) {
			killed = ns.killall(targets[i]);
			if (!killed) {
				error = true;
			} else {
				count++;
			}
		}

		if (error) {
			ns.tprint("There was an error in killing the scripts on one or more targets.");
		}
		ns.tprint("Scripts successfully killed on " + count + " target(s).");

	}
	
}