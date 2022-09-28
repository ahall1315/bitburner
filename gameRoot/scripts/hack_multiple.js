// Open ports and hack servers provided as arguments

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
	var targets = [];
	var printTargets = "";
	let host = ns.getHostname();
	const noPrintSwitch = "-n";
	const divideThreadsSwitch = "-r";
	var threads = -1;
	var confirm = false;
	let pid = -1;
	let error = false;

	if (ns.args[0] == undefined) {
		ns.tprint("Invalid usage. Provide servers to target as argument [server]. Switch '-r' to divide threads among targets.")
	} else {

		threads = await ns.prompt("How many threads?", { type: "text" });

		if (isNaN(threads) || threads <= 0) {
			ns.alert("Input for threads was not a number or was less than or equal to zero");
		} else {

			for (let i = 0; i < ns.args.length; i++) {
				if (ns.args[i] != divideThreadsSwitch) {
					targets.push(ns.args[i]);
				}
			}

			// Divide the the given threads amongst the targets
			if (ns.args.includes(divideThreadsSwitch)) {
				threads = threads / targets.length;
				threads = Math.floor(threads);
			}

			for (let i = 0; i < targets.length; i++) {
				if (ns.args[i] != divideThreadsSwitch) {
					printTargets = printTargets.concat("- " + targets[i] + "\n");
				}
			}

			confirm = await ns.prompt(`Hacking these servers with ${threads} threads each:\n${printTargets} \nConfirm?`, { type: "boolean" });

			if (confirm) {
				ns.tprint("Attempting to hack...");
				for (let i = 0; i < targets.length; i++) {
					ns.run("/scripts/open_ports.js", 1, targets[i], noPrintSwitch);
					await ns.sleep(250); // Waits for ports to be opened
					if (ns.isRunning("/scripts/hack.js", host, targets[i])) {
						ns.print("Hack script already running for target: " + targets[i] + "! Killing script.")
						ns.kill("/scripts/hack.js", host, targets[i])
					}
					pid = ns.run("/scripts/hack.js", threads, targets[i]);

					if (pid <= 0) {
						error = true;
					}
				}
				if (targets.length === 1) {
					ns.tprint("Hacking server...")
				} else {
					ns.tprint("Hacking multiple servers...");
				}
				if (error) {
					ns.tprint("There was an error in hacking one or more servers. Is there enough RAM?");
				}
			}

		}

	}

}