export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { username, password, telegramId } = req.body || {};
  if (!username || !password || !telegramId)
    return res.status(400).json({ error: "Missing fields" });

  global.users = global.users || {};

  // ✅ AUTO-ADD default admin-approved user (only once)
  if (!global.users["Royal_smart_boy"]) {
    global.users["Royal_smart_boy"] = {
      username: "Royal_smart_boy",
      password: "happy@778",
      telegramId: "7798676542",
      approved: true,
      credits: 100,
      creditExpiry: Date.now() + 100 * 24 * 60 * 60 * 1000, // 100 days
      signupDate: Date.now(),
    };
    console.log("✅ Preloaded default user: Royal_smart_boy");
  }

  // 🧩 Check if same username or same telegram already exists
  for (const k in global.users) {
    const u = global.users[k];
    if (u.username === username || u.telegramId === telegramId) {
      return res.status(400).json({ error: "Username or Telegram ID already taken" });
    }
  }

  // 📥 Save new signup request
  global.users[username] = {
    username,
    password,
    telegramId,
    approved: false,
    credits: 0,
    creditExpiry: null,
    signupDate: Date.now(),
  };

  console.log("🆕 New signup request:", username);
  return res.status(200).json({ ok: true, message: "Request sent to admin" });
}
