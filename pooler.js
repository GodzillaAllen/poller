import fetch from "node-fetch";

const POLL_URL = process.env.POLL_URL;
const SLEEP_MS = Number(process.env.SLEEP_MS || 3000); // 3s default

if (!POLL_URL) throw new Error("Missing POLL_URL env");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function loop() {
  for (;;) {
    const start = Date.now();
    try {
      const res = await fetch(POLL_URL, { method: "GET" });
      const json = await res.json().catch(() => ({}));
      console.log(
        new Date().toISOString(),
        res.status,
        json.summaries ? `bots:${json.summaries.length}` : "",
        json.error || json.message || ""
      );
    } catch (err) {
      console.error(new Date().toISOString(), "poll error", err.message);
    }
    const elapsed = Date.now() - start;
    await sleep(Math.max(SLEEP_MS - elapsed, 0));
  }
}

loop();