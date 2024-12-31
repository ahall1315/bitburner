// Prompts the user for their name and welcomes them

/** @param {import("NetscriptDefinitions").NS} ns */
export async function main(ns) { 
    let name = "";

    name = await ns.prompt("What is your name?", {type: "text"});

    ns.tprint("Welcome " + name + "!");
}