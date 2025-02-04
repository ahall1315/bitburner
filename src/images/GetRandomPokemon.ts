import { NS, AutocompleteData } from "@ns";
import { getRandomInt } from "/lib/utils";

export async function main(ns: NS): Promise<void> {
    const args = ns.flags([["help", false]]);
    if (ns.args[0] === "help" || args.help) {
        ns.tprintf("Displays an image of a random Pokémon.");
        ns.tprintf("There is a 1 in 4096 that the Pokémon will be shiny!");
        ns.tprintf(`Usage: run ${ns.getScriptName()}`);
        ns.tprintf("Example:");
        ns.tprintf(`> run ${ns.getScriptName()}`);
        ns.exit();
    }

    // Gets the directory of this script
    const scriptDir = ((p) => p ? p + "/" : "/")(ns.getScriptName().split("/").slice(0, -1).join("/"));

    if (!await ns.wget(`https://pokeapi.co/api/v2/pokemon/${getRandomInt(ns, 1, 1025)}`, scriptDir + "poke.txt")) {
        ns.tprintf("ERROR Failed to fetch the image from the web. Did you specify a valid Pokédex number? Are you connected to the internet?");
        ns.exit();
    }
    let pokeJSON = JSON.parse(ns.read(scriptDir + "poke.txt"));

    // Chance for shiny
    if (1 === getRandomInt(ns, 1, 4096)) {
        ns.alert(`<img src=\"${pokeJSON.sprites.front_shiny}\" width="300" height="300"></img>`);
    } else {
        ns.alert(`<img src=\"${pokeJSON.sprites.front_default}\" width="300" height="300"></img>`);
    }
}

export function autocomplete(data: AutocompleteData, args: string[]): string[] {
    return ["help", "--help"];
}