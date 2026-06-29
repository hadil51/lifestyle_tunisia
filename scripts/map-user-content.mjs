import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(readFileSync(join(root, "content/user-source.json"), "utf8"));
const mapperJs = readFileSync(join(root, "content-mapper.js"), "utf8");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(mapperJs, context);

const mapped = context.mapUserContentToSite(source);
const outPath = join(root, "content-default.js");
writeFileSync(outPath, `window.SITE_DEFAULT_CONTENT = ${JSON.stringify(mapped, null, 2)};\n`, "utf8");
console.log(`Wrote ${outPath} (${mapped.products.length} products)`);
console.log(`Product 1 image: ${mapped.products[0].image}`);
