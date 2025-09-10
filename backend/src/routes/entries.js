// import express from 'express';
// import Entry from '../models/Entry.js';
// import { auth } from '../middleware/auth.js';

// const router = express.Router();

// // Add an integer (entry)
// router.post('/add', auth, async (req, res) => {
//   try {
//     const value = Number(req.body.value);
//     if (!Number.isInteger(value)) return res.status(400).json({ message: 'Value must be an integer' });

//     const entry = await Entry.create({ user: req.user.id, value, type: 'enter' });
//     res.status(201).json(entry);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Remove an integer
// router.post('/remove', auth, async (req, res) => {
//   try {
//     const value = Number(req.body.value);
//     if (!Number.isInteger(value)) return res.status(400).json({ message: 'Value must be an integer' });

//     const entry = await Entry.create({ user: req.user.id, value, type: 'remove' });
//     res.status(201).json(entry);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get total balance
// router.get('/balance', auth, async (req, res) => {
//   try {
//     const entries = await Entry.find({ user: req.user.id });
//     const total = entries.reduce((acc, e) => (e.type === 'enter' ? acc + e.value : acc - e.value), 0);
//     res.json({ balance: total });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Summary for pie chart
// router.get('/summary', auth, async (req, res) => {
//   try {
//     const { period = 'day' } = req.query;
//     const now = new Date();
//     let start;

//     if (period === 'day') start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     else if (period === 'week') { start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0); }
//     else if (period === 'month') { start = new Date(now); start.setDate(now.getDate() - 29); start.setHours(0,0,0,0); }
//     else return res.status(400).json({ message: 'Invalid period' });

//     const data = await Entry.aggregate([
//       { $match: { user: req.user.id, createdAt: { $gte: start } } },
//       { $group: { _id: '$type', totalValue: { $sum: '$value' }, count: { $sum: 1 } } }
//     ]);

//     const result = { enter: { total: 0, count: 0 }, remove: { total: 0, count: 0 } };
//     data.forEach(row => {
//       if (row._id === 'enter') result.enter = { total: row.totalValue, count: row.count };
//       if (row._id === 'remove') result.remove = { total: row.totalValue, count: row.count };
//     });

//     res.json({ period, from: start, to: now, ...result });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;


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

