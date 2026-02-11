const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "https://trustlayer-decentralized-applicatio-five.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before handling any request (critical for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/verify", require("./routes/verifyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/universities", require("./routes/universityRoutes"));
// Public Routes (No Auth)
app.use("/api/public", require("./routes/publicRoutes"));

// Root — API Documentation Page
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustLayer API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif; background: #000; color: #f5f5f7; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; padding: 60px 24px; }
    h1 { font-size: 40px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 6px; }
    .subtitle { color: #86868b; font-size: 17px; margin-bottom: 40px; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-right: 8px; min-width: 52px; text-align: center; }
    .get { background: #30d158; color: #000; }
    .post { background: #0071e3; color: #fff; }
    .put { background: #ff9f0a; color: #000; }
    .delete { background: #ff453a; color: #fff; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 20px; font-weight: 600; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #38383a; }
    .route { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #1c1c1e; font-size: 14px; gap: 12px; }
    .route:last-child { border-bottom: none; }
    .path { font-family: 'SF Mono', 'Fira Code', monospace; color: #f5f5f7; flex: 1; }
    .auth-tag { font-size: 11px; color: #86868b; padding: 2px 8px; border: 1px solid #38383a; border-radius: 12px; }
    .status { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; background: #1c1c1e; border-radius: 20px; font-size: 13px; margin-top: 8px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #30d158; }
    a { color: #0071e3; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #38383a; color: #86868b; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>TrustLayer API</h1>
    <p class="subtitle">Blockchain-Powered Certificate Verification</p>
    <div class="status"><span class="dot"></span> API is operational</div>

    <div style="margin-top:40px">
      <div class="section">
        <div class="section-title">🔐 Authentication</div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/auth/register</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/auth/login</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/auth/verify-email</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/auth/resend-verification</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/auth/forgot-password</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/auth/reset-password</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/auth/me</span><span class="auth-tag">Auth</span></div>
        <div class="route"><span class="badge put">PUT</span><span class="path">/api/auth/profile</span><span class="auth-tag">Auth</span></div>
        <div class="route"><span class="badge put">PUT</span><span class="path">/api/auth/change-password</span><span class="auth-tag">Auth</span></div>
      </div>

      <div class="section">
        <div class="section-title">📜 Certificates</div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/certificates/issue</span><span class="auth-tag">University</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/certificates/bulk-issue</span><span class="auth-tag">University</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/certificates</span><span class="auth-tag">University / Admin</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/certificates/stats</span><span class="auth-tag">University / Admin</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/certificates/:certId</span><span class="auth-tag">University / Admin</span></div>
        <div class="route"><span class="badge put">PUT</span><span class="path">/api/certificates/revoke/:certId</span><span class="auth-tag">University / Admin</span></div>
      </div>

      <div class="section">
        <div class="section-title">✅ Verification</div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/verify</span><span class="auth-tag">User / Admin</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/verify/history</span><span class="auth-tag">User / Admin</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/verify/universities</span><span class="auth-tag">User / Admin</span></div>
      </div>

      <div class="section">
        <div class="section-title">👑 Admin</div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/admin/users</span><span class="auth-tag">Admin</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/admin/pending</span><span class="auth-tag">Admin</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/admin/stats</span><span class="auth-tag">Admin</span></div>
        <div class="route"><span class="badge put">PUT</span><span class="path">/api/admin/university/:id</span><span class="auth-tag">Admin</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/admin/trust-scores</span><span class="auth-tag">Admin</span></div>
        <div class="route"><span class="badge delete">DEL</span><span class="path">/api/admin/user/:id</span><span class="auth-tag">Admin</span></div>
      </div>

      <div class="section">
        <div class="section-title">🌐 Public (No Auth)</div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/public/verify</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/public/certificate/:certId</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/universities/search?name=…</span></div>
        <div class="route"><span class="badge post">POST</span><span class="path">/api/contact</span></div>
      </div>

      <div class="section">
        <div class="section-title">🩺 System</div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/health</span></div>
        <div class="route"><span class="badge get">GET</span><span class="path">/api/seed-admin</span></div>
      </div>
    </div>

    <div class="footer">
      <p>TrustLayer &copy; 2026 &middot; Ethereum Sepolia Testnet &middot; <a href="/api/health">Health Check</a></p>
    </div>
  </div>
</body>
</html>`);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Seed admin (one-time use after deployment)
app.get("/api/seed-admin", async (req, res) => {
  try {
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");
    const existing = await User.findOne({ role: "admin" });
    if (existing) return res.json({ message: "Admin already exists", email: existing.email });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("admin123", salt);
    await User.create({ name: "Admin", email: "admin@trustlayer.com", password: hashed, role: "admin", status: "approved" });
    res.json({ message: "Admin seeded", email: "admin@trustlayer.com" });
  } catch (err) {
    res.status(500).json({ message: "Seed failed: " + err.message });
  }
});

// Start server only when running locally (Vercel manages the server in production)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// Export for Vercel serverless
module.exports = app;
