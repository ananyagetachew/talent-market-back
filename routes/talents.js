const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/database");
const upload = require("../config/multer");
const authenticateToken = require("../middleware/auth");

router.get("/", (req, res) => {
  db.all(
    "SELECT id, name, role, skills, profilePicture, description FROM users",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(
        rows.map((row) => ({
          ...row,
          skills: row.skills?.split(",") || [],
          profilePicture: row.profilePicture
            ? `${req.protocol}://${req.get("host")}${row.profilePicture}`
            : null,
        }))
      );
    }
  );
});

router.get("/:id", (req, res) => {
  db.get(
    "SELECT id, name, role, skills, profilePicture, description FROM users WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Talent not found" });
      res.json({ ...row, skills: row.skills?.split(",") || [] });
    }
  );
});

router.post("/", upload.single("profilePicture"), (req, res) => {
  const { name, email, password, role, skills, description } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (name, email, password, role, skills, profilePicture, description) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, role, skills, profilePicture, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        name,
        email,
        role,
        skills: skills?.split(",") || [],
        profilePicture,
        description,
      });
    }
  );
});

router.put(
  "/:id",
  authenticateToken,
  upload.single("profilePicture"),
  (req, res) => {
    const { name, role, skills, description } = req.body;
    const profilePicture = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.profilePicture;

    db.run(
      `UPDATE users SET name = ?, role = ?, skills = ?, profilePicture = ?, description = ? 
          WHERE id = ?`,
      [name, role, skills, profilePicture, description, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: parseInt(req.params.id),
          name,
          role,
          skills: skills?.split(",") || [],
          profilePicture,
          description,
        });
      }
    );
  }
);

module.exports = router;
