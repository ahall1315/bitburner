// Hacks all servers from home that you can hack with maximum threads

/** @param {NS} ns */
export async function main(ns) {
    const hackScript = "/scripts/hack.js";
    const killScript = "/control/kill_scripts.js";
    const homeSvr = "home";
    const toHackPath = "/serverinfo/can_hack.txt";
    const noPrintSwitch = "-n";

    let toHack = [];
    let pid = -1;
    let threads = 0;
    let error = false;

    pid = ns.run(killScript, 1, homeSvr);
    if (pid <= 0) {
        error = checkError(pid);
    }

    threads = getMaxThreads(homeSvr);
    ns.tprint("Total threads: " + threads);

    toHack = ns.read(toHackPath);

    ns.tprint(toHack);

    toHack = toHack.split(",");

    threads = divideThreads(threads, toHack);
    ns.tprint("Threads per target: " + threads);

    await attemptHack(homeSvr, toHack, threads, noPrintSwitch);

    function getMaxThreads(host) {
        var maxRam = ns.getServerMaxRam(host);
        var scriptRam = ns.getScriptRam(hackScript)

        return Math.floor(maxRam / scriptRam)
    }

    // Divides threads amongst the targets
    function divideThreads(threads, targets) {
        return Math.floor(threads / targets.length);
    }

    function checkError(pid) {
        if (pid <= 0) {
            return true;
        } else {
            return false;
        }
    }

    async function attemptHack(host, targets, threads, noPrintSwitch) {
        ns.tprint("Attempting to hack...");
        for (let i = 0; i < targets.length; i++) {
            ns.run("/scripts/open_ports.js", 1, targets[i], noPrintSwitch);
            await ns.sleep(250); // Waits for ports to be opened
            if (ns.isRunning("/scripts/hack.js", host, targets[i])) {
                ns.print("Hack script already running for target: " + targets[i] + "! Killing script.")
                ns.kill("/scripts/hack.js", host, targets[i])
            }
            pid = ns.run("/scripts/hack.js", threads, targets[i]);

            if (pid <= 0) {
                error = true;
            }
        }
        if (targets.length === 1) {
            ns.tprint("Hacking server...")
        } else {
            ns.tprint("Hacking multiple servers...");
        }
        if (error) {
            ns.tprint("There was an error in hacking one or more servers. Is there enough RAM?");
        }
    }

}