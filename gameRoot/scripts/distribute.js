// Distributes scripts to all connected servers

/** @param {NS} ns */
export async function main(ns) {

	let servers = ns.scan();
	let pid = -1;
	let error = false;
	let count = 0;

	ns.tprint("Attempting to distribute to " + servers.length + " servers...");

	for (let i = 0; i < servers.length; i++) {
		ns.print(servers[i]);
		if (servers[i] != "home") {
			pid = ns.run("/scripts/scp.js", 1, "/scripts/", servers[i]);
			// If the script failed to run
			if (pid === 0) {
				error = true;
			}
			// If the script succeeded in running
			if (pid > 0) {
				count++;
			}
			await ns.sleep(250); // Waits for copy scripts
		}
	}

	if (error) {
		ns.tprint("Failed to distribute to one or more servers. Is there enough RAM?");
	} else {
		if (servers.includes("home")) {
			ns.tprint("Cannot distribute to home!");
		}
	}
	ns.tprint("Succesfully distributed to " + count + " connected servers");

}