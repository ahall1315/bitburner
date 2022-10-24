/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const crawlerScript = "/scripts/crawler.js";
    const serversFilePath = "/data/server_info.txt";

    if (ns.run(crawlerScript, 1, "--noPrint") === 0) {
        ns.tprint("ERROR Failed to run " + crawlerScript + ". Does the file exist?");
    }
    await ns.sleep(100); // Waits for server info to be written to

    let serverInfo = JSON.parse(ns.read(serversFilePath));

    ns.tprintf("These servers have coding contracts:");
    for (let i = 0; i < serverInfo.length; i++) {
        if (serverInfo[i].contracts.length !== 0) {
            ns.tprintf(serverInfo[i].hostname + ": " + [...serverInfo[i].contracts]);
        }
    }
}