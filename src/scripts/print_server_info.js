/** @param {import("@ns").NS} ns **/
export async function main(ns) {
	let ram = ns.args[0];

	if (ram == undefined) {
		ns.tprint("Incorrect usage. Please provide [ram] of server to buy.")
	} else {

		// Create number formatter for USD.
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

		ns.tprint("Purchased server limit: " + ns.getPurchasedServerLimit().toLocaleString());

		ns.tprint("Purchased server cost: " + formatter.format(ns.getPurchasedServerCost(ram)));

		ns.tprint("Purchased server max ram: " + ns.getPurchasedServerMaxRam().toLocaleString() + " GB (2^20)");

		ns.tprint("Purchased servers: " + ns.getPurchasedServers());

	}

}