export default function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  const cookie = req.headers.cookie || "";
  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return res.status(401).json({ error: "Not authenticated" });

  const token = match[1];
  if (!global.adminSessions || !global.adminSessions[token]) {
    return res.status(401).json({ error: "Invalid session" });
  }

  global.users = global.users || {};
  return res.status(200).json({ users: global.users });
}