import express from "express";
import connection from "../../config/DBconfig.js";

const router = express.Router();

router.post("/member", (req, res) => {
  const { Name, role_id } = req.body;
  const query = `INSERT INTO tree (Name, role, role_id) VALUES (?, ?, ?)`;
  const admin_query = `SELECT * FROM tree WHERE id=?`;
  connection.query(admin_query, [role_id], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ err: err.message, message: "GET EMPLOYEE QUERY ERROR" });
    }
    if (result[0].role !== "E") {
      return res.status(400).json({ Error: "Only Employee can be Selected" });
    }
    connection.query(query, [Name, "M", role_id], (err) => {
      if (err) {
        return res
          .status(400)
          .json({ err: err.message, message: "ADD MEMBER QUERY ERROR" });
      }
      res.status(201).json({ message: "Member Successfully Added" });
    });
  });
});
router.post("/employee", (req, res) => {
  const { Name, role_id } = req.body;
  const query = `INSERT INTO tree (Name, role, role_id) VALUES (?, ?, ?)`;
  const admin_query = `SELECT * FROM tree WHERE id=?`;
  connection.query(admin_query, [role_id], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ err: err.message, message: "GET EMPLOYEE QUERY ERROR" });
    }
    if (result[0].role !== "A") {
      return res.status(400).json({ Error: "Only Admin can be Selected" });
    }
    connection.query(query, [Name, "E", role_id], (err) => {
      if (err) {
        return res
          .status(400)
          .json({ err: err.message, message: "ADD MEMBER QUERY ERROR" });
      }
      res.status(201).json({ message: "Employee Successfully Added" });
    });
  });
});

router.post("/admin", (req, res) => {
  const { Name } = req.body;
  const query = `INSERT INTO tree (Name, role, role_id) VALUES (?, ?, ?)`;
  const admin_query = `SELECT * FROM tree WHERE role="SA"`;
  connection.query(admin_query, (err, results) => {
    if (err) {
      return res
        .status(400)
        .json({ err: err.message, message: "GET ADMIN QUERY ERROR" });
    }
    if (results[0].role !== "SA") {
      return res
        .status(400)
        .json({ Error: "Only Super Admin can be Selected" });
    }
    connection.query(query, [Name, "A", results[0].id], (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ err: err.message, message: "ADD ADMIN QUERY ERROR" });
      }
      res.status(201).json({ message: "Admin Successfully Added" });
    });
  });
});

export { router as addroute };
