import express from "express";
import connection from "../DBconfig.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM tree";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "Error executing query" });
    }
    res.status(200).json(result);
  });
});

router.get("/getemployee/:id", (req, res) => {
  const query = `SELECT * FROM tree where id != ? and role="E"`;
  const { id } = req.params;
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    if (result[0].role !== "E") {
      return res.status(400).json({ Error: "Only Employee can be Selected" });
    }
    res.status(200).json({ employee: result });
  });
});

router.get("/getmembers/:empid", (req, res) => {
  const empquery = `SELECT * FROM tree WHERE role_id=?`;
  connection.query(empquery, [req.params.empid], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    res.status(200).json({ members: result });
  });
});

router.delete("/deleteemp/:empid", (req, res) => {
  const { empid } = req.params;
  const dep = [];
  for (const key in req.body) {
    dep.push(req.body[key]);
    dep.push(key);
  }
  const query = Object.keys(req.body).map((str) => {
    return `UPDATE tree SET role_id=? WHERE id=?`;
  });
  const delete_query = `DELETE FROM tree WHERE id=?`;
  connection.query(query.join(";"), dep, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing UPDATE query", err: err.message });
    }
    connection.query(delete_query, [empid], (err) => {
      if (err) {
        return res
          .status(400)
          .json({ Error: "Error executing DELETE query", err: err.message });
      }
      res.status(204).json({ message: "Employee Deleted" });
    });
  });
});

router.get("/htf", (req, res) => {
  const query = "SELECT * FROM tree";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "Error executing query" });
    }
    function unflatten(items) {
      var tree = [],
        mappedArr = {};

      items.forEach(function (item) {
        var id = item.id;
        if (!mappedArr.hasOwnProperty(id)) {
          mappedArr[id] = item;
          mappedArr[id].children = [];
        }
      });

      for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          var mappedElem = mappedArr[id];

          if (mappedElem.role_id) {
            var parentId = mappedElem.role_id;
            mappedArr[parentId].children.push(mappedElem);
          } else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    }
    var htf = unflatten(result);
    res.status(200).json(htf);
  });
});

router.delete("/reset_data", (req, res) => {
  const insert_query = `INSERT INTO tree (id, Name, role, role_id)
  VALUES
    (1, 'Super Admin', 'SA',null),
    (2, 'umar', 'A', 1),
    (3, 'mahesh', 'A', 1),
    (4, 'babu', 'A', 1),
    (5, 'ravi', 'A', 1),
    (6, 'david', 'E', 2),
    (7, 'malik', 'E', 3),
    (8, 'abdul', 'E', 4),
    (9, 'nufaiz', 'E', 5),
    (10, 'irfan', 'M', 6),
    (11, 'zaheer', 'M', 6),
    (12, 'ashwin', 'M', 6),
    (13, 'yogi', 'M', 6),
    (14, 'babu', 'M', 7),
    (15, 'ramesh', 'M', 7),
    (16, 'suresh', 'M', 7),
    (17, 'ram', 'M', 7),
    (18, 'akilash', 'M', 8),
    (19, 'Prabhu', 'M', 8),
    (20, 'Raju', 'M', 8),
    (21, 'mohamed', 'M', 8),
    (22, 'sarath', 'M', 9),
    (23, 'vijay', 'M', 9),
    (24, 'ajith', 'M', 9),
    (25, 'suryan', 'M', 9);`;
    const delete_query = `DELETE FROM tree`;
    connection.query(delete_query,(err)=>{
      if (err) {
        return res
         .status(400)
         .json({ Error: "Error executing DELETE query", err: err.message });
      }
      connection.query(insert_query,(err)=>{
        if (err) {
          return res
           .status(400)
           .json({ Error: "Error executing INSERT query", err: err.message });
        }
        res.status(204).json({ message: "Data Reset" });
      })
    })
});

export { router as treeRouter };
