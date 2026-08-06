const fs = require("fs");
const slice = fs.readFileSync("app_bundle_slice.js", "utf8");

console.log("=== APPBUNDLE SLICE OVERVIEW ===");
console.log(slice.substring(0, 3000));
console.log("\n... MIDDLE SLICE ...");
console.log(slice.substring(15000, 18000));
console.log("\n... END SLICE ...");
console.log(slice.substring(slice.length - 3000));
