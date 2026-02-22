import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

// ================= DATABASE =================

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10
});

const initDb = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 100000.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        type VARCHAR(50),
        merchant VARCHAR(255),
        amount DECIMAL(15,2),
        status VARCHAR(50),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        token VARCHAR(255),
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("MySQL Schema Initialized");
  } finally {
    connection.release();
  }
};

// ================= SERVER =================

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8003;

  if (process.env.DATABASE_URL) await initDb();

  app.use(express.json());

  // ================= REGISTER =================

  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;

      if (!username || !email || !phone || !password) {
        return res.status(400).json({ error: "All fields required" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const [result]: any = await pool.query(
        "INSERT INTO users (username,email,phone,password,balance) VALUES (?,?,?,?,?)",
        [username, email, phone, hashed, 100000]
      );

      res.status(201).json({ message: "Registered successfully" });

    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // ================= LOGIN =================

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const [rows]: any = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      const user = rows[0];
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: parseFloat(user.balance)
        }
      });

    } catch {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ================= AUTH MIDDLEWARE =================

  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      req.user = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // ================= USER DATA =================

  app.get("/api/user/data", authenticate, async (req: any, res) => {
    try {
      const [user]: any = await pool.query(
        "SELECT id,username,email,phone,balance FROM users WHERE id=?",
        [req.user.id]
      );

      const [transactions]: any = await pool.query(
        "SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC LIMIT 10",
        [req.user.id]
      );

      res.json({
        user: { ...user[0], balance: parseFloat(user[0].balance) },
        transactions
      });

    } catch {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  // ================= CHAT (HUGGING FACE ROUTER) =================
app.get("/api/chat/health", (req, res) => {
  res.json({
    status: "ok",
    hasToken: !!process.env.HF_TOKEN,
    model: "meta-llama/Meta-Llama-3-8B-Instruct"
  });
});
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!process.env.HF_TOKEN) {
        return res.status(500).json({ error: "HF_TOKEN not configured" });
      }

      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages,
            max_tokens: 400,
            temperature: 0.7
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);

    } catch (error: any) {
      console.error("HF Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ================= TRANSFER =================

  app.post("/api/transfer", authenticate, async (req: any, res) => {
    const { recipient, amount } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [rows]: any = await connection.query(
        "SELECT balance FROM users WHERE id=?",
        [req.user.id]
      );

      if (rows[0].balance < amount) {
        throw new Error("Insufficient balance");
      }

      await connection.query(
        "UPDATE users SET balance = balance - ? WHERE id=?",
        [amount, req.user.id]
      );

      await connection.commit();

      res.json({ message: "Transfer successful" });

    } catch (err: any) {
      await connection.rollback();
      res.status(400).json({ error: err.message });
    } finally {
      connection.release();
    }
  });

  // ================= VITE =================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();