import express from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/User.js'

const authRouter = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax"
    }).json({ user: { name: user.name, email: user.email } });

  } catch (err) {
    console.error("Register Error:", err); // See terminal for actual issue
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
  }).json({ user: { name: user.name, email: user.email } });
});

authRouter.post("/google", async (req, res) => {
  const { credential } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await userModel.findOne({ email: payload.email });
  if (!user) {
    user = await userModel.create({
      name: payload.name,
      email: payload.email,
      authType: "google"
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
  }).json({ user: { name: user.name, email: user.email } });
});

authRouter.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id, { password: 0 });
    if (!user) return res.sendStatus(404);
    res.json({ user });
  } catch {
    res.sendStatus(403);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").send("Logged out");
});

export default authRouter;