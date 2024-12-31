// Executes a script on the purchased servers that takes no argument

import { pServPrefix } from "/lib/const.js";
import { hacknetPrefix } from "/lib/const.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let script = ns.args[0];
	let threads = ns.args[1];
	let servers = [];
	let scannedServers = [];
	let error = false;
	let pid = -1;

	const args = ns.flags([["help", false], ["hacknet", false]]);
    if (args.help) {
        ns.tprintf("This script will attempt to execute a provided script that takes no args on the purchased servers.");
		ns.tprint("Optional argument --hacknet to execute a script on the hacknet servers instead.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [script] [threads]`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} hack.js 5`);
        return;
    }

	ns.tprint("Attempting to run script " + script + " on " + servers.length + " servers...");

	if (args.hacknet) {
		if (script == undefined) {
			ns.tprint("Incorrect usage of arguments. Provide filename of script and number of threads \nUsage: run exec.js [filename] [threads]");
		} else {
			scannedServers = ns.scan("home");

			for (let i = 0; i < scannedServers.length; i++) {
				if (scannedServers[i].includes(hacknetPrefix)) {
					servers.push(scannedServers[i]);
				}
			}

			for (var i = 0; i < servers.length; ++i) {
				pid = ns.exec(`${script}`, servers[i], threads);
				if (pid === 0) {
					error = true;
				}
			}
		}
	}

	if (!args.hacknet) {		
		if (script == undefined) {
			ns.tprint("Incorrect usage of arguments. Provide filename of script and number of threads \nUsage: run exec.js [filename] [threads]");
		} else {
			servers = ns.getPurchasedServers();
	
			for (var i = 0; i < servers.length; ++i) {
				pid = ns.exec(`${script}`, servers[i], threads);
				if (pid === 0) {
					error = true;
				}
			}
		}
	}


	if (error) {
		ns.tprint("There was an error in attempting to run the script.");
	} else {
		ns.tprint("Script successfully executed.");
	}
}