import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  history: [
    {
      type: { type: String, enum: ["enter", "remove"], required: true },
      value: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Wallet", walletSchema);
