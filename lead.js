module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error("Missing Supabase environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const website = String(body.website || "").trim();
    const message = String(body.message || "").trim();
    const honeypot = String(body.company || "").trim();

    // Basic bot trap
    if (honeypot) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (name.length > 120 || email.length > 254 || website.length > 500 || message.length > 5000) {
      return res.status(400).json({ error: "One or more fields are too long." });
    }

    const lead = {
      name,
      email,
      website: website || null,
      message,
      status: "new",
      source: "website"
    };

    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": `Bearer ${SUPABASE_SECRET_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(lead)
    });

    if (!supabaseResponse.ok) {
      const details = await supabaseResponse.text();
      console.error("Supabase insert failed:", details);
      return res.status(500).json({ error: "Could not save enquiry." });
    }

    const saved = await supabaseResponse.json();

    return res.status(200).json({
      ok: true,
      leadId: saved?.[0]?.id || null
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return res.status(500).json({ error: "Unexpected server error." });
  }
};
