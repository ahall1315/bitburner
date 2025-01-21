// Scans the network and gets the names of all servers that you can hack and server info and writes the data to file

import { NS } from "@ns";
import { getNumOwnedPortPrograms } from "/lib/utils.js";
import { Server } from "@ns";

export async function main(ns: NS): Promise<void> {

    const pServPrefix: string = "golem";
    const hacknetServPrefix: string = "hacknet";
    const hackFilePath: string = "/data/can_hack.txt";
    const serversFilePath: string = "/data/server_info.txt";
    let hosts: string[] = scanNetwork();
    let canHack: string[] = [];
    // Extend the contracts property to the Server type
    let serverInfo: (Server & { contracts: string[] })[] = [];
    let homeSvr: string = "home";
    let printString: string = "Can hack ";

    const args = ns.flags([["m", false], ["noPrint", false]]);
    if (ns.args[0] === "help") {
        ns.tprintf("Scans the network and gets the names of all servers that you can hack and server info and writes the data to file");
        ns.tprintf("Files will be written to " + hackFilePath + " and " + serversFilePath + ".");
        ns.tprintf("Optional argument -m to filter servers that have no money from the list of servers you can hack.");
        ns.tprintf("Optional argument -noPrint to stop the script from printing to the terminal.");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} -m`);
        ns.exit();
    }

    for (let i = 0; i < hosts.length; i++) {
        serverInfo.push(ns.getServer(hosts[i]) as Server & { contracts: string[] });

        // Add coding contracts to server info
        serverInfo[i].contracts = [];
        serverInfo[i].contracts.push(...ns.ls(hosts[i], ".cct"));

        // Can hack if host is not home, not a purchased server, player has a high enough hacking level, and there are enough port programs on home
        if (serverInfo[i].hostname != homeSvr &&
            !serverInfo[i].purchasedByPlayer &&
            ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverInfo[i].hostname) &&
            getNumOwnedPortPrograms(ns) >= ns.getServerNumPortsRequired(serverInfo[i].hostname) &&
            !(args.m && serverInfo[i].moneyMax === 0)) { // Don't add to can hack if the max amount of money on the server is 0

            canHack.push(serverInfo[i].hostname);
        }

    }

    printString = printString.concat(canHack.length + " servers:\n");

    for (let i = 0; i < canHack.length; i++) {
        if (i === 0) {
            printString = printString.concat(canHack[i]);
        } else {
            printString = printString.concat(" " + canHack[i]);
        }
    }

    if (!args.noPrint) {
        ns.tprint("Writing to " + hackFilePath + "...");
    }
    // Variable canHack must be converted to a string to write to a file
    ns.write(hackFilePath, JSON.stringify(canHack, null, 1), "w");

    if (!args.noPrint) {
        ns.tprint("Writing to " + serversFilePath + "...");
    }
    // Variable serverInfo must be converted to a string to write to a file
    ns.write(serversFilePath, JSON.stringify(serverInfo, null, 1), "w");

    if (!args.noPrint) {
        ns.tprint(printString);
    }

    // Returns the hostnames of every host on the network
    function scanNetwork(): string[] {
        let hostnames = ['home'];
        for (let i = 0; i < hostnames.length; i++) {
            hostnames.push(...ns.scan(hostnames[i]).filter(hostname => !hostnames.includes(hostname)));
        }
        return hostnames;
    }
}