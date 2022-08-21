// Deletes all purchased servers

/** @param {NS} ns */
export async function main(ns) {
	let servers = ns.getPurchasedServers();
	let error = false;
	let deleted = false;

	for (var i = 0; i < servers.length; ++i) {
		deleted = ns.deleteServer(servers[i]);

		if (!deleted) {
			error = true;
		}
	}

	if (error) {
		ns.tprint("There was an error in deleting the servers.")
	} else {
		ns.tprint("Servers successfully deleted.");
	}
}