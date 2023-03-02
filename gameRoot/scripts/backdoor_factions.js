import { getNumOwnedPortPrograms } from "./lib/utils.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let factions = [
        {
            "name": "CyberSec",
            "server": "CSEC",
            "joined": false,
            "backdoor": false
        },
        {
            "name": "NiteSec",
            "server": "avmnite-02h",
            "joined": false,
            "backdoor": false
        },
        {
            "name": "The Black Hand",
            "server": "I.I.I.I",
            "joined": false,
            "backdoor": false
        },
        {
            "name": "BitRunners",
            "server": "run4theh111z",
            "joined": false,
            "backdoor": false
        }
    ]
    let playerFactions = ns.getPlayer().factions;
    let allInvitations = false;

    const args = ns.flags([["help", false], ["jf", false]]);
    if (args.help) {
        ns.tprint("This script will have you join all of the backdoor factions.");
        ns.tprint("Optional argument --jf to attempt to join the factions.");
        ns.tprint("INFO This script uses singularity functions you will need access to!");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} --jf`);
        return;
    }

    for (let i = 0; i < factions.length; i++) {
        let canNUKE = false;
        let canHack = false;

        if (playerFactions.includes(factions[i].name)) {
            factions[i].joined = true;
            continue;
        }

        if (getNumOwnedPortPrograms(ns) < ns.getServerNumPortsRequired(factions[i].server)) {
            ns.tprint("WARN Not enough port programs owned to backdoor " + factions[i].server + "!");
            ns.tprint("WARN You need: " + ns.getServerNumPortsRequired(factions[i].server) + " port programs");
        } else {
            canNUKE = true;
        }
        if (ns.getPlayer().skills.hacking <= ns.getServer(factions[i].server).requiredHackingSkill) {
            ns.tprint("WARN Not a high enough hacking skill to backdoor " + factions[i].server + "!");
            ns.tprint("WARN You need: " + ns.getServer(factions[i].server).requiredHackingSkill + " hacking skill");
        } else {
            canHack = true;
        }
        ns.tprintf("--------------------------------------------------------------------------------------------");

        if (canNUKE && canHack) {
            ns.run("/scripts/connect.js", 1, factions[i].server, "--to");
            await ns.sleep(1000); // Wait to connect
            await ns.singularity.installBackdoor();
        }

        if (ns.getServer(factions[i].server).backdoorInstalled) {
            factions[i].backdoor = true;
        }
        ns.singularity.connect("home");

    }

    ns.tprint("Successfully backdoored:\n");
    for (let i = 0; i < factions.length; i++) {
        if (factions[i].backdoor) {
            ns.tprintf("-" + factions[i].server + "\n");
        }
    }


    for (let i = 0; i < factions.length; i++) {
        if (!ns.getServer(factions[i].server)) {
            ns.tprintf("WARN Failed to backdoor: " + factions[i].server + "You need " + ns.getServer(factions[i].server).requiredHackingSkill + "hacking skill to backdoor this server.\n");
        }
    }

    if (args.jf) {
        ns.tprint("Attempting to join backdoored factions...");

        // Wait for faction invitations
        while (!allInvitations) {
            let invitations = ns.singularity.checkFactionInvitations();
            let toJoin = [];
            playerFactions = ns.getPlayer().factions;

            for (let i = 0; i < factions.length; i++) {
                if (factions[i].backdoor && !factions[i].joined) {
                    toJoin.push(factions[i].name);
                }
            }

            // Remove any factions you are already in from the list of factions to join
            for (let i = 0; i < toJoin.length; i++) {
                if (playerFactions.includes(toJoin[i])) {
                    toJoin.splice(i, 1);
                    i--;
                }
            }

            ns.print(toJoin);

            // If there is an invitation for every backdoored faction
            if (toJoin.every(r => invitations.includes(r))) {
                allInvitations = true;
            }

            await ns.sleep(5000);
        }

        for (let i = 0; i < factions.length; i++) {
            if (factions[i].joined) {
                ns.toast("Already in " + factions[i].name, "info");
            } else {
                if (ns.singularity.joinFaction(factions[i].name)) {
                    ns.toast("Joined " + factions[i].name, "success")
                    factions[i].joined = true;
                } else {
                    ns.toast("Failed to join " + factions[i].name, "error");
                }
            }
            await ns.sleep(2000);
        }
    }

}