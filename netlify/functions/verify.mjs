// GET /api/verify?type=staff|acct&id=...
// Looks up one staff ID or collection account in data/register.json and returns only its public fields.
// Exact matches only, so the register can't be browsed or enumerated; rate-limited per IP.
import register from "../../data/register.json" with { type: "json" };

const FORMATS = { staff: /^NDC-[A-Z]{2}-\d{4}$/, acct: /^\d{10}$/ };
const PUBLIC = { staff: ["name", "role", "base"], acct: ["channel"] };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export default async (req) => {
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);
  const url = new URL(req.url);
  const type = url.searchParams.get("type") === "acct" ? "acct" : "staff";
  const id = (url.searchParams.get("id") || "").trim().toUpperCase();
  if (!FORMATS[type].test(id)) return json({ status: "invalid", type, id });
  const table = type === "staff" ? register.staff : register.accounts;
  const rec = table && Object.prototype.hasOwnProperty.call(table, id) ? table[id] : null;
  if (!rec) return json({ status: "not_found", type, id });
  const fields = {};
  for (const k of PUBLIC[type]) if (rec[k]) fields[k] = rec[k];
  return json({ status: rec.status === "active" ? "active" : "suspended", type, id, fields, sample: !!rec.sample });
};

export const config = {
  path: "/api/verify",
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
