// Experiment with hacknet api

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let error = false;
    let targetNode = -1;
    let numNodes = -1;
    let playerMoney = -1;
    let cost = -1;
    const purchaseThresh = 10 / 100; // This value is a threshold between node cost and total money as a percentage
    const maxNodes = ns.hacknet.maxNumNodes(); // This value should be infinity

    ns.tprint("Beginning automated hacknet manager...");

    /* 
    production is in dollars per second
    timeOnline is in seconds
    production is in dollars
    */
    //let nodeStats = ns.hacknet.getNodeStats(0);

    // buy/upgrade a hacknet node if the cost is beneath a threshold
    while (true) {
        numNodes = ns.hacknet.numNodes()
        playerMoney = ns.getPlayer().money;

        // Purchasing a node
        cost = ns.hacknet.getPurchaseNodeCost();
        if (cost < (playerMoney * purchaseThresh)) {
            targetNode = ns.hacknet.purchaseNode();
            if (targetNode === -1) {
                error = true;
            }

            if (error) {
                ns.print("There was an error in purchasing a hacknet node.");
                error = false; // Reset error flag
            } else {
                ns.print("Successfully purchased a hacknet node with index: " + targetNode);
            }
        }

        for (let i = 0; i < numNodes; i++) {
            targetNode = i;
            playerMoney = ns.getPlayer().money;

            // Upgrading the level
            cost = ns.hacknet.getLevelUpgradeCost(targetNode, 1);
            if (cost < (playerMoney * purchaseThresh)) {
                error = !ns.hacknet.upgradeLevel(targetNode, 1);
                if (error) {
                    ns.print("There was an error in upgrading the level of hacknet-node-" + targetNode);
                    error = false; // Reset error flag
                } else {
                    ns.print("Successfully upgraded the level of hacknet-node-" + targetNode);
                }
            }

            // Upgrading the RAM
            cost = ns.hacknet.getRamUpgradeCost(targetNode, 1);
            if (cost < (playerMoney * purchaseThresh)) {
                error = !ns.hacknet.upgradeRam(targetNode, 1);
                if (error) {
                    ns.print("There was an error in upgrading the RAM of hacknet-node-" + targetNode);
                    error = false; // Reset error flag
                } else {
                    ns.print("Successfully upgraded the RAM of hacknet-node-" + targetNode);
                }
            }

            // Upgrading the cores
            cost = ns.hacknet.getCoreUpgradeCost(targetNode, 1);
            if (cost < (playerMoney * purchaseThresh)) {
                error = !ns.hacknet.upgradeCore(targetNode, 1);
                if (error) {
                    ns.print("There was an error in upgrading the cores of hacknet-node-" + targetNode);
                    error = false; // Reset error flag
                } else {
                    ns.print("Successfully upgraded the cores of hacknet-node-" + targetNode);
                }
            }
        }
        await ns.sleep(5000) // Wait five seconds
    }
}