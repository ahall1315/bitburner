// Kills running scripts on all purchased servers

import { NS } from "@ns";
import { pServPrefix } from "/lib/const";

export async function main(ns: NS): Promise<void> {
	let servers: string[] = ns.getPurchasedServers();
	let error: boolean = false;
	let killed: boolean = false;
	let count: number = 0;
	let targets: string[] = [];

	if (ns.args[0] === "help") {
		ns.tprintf("Kills all scripts on purchased servers. If no targets are provided, scripts on all purchased servers will be killed.");
		ns.tprintf(`Usage: run ${ns.getScriptName()} [target1] [target2] ... [targetN]`);
		ns.tprintf("Example:");
		ns.tprintf(`> run ${ns.getScriptName()}`);
		ns.tprintf(`> run ${ns.getScriptName()} ${pServPrefix}0 ${pServPrefix}1`);
		ns.exit();
	}
	
	// If there are no arguments
	if (ns.args.length === 0) {
		ns.tprint("Attempting to kill all scripts on purchased server(s)...");
		
		for (var i = 0; i < servers.length; ++i) {
			killed = ns.killall(pServPrefix + i);
			if (!killed) {
				error = true;
			} else {
				count++;
			}
		}
		
		if (error) {
			ns.tprint("There was an error in killing the scripts on one or more purchased server(s).");
		}
		ns.tprint("Scripts successfully killed on " + count + " purchased server(s).");

	} else {
		ns.tprint("Attempting to kill scripts on target(s)...");

		for (i = 0; i < ns.args.length; i++) {
			targets.push(String(ns.args[i]));
		}

		for (i = 0; i < targets.length; i++) {
			killed = ns.killall(String(targets[i]));
			if (!killed) {
				error = true;
			} else {
				count++;
			}
		}

		if (error) {
			ns.tprint("There was an error in killing the scripts on one or more target(s).");
		}
		ns.tprint("Scripts successfully killed on " + count + " target(s).");

	}
}