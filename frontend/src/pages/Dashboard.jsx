import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout, user } = useAuth(); // get user and logout
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, history: [] });
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // Fetch wallet
  const fetchWallet = async () => {
    try {
      const { data } = await api.get("/api/wallet");
      setWallet(data);
    } catch (e) {
      console.error("Failed to fetch wallet", e);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Handle Add / Remove
  const submit = async (type) => {
    const intVal = parseInt(value, 10);
    if (Number.isNaN(intVal)) {
      setError("Enter valid number");
      return;
    }
    try {
      await api.post(`/api/wallet/${type}`, { value: intVal });
      setValue("");
      setError("");
      fetchWallet();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed");
    }
  };

  // Logout with redirect
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // redirect to login
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", fontFamily: "Arial" }}>
      {/* Header with logout */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Welcome, {user?.name || "User"}</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#333",
            color: "white",
            padding: "6px 12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <h3>Total Balance: {wallet.balance}</h3>

      {/* Transaction Form */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="number"
          placeholder="Enter amount"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ padding: 6, marginRight: 8 }}
        />
        <button
          style={{ color: "white", background: "green", marginRight: 8, padding: "6px 12px" }}
          onClick={() => submit("enter")}
        >
          Add
        </button>
        <button
          style={{ color: "white", background: "red", padding: "6px 12px" }}
          onClick={() => submit("remove")}
        >
          Remove
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Transaction History */}
      <h3>Transaction History</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {wallet.history.map((h, i) => (
          <li
            key={i}
            style={{
              color: h.type === "enter" ? "green" : "red",
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            {h.type === "enter" ? "Entry" : "Remove"}: {h.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
