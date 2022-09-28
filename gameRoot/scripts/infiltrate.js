// Writes info about infiltration locations to a file

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let locations = ns.infiltration.getPossibleLocations();
    let infiltrations = [];
    let infiltrationPath = "/serverinfo/infiltration.txt";
    let difficultySwitch = "-d";
    let writeString = "";

    for (let i = 0; i < locations.length; i++) {
        infiltrations.push(ns.infiltration.getInfiltration(locations[i].name));
    }

    if (ns.args.includes(difficultySwitch)) {
        for (let i = 0; i < infiltrations.length; i++) {
            ns.tprint(infiltrations[i].location.name);
            ns.tprint("    City: " + infiltrations[i].location.city);
            ns.tprint("      Difficulty");
            ns.tprint("          Difficulty level: " + (infiltrations[i].difficulty * 33.3333).toFixed(0) + " / 100");
            ns.tprint("          Max clearance level: " + infiltrations[i].location.infiltrationData.maxClearanceLevel);
            ns.tprint("          Starting security level: " + infiltrations[i].location.infiltrationData.startingSecurityLevel.toFixed(2));
    
            ns.tprint("\n");
        }
    } else {
        for (let i = 0; i < infiltrations.length; i++) {
            ns.tprint(infiltrations[i].location.name);
            ns.tprint("    City: " + infiltrations[i].location.city);
            if (infiltrations[i].location.techVendorMaxRam > 0 && infiltrations[i].location.techVendorMinRam > 0) {
                ns.tprint("    Max RAM: " + infiltrations[i].location.techVendorMaxRam + " GB");
                ns.tprint("    Min RAM: " + infiltrations[i].location.techVendorMinRam + " GB");
            }
            ns.tprint("      Difficulty");
            ns.tprint("          Difficulty level: " + (infiltrations[i].difficulty * 33.3333).toFixed(0) + " / 100");
            ns.tprint("          Max clearance level: " + infiltrations[i].location.infiltrationData.maxClearanceLevel);
            ns.tprint("          Starting security level: " + infiltrations[i].location.infiltrationData.startingSecurityLevel.toFixed(2));
    
            ns.tprint("      Rewards");
            ns.tprint("          Cash for selling: " + infiltrations[i].reward.sellCash);
            ns.tprint("          Reputation for trading: " + infiltrations[i].reward.tradeRep);
            ns.tprint("          SoA Reputation: " + infiltrations[i].reward.SoARep);
    
            ns.tprint("\n");
        }
    }


    // Builds the string that is written to infiltration.txt
    for (let i = 0; i < infiltrations.length; i++) {
        writeString = writeString.concat(JSON.stringify(infiltrations[i], null, 2));
    }

    ns.write(infiltrationPath, writeString, "w");
    ns.tprint("Wrote to " + infiltrationPath);
}