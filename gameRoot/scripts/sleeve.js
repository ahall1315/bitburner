/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let playerMoney = ns.getServerMoneyAvailable("home");
    let numSleeves = ns.sleeve.getNumSleeves();
    let sleeveNumber = -1;
    let totalCost = 0;
    let purchaseableAugs = [];
    let sleeveAugs = [];
    let augCount = 0;
    let confirm = false;

    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprintf("This script will buy augmentations that you can afford for your sleeves.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    if (numSleeves === 0) {
        ns.tprint("You don't have any sleeves!");
        return;
    }

    for (let i = 0; i < numSleeves; i++) {
        sleeveNumber = i;

        purchaseableAugs = ns.sleeve.getSleevePurchasableAugs(i);
        for (let i = 0; i < purchaseableAugs.length; i++) {
            if (purchaseableAugs[i] === undefined) {
                purchaseableAugs[i] = {};
            }
            purchaseableAugs[i].sleeveNumber = sleeveNumber;
        }

        sleeveAugs = sleeveAugs.concat(purchaseableAugs);
        
    }

    for (let i = 0; i < sleeveAugs.length; i++) {
        if ((playerMoney - totalCost) > sleeveAugs[i].cost) {
            totalCost += sleeveAugs[i].cost;
            sleeveAugs[i].canPurchase = true;
            augCount++;
        }
    }

    if (augCount > 0) {
        confirm = await ns.prompt("Buying " + augCount + " augmentations for " + numSleeves + " sleeves will cost " + ns.nFormat(totalCost, "$0.000a") + "\nConfirm?");
    }
    augCount = 0;

    if (confirm) {
        for (let i = 0; i < sleeveAugs.length; i++) {
            if (sleeveAugs[i].canPurchase === true && ns.getServerMoneyAvailable("home") > sleeveAugs[i].cost) {
                if (ns.sleeve.purchaseSleeveAug(sleeveAugs[i].sleeveNumber, sleeveAugs[i].name) === true) {
                    ns.print("SUCCESS Purchased " + sleeveAugs[i].name + " for sleeve " + sleeveAugs[i].sleeveNumber);
                    augCount++;
                } else {
                    ns.print("ERROR Failed to purchase " + sleeveAugs[i].name + " for sleeve " + sleeveAugs[i].sleeveNumber);
                }
            }
        }
    }
    
    if (augCount > 0) {
        ns.tprint("Successfully purchased " + augCount + " augmentations for your sleeves for " + ns.nFormat(totalCost, "$0.000a"));
    } else {
        ns.tprint("Cannot purchase any more augmentations!");
    }
}