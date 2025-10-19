export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: "Missing username" });

  global.users = global.users || {};
  if (!global.users[username]) return res.status(404).json({ error: "User not found" });

  // Just log a request - admin will handle payment & top-up manually
  console.log("Subscription request:", username);
  return res.status(200).json({
    ok: true,
    message: "Request sent to admin. Contact TG: @Royal_smart_boy",
  });
}