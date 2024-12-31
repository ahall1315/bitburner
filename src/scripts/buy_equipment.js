// Buys equipment for gang members you have enough money for

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    let money = -1; // Player's money after cost of equipment
    let cost = -1; // Cost of equipment
    let total = 0; // Total cost of all equipment
    let count = 0; // Count of equipment bought
    let memberNames = [];
    let members = []; // List of GangMember objects
    let toBuy = []; // List of equipment to buy
    const hackingAugmentations = ["BitWire", "Neuralstimulator", "DataJack"];
    let confirm = false;
    let error = false;
    let augmentationSwitch = "-a";

    class GangMember {
        constructor(name, canBuy) {
            this.name = name;
            this.canBuy = canBuy;
        }
    }

    // Create number formatter for USD.
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

    if (!ns.gang.inGang()) {
        ns.tprint("You are not in a gang!");
        ns.exit();
    } else {
        // Get's the player's current money
        money = ns.getServerMoneyAvailable("home");

        memberNames = ns.gang.getMemberNames();
        toBuy = ns.gang.getEquipmentNames();

        for (let i = 0; i < memberNames.length; i++) {
            members.push(new GangMember(memberNames[i], []));
        }

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
        if (!ns.args.includes(augmentationSwitch)) {
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

        // Get the list of equipment you can buy for every gang member
        for (let i = 0; i < members.length; i++) {
            for (let j = 0; j < toBuy.length; j++) {
                cost = ns.gang.getEquipmentCost(toBuy[j])

                // Add to the list that you can buy if you have enough money, and the gang member does not already have the equipment
                if (money > cost && 
                    !ns.gang.getMemberInformation(members[i].name).upgrades.includes(toBuy[j]) &&
                    !ns.gang.getMemberInformation(members[i].name).augmentations.includes(toBuy[j])) {
                    
                    members[i].canBuy.push(toBuy[j]);
                    money = money - cost;
                    total = total + cost;
                }

            }
        }

        ns.tprint(JSON.stringify(members, null, 2))

        if (total <= 0) {
            ns.tprint("Cannot buy any equipment!");
            ns.exit();
        }
        
        confirm = await ns.prompt("Buying this equipment will cost " + formatter.format(total) + "\nConfirm?");

        if (confirm) {
            for (let i = 0; i < members.length; i++) {
                for (let j = 0; j < members[i].canBuy.length; j++) {
                    error = !ns.gang.purchaseEquipment(members[i].name, members[i].canBuy[j]);
                    if (error) {
                        ns.print("Failed to buy " + members[i].canBuy[j] + " for " + members[i].name);
                    } else {
                        count++;
                    }
                    error = false; // Reset error flag
                }
            }
        }

        if (count > 0) {
            ns.tprint("Successfully purchased " + count + " equipment.");
        }

    }

}