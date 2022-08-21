/** @param {NS} ns */
export async function main(ns) {

	ns.tprint(`
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
|__________________________________________|`);


	let serverCount = ns.args[0];
	let ram = ns.args[1];
	const hostPrefix = "golem";
	var cost = "0";
	var confirm = false;
	var purchasedCount = 0;

	// Create number formatter for USD.
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	if (serverCount == undefined) {
		ns.tprint("Incorrect usage. Please provide [count] of servers to buy.");
	} else {
		if (ram == undefined) {
			ns.tprint("Incorrect usage. Please provide [ram] of server to purchase.");
		} else {
			if (!isPowerofTwo(ram)) {
				ns.tprint("RAM must be a power of two!")
			} else {
				if (serverCount > ns.getPurchasedServerLimit()) {
					ns.tprint("Cannot buy that many servers!");
				} else {
					cost = formatter.format(serverCount * ns.getPurchasedServerCost(ram));

					confirm = await ns.prompt(`Purchasing ${serverCount} server(s) \nwith ${ram} GB of RAM \nwill cost ${cost}. \nConfirm?`, { type: "boolean" });

					if (confirm) {
						var purchasedServers = ns.getPurchasedServers();

						for (var i = 0; i < serverCount; ++i) {
							if (purchasedServers.includes(hostPrefix + i)) {
								serverCount++
							} else {
								if (serverCount <= ns.getPurchasedServerLimit()) {
									ns.purchaseServer(hostPrefix + i, ram);
									purchasedCount++;
								} else {
									ns.tprint("Cannot purchase any more servers!");
								}
							}
						}
						if (purchasedCount != 0) {
							ns.tprint(`Successfully purchased ${purchasedCount} server(s).`)
						}
					}
				}

			}

		}
	}

	function isPowerofTwo(x) {
		return ((x != 0) && !(x & (x - 1)));
	}
}