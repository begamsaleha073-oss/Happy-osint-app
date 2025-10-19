export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { username, password, telegramId } = req.body || {};
  if (!username || !password || !telegramId)
    return res.status(400).json({ error: "Missing fields" });

  global.users = global.users || {};

  // Check if same username OR same telegramId already exists
  for (const k in global.users) {
    const u = global.users[k];
    if (u.username === username || u.telegramId === telegramId) {
      return res.status(400).json({ error: "Username or Telegram ID already taken" });
    }
  }

  global.users[username] = {
    username,
    password,
    telegramId,
    approved: false,
    credits: 0,
    creditExpiry: null,
    signupDate: Date.now(),
  };

  console.log("New signup request:", username);
  return res.status(200).json({ ok: true, message: "Request sent to admin" });
}