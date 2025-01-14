// Runs scripts to be used after installing augmentations

/** @param {import("@ns").NS} ns **/
export async function main(ns) {
    let pid = -1;
    let totalRAM = 0;
    let allFactions = false;
    let error = false;
    const toJoin = [
        "Sector-12"
    ]
    // Edit this list to change wich scripts will be run. They will be run in descending order.
    const toRun = [
        {
            script: "/scripts/custom_stats.js",
            args: null
        },
        {
            script: "/scripts/buy_programs.js",
            args: null
        },
        {
            script: "/scripts/join_factions.js",
            args: ["-a"]
        },
        {
            script: "/scripts/assign_sleeves.js",
            args: null
        },
        {
            script: "/scripts/hack_all.js",
            args: ["--killHack"]
        },
        {
            script: "/scripts/hacknet.js",
            args: null
        },
        {
            script: "/scripts/hacknet.js",
            args: ["--sell"]
        }
    ]

    totalRAM += ns.getScriptRam(ns.getScriptName());
    for (let i = 0; i < toRun.length; i++) {
        totalRAM += ns.getScriptRam(toRun[i].script);
    }
    if (totalRAM >= ns.getServerMaxRam(ns.getHostname())) {
        ns.tprint("WARN Not enough RAM to run all scripts! You need at least " + Math.ceil(totalRAM) + "GB of RAM to run all scripts.");
    }

    for (let i = 0; i < toRun.length; i++) {
        try {
            if (toRun[i].args === null || toRun[i].args === undefined) {
                pid = ns.run(toRun[i].script);
            } else {
                pid = ns.run(toRun[i].script, 1, ...toRun[i].args);
            }
            if (pid === 0) {
                throw `ERROR Failed to run ${toRun[i].script}`;
            }

            if (toRun[i] === "scripts/join_factions.js") {
                // Waits for factions to be joined (so sleeves can be assigned to work for them)
                while (!allFactions) {
                    let count = 0;
                    for (let i = 0; i < toJoin.length; i++) {
                        if (ns.getPlayer().factions.includes(toJoin[i])) {
                            count++;
                        }
                    }
                    if (count === toJoin.length) {
                        allFactions = true;
                    }
                    await ns.sleep(500);
                }
            }

        } catch (err) {
            error = true;
            ns.print(err);
        }

    }

    if (error) {
        ns.tprint("ERROR One or more scripts failed to run");
    }

}