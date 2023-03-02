import { formatRAM } from "./lib/utils.js";

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const crawlerScript = "/scripts/crawler.js";
    const serversFilePath = "/data/server_info.txt";
    const canSolve = ["Find Largest Prime Factor"]

    const args = ns.flags([["help", false], ["solve", false]])
    if (args.help) {
        ns.tprintf("This script will print information about coding contracts on the network.");
        ns.tprintf("Optional argument --solve to attempt to solve all contracts on the network. Warning, this script does not yet have a solution for all contract types.");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example 1");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        ns.tprintf("Example 2");
        ns.tprintf(`> run ${ns.getScriptName()} --solve`);
        return;
    }

    if ((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname())) < ns.getScriptRam(crawlerScript)) {
        let totalRAM = ns.getScriptRam(ns.getScriptName()) + ns.getScriptRam(crawlerScript);
        ns.tprint("ERROR Not enough RAM to run this script! You need at least " + formatRAM(ns, totalRAM) + " of RAM.");
        return;
    }

    if (ns.run(crawlerScript, 1, "--noPrint") === 0) {
        ns.tprint("ERROR Failed to run " + crawlerScript + ". Does the file exist? Do you have enough RAM?");
        return;
    }
    await ns.sleep(100); // Waits for server info to be written to

    let serverInfo = JSON.parse(ns.read(serversFilePath));

    if (args.solve) {
        let solvedCount = 0;

        for (let i = 0; i < serverInfo.length; i++) {
            let serverIndex = i;
            if (serverInfo[i].contracts.length !== 0) {
                for (let i = 0; i < serverInfo[serverIndex].contracts.length; i++) {
                    let contractFile = serverInfo[serverIndex].contracts[i]
                    let hostname = serverInfo[serverIndex].hostname
                    let contractType = ns.codingcontract.getContractType(contractFile, hostname);

                    if (canSolve.includes(contractType, hostname)) {
                        let data = ns.codingcontract.getData(contractFile, hostname);
                        let reward = ns.codingcontract.attempt(solveContract(contractType, data), contractFile, hostname, {returnReward: true})
                        if (reward === "") {
                            ns.tprint("ERROR failed to solve " + contractFile + " (" + contractType + ") on " + hostname + " with solution " + solveContract(contractType, data));
                        } else {
                            ns.tprint("Successfully solved " + contractFile  + " (" + contractType + ") on " + hostname + " with solution " + solveContract(contractType, data));
                            ns.tprint(reward);
                            solvedCount++;
                        }
                    }
                }
            }
        }
        if (solvedCount === 0) {
            ns.tprint("Cannot solve any more contracts!");
        } else {
            ns.tprint("Solved " + solvedCount + " contracts.");
        }

        return;
    }

    ns.tprintf("These servers have coding contracts:");
    for (let i = 0; i < serverInfo.length; i++) {
        let serverIndex = i;
        let printString = "";
        printString = printString.concat(serverInfo[serverIndex].hostname + ": ");
        if (serverInfo[i].contracts.length !== 0) {
            for (let i = 0; i < serverInfo[serverIndex].contracts.length; i++) {
                if (i != serverInfo[serverIndex].contracts.length - 1) {
                    printString = printString.concat(serverInfo[serverIndex].contracts[i] +
                        " (" + ns.codingcontract.getContractType(serverInfo[serverIndex].contracts[i], serverInfo[serverIndex].hostname) + "), ");
                } else {
                    printString = printString.concat(serverInfo[serverIndex].contracts[i] +
                        " (" + ns.codingcontract.getContractType(serverInfo[serverIndex].contracts[i], serverInfo[serverIndex].hostname) + ")");
                }
            }
            ns.tprintf(printString);
        }
    }

    function solveContract(contractType, data) {
        switch (contractType) {
            case "Find Largest Prime Factor":
                return factor(data);
        
            default:
                break;
        }
    }

    //#region Find Largest Prime Factor
    function factor(num) {
        for (let div = 2; div <= Math.sqrt(num); div++) {
          if (num % div != 0) {
            continue;
          }
          num = num / div;
          div = 1;
        }
        return num;
    }
    //#endregion
}