// Scans the network and gets the names of all servers that you can hack

/** @param {NS} ns */
export async function main(ns) {

    let hosts = scanNetwork();
    let canHack = [];
    let pServPrefix = "golem";
    let homeSvr = "home";
    let printString = "Can hack ";
    let noMoneySwitch = "-m";
    // There are probably more. TODO: update this list
    let noMoney = ["CSEC", "darkweb", "avmnite-02h", "I.I.I.I", "run4theh111z", ".", "The-Cave"];

    for (let i = 0; i < hosts.length; i++) {
        // Can hack if host is not home, not a purchased server, player has a high enough hacking level, and there are enough port programs on home
        if (hosts[i] != homeSvr && !hosts[i].includes(pServPrefix) && ns.getHackingLevel() > ns.getServerRequiredHackingLevel(hosts[i]) && getNumPortPrograms() > ns.getServerNumPortsRequired(hosts[i])) {
            canHack.push(hosts[i]);
        }
    }

    if (ns.args.includes(noMoneySwitch)) {
        canHack = canHack.filter(host => !noMoney.includes(host));
    }

    printString = printString.concat(canHack.length + " servers:\n")

    for (let i = 0; i < canHack.length; i++) {
        if (i === 0) {
            printString = printString.concat(canHack[i]);
        } else {
            printString = printString.concat(" " + canHack[i]);
        }
    }

    ns.tprint(printString);

    return canHack;

    // Returns the hostnames of every host on the network
    function scanNetwork() {
        let hostnames = ['home'];
        for (let i = 0; i < hostnames.length; i++) {
            hostnames.push(...ns.scan(hostnames[i]).filter(hostname => !hostnames.includes(hostname)));
        }
        return hostnames;
    }

    // Returns the number of port programs the player owns
    function getNumPortPrograms() {
        let portPrograms = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
        let count = 0;

        for (let i = 0; i < portPrograms.length; i++) {
            if (ns.fileExists(portPrograms[i], homeSvr)) {
                count++;
            }
        }

        return count;
    }

}