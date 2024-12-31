// Prints the maximum threads a host can run a script

/** @param {import("@ns").NS} ns **/
export async function main(ns) {

	const thisHostSwitch = "-h";
	let thisHost = false;

	if (ns.args.includes(thisHostSwitch)) {
		if (ns.args[0] == undefined) {
			ns.tprint("Incorrect usage. Provide [Hostname] of host and [Filename] of script to be run. Switch "+ thisHostSwitch + " for this host.");
			ns.exit();
		}

		thisHost = true;
	} else {
		if (ns.args[0] == undefined || ns.args[1] == undefined) {
			ns.tprint("Incorrect usage. Provide [Hostname] of host and [Filename] of script to be run. Switch "+ thisHostSwitch + " for this host.");
			ns.exit();
		}
	}

	let host = "";
	let script = "";


	if (thisHost) {
		host = ns.getHostname();
		script = ns.args[0];
	} else {
		host = ns.args[0];
		script = ns.args[1];
	}

	let maxRam = ns.getServerMaxRam(host);
	let usedRam = ns.getServerUsedRam(host)
	let freeRam = maxRam - usedRam;
	let usedRatio = usedRam / maxRam;
	let scriptRam = ns.getScriptRam(script, host);
	let threads = 0;

	// If this script is analyzing the same host it is running on
	if (host === ns.getHostname()) {
		usedRam = usedRam - ns.getScriptRam("/scripts/max_threads.js"); // Subtracts the RAM cost of this script
		freeRam = maxRam - usedRam;
		usedRatio = usedRam / maxRam;
	}

	ns.tprint("Host total RAM: " + maxRam.toLocaleString() + " GB");
	ns.tprint("Host used RAM: " + usedRam.toLocaleString() + " GB (" + (usedRatio * 100).toFixed(2) + "%)");
	ns.tprint("Host free RAM: " + freeRam.toLocaleString() + " GB");
	ns.tprint("RAM to run script: " + scriptRam.toLocaleString() + " GB");

	ns.tprint("------------------------------------");

	threads = Math.floor(maxRam / scriptRam);
	ns.tprint("Max threads with total RAM: " + numberWithCommas(threads));
	threads = Math.floor(freeRam / scriptRam);
	ns.tprint("Max threads with free RAM: " + numberWithCommas(threads));

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}