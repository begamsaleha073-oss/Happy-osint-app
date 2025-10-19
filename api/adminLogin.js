export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // create a simple session token (in-memory)
  const token = "admin-session-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  global.adminSessions = global.adminSessions || {};
  global.adminSessions[token] = { created: Date.now() };

  // Set HttpOnly cookie (Secure only if Vercel/HTTPS)
  const cookie = `admin_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 6}; SameSite=Strict; ${
    process.env.VERCEL ? "Secure;" : ""
  }`;
  res.setHeader("Set-Cookie", cookie);

  return res.status(200).json({ ok: true });
}