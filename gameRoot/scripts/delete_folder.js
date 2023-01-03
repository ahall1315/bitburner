/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help || (args._[0] === undefined)) {
        ns.tprintf("This script will delete a folder along with every file in it.");
        ns.tprintf(`Usage: run ${ns.getScriptName()} [directory]`);
        ns.tprintf("Example");
        ns.tprintf(`> run ${ns.getScriptName()} test/`);
        return;
    }
    
    let hostname = ns.getHostname();
    let directory = ns.args[0];
    let deleted = false;

    let files = ns.ls(hostname, directory);
    files.forEach(function (file, index) {
        deleted = ns.rm(file, hostname);
        if (deleted) {
            ns.print("Successfully deleted " + file + " on " + hostname);
        } else {
            ns.print("Failed to deleted " + file + " on " + hostname + ". Is there enough RAM?");
        }
    })
}