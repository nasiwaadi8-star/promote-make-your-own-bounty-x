// Entry program for make.fun bounty post-x-promote-make-your-own-bounty-01.
//
// The entry itself is a public post on X; this repository hands it in.
// POST.json at the repository root names the post's address, and the
// grader expects to find that file in the output directory, so all this
// program does is copy POST.json from the bot directory (where the
// repository is mounted) into the output directory.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");
const destination = join(outputDir, "POST.json");

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(source, destination);
} catch (error) {
  console.error(`main.ts: could not copy ${source} to ${destination}: ${error.message}`);
  process.exit(1);
}

// Read the copied file back and make sure it really is the hand-in the
// grader expects: valid JSON whose "url" is an https address on x.com.
let handedIn;
try {
  handedIn = JSON.parse(readFileSync(destination, "utf8"));
} catch (error) {
  console.error(`main.ts: ${destination} is not valid JSON: ${error.message}`);
  process.exit(1);
}

let url;
try {
  url = new URL(handedIn?.url ?? "");
} catch {
  console.error(`main.ts: POST.json must name an https://x.com address, got: ${handedIn?.url}`);
  process.exit(1);
}
if (url.protocol !== "https:" || url.hostname !== "x.com") {
  console.error(`main.ts: POST.json must name an https://x.com address, got: ${handedIn?.url}`);
  process.exit(1);
}

console.log(`main.ts: handed in ${url.href}`);
