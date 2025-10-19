export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  const { username, number } = req.query || {};
  if (!username || !number) return res.status(400).json({ error: "Missing parameters" });

  global.users = global.users || {};
  const user = global.users[username];
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.approved) return res.status(403).json({ error: "User not approved" });

  const now = Date.now();
  if (!user.creditExpiry || now > user.creditExpiry) {
    return res.status(403).json({ error: "No search credits left or expired" });
  }
  if (!user.credits || user.credits <= 0) {
    return res.status(403).json({ error: "No search credits left" });
  }

  // Consume one credit
  user.credits = (user.credits || 0) - 1;

  try {
    const url = (process.env.API_URL || "") + number;
    if (!process.env.API_URL) {
      // For safety, don't reveal API_URL to client
      console.error("API_URL not configured in env");
      return res.status(500).json({ error: "Server not configured" });
    }

    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json({ data, remaining: user.credits });
  } catch (err) {
    console.error("fetch error:", err);
    return res.status(500).json({ error: "External API error" });
  }
}