export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, data: [], error: "Method not allowed" });
  }

  const codigo = Array.isArray(req.query.codigo) ? req.query.codigo[0] : req.query.codigo;
  const t = (Array.isArray(req.query.t) ? req.query.t[0] : req.query.t) || Date.now();

  const upstream =
    `http://177.221.240.85:8000/api/consulta/${encodeURIComponent(codigo)}/` +
    `?t=${encodeURIComponent(t)}`;

  try {
    const controller = new AbortController();
    const timeoutMs = Number(process.env.UPSTREAM_TIMEOUT_MS || "15000");
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const r = await fetch(upstream, {
      signal: controller.signal,
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0",
      },
    });
    clearTimeout(timeoutId);

    const text = await r.text();
    res.status(r.status);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json; charset=utf-8");
    return res.send(text);
  } catch (e) {
    const cause = e && typeof e === "object" ? e.cause : undefined;
    const details = {};
    if (cause && typeof cause === "object") {
      if (cause.code) details.code = cause.code;
      if (cause.errno) details.errno = cause.errno;
      if (cause.syscall) details.syscall = cause.syscall;
      if (cause.address) details.address = cause.address;
      if (cause.port) details.port = cause.port;
    }
    return res.status(503).json({
      success: false,
      data: [],
      error: e?.name === "AbortError" ? "Timeout no fetch do upstream" : String(e),
      upstream,
      details,
    });
  }
}
