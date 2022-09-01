// Experiment with hacknet api

/** @param {NS} ns */
export async function main(ns) {
    let error = false;
    let targetNode = -1;
    let numNodes = ns.hacknet.numNodes();
    const maxNodes = ns.hacknet.maxNumNodes(); // This value should be infinity

    ns.tprint("Beginning automated hacknet manager...");

    /* 
    production is in dollars per second
    timeOnline is in seconds
    production is in dollars
    */
    let nodeStats = ns.hacknet.getNodeStats(0);

    //ns.tprint(JSON.stringify(nodeStats, null, 2));

    //ns.hacknet.purchaseNode();

    // const {production, purchaseCost} = ns.getHacknetMultipliers();
    // ns.tprint(production);
    // ns.tprint(purchaseCost);

    
    // calculate the return on investment for upgrading level, and if good enough, upgrade
    while (true) {
        for (let i = 0; i < numNodes; i++) {
            targetNode = i;
            error = !ns.hacknet.upgradeLevel(targetNode, 1);
            if (error) {
                ns.print("There was an error in upgrading the level of a hacknet node.");
                error = false; // Reset error flag
            } else {
                ns.print("Successfully upgraded a hacknet node");
            }
        }
        await ns.sleep(10000) // Wait ten seconds
    }
}