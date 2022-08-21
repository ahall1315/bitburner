/** @param {NS} ns */

// Displays a cat picture
// run GetCat.js img.txt ; cat img.txt
export async function main(ns) {
    await ns.wget("https://api.thecatapi.com/v1/images/search", "/images/json.txt");
    var content = await ns.read("/images/json.txt");
    var imageJSON = JSON.parse(content)[0];
    var aspectRatio = imageJSON.width / imageJSON.height;
    if (imageJSON.height > 570) {
        imageJSON.height = 570;
        imageJSON.width = imageJSON.height * aspectRatio;
    } else if (imageJSON.width > 1024) {
        imageJSON.width = 1024;
        imageJSON.height = imageJSON.width / aspectRatio;
    }
    await ns.write(ns.args[0], `<img src=\"${imageJSON.url}\" width=${imageJSON.width} height=${imageJSON.height}></img>`, "w");
};