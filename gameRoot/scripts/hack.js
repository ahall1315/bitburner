/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];

    if (target == undefined) {
        ns.tprint("Incorrect usage. Provide argument [hostname]")
    } else {
        if (!ns.hasRootAccess(target)) {
            ns.tprint("Cannot hack " + target + "! Need root access.");
            ns.exit();
        }

        const toDisable = ["getServerMaxMoney", "getServerMoneyAvailable", "getServerMinSecurityLevel", "getServerSecurityLevel", "getHackTime",
        "getGrowTime", "getWeakenTime"]
        toDisable.forEach(function (string) {
            ns.disableLog(string);
        })

        // Create number formatter for USD.
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        var serverMaxMoney = ns.getServerMaxMoney(target);
        var serverMoneyAvailable = ns.getServerMoneyAvailable(target);
        var serverMinSecurityLevel = ns.getServerMinSecurityLevel(target);

        var moneyThresh = serverMaxMoney * 0.50; // Weight is the threshold to hack
        var securityThresh = serverMinSecurityLevel + 5;

        while (true) {
            serverMoneyAvailable = ns.getServerMoneyAvailable(target);
            var serverSecurityLevel = ns.getServerSecurityLevel(target);

            // Get current local time
            var currentdate = new Date(); 
            var datetime = (currentdate.getMonth()+1) + "/"
                    + currentdate.getDate()  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

            ns.print("---------------------------------------------------")
            ns.print("             HACKING TARGET: " + target);
            ns.print("Available money: " + formatter.format(serverMoneyAvailable));
            ns.print("Server Max Money: " + formatter.format(serverMaxMoney));
            ns.print("Available to max ratio: " + ((serverMoneyAvailable / serverMaxMoney) * 100).toFixed(2) + "%");
            ns.print("Threshold to hack: " + ((moneyThresh / serverMaxMoney) * 100).toFixed(2) + "%");
            ns.print("");
            ns.print("Current security level: " + serverSecurityLevel.toFixed(2));
            ns.print("Threshold to weaken: " + securityThresh);
            ns.print("");

            if (serverSecurityLevel > securityThresh) {
                ns.print("Security level above threshold. Weakening security...\n")
                ns.print("Started on: " + datetime);
                ns.print("Will complete on: " + addMilliseconds(currentdate, ns.getWeakenTime(target)));
                ns.print("");
                await ns.weaken(target);
            } else if (serverMoneyAvailable < moneyThresh) {
                ns.print("Server money below threshold. Growing money...\n")
                ns.print("Started on: " + datetime);
                ns.print("Will complete on: " + addMilliseconds(currentdate, ns.getGrowTime(target)));
                ns.print("");
                await ns.grow(target);
            } else {
                ns.print("Within thresholds. Hacking target...\n")
                ns.print("Started on: " + datetime);
                ns.print("Will complete on: " + addMilliseconds(currentdate, ns.getHackTime(target)));
                ns.print("");
                await ns.hack(target);
            }
        }
    }

    function addMilliseconds(date, ms) {
        date = new Date(date.getTime() + ms);
        return date = (date.getMonth()+1) + "/"
                + date.getDate()  + "/" 
                + date.getFullYear() + " @ "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
    }
}