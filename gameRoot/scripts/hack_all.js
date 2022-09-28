// Hacks all servers from home that you can hack with maximum threads

// RUNTIME ERROR
// /scripts/hack_all.js@home (PID - 4)

// run: Invalid thread count. Must be numeric and > 0, is 0

/** @param {NS} ns */
export async function main(ns) {
    const hackScript = "/scripts/hack.js";
    const host = ns.getHostname();
    const toHackPath = "/serverinfo/can_hack.txt";
    const noPrintSwitch = "-n";
    const noMoneySwitch = "-m";

    let canHack = [];
    let toHack = [];
    let pid = -1;
    let threads = 0;
    let error = false;

    ns.killall(host, true);
    await ns.sleep(1000); // Waits for scripts to be killed

    // Populate can_hack.txt
    pid = ns.run("/scripts/crawler.js", 1, noMoneySwitch);
    await ns.sleep(1000); // Waits for can_hack.txt to be populated
    error = checkError();

    threads = getMaxThreads(host);
    ns.tprint("Total threads: " + threads);

    canHack = ns.read(toHackPath);
    canHack = JSON.parse(canHack);

    for (let i = 0; i < canHack.length; i++) {
        toHack.push(canHack[i]);
    }

    threads = divideThreads(threads, toHack);
    ns.tprint("Threads per target: " + threads);

    await attemptHack(host, toHack, threads, noPrintSwitch);

    if (error) {
        ns.tprint("There was an error in running the script.");
    }

    function getMaxThreads(host) {
        var serverMaxRam = ns.getServerMaxRam(host);
        
        if (serverMaxRam <= 32) {
            var maxRam = ns.getServerMaxRam(host)
        } else {
            var maxRam = ns.getServerMaxRam(host) - 32; // Leaves at least 32 GB to leave room for scripts to run
        }

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

        if (threads === 0) {
            ns.tprint("Error: 0 threads while attempting to hack targets.")
            error = true;
            ns.exit();
        }

        if (targets.length === 0 || targets.includes("")) {
            error = true;
        } else {
            for (let i = 0; i < targets.length; i++) {
                ns.run("/scripts/open_ports.js", 1, targets[i], noPrintSwitch);
                await ns.sleep(250); // Waits for ports to be opened
                if (ns.isRunning("/scripts/hack.js", host, targets[i])) {
                    ns.print("Hack script already running for target: " + targets[i] + "! Killing script.")
                    ns.kill("/scripts/hack.js", host, targets[i])
                }
                pid = ns.run("/scripts/hack.js", threads, targets[i]);

                error = checkError(pid);
            }
            if (targets.length === 1) {
                ns.tprint("Hacking server...")
            } else {
                ns.tprint("Hacking multiple servers...");
            }
        }

        if (error) {
            ns.tprint("There was an error in hacking one or more servers. Is there enough RAM?");
        }
    }

}