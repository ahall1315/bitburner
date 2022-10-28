/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const crawlerScript = "/scripts/crawler.js";
    const serversFilePath = "/data/server_info.txt";

    const args = ns.flags([["help", false]])
    if (args.help) {
        ns.tprintf("This script will print information about coding contracts on the network.");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        return;
    }

    if (ns.run(crawlerScript, 1, "--noPrint") === 0) {
        ns.tprint("ERROR Failed to run " + crawlerScript + ". Does the file exist?");
    }
    await ns.sleep(100); // Waits for server info to be written to

    let serverInfo = JSON.parse(ns.read(serversFilePath));

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