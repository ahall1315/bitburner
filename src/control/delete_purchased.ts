// Deletes all purchased servers

import { NS, AutocompleteData } from "@ns";

export async function main(ns: NS): Promise<void> {
	const args = ns.flags([["help", false]]);
	if (ns.args[0] === "help" || args.help) {
		ns.tprintf("Deletes all purchased servers");
		ns.tprintf(`Usage: run ${ns.getScriptName()}`);
		ns.exit();
	}

	let servers: string[] = ns.getPurchasedServers();
	let error: boolean = false;
	let deleted: boolean = false;

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

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
	return [...data.servers];
}