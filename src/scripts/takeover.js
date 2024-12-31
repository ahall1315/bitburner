// Attempts to grant root access and distribute scripts to a provided server

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	let pid = -1;
	let error = false;
	const noPrintSwitch = "-n";
	let match = false;
	const substring = "scripts";

	if (target == undefined) {
		ns.tprint("Incorrect usage of arguments. Provide [hostname] of targeted server.");
		ns.exit();
	}

	ns.tprint("Attempting to take over " + target + ".");

	pid = ns.run("/scripts/open_ports.js", 1, target, noPrintSwitch);
	await ns.sleep(250);

	if (pid === 0 || !ns.hasRootAccess(target)) {
		ns.tprint("Not enough ports open on " + target + ".");
		error = true;
	} else {
		ns.tprint("Root access granted on " + target + ".");
	}

	pid = ns.run("/scripts/scp.js", 1, "/lib/", target);
	pid = ns.run("/scripts/scp.js", 1, "/scripts/", target);
	await ns.sleep(250);

	// Searches the server's files for the substring 'scripts'
	match = ns.ls(target).find(element => {
		if (element.includes(substring)) {
			return true;
		}
	});

	if (pid === 0 || !match) {
		ns.tprint("No scripts found on " + target + ".");
		error = true;
	} else {
		ns.tprint("Scripts found on " + target + ".");
	}

	if (!error) {
		ns.tprint("Successfully took over " + target + ".");
	} else {
		ns.tprint("Failed to take over " + target + ".");
	}

}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}