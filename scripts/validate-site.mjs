import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publishRoot = join(repositoryRoot, "Revision Hub V3");
const errors = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(join(publishRoot, "assets", "data")).filter((path) => path.endsWith(".json"))) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
  }
}

const cmsConfigPath = join(publishRoot, "admin", "config.yml");
const cmsConfig = readFileSync(cmsConfigPath, "utf8");
for (const match of cmsConfig.matchAll(/^\s*file:\s*"([^"]+)"/gm)) {
  const target = join(repositoryRoot, match[1]);
  if (!existsSync(target)) errors.push(`${cmsConfigPath}: missing CMS file ${match[1]}`);
}

const ignoredPrefixes = ["#", "http:", "https:", "data:", "mailto:", "tel:", "javascript:", "//", "{", "$" ];
for (const file of walk(publishRoot).filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const attributePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributePattern)) {
    const reference = match[1].trim();
    if (!reference || reference.includes("${") || ignoredPrefixes.some((prefix) => reference.startsWith(prefix))) continue;
    if (reference.includes("\\")) {
      errors.push(`${file}: browser URL contains a backslash: ${reference}`);
      continue;
    }

    const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    if (!pathname || pathname === "/") continue;
    const target = pathname.startsWith("/")
      ? join(publishRoot, pathname.slice(1))
      : resolve(dirname(file), pathname);
    const candidates = [target];
    if (!extname(target)) candidates.push(`${target}.html`, join(target, "index.html"));
    if (!candidates.some(existsSync)) errors.push(`${file}: missing local reference ${reference}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Site validation passed: JSON, CMS targets, and local references are valid.");
