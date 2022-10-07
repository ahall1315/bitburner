// Writes info about infiltration locations to a file
// TODO: Is the reputation reward that is printed accurate? Need to confirm this.

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let locations = ns.infiltration.getPossibleLocations();
    let infiltrations = [];
    let infiltrationPath = "/data/infiltration.txt";
    let difficultySwitch = "-d";
    let writeString = "";

    let args = ns.flags([["help", false], ["sort", ""]])

    if (args.help) {
        ns.tprint("This script will print info about infiltration locations and save the info to a file.");
        ns.tprint("Option argument --sort to sort the info by a provided property.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example 1:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        ns.tprint("Example 2:");
        ns.tprint(`> run ${ns.getScriptName()} --sort difficulty`);
        return;
    }

    for (let i = 0; i < locations.length; i++) {
        infiltrations.push(ns.infiltration.getInfiltration(locations[i].name));
    }

    if (!["difficulty", "money", "cash", "reputation", "rep", ""].includes(args.sort.toLocaleLowerCase())) {
        ns.tprint("WARN You may only sort by difficulty, money, and reputation.");
        return;
    }
    
    // Sort the infiltration locations by difficulty in descending order
    if (args.sort.toLowerCase() === "difficulty") {
        infiltrations.sort((a, b) => {
            if (a.difficulty < b.difficulty) {
                return 1;
            }
            if (a.difficulty > b.difficulty) {
                return -1;
            }
            return 0;
        })
    }

    // Sort the infiltration locations by money in descending order
    if (args.sort.toLowerCase() === "money" || args.sort.toLowerCase() === "cash") {
        infiltrations.sort((a, b) => {
            if (a.reward.sellCash < b.reward.sellCash) {
                return 1;
            }
            if (a.reward.sellCash > b.reward.sellCash) {
                return -1;
            }
            return 0;
        })
    }

    // Sort the infiltration locations by reputation in descending order
    if (args.sort.toLowerCase() === "reputation" || args.sort.toLowerCase() === "reputation") {
        infiltrations.sort((a, b) => {
            if (a.reward.tradeRep < b.reward.tradeRep) {
                return 1;
            }
            if (a.reward.tradeRep > b.reward.tradeRep) {
                return -1;
            }
            return 0;
        })
    }

    if (ns.args.includes(difficultySwitch)) {
        for (let i = 0; i < infiltrations.length; i++) {
            ns.tprintf(infiltrations[i].location.name);
            ns.tprintf("    City: " + infiltrations[i].location.city);
            ns.tprintf("      Difficulty");
            ns.tprintf("          Difficulty level: " + (infiltrations[i].difficulty * 33.3333).toFixed(0) + " / 100");
            ns.tprintf("          Max clearance level: " + infiltrations[i].location.infiltrationData.maxClearanceLevel);
            ns.tprintf("          Starting security level: " + infiltrations[i].location.infiltrationData.startingSecurityLevel.toFixed(2));
    
            ns.tprintf("\n");
        }
    } else {
        for (let i = 0; i < infiltrations.length; i++) {
            ns.tprintf(infiltrations[i].location.name);
            ns.tprintf("    City: " + infiltrations[i].location.city);
            if (infiltrations[i].location.techVendorMaxRam > 0 && infiltrations[i].location.techVendorMinRam > 0) {
                ns.tprintf("    Max RAM: " + infiltrations[i].location.techVendorMaxRam + " GB");
                ns.tprintf("    Min RAM: " + infiltrations[i].location.techVendorMinRam + " GB");
            }
            ns.tprintf("      Difficulty");
            ns.tprintf("          Difficulty level: " + (infiltrations[i].difficulty * 33.3333).toFixed(0) + " / 100");
            ns.tprintf("          Max clearance level: " + infiltrations[i].location.infiltrationData.maxClearanceLevel);
            ns.tprintf("          Starting security level: " + infiltrations[i].location.infiltrationData.startingSecurityLevel.toFixed(2));
    
            ns.tprintf("      Rewards");
            ns.tprintf("          Cash for selling: " + ns.nFormat(infiltrations[i].reward.sellCash, "$0.000a"));
            ns.tprintf("          Reputation for trading: " + ns.nFormat(infiltrations[i].reward.tradeRep, "0.000a"));
            ns.tprintf("          SoA Reputation: " + ns.nFormat(infiltrations[i].reward.SoARep, "0.000a"));
    
            ns.tprintf("\n");
        }
    }


    // Builds the string that is written to infiltration.txt
    for (let i = 0; i < infiltrations.length; i++) {
        writeString = writeString.concat(JSON.stringify(infiltrations[i], null, 2));
    }

    ns.write(infiltrationPath, writeString, "w");
    ns.tprint("Wrote to " + infiltrationPath);
}