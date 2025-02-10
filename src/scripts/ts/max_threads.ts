import { NS, AutocompleteData } from "@ns";
import { numberWithCommas } from "/lib/utils.js";

export async function main(ns: NS): Promise<void> {
    const thisHostSwitch = "h";

    const args = ns.flags([["help", false], [thisHostSwitch, false]]);
    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("Prints the maximum amount of threads that can be run a given host with a given script");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [hostname] [scriptname]`);
        ns.tprintf("Optional switch " + thisHostSwitch + " to run on this host");
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} home hack.js`);
        ns.tprintf(`> run ${ns.getScriptName()} hack.js -${thisHostSwitch}`);
        ns.exit();
    }

	if (args[thisHostSwitch]) {
		if (ns.args[0] == undefined) {
			ns.tprint("Incorrect usage. Provide [Hostname] of host and [Filename] of script to be run. Switch "+ thisHostSwitch + " for this host.");
			ns.exit();
		}
	} else {
		if (ns.args[0] == undefined || ns.args[1] == undefined) {
			ns.tprint("Incorrect usage. Provide [Hostname] of host and [Filename] of script to be run. Switch "+ thisHostSwitch + " for this host.");
			ns.exit();
		}
	}

	let host: string = "";
	let script: string = "";

	if (args[thisHostSwitch]) {
		host = ns.getHostname();
		script = <string>ns.args[0];
	} else {
		host = <string>ns.args[0];
		script = <string>ns.args[1];
	}

    if (!ns.fileExists(script, host)) {
        ns.tprintf("WARNING: Script " + script + " does not exist on host " + host);
        ns.tprintf("WARNING: Make sure you have the correct file path e.g. /scripts/hack.js");
        ns.exit();
    }

	let maxRam: number = ns.getServerMaxRam(host);
	let usedRam: number = ns.getServerUsedRam(host)
	let freeRam: number = maxRam - usedRam;
	let usedRatio: number = usedRam / maxRam;
	let scriptRam: number = ns.getScriptRam(script, host);
	let threads: number = 0;

	// If this script is analyzing the same host it is running on
	if (host === ns.getHostname()) {
		usedRam = usedRam - ns.getScriptRam(ns.getScriptName()); // Subtracts the RAM cost of this script
		freeRam = maxRam - usedRam;
		usedRatio = usedRam / maxRam;
	}

	ns.tprintf("Host total RAM: " + maxRam.toLocaleString() + " GB");
	ns.tprintf("Host used RAM: " + usedRam.toLocaleString() + " GB (" + (usedRatio * 100).toFixed(2) + "%%)");// There are two percentage signs because the first one is an escape character
	ns.tprintf("Host free RAM: " + freeRam.toLocaleString() + " GB");
	ns.tprintf("RAM to run script: " + scriptRam.toLocaleString() + " GB");

	ns.tprintf("------------------------------------");

	threads = Math.floor(maxRam / scriptRam);
	ns.tprintf("Max threads with total RAM: " + numberWithCommas(threads));
	threads = Math.floor(freeRam / scriptRam);
	ns.tprintf("Max threads with free RAM: " + numberWithCommas(threads));
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return [...data.servers, ...data.scripts, "help", "--help"];
}