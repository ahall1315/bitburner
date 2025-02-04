// Executes hacking script on all purchased servers

import { NS, AutocompleteData } from "@ns";
import { pServPrefix } from "/lib/const.js";

export async function main(ns: NS): Promise<void> {
	const script = "/scripts/ts/hgw.js";
	let target: string = <string>ns.args[0];
	let threads: number = <number>ns.args[1];
	let servers: string[] = ns.getPurchasedServers();
	let pid: number = -1;
	let error: boolean = false;
	let count: number = 0;

	const args = ns.flags([["help", false]]);
	if (ns.args[0] === "help" || args.help) {
		ns.tprintf("Executes the hacking script on the targeted server with a specified number of threads");
		ns.tprintf(`Usage: run ${ns.getScriptName()} [target] [threads]`);
		ns.tprintf("Example:");
		ns.tprintf(`> run ${ns.getScriptName()} golem0 5`);
		ns.exit();
	}

	if (threads == undefined || target == undefined) {
		ns.tprint("Incorrect usage of arguments. Provide number of threads for executed script and target host. \nUsage: run exec_hack.js [target] [threads]");
	} else {
		ns.tprint("Attempting to run script " + script + " on " + servers.length + " servers...");

		for (var i = 0; i < servers.length; ++i) {
			pid = ns.exec(script, pServPrefix + i, threads, target);
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

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
	return [...data.servers, ...data.scripts, ...data.txts, "help", "--help"];
}