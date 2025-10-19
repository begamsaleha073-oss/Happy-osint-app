export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  global.users = global.users || {};
  const user = global.users[username];
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.approved) return res.status(403).json({ error: "You are not an approved user" });
  if (user.password !== password) return res.status(401).json({ error: "Wrong password" });

  // initialize free 10 searches if first login or expired
  const now = Date.now();
  if (!user.creditExpiry || now > user.creditExpiry) {
    user.credits = 10;
    user.creditExpiry = now + 10 * 24 * 60 * 60 * 1000; // 10 days
  }

  return res.status(200).json({ ok: true, credits: user.credits });
}