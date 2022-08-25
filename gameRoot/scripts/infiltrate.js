// Writes info about infiltration locations to a file

/** @param {NS} ns */
export async function main(ns) {
    let locations = ns.infiltration.getPossibleLocations();
    let infiltrations = [];
    let writeString = "";

    // Create number formatter for USD.
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    for (let i = 0; i < locations.length; i++) {
        infiltrations.push(ns.infiltration.getInfiltration(locations[i].name));
    }

    for (let i = 0; i < infiltrations.length; i++) {
        ns.tprint(infiltrations[i].location.name);
        ns.tprint("    City: " + infiltrations[i].location.city);
        if (infiltrations[i].location.techVendorMaxRam > 0 && infiltrations[i].location.techVendorMinRam > 0) {
            ns.tprint("    Max RAM: " + infiltrations[i].location.techVendorMaxRam + " GB");
            ns.tprint("    Min RAM: " + infiltrations[i].location.techVendorMinRam + " GB");
        }
        ns.tprint("      Difficulty");
        ns.tprint("          Difficulty level: " + infiltrations[i].difficulty.toFixed(2));
        ns.tprint("          Max clearance level: " + infiltrations[i].location.infiltrationData.maxClearanceLevel);
        ns.tprint("          Starting security level: " + infiltrations[i].location.infiltrationData.startingSecurityLevel.toFixed(2));

        ns.tprint("      Rewards");
        ns.tprint("          Cash for selling: " + formatter.format(infiltrations[i].reward.sellCash));
        ns.tprint("          Reputation for trading: " + infiltrations[i].reward.tradeRep);
        ns.tprint("          SoA Reputation: " + infiltrations[i].reward.SoARep);

        ns.tprint("\n");
    }

    //ns.write("/serverinfo/infiltration.txt", writeString, "w");
}