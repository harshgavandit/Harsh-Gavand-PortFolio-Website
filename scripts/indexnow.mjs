// Notify Bing, Yandex, Seznam and other IndexNow engines about changed URLs
// after a production deploy:  node scripts/indexnow.mjs [url ...]
// Without arguments it submits every URL in the live sitemap. The key file is
// served from public/<key>.txt, which proves ownership of the host.
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const origin = (process.env.SITE_URL || "https://harshgavand.dev").replace(
  /\/$/,
  "",
);
const key = readdirSync(fileURLToPath(new URL("../public/", import.meta.url)))
  .find((file) => /^[a-f0-9]{32}\.txt$/.test(file))
  ?.replace(/\.txt$/, "");
if (!key) throw new Error("Missing public/<32-hex-key>.txt IndexNow key file.");

let urls = process.argv.slice(2);
if (!urls.length) {
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}
urls = urls.filter((url) => url.startsWith(origin + "/"));
if (!urls.length) throw new Error("No URLs on " + origin + " to submit.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(origin).host,
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList: urls,
  }),
});
// 200 = accepted, 202 = accepted pending key validation.
console.log(`IndexNow: HTTP ${response.status} for ${urls.length} URLs`);
if (response.status >= 400) process.exit(1);
