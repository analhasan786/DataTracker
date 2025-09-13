import express from "express";
import Wallet from "../models/Wallet.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get wallet
router.get("/", auth, async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) wallet = await Wallet.create({ user: req.user.id, balance: 0 });
  res.json(wallet);
});

// Add amount
router.post("/enter", auth, async (req, res) => {
  const { value } = req.body;
  if (!Number.isInteger(value)) return res.status(400).json({ message: "Enter integer" });

  let wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) wallet = await Wallet.create({ user: req.user.id, balance: 0 });

  wallet.balance += value;
  wallet.history.push({ type: "enter", value });
  await wallet.save();

  res.json(wallet);
});

// Remove amount
router.post("/remove", auth, async (req, res) => {
  const { value } = req.body;
  if (!Number.isInteger(value)) return res.status(400).json({ message: "Enter integer" });

  let wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) wallet = await Wallet.create({ user: req.user.id, balance: 0 });

  if (wallet.balance < value) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  wallet.balance -= value;
  wallet.history.push({ type: "remove", value });
  await wallet.save();

  res.json(wallet);
});

export default router;

