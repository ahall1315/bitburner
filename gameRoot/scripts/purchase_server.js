import { pServPrefix } from "./lib/const.js";
import { formatRAM } from "./lib/utils.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {

	const args = ns.flags([["help", false]]);
	if (args.help) {
		ns.tprintf("This script will prompt the user with a menu to purchase servers.");
		ns.tprintf(`Usage: run ${ns.getScriptName()} [Amount of servers]`);
		ns.tprintf("Example:");
		ns.tprintf(`> run ${ns.getScriptName()} 25`);
		return;
	}

	let serverCount = args._[0];
	let cost = "0";
	let confirm = false;
	let purchasedCount = 0;
	let ram = -1;
	const pServLimit = ns.getPurchasedServerLimit();
	const pServMaxRam = ns.getPurchasedServerMaxRam();

	if (serverCount == undefined) {
		ns.tprint("Incorrect usage. Please provide [count] of servers to buy.");
	} else {
		if (serverCount > (pServLimit - ns.getPurchasedServers().length) || serverCount <= 0 || isNaN(serverCount)) {
			ns.tprint("Cannot buy that many servers!");
			ns.tprint("You can buy " + (pServLimit - ns.getPurchasedServers().length) + " more server(s).");
			ns.exit();
		}

		ram = await ns.prompt("How many GB of RAM?", { type: "select", choices: getRamOptions(pServMaxRam) });
		if (ram === undefined || ram === "") {
			return;
		}
		if (!isPowerofTwo(ram)) {
			ns.tprint("RAM must be a power of two!");
		} else {
			cost = serverCount * ns.getPurchasedServerCost(ram);

			confirm = await ns.prompt(`Purchasing ${serverCount} server(s) \nwith ${formatRAM(ns, ram)} of RAM \nwill cost ${ns.nFormat(cost, "$0.000a")} \nConfirm?`, { type: "boolean" });

			if (confirm) {
				if (cost > ns.getPlayer().money) {
					ns.tprintf("You do not have enough money to purchase " + serverCount + " server(s) for " + ns.nFormat(cost, "$0.000a") + "!");
				} else {

					let purchasedServers = ns.getPurchasedServers();

					for (let i = 0; i < serverCount; ++i) {
						if (purchasedServers.includes(pServPrefix + i)) {
							serverCount++;
						} else {
							if (serverCount <= pServLimit) {
								let purchasedHost = ns.purchaseServer(pServPrefix + i, ram);
								if (!(purchasedHost == "")) {
									purchasedCount++;
								} else {
									ns.print("ERROR Failed to purchase " + pServPrefix + i);
								}
							} else {
								ns.tprint("Cannot purchase any more servers!");
							}
						}
					}
				}
				if (purchasedCount != 0) {
					ns.tprintf(`Successfully purchased ${purchasedCount} server(s) with ${formatRAM(ns, ram)} of RAM.`);

					ns.tprintf(`
Thank you for shopping with us!
				
 __________________________________________
|                 888                      |
|                 888                      |
|  .d88b.  .d88b. 888 .d88b. 88888b.d88b.  |
| d88P"88bd88""88b888d8P  Y8b888 "888 "88b |
| 888  888888  88888888888888888  888  888 |
| Y88b 888Y88..88P888Y8b.    888  888  888 |
|  "Y88888 "Y88P" 888 "Y8888 888  888  888 |
|      888                                 |
| Y8b d88P                                 |
|  "Y88P"                server net        |
|__________________________________________|

`);
				}
			}
		}
	}
	function isPowerofTwo(x) {
		return ((x != 0) && !(x & (x - 1)));
	}

	function getRamOptions(maxRam) {
		let ramOptions = [];
		for (let i = 0; i <= maxRam; i++) {
			if (isPowerofTwo(i)) {
				ramOptions.push(i);
			}
		}
		return ramOptions;
	}
}