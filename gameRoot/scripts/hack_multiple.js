// Open ports and hack servers provided as arguments

/** @param {NS} ns */
export async function main(ns) {
	var targets = [];
	var printTargets = "";
	let host = ns.getHostname();
	const noPrintSwitch = "-n";

	if (ns.args[0] == undefined) {
		ns.tprint("Invalid usage. Provide servers to target as argument [server].")
	} else {

		var threads = await ns.prompt("How many threads?", { type: "text" });

		if (isNaN(threads) || threads <= 0) {
			ns.alert("Input for threads was not a number or was less than or equal to zero");
		} else {

			for (let i = 0; i < ns.args.length; i++) {
				targets.push(ns.args[i]);
			}

			for (let i = 0; i < targets.length; i++) {
				printTargets = printTargets.concat("- " + targets[i] + "\n");
			}

			var confirm = await ns.prompt(`Hacking these servers with ${threads} threads:\n${printTargets} \nConfirm?`, { type: "boolean" });


			if (confirm) {
				for (let i = 0; i < targets.length; i++) {
					ns.run("/scripts/open_ports.js", 1, targets[i], noPrintSwitch);
					if (ns.isRunning("/scripts/hack.js", host, targets[i])) {
						ns.print("Hack script already running for target: " + targets[i] + "! Killing script.")
						ns.kill("/scripts/hack.js", host, targets[i])
					}
					ns.run("/scripts/hack.js", threads, targets[i]);
				}
			}

			if (targets.length === 1) {
				ns.tprint("Hacking server...")
			} else {
				ns.tprint("Hacking multiple servers...");
			}

		}


	}

}