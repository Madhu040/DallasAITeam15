import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const chaptersDir = join(import.meta.dirname, "../content/chapters");
let errors = 0;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".json")) out.push(full);
  }
  return out;
}

for (const file of walk(chaptersDir)) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  const name = file.split("/").slice(-2).join("/");
  if (name.includes("dp_")) {
    if (!data.emotionalArc) {
      console.error(`❌ ${name}: missing emotionalArc`);
      errors++;
    }
    if (!data.consequences?.length) {
      console.error(`❌ ${name}: missing consequences`);
      errors++;
    }
  } else if (!data.id || !data.chapterId) {
    console.error(`❌ ${name}: missing id or chapterId`);
    errors++;
  }
  console.log(`✅ ${name}`);
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s)`);
  process.exit(1);
}
console.log("\nAll content files valid.");
