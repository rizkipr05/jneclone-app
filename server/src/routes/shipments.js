import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const ALLOWED_STATUS = ["Dibuat", "Diproses", "Dikirim", "Selesai"];

function buildResi(id) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `JNE-${yyyy}${mm}${dd}-${String(id).padStart(4, "0")}`;
}

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const body = req.body || {};
  const required = [
    "sender_name",
    "sender_phone",
    "sender_address",
    "receiver_name",
    "receiver_phone",
    "receiver_address",
    "origin",
    "destination",
    "weight_kg",
    "content"
  ];

  for (const key of required) {
    if (!String(body[key] ?? "").trim()) {
      return res.status(400).json({ message: `Field ${key} wajib diisi` });
    }
  }

  const weight = Number(body.weight_kg);
  if (Number.isNaN(weight) || weight <= 0) {
    return res.status(400).json({ message: "Berat harus angka dan > 0" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO shipments
      (sender_name, sender_phone, sender_address, receiver_name, receiver_phone, receiver_address,
       origin, destination, weight_kg, content, service, notes, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.sender_name,
        body.sender_phone,
        body.sender_address,
        body.receiver_name,
        body.receiver_phone,
        body.receiver_address,
        body.origin,
        body.destination,
        weight,
        body.content,
        body.service || "REG",
        body.notes || null,
        "Dibuat",
        req.user.id
      ]
    );

    const id = result.insertId;
    const resi = buildResi(id);

    await pool.query("UPDATE shipments SET resi_number = ? WHERE id = ?", [
      resi,
      id
    ]);

    await pool.query(
      "INSERT INTO shipment_status_history (shipment_id, status, note, created_by) VALUES (?, ?, ?, ?)",
      [id, "Dibuat", "Auto generated", req.user.id]
    );

    const [rows] = await pool.query(
      "SELECT * FROM shipments WHERE id = ?",
      [id]
    );

    return res.status(201).json({ shipment: rows[0] });
  } catch (err) {
    console.error("Create shipment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const { search = "", status, limit = 50 } = req.query;
  const params = [];
  let where = "1=1";

  if (search) {
    where +=
      " AND (resi_number LIKE ? OR sender_name LIKE ? OR receiver_name LIKE ?)";
    const keyword = `%${search}%`;
    params.push(keyword, keyword, keyword);
  }
  if (status) {
    where += " AND status = ?";
    params.push(status);
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM shipments WHERE ${where} ORDER BY created_at DESC LIMIT ?`,
      [...params, Number(limit)]
    );
    return res.json({ items: rows });
  } catch (err) {
    console.error("List shipments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM shipments WHERE id = ?", [
      id
    ]);
    if (!rows[0]) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    return res.json({ shipment: rows[0] });
  } catch (err) {
    console.error("Get shipment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM shipments WHERE id = ?", [
      id
    ]);
    if (!rows[0]) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await pool.query("UPDATE shipments SET status = ? WHERE id = ?", [
      status,
      id
    ]);
    await pool.query(
      "INSERT INTO shipment_status_history (shipment_id, status, note, created_by) VALUES (?, ?, ?, ?)",
      [id, status, "Update manual", req.user.id]
    );

    const [updated] = await pool.query(
      "SELECT * FROM shipments WHERE id = ?",
      [id]
    );
    return res.json({ shipment: updated[0] });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
