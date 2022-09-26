// Connects to the provided host

/** @param {NS} ns */
export async function main(ns) {
    let startServer = ns.getHostname();
    let terminalString = "";
    let pid = -1;
    let error = false;
    
    const args = ns.flags([["help", false], ["to", false]])
	let target = args._[0];

	if (args.help || args._.length === 0) {
        ns.tprint("This script connects to any server. Optional switch --to to take over the server.");
        ns.tprint(`Usage: run ${ns.getScriptName()} [server]`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
		ns.exit();
	}

    // Acquire a reference to the terminal text field
	const terminalInput = eval("document").getElementById("terminal-input");

    // Get a reference to the React event handler.
    const handler = Object.keys(terminalInput)[1];

    // If the takeover switch was provided
    if (args.to) {
        pid = ns.run("/scripts/takeover.js", 1, target);

        if (pid <= 0) {
            error = true;
        }
    }
   
	let [results, isFound] = findPath(target, startServer, [], [], false);
	if (!isFound) {
        ns.tprint("Server not found!");
	} else {
        for (let i = 0; i < results.length; i++) {
            terminalString = terminalString.concat("connect " + results[i] + ";");
        }
        terminalString = terminalString.slice(0, -1); // Removes the last semicolon
        
        terminalInput.value = terminalString;

        // Perform an onChange event to set some internal values.
        terminalInput[handler].onChange({target:terminalInput});
    
        // Simulate an enter press
        terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
	}

    if (error) {
        ns.tprint("There was an error in attempting to take over the target.")
    }

    function findPath (target, serverName, serverList, ignore, isFound) {
        ignore.push(serverName);
        let scanResults = ns.scan(serverName);
        for (let server of scanResults) {
            if (ignore.includes(server)) {
                continue;
            }
            if (server === target) {
                serverList.push(server);
                return [serverList, true];
            }
            serverList.push(server);
            [serverList, isFound] = findPath(target, server, serverList, ignore, isFound);
            if (isFound) {
                return [serverList, isFound];
            }
            serverList.pop();
        }
        return [serverList, false];
    }
}