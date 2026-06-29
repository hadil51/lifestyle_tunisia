import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const configJs = readFileSync(join(root, "config.js"), "utf8");
const contentDefaultJs = readFileSync(join(root, "content-default.js"), "utf8");
const sharedJs = readFileSync(join(root, "shared.js"), "utf8");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(configJs + "\n" + contentDefaultJs + "\n" + sharedJs, context);

const content = context.defaultContent();
const { url, anonKey } = context.getSupabaseConfig();

const response = await fetch(`${url}/rest/v1/site_content?on_conflict=id`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify([
    {
      id: "main",
      content,
      updated_at: new Date().toISOString(),
    },
  ]),
});

if (!response.ok) {
  const detail = await response.text();
  console.error(`Seed failed (${response.status}):`, detail);
  process.exit(1);
}

console.log("Seeded default content to Supabase successfully.");
