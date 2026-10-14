// Unit checks for the verify function (runs in plain Node, no Netlify needed).
import handler from "../netlify/functions/verify.mjs";
const call = async (q) => (await handler(new Request("https://x/api/verify?" + q))).json();
const cases = [
  ["type=staff&id=ndc-ph-0142", "active"],
  ["type=staff&id=NDC-LG-0087", "suspended"],
  ["type=staff&id=NDC-PH-9999", "not_found"],
  ["type=staff&id=hello", "invalid"],
  ["type=acct&id=0123456789", "active"],
  ["type=acct&id=2233445566", "not_found"],
  ["type=staff&id=__proto__", "invalid"],
];
let fail = 0;
for (const [q, want] of cases) {
  const r = await call(q);
  const ok = r.status === want; if (!ok) fail++;
  console.log(`${ok ? "pass" : "FAIL"}  ${q} -> ${r.status}`);
}
const leak = await call("type=staff&id=NDC-PH-0142");
if ("status" in (leak.fields || {}) || "sample" in (leak.fields || {})) { console.log("FAIL  private fields leaked"); fail++; }
process.exit(fail ? 1 : 0);
