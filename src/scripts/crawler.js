// Scans the network and gets the names of all servers that you can hack and server info and writes the data to file

import { getNumOwnedPortPrograms } from "/lib/utils.js";

/** @param {import("@ns").NS} ns **/
export async function main(ns) {

    const pServPrefix = "golem";
    const hackFilePath = "/data/can_hack.txt";
    const serversFilePath = "/data/server_info.txt";
    let hosts = scanNetwork();
    let canHack = [];
    let serverInfo = [];
    let homeSvr = "home";
    let printString = "Can hack ";

    let args = ns.flags([["help", false], ["m", false], ["noPrint", false]]);
    if (args.help) {
        ns.tprintf("Scans the network and gets the names of all servers that you can hack and server info and writes the data to file.");
        ns.tprintf("Files will be written to " + hackFilePath + " and " + serversFilePath + ".");
        ns.tprintf("Optional argument -m to filter servers that have no money from the list of servers you can hack.");
        ns.tprintf("Optional argument -noPrint to stop the script from printing to the terminal.");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()} -m`);
        return;
    }

    for (let i = 0; i < hosts.length; i++) {
        serverInfo.push(ns.getServer(hosts[i]));

        // Add coding contracts to server info
        serverInfo[i].contracts = [];
        serverInfo[i].contracts.push(...ns.ls(hosts[i], ".cct"))

        // Can hack if host is not home, not a purchased server, player has a high enough hacking level, and there are enough port programs on home
        if (hosts[i] != homeSvr &&
            !hosts[i].includes(pServPrefix) &&
            ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(hosts[i]) &&
            getNumOwnedPortPrograms(ns) >= ns.getServerNumPortsRequired(hosts[i]) &&
            !(args.m && serverInfo[i].moneyMax === 0)) { // Don't add to can hack if the server has no max money

            canHack.push(hosts[i]);
        }

    }

    printString = printString.concat(canHack.length + " servers:\n")

    for (let i = 0; i < canHack.length; i++) {
        if (i === 0) {
            printString = printString.concat(canHack[i]);
        } else {
            printString = printString.concat(" " + canHack[i]);
        }
    }

    // Variable must be a string to write to a file
    canHack = JSON.stringify(canHack, null, 1);
    serverInfo = JSON.stringify(serverInfo, null, 1);

    if (!args.noPrint) {
        ns.tprint("Writing to " + hackFilePath + "...");
    }
    ns.write(hackFilePath, canHack, "w");

    if (!args.noPrint) {
        ns.tprint("Writing to " + serversFilePath + "...");
    }
    ns.write(serversFilePath, serverInfo, "w");

    if (!args.noPrint) {
        ns.tprint(printString);
    }

    // Returns the hostnames of every host on the network
    function scanNetwork() {
        let hostnames = ['home'];
        for (let i = 0; i < hostnames.length; i++) {
            hostnames.push(...ns.scan(hostnames[i]).filter(hostname => !hostnames.includes(hostname)));
        }
        return hostnames;
    }

}