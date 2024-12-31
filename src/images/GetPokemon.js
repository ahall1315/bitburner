/** @param {NS} ns */
export async function main(ns) {
    await ns.wget(`https://pokeapi.co/api/v2/pokemon/${ns.args[0]}`, "/images/json.txt");
    var content = await ns.read("/images/json.txt");
    var pokeJSON = JSON.parse(content);
    
    await ns.write(ns.args[1], `<img src=\"${pokeJSON.sprites.front_default}\"></img>`, "w");
};