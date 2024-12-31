/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false], ["a", false]]);
    if (args.help || args._.length === 0) {
        ns.tprintf("Buys as much equipment as the player can afford for a gang member.");
        ns.tprintf("Optional argument -a to buy augmentations as well.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [memberName] -a`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} jump3R`);
        return;
    }

    let money = -1; // Player's money after cost of equipment
    let cost = -1; // Cost of equipment
    let total = 0; // Total cost of all equipment
    let count = 0; // Count of equipment bought
    let name = args._[0]; // Name of gang member
    let toBuy = []; // List of equipment to buy
    let canBuy = []; // List of equipment you can buy
    const hackingAugmentations = ["BitWire", "Neuralstimulator", "DataJack"];

    if (!ns.gang.inGang()) {
        ns.tprint("You are not in a gang! Cannot buy equipment for " + name);
        ns.exit();
    } else {
        // Get's the player's current money
        money = ns.getServerMoneyAvailable("home");
        toBuy = ns.gang.getEquipmentNames();

        // If hacking gang
        if (ns.gang.getGangInformation().isHacking) {
            for (let i = 0; i < toBuy.length; i++) {
                if (!ns.gang.getEquipmentType(toBuy[i]) === "Rootkit") {
                    toBuy.splice(i, 1);
                    i--;
                }
            }
        } else {
            // Combat gang
            for (let i = 0; i < toBuy.length; i++) {
                if (ns.gang.getEquipmentType(toBuy[i]) === "Rootkit") {
                    toBuy.splice(i, 1);
                    i--;
                }
            }
        }

        // Remove augmentations unless augmentation switch is provided
        if (!args.a) {
            for (let i = 0; i < toBuy.length; i++) {
                if (ns.gang.getEquipmentType(toBuy[i]) === "Augmentation") {
                    toBuy.splice(i, 1);
                    i--;
                }
            }
        } else {
            // Remove either combat or hacking augmentations
            if (!ns.gang.isHacking) {
                for (let i = 0; i < toBuy.length; i++) {
                    if (hackingAugmentations.includes(toBuy[i])) {
                        toBuy.splice(i, 1);
                        i--;
                    }
                }
            } else {
                for (let i = 0; i < toBuy.length; i++) {
                    if (!hackingAugmentations.includes(toBuy[i])) {
                        toBuy.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        // Get the list of equipment you can buy for the gang member
        for (let i = 0; i < toBuy.length; i++) {
            cost = ns.gang.getEquipmentCost(toBuy[i])

            // Add to the list that you can buy if you have enough money, and the gang member does not already have the equipment
            if (money > cost && 
                !ns.gang.getMemberInformation(name).upgrades.includes(toBuy[i]) &&
                !ns.gang.getMemberInformation(name).augmentations.includes(toBuy[i])) {
                
                canBuy.push(toBuy[i]);
                money = money - cost;
                total = total + cost;
            }

        }

        // Buy the equipment
        for (let i = 0; i < canBuy.length; i++) {
            if (!ns.gang.purchaseEquipment(name, canBuy[i])) {
                ns.print("Failed to buy " + canBuy[i] + " for " + name);
            } else {
                count++;
            }
        }

        if (count > 0) {
            ns.print("Successfully purchased " + count + " equipment for " + name + " for $" + ns.formatNumber(total));
        } else {
            ns.print("Unable to purchase any equipment for " + name + "!")
        }

    }

}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
    return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
    return ["low", "medium", "high"]; // Autocomplete 3 specific strings.
}